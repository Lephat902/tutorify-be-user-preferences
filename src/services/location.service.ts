import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPreferences } from 'src/entities';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(UserPreferences)
    private readonly userPreferencesRepository: Repository<UserPreferences>,
  ) { }

  async updateLocation(userId: string, location: UserPreferences['preferences']['location']) {
    const userPreferences = await this.userPreferencesRepository.findOneBy({ userId });

    if (userPreferences) {
      userPreferences.preferences.location = location;
      await this.userPreferencesRepository.save(userPreferences);
    }
  }
}
