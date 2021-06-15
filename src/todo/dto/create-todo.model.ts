import { TodoLevel } from './../schemas/todo-level.enum';
import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty()
  @AutoMap()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ enum: TodoLevel, default: TodoLevel.NORMAL })
  @AutoMap()
  level: TodoLevel;
}
