// DTO Types matching class diagram

export interface LoginRequest {
  email: string;
  password: string;
}

export interface GoogleLoginRequest {
  idToken: string; // Google ID token from OAuth
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  roles: Role[];
  user: UserInfo;
}

export interface UserInfo {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
}

export interface Role {
  id: string;
  name: 'PATIENT' | 'DOCTOR' | 'ADMIN';
  displayName: string;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  avatar?: string;
  createdAt: Date;
}