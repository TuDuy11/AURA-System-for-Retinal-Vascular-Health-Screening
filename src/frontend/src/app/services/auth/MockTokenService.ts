import { ITokenService } from './ITokenService';
import { User, Role } from './types';

export class MockTokenService implements ITokenService {
  async generateAccessToken(user: User, roles: Role[]): Promise<string> {
    // Simulate token generation delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // In production, use JWT with proper signing
    // For demo, create a simple token-like string
    const payload = {
      sub: user.id,
      email: user.email,
      roles: roles.map(r => r.name),
      iat: Date.now(),
      exp: Date.now() + 3600000, // 1 hour
    };
    
    return `mock.access.${btoa(JSON.stringify(payload))}`;
  }

  async generateRefreshToken(user: User): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const payload = {
      sub: user.id,
      type: 'refresh',
      iat: Date.now(),
      exp: Date.now() + 86400000 * 7, // 7 days
    };
    
    return `mock.refresh.${btoa(JSON.stringify(payload))}`;
  }
}
