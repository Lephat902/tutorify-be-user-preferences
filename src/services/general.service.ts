import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPreferences } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class GeneralService {
  constructor(
    @InjectRepository(UserPreferences)
    private readonly userPreferencesRepository: Repository<UserPreferences>,
  ) { }

  async getUserPreferencesByUserId(userId: string) {
    return this.userPreferencesRepository.findOneBy({ userId });
  }

  async handleUserDeleted(userId: string) {
    return this.userPreferencesRepository.delete({ userId });
  }
}
