import { Todo, TodoDocument } from './schemas/todo.schema';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BaseService } from 'src/shared/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTodoDto } from './dto/create-todo.model';
import { TodoDto } from './dto/todo.model';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/types';

@Injectable()
export class TodoService extends BaseService<TodoDocument> {
  constructor(
    @InjectModel(Todo.name) private readonly _todoModel: Model<TodoDocument>,
    @InjectMapper() private _mapper: Mapper,
  ) {
    super();
    this._model = _todoModel;
  }

  async createTodo(todo: CreateTodoDto): Promise<TodoDto> {
    try {
      const newTodo: TodoDocument = new this._model(todo);
      const result = await this.create(newTodo);
      return this._mapper.map(result.toJSON(), TodoDto, Todo);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
