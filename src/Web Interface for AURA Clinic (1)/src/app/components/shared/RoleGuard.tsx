import { AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
<<<<<<< HEAD:src/Web Interface for AURA Clinic (1)/src/app/components/shared/RoleGuard.tsx
const logoImage = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22%3E%3Crect fill=%22%234f46e5%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2248%22 font-weight=%22bold%22%3EAURA%3C/text%3E%3C/svg%3E';
=======
import logoImage from 'figma:asset/bc4a6196f2ea60ceb4bf7a5ed0a8563545e7d16f.png';
>>>>>>> efcb8ba60e63834eb9db130be1617615df418b0d:src/frontend/src/app/components/shared/RoleGuard.tsx

interface RoleGuardProps {
  userRole: 'patient' | 'doctor';
  onBackToDashboard: () => void;
}

export function RoleGuard({ userRole, onBackToDashboard }: RoleGuardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1f3d] via-[#0d2d4a] to-[#0a1f3d] flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="flex items-center justify-center mb-6">
          <img 
            src={logoImage} 
            alt="AURA Logo" 
            className="h-16 w-auto"
          />
        </div>
        
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-cyan-500/30 p-8">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Truy cập bị từ chối
            </h2>
            
            <p className="text-gray-600">
              Bạn không có quyền truy cập vào trang này.
            </p>
          </div>
          
          <Button
            onClick={onBackToDashboard}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white"
            size="lg"
          >
            Về trang chủ
          </Button>
          
          <p className="mt-4 text-sm text-gray-500">
            Vai trò hiện tại: <strong>{userRole === 'patient' ? 'Bệnh nhân' : 'Bác sĩ'}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
