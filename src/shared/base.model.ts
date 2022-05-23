import { AutoMap } from '@automapper/classes';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class BaseModelDto {
  @AutoMap()
  @ApiProperty({ type: String, format: 'date-time' })
  createdAt?: Date;

  @AutoMap()
  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt?: Date;

  @AutoMap()
  @ApiProperty()
  id?: string;
}

export abstract class BaseModel {
  @AutoMap()
  @ApiPropertyOptional({ type: String, format: 'date-time' })
  createdAt?: Date;

  @AutoMap()
  @ApiPropertyOptional({ type: String, format: 'date-time' })
  updatedAt?: Date;

  @AutoMap()
  @ApiPropertyOptional()
  id?: string;
}
