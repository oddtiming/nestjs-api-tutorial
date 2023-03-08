import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { BookmarkModule } from './bookmark/bookmark.module';
// import { PrismaModule } from 'prisma';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { GatewayModule } from './gateway/gateway.module';
import { SocketModule } from './socket/socket.module';
import { configValidationSchema } from './config.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
      ConfigModule.forRoot({
        envFilePath: '../.env',
        validationSchema: configValidationSchema,
        isGlobal: true, // Expose the module globally
      }), // Loads env vars. Uses dotenv library under the hood
      AuthModule,
      HttpModule,
      UserModule,
      BookmarkModule,
      PrismaModule,
      GatewayModule,
      SocketModule
    ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
