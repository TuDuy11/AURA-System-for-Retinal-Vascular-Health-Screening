import { IRoleRepository } from './IRoleRepository';
import { Role } from './types';

// Mock user-role mappings
const USER_ROLES: Record<string, Role[]> = {
  'patient-001': [
    { id: 'role-1', name: 'PATIENT', displayName: 'Bệnh nhân' }
  ],
  'patient-002': [
    { id: 'role-1', name: 'PATIENT', displayName: 'Bệnh nhân' }
  ],
  'doctor-001': [
    { id: 'role-2', name: 'DOCTOR', displayName: 'Bác sĩ' }
  ],
  'doctor-002': [
    { id: 'role-2', name: 'DOCTOR', displayName: 'Bác sĩ' }
  ],
};

export class MockRoleRepository implements IRoleRepository {
  async getRolesByUserId(userId: string): Promise<Role[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return USER_ROLES[userId] || [];
  }
}
