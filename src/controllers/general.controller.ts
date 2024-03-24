import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { GeneralService } from 'src/services';

@Controller()
export class GeneralController {
  constructor(
    private readonly generalService: GeneralService,
  ) { }

  @MessagePattern({ cmd: 'getUserPreferencesByUserId' })
  getUserPreferencesByUserId(userId: string) {
    return this.generalService.getUserPreferencesByUserId(userId);
  }
}
