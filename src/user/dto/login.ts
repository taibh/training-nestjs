import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, Matches } from 'class-validator';

export class LoginDto {
  @AutoMap()
  @ApiProperty({ type: String, default: 'username' })
  @IsNotEmpty()
  @MinLength(6)
  username: string;

  @AutoMap()
  @ApiProperty({ type: String, default: '@xYz12345' })
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
