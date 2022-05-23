import { mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/types';
import { Injectable } from '@nestjs/common';
import { BaseModel, BaseModelDto } from 'src/shared/base.model';
import { UserDto } from './dto/user';
import { User } from './schemas/user.schema';

@Injectable()
export class UserProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  mapProfile() {
    return (mapper) => {
      mapper.createMap(BaseModel, BaseModelDto);
      mapper.createMap(User, UserDto).forMember(
        (destination) => destination.fullName,
        mapFrom((source) => source.firstName + ' ' + source.lastName),
      );
    };
  }
}
