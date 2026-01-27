import axios from 'axios'
import { LoginCredentials, AuthResponse } from '../types'

const API_URL = 'http://localhost:9999/api'

const apiClient = axios.create({
  baseURL: API_URL,
})

// Mock login function (replace with real API call)
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // Mock response - replace with real API call
      return {
        success: true,
        data: {
          user: {
            id: 1,
            email: credentials.email,
            fullName: 'John Doe',
            role: credentials.email.includes('doctor') ? 'doctor' : 'patient',
            isActive: true,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
          },
          token: 'mock-jwt-token-' + Date.now()
        }
      }
    } catch (error) {
      throw error
    }
  },

  register: async (data: any) => {
    try {
      return await apiClient.post('/auth/register', data)
    } catch (error) {
      throw error
    }
  }
}

export default apiClient