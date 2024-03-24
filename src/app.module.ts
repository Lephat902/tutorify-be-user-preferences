import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassCategoryService, GeneralService } from './services';
import { Controllers } from './controllers';
import { BroadcastModule } from '@tutorify/shared';
import { UserPreferences } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPreferences]),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: configService.get('DATABASE_TYPE'),
        url: configService.get('DATABASE_URI'),
        entities: [UserPreferences],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.example'],
    }),
    BroadcastModule,
  ],
  providers: [
    ClassCategoryService,
    GeneralService,
  ],
  controllers: Controllers,
})
export class AppModule { }
