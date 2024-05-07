import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import {
  UserCreatedEventPattern,
  UserCreatedEventPayload,
  UserDeletedEventPattern,
  UserDeletedEventPayload,
  UserUpdatedEventPattern,
  UserUpdatedEventPayload
} from '@tutorify/shared';
import { ClassCategoryService, GeneralService, LocationService } from 'src/services';

@Controller()
export class EventHandlerController {
  constructor(
    private readonly classCategoryService: ClassCategoryService,
    private readonly locationService: LocationService,
    private readonly generalService: GeneralService,
  ) { }

  @EventPattern(new UserCreatedEventPattern())
  handleUserCreated(payload: UserCreatedEventPayload) {
    return this.handleUserCreatedOrUpdated(payload);
  }

  @EventPattern(new UserUpdatedEventPattern())
  handleUserUpdated(payload: UserUpdatedEventPayload) {
    return this.handleUserCreatedOrUpdated(payload);
  }

  @EventPattern(new UserDeletedEventPattern())
  handleUserDeleted(payload: UserDeletedEventPayload) {
    return this.generalService.handleUserDeleted(payload.userId);
  }

  private async handleUserCreatedOrUpdated(payload: UserCreatedEventPayload | UserUpdatedEventPayload) {
    const { proficienciesIds, interestedClassCategoryIds, location, userId } = payload;

    // note that the incoming ids can be in either of the 2 forms:
    // + array: process it
    //    + empty: mean to reset
    //    + not empty: normal alternation
    // + not an array: ignore it
    if (Array.isArray(proficienciesIds) || Array.isArray(interestedClassCategoryIds)) {
      console.log("Start update class categories preferences");
      const categoryIdsToUpdate = Array.isArray(proficienciesIds) ? proficienciesIds : interestedClassCategoryIds;
      await this.classCategoryService.updateClassCategories(userId, categoryIdsToUpdate);
    }
    if (location !== undefined) {
      console.log("Start update location preferences", location);
      await this.locationService.updateLocation(userId, location);
    }
  }
}
