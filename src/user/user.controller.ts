import { UserService } from './user.service';
import { UserDto } from './dto/user';
import { Body, Controller, Post } from '@nestjs/common';

import { RegisterDto } from './dto/register';

@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Post('register')
  async register(@Body() data: RegisterDto): Promise<UserDto> {
    const newUser = await this._userService.register(data);
    console.log(newUser);
    return newUser;
    // return this._userService.map(newUser, User, UserVm);
  }
}
