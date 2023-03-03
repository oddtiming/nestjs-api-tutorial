import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// This class is also a provider
@Injectable()
// set as 'jwt' by default, but any other identifier can be passed
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

  constructor(config: ConfigService) {
    // Ensures that the provided JWT's secret was issued by our server
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  /**
   * Used automatically by Express to validate the token
   * @param payload Contents of the JTW
   * @returns Will be appended the payload to the user object of the request object 
   */
  validate(payload: any) {
    return payload;
  }
}
