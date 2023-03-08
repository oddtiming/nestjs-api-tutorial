import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strips out unwanted request elements from a dto
  }));

  const config = new DocumentBuilder()
    .setTitle('Bookmarks API')
    .setDescription('Simple API for a bookmarks website')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(
    session({ resave: false, saveUninitialized: false, secret: 'secret' }),
  );

  await app.listen(3333);
}
bootstrap();
