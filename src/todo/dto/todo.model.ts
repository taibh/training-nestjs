import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { BaseModelDto } from 'src/shared/base.model';
import { TodoLevel } from '../schemas/todo-level.enum';

export class TodoDto extends BaseModelDto {
  @ApiProperty()
  @AutoMap()
  content: string;

  @ApiProperty({ enum: TodoLevel, default: TodoLevel.NORMAL })
  @AutoMap()
  level: TodoLevel;

  @ApiProperty({ default: false })
  @AutoMap()
  isCompleted: boolean;
}
