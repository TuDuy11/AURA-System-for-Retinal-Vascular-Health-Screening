import { useState } from 'react';
import { User, Lock, Eye, EyeOff, UserCircle2, Stethoscope, AlertCircle, Loader2, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import logoImage from 'figma:asset/bc4a6196f2ea60ceb4bf7a5ed0a8563545e7d16f.png';
import { AuthController } from '@/app/services/auth/AuthController';
import { LoginResponse } from '@/app/services/auth/types';

interface LoginPageProps {
  onLogin: (role: 'doctor' | 'patient', userId: string, loginResponse: LoginResponse) => void;
  onRegisterClick: () => void;
  onForgotPassword: () => void;
  onBackToPublic?: () => void;
}

// Login states
type LoginState = 'idle' | 'submitting' | 'error' | 'success';
type GoogleLoginState = 'idle' | 'loading' | 'error' | 'success';

export function LoginPage({ onLogin, onRegisterClick, onForgotPassword, onBackToPublic }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [loginState, setLoginState] = useState<LoginState>('idle');
  const [googleLoginState, setGoogleLoginState] = useState<GoogleLoginState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [googleErrorMessage, setGoogleErrorMessage] = useState('');

  const handleLogin = async (selectedRole: 'doctor' | 'patient') => {
    if (!credentials.email || !credentials.password) {
      setLoginState('error');
      setErrorMessage('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    // Set submitting state
    setLoginState('submitting');
    setErrorMessage('');

    try {
      // Call AuthController.login(LoginRequest)
      const response = await AuthController.login({
        email: credentials.email,
        password: credentials.password,
      });

      // Success state
      setLoginState('success');

      // RBAC: Redirect based on roles from LoginResponse (not UI pill selection)
      const primaryRole = response.roles[0]?.name;
      
      if (primaryRole === 'PATIENT') {
        onLogin('patient', response.user.id, response);
      } else if (primaryRole === 'DOCTOR') {
        onLogin('doctor', response.user.id, response);
      } else {
        throw new Error('UNAUTHORIZED');
      }
    } catch (error) {
      // Error state - 401 Unauthorized
      setLoginState('error');
      if (error instanceof Error && error.message === 'UNAUTHORIZED') {
        setErrorMessage('Email hoặc mật khẩu không đúng');
      } else {
        setErrorMessage('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    }
  };

  /**
   * Handle Google Login
   * In production: This would redirect to Google OAuth or open popup
   * For mock: We simulate with a predefined token based on selected role
   */
  const handleGoogleLogin = async (selectedRole: 'doctor' | 'patient') => {
    setGoogleLoginState('loading');
    setGoogleErrorMessage('');

    try {
      // Mock: Generate a demo token based on role
      const mockToken = selectedRole === 'patient' 
        ? 'MOCK_GOOGLE_TOKEN_PATIENT' 
        : 'MOCK_GOOGLE_TOKEN_DOCTOR';

      // Call AuthController.loginWithGoogle
      const response = await AuthController.loginWithGoogle({
        idToken: mockToken,
      });

      // Success state
      setGoogleLoginState('success');

      // RBAC: Redirect based on roles from LoginResponse
      const primaryRole = response.roles[0]?.name;
      
      if (primaryRole === 'PATIENT') {
        onLogin('patient', response.user.id, response);
      } else if (primaryRole === 'DOCTOR') {
        onLogin('doctor', response.user.id, response);
      } else {
        throw new Error('UNAUTHORIZED');
      }
    } catch (error) {
      // Error state
      setGoogleLoginState('error');
      if (error instanceof Error && error.message === 'UNAUTHORIZED') {
        setGoogleErrorMessage('Đăng nhập Google thất bại, vui lòng thử lại');
      } else {
        setGoogleErrorMessage('Có lỗi xảy ra với Google login. Vui lòng thử lại.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1f3d] via-[#0d2d4a] to-[#0a1f3d] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Medical Grid Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 212, 255, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 212, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <button 
            onClick={onBackToPublic}
            className="flex items-center justify-center mb-6 mx-auto transition-transform hover:scale-105"
            title="Quay về trang chủ"
          >
            <img 
              src={logoImage} 
              alt="AURA Logo" 
              className="h-28 w-auto"
            />
          </button>
          <h2 className="text-3xl font-bold text-white mb-2">Đăng nhập hệ thống</h2>
          <p className="text-cyan-200/80">Chào mừng bạn quay trở lại</p>
        </div>

        <Card className="shadow-2xl border-2 border-cyan-500/30 bg-white/98 backdrop-blur-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-2xl text-gray-900">Chọn loại tài khoản</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="patient" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1">
                <TabsTrigger value="patient" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
                  <UserCircle2 className="w-4 h-4 mr-2" />
                  Bệnh nhân
                </TabsTrigger>
                <TabsTrigger value="doctor" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Bác sĩ
                </TabsTrigger>
              </TabsList>

              <TabsContent value="patient" className="space-y-4 mt-6">
                {/* Error Alert */}
                {loginState === 'error' && errorMessage && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}

                {/* Google Error Alert */}
                {googleLoginState === 'error' && googleErrorMessage && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{googleErrorMessage}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="patient-email">Email</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="patient-email"
                      type="email"
                      placeholder="patient@example.com"
                      className="pl-10"
                      value={credentials.email}
                      onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patient-password">Mật khẩu</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="patient-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                  <strong>Demo:</strong> patient@example.com / password
                </div>

                <Button
                  onClick={() => handleLogin('patient')}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg"
                  size="lg"
                  disabled={loginState === 'submitting'}
                >
                  {loginState === 'submitting' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <UserCircle2 className="w-4 h-4 mr-2" />
                      Đăng nhập
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => handleGoogleLogin('patient')}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg"
                  size="lg"
                  disabled={googleLoginState === 'loading'}
                >
                  {googleLoginState === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Đăng nhập bằng Google
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="doctor" className="space-y-4 mt-6">
                {/* Error Alert */}
                {loginState === 'error' && errorMessage && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}

                {/* Google Error Alert */}
                {googleLoginState === 'error' && googleErrorMessage && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{googleErrorMessage}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="doctor-email">Email</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="doctor-email"
                      type="email"
                      placeholder="doctor@aura.vn"
                      className="pl-10"
                      value={credentials.email}
                      onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doctor-password">Mật khẩu</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="doctor-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                  <strong>Demo:</strong> doctor@aura.vn / password
                </div>

                <Button
                  onClick={() => handleLogin('doctor')}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg"
                  size="lg"
                  disabled={loginState === 'submitting'}
                >
                  {loginState === 'submitting' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Stethoscope className="w-4 h-4 mr-2" />
                      Đăng nhập
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => handleGoogleLogin('doctor')}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg"
                  size="lg"
                  disabled={googleLoginState === 'loading'}
                >
                  {googleLoginState === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Đăng nhập bằng Google
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <button onClick={onForgotPassword} className="text-sm text-blue-600 hover:underline font-medium">
                Quên mật khẩu?
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm">
          <p className="text-cyan-100">Chưa có tài khoản? <button onClick={onRegisterClick} className="text-cyan-300 hover:text-cyan-200 hover:underline font-semibold">Đăng ký ngay</button></p>
        </div>
      </div>
    </div>
  );
}