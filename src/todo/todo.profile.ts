import { Mapper } from '@automapper/types';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Todo } from './schemas/todo.schema';
import { TodoDto } from './dto/todo.model';

export class TodoProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  mapProfile() {
    return (mapper) => {
      mapper.createMap(Todo, TodoDto);
    };
  }
}
