import { BaseModel } from 'src/shared/base.model';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AutoMap } from '@automapper/classes';
import { TodoLevel } from './todo-level.enum';

export type TodoDocument = Todo & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class Todo extends BaseModel {
  @Prop({ required: true })
  @AutoMap()
  content: string;

  @Prop({ enum: TodoLevel, default: TodoLevel.NORMAL })
  @AutoMap()
  level: TodoLevel;

  @Prop({ default: false })
  @AutoMap()
  isCompleted: boolean;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
