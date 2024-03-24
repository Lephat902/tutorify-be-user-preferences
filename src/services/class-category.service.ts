import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BroadcastService,
  TutorProficiencyCreatedEvent,
  TutorProficiencyCreatedEventPayload,
  TutorProficiencyDeletedEvent,
  TutorProficiencyDeletedEventPayload,
} from '@tutorify/shared';
import { Builder } from 'builder-pattern';
import { UserPreferences } from 'src/entities';
import { GeneralService } from './general.service';

@Injectable()
export class ClassCategoryService {
  constructor(
    @InjectRepository(UserPreferences)
    private readonly userPreferencesRepository: Repository<UserPreferences>,
    private readonly generalService: GeneralService,
    private readonly broadcastService: BroadcastService,
  ) { }

  async updateClassCategories(userId: string, newClassCategoryIds: string[]): Promise<UserPreferences> {
    let preferences = await this.userPreferencesRepository.findOne({ where: { userId } });
    if (!preferences) {
      // Create new preferences if not found
      preferences = this.userPreferencesRepository.create({
        userId,
        preferences: { classCategoryIds: newClassCategoryIds }
      } as UserPreferences);
      this.dispatchProficiencyCreatedEvent(newClassCategoryIds, userId);
    } else {
      const classCategoryIdsToInsert = newClassCategoryIds.filter(id => !preferences.preferences.classCategoryIds.includes(id));
      const classCategoryIdsToDelete = preferences.preferences.classCategoryIds.filter(id => !newClassCategoryIds.includes(id));
      preferences.preferences.classCategoryIds = newClassCategoryIds;
      if (classCategoryIdsToInsert.length > 0) {
        this.dispatchProficiencyCreatedEvent(classCategoryIdsToInsert, userId);
      }
      if (classCategoryIdsToDelete.length > 0) {
        for (const categoryId of classCategoryIdsToDelete)
          this.dispatchProficiencyDeletedEvent(categoryId, userId);
      }
    }

    return this.userPreferencesRepository.save(preferences);
  }

  async addClassCategories(userId: string, classCategoryIds: string[]): Promise<UserPreferences> {
    const preferences = await this.userPreferencesRepository.findOne({ where: { userId } });
    if (!preferences) {
      throw new NotFoundException("User preferences not found");
    }

    const classCategoryIdsToInsert = classCategoryIds.filter(id => !preferences.preferences.classCategoryIds.includes(id));
    if (classCategoryIdsToInsert.length > 0) {
      preferences.preferences.classCategoryIds.push(...classCategoryIdsToInsert);
      this.dispatchProficiencyCreatedEvent(classCategoryIdsToInsert, userId);
    }

    return this.userPreferencesRepository.save(preferences);
  }

  async removeClassCategory(userId: string, classCategoryId: string): Promise<UserPreferences> {
    const preferences = await this.userPreferencesRepository.findOne({ where: { userId } });
    if (!preferences) {
      throw new NotFoundException("User preferences not found");
    }

    // Check if the classCategoryId exists in the classCategoryIds array
    const index = preferences.preferences.classCategoryIds.indexOf(classCategoryId);
    if (index < 0) {
      throw new NotFoundException('Class category ID not found in the user preferences.');
    }

    // If found, remove it from the array
    preferences.preferences.classCategoryIds.splice(index, 1);

    this.dispatchProficiencyDeletedEvent(classCategoryId, userId);

    // Save the updated preferences
    return this.userPreferencesRepository.save(preferences);
  }

  async getClassCategoryPreferencesByUserId(userId: string) {
    const userPreferences = await this.generalService.getUserPreferencesByUserId(userId);
    return userPreferences.preferences.classCategoryIds;
  }

  private dispatchProficiencyCreatedEvent(classCategoryIds: string[], userId: string) {
    for (const classCategoryId of classCategoryIds) {
      const eventPayload = Builder<TutorProficiencyCreatedEventPayload>()
        .classCategoryId(classCategoryId)
        .tutorId(userId)
        .build();
      const event = new TutorProficiencyCreatedEvent(eventPayload);
      this.broadcastService.broadcastEventToAllMicroservices(event.pattern, event.payload);
    }
  }

  private dispatchProficiencyDeletedEvent(classCategoryId: string, userId: string) {
    const eventPayload = Builder<TutorProficiencyDeletedEventPayload>()
      .classCategoryId(classCategoryId)
      .tutorId(userId)
      .build();
    const event = new TutorProficiencyDeletedEvent(eventPayload);
    this.broadcastService.broadcastEventToAllMicroservices(event.pattern, event.payload);
  }
}
