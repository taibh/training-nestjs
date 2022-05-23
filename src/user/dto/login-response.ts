import { UserDto } from './user';
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty() token: string;

  @ApiProperty({ type: UserDto })
  user: UserDto;
}
