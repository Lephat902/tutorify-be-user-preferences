import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import {
  UserCreatedEventPattern,
  UserCreatedEventPayload,
  UserUpdatedEventPattern,
  UserUpdatedEventPayload
} from '@tutorify/shared';
import { ClassCategoryService, LocationService } from 'src/services';

@Controller()
export class EventHandlerController {
  constructor(
    private readonly classCategoryService: ClassCategoryService,
    private readonly locationService: LocationService,
    ) { }

  @EventPattern(new UserCreatedEventPattern())
  handleUserCreated(payload: UserCreatedEventPayload) {
    return this.handleUserCreatedOrUpdated(payload);
  }

  @EventPattern(new UserUpdatedEventPattern())
  handleUserUpdated(payload: UserUpdatedEventPayload) {
    return this.handleUserCreatedOrUpdated(payload);
  }

  private async handleUserCreatedOrUpdated(payload: UserCreatedEventPayload | UserUpdatedEventPayload) {
    const { proficienciesIds, interestedClassCategoryIds, location, userId } = payload;

    if (proficienciesIds?.length || interestedClassCategoryIds?.length) {
      console.log("Start update class categories preferences");
      const categoryIdsToUpdate = proficienciesIds?.length ? proficienciesIds : interestedClassCategoryIds;
      await this.classCategoryService.updateClassCategories(userId, categoryIdsToUpdate);
    }
    if (location) {
      console.log("Start update location preferences", location);
      await this.locationService.updateLocation(userId, location);
    }
  }
}
