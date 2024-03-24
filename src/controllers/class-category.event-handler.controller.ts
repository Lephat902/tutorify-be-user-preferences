import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import {
  UserCreatedEventPattern,
  UserCreatedEventPayload,
  UserUpdatedEventPattern,
  UserUpdatedEventPayload
} from '@tutorify/shared';
import { ClassCategoryService } from 'src/services';

@Controller()
export class ClassCategoryEventHandlerController {
  constructor(private readonly classCategoryService: ClassCategoryService) { }

  @EventPattern(new UserCreatedEventPattern())
  handleUserCreated(payload: UserCreatedEventPayload) {
    this.handleUserCreatedOrUpdated(payload);
  }

  @EventPattern(new UserUpdatedEventPattern())
  handleUserUpdated(payload: UserUpdatedEventPayload) {
    this.handleUserCreatedOrUpdated(payload);
  }

  private handleUserCreatedOrUpdated(payload: UserCreatedEventPayload | UserUpdatedEventPayload) {
    const { proficienciesIds, interestedClassCategoryIds, userId } = payload;
    if (proficienciesIds) {
      return this.classCategoryService.addClassCategories(userId, proficienciesIds);
    }
    if (interestedClassCategoryIds) {
      return this.classCategoryService.addClassCategories(userId, interestedClassCategoryIds);
    }
  }
}
