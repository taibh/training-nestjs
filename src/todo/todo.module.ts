import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { Todo, TodoSchema } from './schemas/todo.schema';
import { TodoProfile } from './todo.profile';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
  ],
  providers: [TodoService, TodoProfile],
  controllers: [TodoController],
})
export class TodoModule {}
