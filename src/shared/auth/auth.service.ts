import { JwtPayload } from './jwt-payload.model';
import { ConfigService } from '@nestjs/config';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { sign, SignOptions } from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';
import { Configuration } from '../config/configuration.enum';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class AuthService {
  private readonly jwtOptions: SignOptions;
  private readonly jwtKey: string;

  constructor(
    @Inject(forwardRef(() => UserService)) readonly _userService: UserService,
    private _configService: ConfigService,
  ) {
    this.jwtOptions = { expiresIn: '12h' };
    this.jwtKey = _configService.get(Configuration.JWT_KEY);
  }

  async signPayload(payload: JwtPayload): Promise<string> {
    return sign(payload, this.jwtKey, this.jwtOptions);
  }

  async validateUser(validatePayload: JwtPayload): Promise<User> {
    return this._userService.findOne({
      username: validatePayload.username.toLowerCase(),
    });
  }
}
