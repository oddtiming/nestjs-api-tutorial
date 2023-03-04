import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
// import { PrismaModule } from 'prisma';
import { PrismaModule } from './prisma/prisma.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true, // Expose the module globally
      }), // Loads env vars. Uses dotenv library under the hood
      AuthModule,
      UserModule,
      BookmarkModule,
      PrismaModule,
    ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
