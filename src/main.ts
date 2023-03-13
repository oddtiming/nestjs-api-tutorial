import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import * as passport from 'passport';
import { AppModule } from './app.module';
import { Server } from 'socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips out unwanted request elements from a dto
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Bookmarks API')
    .setDescription('Simple API for a bookmarks website')
    .setVersion('1.0')
    .addTag('bookmarks')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: 'secret',
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  const server = require('http').createServer(app);
  const io = require('socket.io')(server);
  io.on('connection', (socket) => {
    console.log(`connect ${socket.id}`);

    socket.on('ping', (cb) => {
      console.log('ping');
      cb();
    });

    socket.on('disconnect', () => {
      console.log(`disconnect ${socket.id}`);
    });
  });

  await app.listen(3000);
}
bootstrap();
