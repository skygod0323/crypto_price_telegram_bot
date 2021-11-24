import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { Setting } from './entities/setting.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Setting])
  ],
  controllers: [
    ApiController
  ],
  providers: [
    ApiService
  ],
  exports: [
    ApiService
  ]
})
export class ApiModule {}