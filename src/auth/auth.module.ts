import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionSerializer } from './session.serializer';
import { FortyTwoStrategy, JwtStrategy } from './strategy';
import { AuthGateway } from './auth.gateway';
import { redisModule } from '../redis/redis-module.config';

@Module({
  imports: [JwtModule.register({}), PrismaModule, redisModule],
  /**
   *  Creates a jwt Access Token
   *
   *  register({}) can take options, such as :
   *  ```
   *     secret: jwtConstants.secret,
   *     signOptions: { expiresIn: '60s' },
   *  ```
   *  Instead we customize the token in auth.service
   */
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    FortyTwoStrategy,
    SessionSerializer,
    AuthGateway,
  ],
})
export class AuthModule {}
