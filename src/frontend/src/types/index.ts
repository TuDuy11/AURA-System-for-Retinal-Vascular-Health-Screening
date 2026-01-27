export type UserRole = 'patient' | 'doctor' | 'clinic' | 'admin'

export interface User {
  id: number
  email: string
  fullName: string
  role: UserRole
  isActive: boolean
  avatar?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  data: {
    user: User
    token: string
  }
}