import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseModelDto } from './../../shared/base.model';

export class UserDto extends BaseModelDto {
  @ApiProperty()
  username: string;

  @ApiPropertyOptional()
  firstName?: string;

  @ApiPropertyOptional()
  lastName?: string;

  @ApiPropertyOptional()
  fullName?: string;
}
