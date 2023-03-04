import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  // Here, private means that authService is a member attribute
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signup( @Body() dto: AuthDto ) {
    // The barren export pattern in ./dto/index.ts allows automatic exposition
    
    // console.log({
    //     dto,
    // }); // Creates an object and assigns it

    return this.authService.signup(dto);
  }
  
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin( @Body() dto: AuthDto ) {
    return this.authService.signin(dto);
  }
}
