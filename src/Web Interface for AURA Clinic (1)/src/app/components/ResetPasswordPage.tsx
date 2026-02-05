import { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { logoImage } from '../assets/images';
interface ResetPasswordPageProps {
  email: string;
  onResetSuccess: () => void;
  onBackToLogin: () => void;
}

export function ResetPasswordPage({ email, onResetSuccess, onBackToLogin }: ResetPasswordPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (): boolean => {
    if (!password || !confirmPassword) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return false;
    }

    if (password.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }

    if (password !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp');
      return false;
    }

    return true;
  };

  const handleResetPassword = () => {
    if (!validatePassword()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        onResetSuccess();
      }, 2000);
    }, 1500);
  };

  if (isSuccess) {
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
            <div className="flex items-center justify-center mb-6">
              <img 
                src={logoImage} 
                alt="AURA Logo" 
                className="h-16 w-auto"
              />
            </div>
          </div>

          <Card className="shadow-2xl border-2 border-cyan-500/30 bg-white/98 backdrop-blur-md">
            <CardContent className="pt-12 pb-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Đặt lại mật khẩu thành công!
                </h2>
                
                <p className="text-gray-600 mb-8">
                  Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập với mật khẩu mới.
                </p>

                <p className="text-sm text-gray-500">
                  Đang chuyển hướng đến trang đăng nhập...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
            onClick={onBackToLogin}
            className="flex items-center justify-center mb-6 mx-auto transition-transform hover:scale-105"
            title="Quay về trang chủ"
          >
            <img 
              src={logoImage} 
              alt="AURA Logo" 
              className="h-28 w-auto"
            />
          </button>
          <h2 className="text-3xl font-bold text-white mb-2">Tạo mật khẩu mới</h2>
          <p className="text-cyan-200/80">Nhập mật khẩu mới cho tài khoản của bạn</p>
        </div>

        <Card className="shadow-2xl border-2 border-cyan-500/30 bg-white/98 backdrop-blur-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-2xl text-gray-900">Đặt lại mật khẩu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-gray-700">
                Đang đặt lại mật khẩu cho: <strong>{email}</strong>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu mới</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Ít nhất 6 ký tự"
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Nhập lại mật khẩu"
                    className="pl-10 pr-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleResetPassword()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password strength indicator */}
              {password && (
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Độ mạnh mật khẩu:</div>
                  <div className="flex gap-1">
                    <div className={`h-2 flex-1 rounded ${password.length >= 6 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                    <div className={`h-2 flex-1 rounded ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                    <div className={`h-2 flex-1 rounded ${password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                  </div>
                </div>
              )}

              <Button
                onClick={handleResetPassword}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg"
                size="lg"
              >
                {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
              </Button>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={onBackToLogin}
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Quay lại đăng nhập
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

