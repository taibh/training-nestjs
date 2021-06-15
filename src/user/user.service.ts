import { UserDto } from './dto/user';
import { RegisterDto } from './dto/register';
import { User, UserDocument } from './schemas/user.schema';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BaseService } from 'src/shared/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/types';
import { compare, genSalt, hash } from 'bcryptjs';
import { LoginDto } from './dto/login';
import { LoginResponseDto } from './dto/login-response';
import { JwtPayload } from 'src/shared/auth/jwt-payload.model';
import { AuthService } from 'src/shared/auth/auth.service';

@Injectable()
export class UserService extends BaseService<UserDocument> {
  constructor(
    @InjectModel(User.name) private readonly _userModel: Model<UserDocument>,
    @InjectMapper() private mapper: Mapper,
    private readonly _authService: AuthService,
  ) {
    super();
    this._model = _userModel;
  }

  async register(data: RegisterDto): Promise<UserDto> {
    const { username, password, firstName, lastName, email } = data;

    const newData: RegisterDto = {
      username,
      password,
      firstName,
      lastName,
      email,
    };

    const salt = await genSalt(10);
    newData.password = await hash(password, salt);

    try {
      const newUser: UserDocument = new this._model(newData);

      const result = await this.create(newUser);
      return this.mapper.map(result.toJSON(), UserDto, User);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async login(data: LoginDto): Promise<LoginResponseDto> {
    const { username, password } = data;

    const user = await this.findOne({ username });

    if (!user) {
      throw new NotFoundException('Invalid crendentials');
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Invalid crendentials');
    }

    const payload: JwtPayload = {
      username: user.username,
      role: user.role,
    };

    const token = await this._authService.signPayload(payload);

    const userDto: UserDto = await this.mapper.map(
      user.toJSON(),
      UserDto,
      User,
    );

    return {
      token,
      user: userDto,
    };
  }
}
