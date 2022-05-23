import { UpdateTodoDto } from './dto/update-todo.model';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/types';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOperation,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { isArray, map } from 'lodash';
import { ApiException } from 'src/shared/api-exception.model';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { ToBooleanPipe } from 'src/shared/pipes/to-boolean.pipe';
import { UserRole } from 'src/user/schemas/user-role.enum';
import { CreateTodoDto } from './dto/create-todo.model';
import { TodoDto } from './dto/todo.model';
import { TodoLevel } from './schemas/todo-level.enum';
import { Todo } from './schemas/todo.schema';
import { TodoService } from './todo.service';

@Controller('todos')
@ApiTags(Todo.name)
@Roles(UserRole.Admin, UserRole.User)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class TodoController {
  constructor(
    private readonly _todoService: TodoService,
    @InjectMapper() private _mapper: Mapper,
  ) {}

  @Get()
  @ApiOkResponse({ type: TodoDto, isArray: true })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ summary: 'Get all Todos' })
  @ApiQuery({
    name: 'level',
    enum: EnumToArray(TodoLevel),
    required: false,
    isArray: true,
  })
  @ApiQuery({ name: 'isCompleted', required: false, type: Boolean })
  async getTodo(
    @Query('level') level?: TodoLevel,
    @Query('isCompleted', new ToBooleanPipe()) isCompleted?: boolean,
  ): Promise<TodoDto[]> {
    let filter = {};
    if (level) {
      filter['level'] = { $in: isArray(level) ? [...level] : [level] };
    }

    if (isCompleted !== null) {
      if (filter['level']) {
        filter = { $and: [{ level: filter['level'] }, { isCompleted }] };
      } else {
        filter['isCompleted'] = isCompleted;
      }
    }

    try {
      const todos = await this._todoService.findAll(filter);
      return this._mapper.mapArray(
        map(todos, (todo) => todo.toJSON()),
        TodoDto,
        Todo,
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post()
  @ApiCreatedResponse({ type: TodoDto })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ summary: 'Create new Todo' })
  async register(@Body() todo: CreateTodoDto): Promise<TodoDto> {
    const { content, level } = todo;

    const newTodo = {
      content,
      level,
    };

    return this._todoService.createTodo(newTodo);
  }

  @Put()
  @ApiOkResponse({ type: TodoDto })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ summary: 'Update Todo' })
  async update(@Body() todo: UpdateTodoDto): Promise<TodoDto> {
    const { id, content, level, isCompleted } = todo;
    let exist;

    if (!todo || !id) {
      throw new BadRequestException('Missing parameters');
    }
    try {
      exist = await this._todoService.findById(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if (!exist) {
      throw new NotFoundException(`${id} Not found`);
    }

    if (exist.isCompleted) {
      throw new BadRequestException('This Todo already completed');
    }

    exist.content = content;
    exist.level = level;
    exist.isCompleted = isCompleted;

    try {
      const updated = await this._todoService.update(id, exist);
      return this._mapper.map(updated.toJSON(), TodoDto, Todo);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Delete(':id')
  @ApiOkResponse({ type: TodoDto })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ summary: 'Delete Todo' })
  async delete(@Param('id') id: string): Promise<TodoDto> {
    try {
      const deleted = await this._todoService.delete(id);
      return this._mapper.map(deleted.toJSON(), TodoDto, Todo);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}

export function EnumToArray(enumVariable: any): string[] {
  return Object.keys(enumVariable).map((k) => enumVariable[k]);
}
