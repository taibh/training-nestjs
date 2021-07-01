import { AutoMap } from '@automapper/classes';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Equals, Matches, IsNotEmpty, IsEmail } from 'class-validator';
import { Match } from 'src/shared/decorators/match.decorator';
import { LoginDto } from './login';

export class RegisterDto extends LoginDto {
  @AutoMap()
  @ApiPropertyOptional()
  firstName: string;

  @AutoMap()
  @ApiPropertyOptional()
  lastName: string;

  @AutoMap()
  @ApiProperty({ default: 'example@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, default: '@xYz12345' })
  @Match('password', {
    message: 'Those passwords didn’t match. Try again.',
  })
  confirmPassword?: string;

  @AutoMap()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;
}
