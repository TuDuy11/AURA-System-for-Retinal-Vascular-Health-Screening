import { IPasswordHasher } from './IPasswordHasher';

export class MockPasswordHasher implements IPasswordHasher {
  async verify(rawPassword: string, hashedPassword: string): Promise<boolean> {
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // In production, this would use bcrypt or similar
    // For demo, we just compare strings directly
    return rawPassword === hashedPassword;
  }

  async hash(password: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // In production, use bcrypt
    // For demo, return as-is (NOT SECURE)
    return password;
  }
}
