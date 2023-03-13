import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { GatewayModule } from './gateway/gateway.module';
import { SocketModule } from './socket/socket.module';
import { configValidationSchema } from './config.schema';
import { HttpModule } from '@nestjs/axios';
import { SearchModule } from './search/search.module';
import * as redisStore from 'cache-manager-redis-store';
import { redisModule } from './redis/redis-module.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      validationSchema: configValidationSchema,
      isGlobal: true, // Expose the module globally
    }), // Loads env vars. Uses dotenv library under the hood
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      redisInstanceName: 'redis',
      host: 'localhost',
      port: 6379,
    }),
    AuthModule,
    HttpModule,
    UserModule,
    BookmarkModule,
    PrismaModule,
    GatewayModule,
    SocketModule,
    SearchModule,
    redisModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
