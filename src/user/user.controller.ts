import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
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
  editUser(@GetUser() user: User) {}
}
