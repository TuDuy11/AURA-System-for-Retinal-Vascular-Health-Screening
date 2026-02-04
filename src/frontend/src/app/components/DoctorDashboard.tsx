import { useState } from 'react';
import { DashboardLayout } from './shared/DashboardLayout';
import { DoctorDashboardHome } from './doctor/DoctorDashboardHome';
import { DoctorCasesListPage } from './doctor/DoctorCasesListPage';
import { DoctorCaseDetailPage } from './doctor/DoctorCaseDetailPage';
import { DoctorNotificationsPage } from './doctor/DoctorNotificationsPage';
import { DoctorProfilePage } from './doctor/DoctorProfilePage';
import { LoginResponse } from '@/app/services/auth/types';

interface DoctorDashboardProps {
  onLogout: () => void;
  onBackToHome: () => void;
  onBackToPublic?: () => void;
  loginResponse: LoginResponse | null;
}

type DoctorPage = 'dashboard' | 'cases' | 'case-detail' | 'notifications' | 'profile';

export function DoctorDashboard({ onLogout, onBackToHome, onBackToPublic, loginResponse }: DoctorDashboardProps) {
  const [currentPage, setCurrentPage] = useState<DoctorPage>('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as DoctorPage);
  };

  const handleCaseSelect = (caseId: string) => {
    setSelectedCaseId(caseId);
    setCurrentPage('case-detail');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DoctorDashboardHome onNavigate={handleNavigate} />;
      
      case 'cases':
        return (
          <DoctorCasesListPage
            onNavigate={handleNavigate}
            onCaseSelect={handleCaseSelect}
          />
        );
      
      case 'case-detail':
        return selectedCaseId ? (
          <DoctorCaseDetailPage
            caseId={selectedCaseId}
            onNavigate={handleNavigate}
          />
        ) : (
          <DoctorDashboardHome onNavigate={handleNavigate} />
        );
      
      case 'notifications':
        return <DoctorNotificationsPage onNavigate={handleNavigate} />;
      
      case 'profile':
        return <DoctorProfilePage onNavigate={handleNavigate} />;
      
      default:
        return <DoctorDashboardHome onNavigate={handleNavigate} />;
    }
  };

  return (
    <DashboardLayout
      userRole="doctor"
      userName={loginResponse?.user.fullName || 'TS. BS. Nguyễn Văn A'}
      userEmail={loginResponse?.user.email}
      userAvatar={loginResponse?.user.avatar}
      roles={loginResponse?.roles || []}
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onLogout={onLogout}
      onBackToHome={onBackToHome}
      onBackToPublic={onBackToPublic}
    >
      {renderPage()}
    </DashboardLayout>
  );
}