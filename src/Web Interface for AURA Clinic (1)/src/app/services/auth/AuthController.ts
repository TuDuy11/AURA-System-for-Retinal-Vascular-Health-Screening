import { AuthService } from './AuthService';
import { MockUserRepository } from './MockUserRepository';
import { MockPasswordHasher } from './MockPasswordHasher';
import { MockRoleRepository } from './MockRoleRepository';
import { MockTokenService } from './MockTokenService';
import { LoginRequest, GoogleLoginRequest, LoginResponse } from './types';

// Singleton instance
let authServiceInstance: AuthService | null = null;

export class AuthController {
  private static getAuthService(): AuthService {
    if (!authServiceInstance) {
      // Initialize with mock implementations
      const userRepository = new MockUserRepository();
      const passwordHasher = new MockPasswordHasher();
      const roleRepository = new MockRoleRepository();
      const tokenService = new MockTokenService();
      
      authServiceInstance = new AuthService(
        userRepository,
        passwordHasher,
        roleRepository,
        tokenService
      );
    }
    
    return authServiceInstance;
  }

  static async login(request: LoginRequest): Promise<LoginResponse> {
    const authService = this.getAuthService();
    
    try {
      const response = await authService.login(request);
      
      // Store tokens in localStorage (for demo)
      localStorage.setItem('aura_access_token', response.accessToken);
      localStorage.setItem('aura_refresh_token', response.refreshToken);
      localStorage.setItem('aura_user_info', JSON.stringify(response.user));
      localStorage.setItem('aura_user_roles', JSON.stringify(response.roles));
      
      return response;
    } catch (error) {
      // Re-throw for proper error handling in UI
      throw error;
    }
  }

<<<<<<< HEAD:src/Web Interface for AURA Clinic (1)/src/app/services/auth/AuthController.ts
  static async register(request: { email: string; password: string; fullName: string }): Promise<LoginResponse> {
    const authService = this.getAuthService();
    
    try {
      const response = await authService.register(request.email, request.password, request.fullName);
      
      // Store tokens in localStorage (for demo)
      localStorage.setItem('aura_access_token', response.accessToken);
      localStorage.setItem('aura_refresh_token', response.refreshToken);
      localStorage.setItem('aura_user_info', JSON.stringify(response.user));
      localStorage.setItem('aura_user_roles', JSON.stringify(response.roles));
      
      return response;
    } catch (error) {
      // Re-throw for proper error handling in UI
      throw error;
    }
  }

=======
>>>>>>> efcb8ba60e63834eb9db130be1617615df418b0d:src/frontend/src/app/services/auth/AuthController.ts
  /**
   * Google OAuth Login
   * In production: This would redirect to Google OAuth or handle callback
   * For mock: We simulate with a predefined token
   */
  static async loginWithGoogle(request: GoogleLoginRequest): Promise<LoginResponse> {
    const authService = this.getAuthService();
    
    try {
      const response = await authService.loginWithGoogle(request);
      
      // Store tokens in localStorage (for demo)
      localStorage.setItem('aura_access_token', response.accessToken);
      localStorage.setItem('aura_refresh_token', response.refreshToken);
      localStorage.setItem('aura_user_info', JSON.stringify(response.user));
      localStorage.setItem('aura_user_roles', JSON.stringify(response.roles));
      localStorage.setItem('aura_login_method', 'google');
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  static logout(): void {
    localStorage.removeItem('aura_access_token');
    localStorage.removeItem('aura_refresh_token');
    localStorage.removeItem('aura_user_info');
    localStorage.removeItem('aura_user_roles');
    localStorage.removeItem('aura_login_method');
  }

  static getCurrentUser() {
    const userInfo = localStorage.getItem('aura_user_info');
    const roles = localStorage.getItem('aura_user_roles');
    
    if (!userInfo || !roles) {
      return null;
    }
    
    return {
      user: JSON.parse(userInfo),
      roles: JSON.parse(roles),
    };
  }
}