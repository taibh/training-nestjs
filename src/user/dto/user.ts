import { UserRole } from './../schemas/user-role.enum';
import { AutoMap } from '@automapper/classes';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseModelDto } from 'src/shared/base.model';

export class UserDto extends BaseModelDto {
  @ApiProperty()
  @AutoMap()
  username: string;

  @ApiPropertyOptional()
  @AutoMap()
  firstName?: string;

  @ApiPropertyOptional()
  @AutoMap()
  lastName?: string;

  @ApiPropertyOptional()
  @AutoMap()
  fullName?: string;

  @ApiProperty()
  @AutoMap()
  email?: string;

  @ApiProperty({ enum: UserRole })
  @AutoMap()
  role: UserRole;
}
