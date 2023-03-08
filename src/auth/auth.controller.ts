import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Profile } from 'passport-42';
import { AuthService } from './auth.service';
import { GetUser } from './decorator';
import { AuthDto } from './dto';
import { FortyTwoGuard } from './guards/ft.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  // Here, private means that authService is a member attribute
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signup( @Body() dto: AuthDto ) {
    // The barren export pattern in ./dto/index.ts allows automatic exposition
    
    console.log({
        dto,
    }); // Creates an object and assigns it

    return this.authService.signup(dto);
  }

  @UseGuards(FortyTwoGuard)
  @Get('signup')
  signup_ft( @Body() dto: AuthDto ) {
    
    console.log('Succesfully redirected!');
    
    console.log({
        dto,
    }); // Creates an object and assigns it

    return dto;
  }
  

  @UseGuards(FortyTwoGuard)
  @Get('signin')
  signin_ft( @GetUser() user: Profile ) {
    // The barren export pattern in ./dto/index.ts allows automatic exposition
    
    console.log('Succesfully signed in!');
    
    console.log({
        user,
    }); // Creates an object and assigns it

    return user;
  }
  
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin( @Body() dto: AuthDto ) {
    return this.authService.signin(dto);
  }

}
