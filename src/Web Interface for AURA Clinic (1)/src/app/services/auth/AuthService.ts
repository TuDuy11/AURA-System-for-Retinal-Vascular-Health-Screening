import { IUserRepository } from './IUserRepository';
import { IPasswordHasher } from './IPasswordHasher';
import { IRoleRepository } from './IRoleRepository';
import { ITokenService } from './ITokenService';
import { LoginRequest, GoogleLoginRequest, LoginResponse, UserInfo } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9999/api';

export class AuthService {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
    private roleRepository: IRoleRepository,
    private tokenService: ITokenService
  ) {}

  async login(request: LoginRequest): Promise<LoginResponse> {
    // Call backend API
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: request.email,
        password: request.password,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      const errorData = await response.json();
      throw new Error(errorData.error || 'Lỗi đăng nhập');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error('UNAUTHORIZED');
    }

    // Return LoginResponse from backend
    return {
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken,
      roles: data.data.roles,
      user: data.data.user,
    };
  }

  async register(email: string, password: string, fullName: string): Promise<LoginResponse> {
    // Call backend API
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        fullName,
      }),
    });

    if (!response.ok) {
      if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Lỗi đăng ký');
      }
      const errorData = await response.json();
      throw new Error(errorData.error || 'Lỗi đăng ký');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error('Lỗi đăng ký');
    }

    // Return LoginResponse from backend
    return {
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken,
      roles: data.data.roles,
      user: data.data.user,
    };
  }

  /**
   * Google OAuth Login Flow
   * In production, this would:
   * 1. Verify Google ID token with Google API
   * 2. Extract user info from verified token
   * 3. Find or create user in database
   * 4. Generate access/refresh tokens
   * 
   * For mock: We simulate the Google login with predefined demo accounts
   */
  async loginWithGoogle(request: GoogleLoginRequest): Promise<LoginResponse> {
    // Mock: Simulate Google token verification
    // In production: Verify idToken with Google's tokeninfo endpoint
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

    // Mock: Extract user info from "verified" token
    // For demo, we'll use a mock user based on token pattern
    const mockGoogleUser = this.extractMockGoogleUser(request.idToken);
    
    if (!mockGoogleUser) {
      throw new Error('UNAUTHORIZED');
    }

    // Try to find existing user or create new one
    let user = await this.userRepository.findByEmail(mockGoogleUser.email);
    
    if (!user) {
      // In production: Create new user with Google account
      // For mock: Use demo accounts if they match
      const demoUser = await this.userRepository.findByEmail('patient@example.com');
      user = demoUser || {
        id: 'google-' + Date.now(),
        email: mockGoogleUser.email,
        fullName: mockGoogleUser.fullName,
        passwordHash: '',
        avatar: mockGoogleUser.avatar,
        createdAt: new Date(),
      };
    }

    // Get user roles
    const roles = await this.roleRepository.getRolesByUserId(user.id);

    // Generate tokens
    const accessToken = await this.tokenService.generateAccessToken(user, roles);
    const refreshToken = await this.tokenService.generateRefreshToken(user);

    // Build UserInfo
    const userInfo: UserInfo = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
    };

    return {
      accessToken,
      refreshToken,
      roles,
      user: userInfo,
    };
  }

  /**
   * Mock helper: Extract user from demo Google token
   * In production: This would verify with Google API
   */
  private extractMockGoogleUser(idToken: string) {
    // Mock token patterns for demo
    if (idToken === 'MOCK_GOOGLE_TOKEN_PATIENT') {
      return {
        email: 'patient@example.com',
        fullName: 'Nguyễn Văn B (Google)',
        avatar: undefined,
      };
    }
    
    if (idToken === 'MOCK_GOOGLE_TOKEN_DOCTOR') {
      return {
        email: 'doctor@aura.vn',
        fullName: 'TS. BS. Nguyễn Văn A (Google)',
        avatar: undefined,
      };
    }

    return null;
  }
}