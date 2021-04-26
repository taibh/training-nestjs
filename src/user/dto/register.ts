import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LoginDto } from './login';

export class RegisterDto extends LoginDto {
  @ApiPropertyOptional()
  firstName: string;

  @ApiPropertyOptional()
  lastName: string;

  @ApiProperty()
  email: string;
}
