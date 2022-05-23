import { UserRole } from './user-role.enum';
import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseModel } from 'src/shared/base.model';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class User extends BaseModel {
  @Prop({ required: true, unique: true, minlength: 6, trim: true })
  @AutoMap()
  username: string;

  @Prop({
    required: true,
    minlength: 8,
  })
  @AutoMap()
  password: string;

  @Prop()
  @AutoMap()
  firstName: string;

  @Prop()
  @AutoMap()
  lastName: string;

  @Prop({ required: true, email: true })
  @AutoMap()
  email: string;

  @Prop({ enum: UserRole, default: UserRole.User })
  @AutoMap()
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
