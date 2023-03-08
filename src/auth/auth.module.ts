import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionSerializer } from './session.serializer';
import { FortyTwoStrategy, JwtStrategy } from './strategy';

@Module({
    imports: [JwtModule.register({})],
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
    providers: [AuthService, JwtStrategy, FortyTwoStrategy, SessionSerializer],
})
export class AuthModule {}
