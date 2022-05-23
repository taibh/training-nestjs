import { UserRole } from './../../user/schemas/user-role.enum';

export interface JwtPayload {
  username: string;
  role: UserRole;
  iat?: Date;
}
