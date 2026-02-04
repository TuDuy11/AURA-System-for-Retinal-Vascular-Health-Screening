import { User, Role } from './types';

export interface ITokenService {
  generateAccessToken(user: User, roles: Role[]): Promise<string>;
  generateRefreshToken(user: User): Promise<string>;
}
