import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import * as expressBasicAuth from 'express-basic-auth';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Dreamify API Document')
    .setDescription('This document is for Dreamify APIs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.use(
    '/doc',
    expressBasicAuth({
      challenge: true,
      users: {
        telegram_bot: 'password',
      },
    }),
  );

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  await app.listen(3000);
}
bootstrap();
