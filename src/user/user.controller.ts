import { User } from './schemas/user.schema';
import { UserService } from './user.service';
import { UserDto } from './dto/user';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { RegisterDto } from './dto/register';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiException } from 'src/shared/api-exception.model';
import { LoginDto } from './dto/login';
import { LoginResponseDto } from './dto/login-response';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRole } from './schemas/user-role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { map } from 'lodash';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/types';

@ApiTags(User.name)
@Controller('users')
export class UserController {
  constructor(
    private readonly _userService: UserService,
    @InjectMapper() private _mapper: Mapper,
  ) {}

  @Post('register')
  @ApiCreatedResponse({ type: UserDto })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ summary: 'Register new User' })
  async register(@Body() data: RegisterDto): Promise<UserDto> {
    const { username } = data;

    let exist;

    try {
      exist = await this._userService.findOne({ username });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }

    if (exist) {
      throw new BadRequestException('That username is taken, Try another.');
    }

    const newUser = await this._userService.register(data);
    return newUser;
  }

  @Post('login')
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ summary: 'Login' })
  async login(@Body() data: LoginDto): Promise<LoginResponseDto> {
    return this._userService.login(data);
  }

  @Get()
  @Roles(UserRole.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserDto, isArray: true })
  @ApiBadRequestResponse({ type: ApiException })
  async getAll(): Promise<UserDto[]> {
    try {
      const users = await this._userService.findAll({});
      return this._mapper.mapArray(
        map(users, (user) => user.toJSON()),
        UserDto,
        User,
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get('/info')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserDto })
  @ApiBadRequestResponse({ type: ApiException })
  async getInfo(@Req() req): Promise<UserDto> {
    try {
      return this._mapper.map(req.user.toJSON(), UserDto, User);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
