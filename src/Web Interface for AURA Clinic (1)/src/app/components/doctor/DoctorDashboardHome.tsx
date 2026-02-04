import { FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { StatsCard } from '@/app/components/shared/StatsCard';
import { RiskBadge } from '@/app/components/shared/RiskBadge';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

interface DoctorDashboardHomeProps {
  onNavigate: (page: string) => void;
}

export function DoctorDashboardHome({ onNavigate }: DoctorDashboardHomeProps) {
  // Mock data
  const pendingCases = [
    {
      id: 'C001',
      patientName: 'Nguyễn Văn A',
      patientId: 'P123',
      date: '2026-02-02',
      eye: 'Mắt phải',
      risk: 'high' as const,
      confidence: 89,
      waitTime: '2 giờ'
    },
    {
      id: 'C002',
      patientName: 'Trần Thị B',
      patientId: 'P456',
      date: '2026-02-02',
      eye: 'Mắt trái',
      risk: 'medium' as const,
      confidence: 85,
      waitTime: '4 giờ'
    },
    {
      id: 'C003',
      patientName: 'Lê Văn C',
      patientId: 'P789',
      date: '2026-02-01',
      eye: 'Mắt phải',
      risk: 'critical' as const,
      confidence: 92,
      waitTime: '1 ngày'
    }
  ];

  const stats = {
    totalPending: 8,
    highRisk: 3,
    completedToday: 12,
    avgReviewTime: '15 phút'
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Chào mừng, Bác sĩ! 👨‍⚕️</h2>
        <p className="text-blue-100">
          Bạn có {stats.totalPending} ca cần duyệt, trong đó {stats.highRisk} ca nguy cơ cao cần ưu tiên.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Chờ duyệt"
          value={stats.totalPending}
          subtitle="ca cần xem xét"
          icon={Clock}
          color="orange"
        />
        <StatsCard
          title="Nguy cơ cao"
          value={stats.highRisk}
          subtitle="cần ưu tiên"
          icon={AlertTriangle}
          color="red"
        />
        <StatsCard
          title="Hoàn thành hôm nay"
          value={stats.completedToday}
          subtitle="ca đã duyệt"
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="Thời gian trung bình"
          value={stats.avgReviewTime}
          subtitle="mỗi ca"
          icon={FileText}
          color="blue"
        />
      </div>

      {/* Pending Cases - High Priority */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Ca cần duyệt gấp</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Các ca nguy cơ cao cần được xem xét ngay
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('cases')}
            >
              Xem tất cả →
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingCases.map((case_) => (
              <div
                key={case_.id}
                className={`p-4 border-2 rounded-lg hover:bg-gray-50 transition-colors ${
                  case_.risk === 'critical' || case_.risk === 'high'
                    ? 'border-red-200 bg-red-50/30'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{case_.patientName}</h4>
                      <span className="text-sm text-gray-500">ID: {case_.patientId}</span>
                      <RiskBadge level={case_.risk} />
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                      <div>
                        <span className="block text-gray-500">Ngày:</span>
                        <span className="font-medium">{case_.date}</span>
                      </div>
                      <div>
                        <span className="block text-gray-500">Mắt:</span>
                        <span className="font-medium">{case_.eye}</span>
                      </div>
                      <div>
                        <span className="block text-gray-500">Độ tin cậy AI:</span>
                        <span className="font-medium">{case_.confidence}%</span>
                      </div>
                      <div>
                        <span className="block text-gray-500">Thời gian chờ:</span>
                        <span className="font-medium text-orange-600">{case_.waitTime}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      // In real app, navigate to case detail
                      alert(`Reviewing case: ${case_.id}`);
                    }}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 flex-shrink-0"
                  >
                    Duyệt ngay
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors cursor-pointer"
              onClick={() => onNavigate('cases')}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Tất cả ca bệnh</h3>
                <p className="text-sm text-gray-600">Xem danh sách đầy đủ</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200 hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => onNavigate('notifications')}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Thông báo</h3>
                <p className="text-sm text-gray-600">Xem tin nhắn mới</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200 hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => onNavigate('profile')}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Hồ sơ</h3>
                <p className="text-sm text-gray-600">Thông tin cá nhân</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Important Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Lưu ý quan trọng</h4>
            <p className="text-sm text-blue-800">
              Tất cả các thao tác xác nhận và chẩn đoán sẽ được ghi log theo quy định y tế. 
              Vui lòng kiểm tra kỹ trước khi xác nhận kết quả.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
