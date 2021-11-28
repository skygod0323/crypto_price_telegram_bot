import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';
import { Setting } from './entities/setting.entity';
import { Token } from './entities/token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Setting, Token])],
  controllers: [TelegramController],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
