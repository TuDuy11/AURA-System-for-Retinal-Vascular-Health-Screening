import { useState } from 'react';
import { DashboardLayout } from './shared/DashboardLayout';
import { PatientDashboardHome } from './patient/PatientDashboardHome';
import { PatientUploadPage } from './patient/PatientUploadPage';
import { PatientProcessingPage } from './patient/PatientProcessingPage';
import { PatientResultPage } from './patient/PatientResultPage';
import { PatientHistoryPage } from './patient/PatientHistoryPage';
import { PatientProfilePage } from './patient/PatientProfilePage';
import { LoginResponse } from '@/app/services/auth/types';

interface PatientDashboardProps {
  onLogout: () => void;
  onBackToHome: () => void;
  onBackToPublic?: () => void;
  loginResponse: LoginResponse | null;
}

type PatientPage = 'dashboard' | 'upload' | 'processing' | 'result' | 'history' | 'profile';

export function PatientDashboard({ onLogout, onBackToHome, onBackToPublic, loginResponse }: PatientDashboardProps) {
  const [currentPage, setCurrentPage] = useState<PatientPage>('dashboard');
  const [processingData, setProcessingData] = useState<{ file: File; eye: string } | null>(null);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as PatientPage);
  };

  const handleStartProcessing = (file: File, eye: string) => {
    setProcessingData({ file, eye });
    setCurrentPage('processing');
  };

  const handleProcessingComplete = () => {
    setProcessingData(null);
    setCurrentPage('result');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <PatientDashboardHome onNavigate={handleNavigate} />;
      
      case 'upload':
        return (
          <PatientUploadPage
            onNavigate={handleNavigate}
            onStartProcessing={handleStartProcessing}
          />
        );
      
      case 'processing':
        return processingData ? (
          <PatientProcessingPage
            file={processingData.file}
            eye={processingData.eye}
            onProcessingComplete={handleProcessingComplete}
          />
        ) : (
          <PatientDashboardHome onNavigate={handleNavigate} />
        );
      
      case 'result':
        return <PatientResultPage onNavigate={handleNavigate} />;
      
      case 'history':
        return <PatientHistoryPage onNavigate={handleNavigate} />;
      
      case 'profile':
        return <PatientProfilePage onNavigate={handleNavigate} />;
      
      default:
        return <PatientDashboardHome onNavigate={handleNavigate} />;
    }
  };

  return (
    <DashboardLayout
      userRole="patient"
      userName={loginResponse?.user.fullName || 'Nguyễn Văn A'}
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