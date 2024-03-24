import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ClassCategoryService } from '../services/class-category.service';

@Controller()
export class ClassCategoryController {
  constructor(
    private readonly classCategoryService: ClassCategoryService,
  ) { }

  @MessagePattern({ cmd: 'addOneClassCategory' })
  addOneClassCategory(payload: { userId: string, classCategoryId: string }) {
    const { userId, classCategoryId } = payload;
    return this.classCategoryService.addClassCategories(userId, [classCategoryId]);
  }

  @MessagePattern({ cmd: 'removeClassCategory' })
  removeClassCategory(payload: { userId: string, classCategoryId: string }) {
    const { userId, classCategoryId } = payload;
    return this.classCategoryService.removeClassCategory(userId, classCategoryId);
  }

  @MessagePattern({ cmd: 'getClassCategoryPreferencesByUserId' })
  getClassCategoryPreferencesByUserId(userId: string) {
    return this.classCategoryService.getClassCategoryPreferencesByUserId(userId);
  }
}
