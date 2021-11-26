import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramModule } from './telegram/telegram.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as ormConfig from './ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    TelegramModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
