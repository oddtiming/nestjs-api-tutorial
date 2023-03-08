import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtGuard } from '../auth/guards';
import { FortyTwoGuard } from '../auth/guards/ft.guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(FortyTwoGuard)
@Controller('users')
@ApiTags('users') // To group them in Swagger
export class UserController {
  constructor (private userService: UserService) {}

  /**
   *    User Profile page
   * @param user User type from the prisma schema.
   *    @GetUser() custom decorator exposes the user from the request
   */
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  /**
   *    Edit user parameters
   * @param user User type from the prisma schema.
   *    @GetUser() custom decorator exposes the user from the request
   */
  @Patch('edit')
  editUser(@GetUser('id') userId: string, @Body() dto: EditUserDto) {
   return this.userService.editUser(userId, dto);
  }
}
