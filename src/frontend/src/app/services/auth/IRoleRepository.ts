import { Role } from './types';

export interface IRoleRepository {
  getRolesByUserId(userId: string): Promise<Role[]>;
}
