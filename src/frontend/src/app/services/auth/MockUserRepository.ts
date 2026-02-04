import { IUserRepository } from './IUserRepository';
import { User } from './types';

// Mock database
const MOCK_USERS: User[] = [
  {
    id: 'patient-001',
    email: 'patient@example.com',
    passwordHash: 'password', // In production this would be hashed
    fullName: 'Nguyễn Văn A',
    avatar: undefined,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'doctor-001',
    email: 'doctor@aura.vn',
    passwordHash: 'password', // In production this would be hashed
    fullName: 'TS. BS. Nguyễn Thị B',
    avatar: undefined,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'patient-002',
    email: 'john.doe@example.com',
    passwordHash: '123456',
    fullName: 'John Doe',
    avatar: undefined,
    createdAt: new Date('2024-02-01'),
  },
  {
    id: 'doctor-002',
    email: 'dr.smith@aura.vn',
    passwordHash: 'doctor123',
    fullName: 'TS. BS. Sarah Smith',
    avatar: undefined,
    createdAt: new Date('2024-02-01'),
  },
];

export class MockUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  }

  async findById(id: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const user = MOCK_USERS.find(u => u.id === id);
    return user || null;
  }
}
