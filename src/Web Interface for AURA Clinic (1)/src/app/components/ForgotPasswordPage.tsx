import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
<<<<<<< HEAD:src/Web Interface for AURA Clinic (1)/src/app/components/ForgotPasswordPage.tsx
const logoImage = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22%3E%3Crect fill=%22%234f46e5%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2248%22 font-weight=%22bold%22%3EAURA%3C/text%3E%3C/svg%3E';
=======
import logoImage from 'figma:asset/bc4a6196f2ea60ceb4bf7a5ed0a8563545e7d16f.png';
>>>>>>> efcb8ba60e63834eb9db130be1617615df418b0d:src/frontend/src/app/components/ForgotPasswordPage.tsx

interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
  onResetLinkSent: (email: string) => void;
}

export function ForgotPasswordPage({ onBackToLogin, onResetLinkSent }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!email) {
      alert('Vui lòng nhập email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Email không hợp lệ');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      onResetLinkSent(email);
    }, 1500);
  };

  if (isSubmitted) {
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
                  Kiểm tra email của bạn
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Chúng tôi đã gửi link đặt lại mật khẩu đến
                </p>
                
                <p className="text-blue-600 font-semibold mb-8">
                  {email}
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-left">
                  <p className="text-gray-700">
                    <strong>Lưu ý:</strong> Link đặt lại mật khẩu sẽ hết hạn sau 1 giờ. 
                    Nếu bạn không nhận được email, vui lòng kiểm tra thư mục spam.
                  </p>
                </div>

                <Button
                  onClick={onBackToLogin}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg"
                  size="lg"
                >
                  Quay lại đăng nhập
                </Button>
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
          <h2 className="text-3xl font-bold text-white mb-2">Quên mật khẩu?</h2>
          <p className="text-cyan-200/80">Nhập email để đặt lại mật khẩu</p>
        </div>

        <Card className="shadow-2xl border-2 border-cyan-500/30 bg-white/98 backdrop-blur-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-2xl text-gray-900">Đặt lại mật khẩu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email đã đăng ký</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-gray-700">
                Chúng tôi sẽ gửi link đặt lại mật khẩu đến email này.
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg"
                size="lg"
              >
                {isLoading ? 'Đang gửi...' : 'Gửi link đặt lại'}
              </Button>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={onBackToLogin}
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại đăng nhập
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}