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
    return this.handleUserCreatedOrUpdated(payload);
  }

  @EventPattern(new UserUpdatedEventPattern())
  handleUserUpdated(payload: UserUpdatedEventPayload) {
    return this.handleUserCreatedOrUpdated(payload);
  }

  private handleUserCreatedOrUpdated(payload: UserCreatedEventPayload | UserUpdatedEventPayload) {
    const { proficienciesIds, interestedClassCategoryIds, userId } = payload;

    if (proficienciesIds?.length || interestedClassCategoryIds?.length) {
      console.log("Start update class categories preferences");
      const categoryIdsToUpdate = proficienciesIds?.length ? proficienciesIds : interestedClassCategoryIds;
      return this.classCategoryService.updateClassCategories(userId, categoryIdsToUpdate);
    }
  }
}
