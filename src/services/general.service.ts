import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPreferences } from 'src/entities';

@Injectable()
export class GeneralService {
  constructor(
    @InjectRepository(UserPreferences)
    private readonly userPreferencesRepository: Repository<UserPreferences>,
  ) { }

  async getUserPreferencesByUserId(userId: string) {
    return this.userPreferencesRepository.findOneBy({ userId });
  }
}
