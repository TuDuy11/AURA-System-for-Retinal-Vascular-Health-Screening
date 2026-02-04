import { ReactNode, useState } from 'react';
import { 
  Home, 
  Upload, 
  History, 
  User, 
  LogOut, 
  Menu, 
  X,
  Stethoscope,
  Users,
  Bell,
  FileText,
  Eye
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
<<<<<<< HEAD:src/Web Interface for AURA Clinic (1)/src/app/components/shared/DashboardLayout.tsx
const logoImage = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22%3E%3Crect fill=%22%234f46e5%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2248%22 font-weight=%22bold%22%3EAURA%3C/text%3E%3C/svg%3E';
=======
import logoImage from 'figma:asset/bc4a6196f2ea60ceb4bf7a5ed0a8563545e7d16f.png';
>>>>>>> efcb8ba60e63834eb9db130be1617615df418b0d:src/frontend/src/app/components/shared/DashboardLayout.tsx
import { Role } from '@/app/services/auth/types';

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: 'patient' | 'doctor';
  userName: string;
  userEmail?: string;
  userAvatar?: string;
  roles: Role[];
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onBackToHome: () => void;
  onBackToPublic?: () => void; // New prop for Public Home
}

export function DashboardLayout({
  children,
  userRole,
  userName,
  userEmail,
  userAvatar,
  roles,
  currentPage,
  onNavigate,
  onLogout,
  onBackToHome,
  onBackToPublic
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /**
   * Handle Public Home Icon Click
   * When logged in: Logout first, then navigate to public landing
   */
  const handlePublicHomeClick = () => {
    if (onBackToPublic) {
      onLogout(); // Clear session
      onBackToPublic(); // Navigate to public landing
    }
  };

  const patientMenuItems = [
    { id: 'dashboard', label: 'Trang chủ', icon: Home },
    { id: 'upload', label: 'Sàng lọc mới', icon: Upload },
    { id: 'history', label: 'Lịch sử', icon: History },
    { id: 'profile', label: 'Hồ sơ', icon: User },
  ];

  const doctorMenuItems = [
    { id: 'dashboard', label: 'Trang chủ', icon: Home },
    { id: 'cases', label: 'Danh sách ca', icon: FileText },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'profile', label: 'Hồ sơ', icon: User },
  ];

  const menuItems = userRole === 'patient' ? patientMenuItems : doctorMenuItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between px-4 md:px-6 h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <button onClick={onBackToHome} className="flex items-center gap-3">
              <img src={logoImage} alt="AURA" className="h-28 w-auto" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
              {userRole === 'patient' ? (
                <User className="w-4 h-4 text-blue-600" />
              ) : (
                <Stethoscope className="w-4 h-4 text-blue-600" />
              )}
              <span className="text-sm font-medium text-gray-700">{userName}</span>
            </div>
            
            <Button
              onClick={onLogout}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-red-600"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)]
            w-64 bg-white border-r border-gray-200 
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Info at Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-semibold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                <p className="text-xs text-gray-500">
                  {userRole === 'patient' ? 'Bệnh nhân' : 'Bác sĩ'}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}