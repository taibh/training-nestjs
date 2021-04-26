import { UserDto } from './dto/user';
import { RegisterDto } from './dto/register';
import { User } from './schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectModel(User.name) private readonly _userModel: Model<User>,
  ) {
    super();
    this._model = _userModel;
  }

  async register(data: RegisterDto) {
    const { username, password, firstName, lastName } = data;

    const newUser = new this._model(data);
    newUser.username = username.trim().toLowerCase();
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.password = password;

    const result = await this.create(newUser);
    return result.toJSON() as User;
    return {} as any;
  }
}
