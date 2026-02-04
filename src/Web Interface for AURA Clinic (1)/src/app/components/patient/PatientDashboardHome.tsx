import { Upload, Eye, History, AlertCircle } from 'lucide-react';
import { StatsCard } from '@/app/components/shared/StatsCard';
import { RiskBadge, StatusBadge } from '@/app/components/shared/RiskBadge';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

interface PatientDashboardHomeProps {
  onNavigate: (page: string) => void;
}

export function PatientDashboardHome({ onNavigate }: PatientDashboardHomeProps) {
  // Mock data
  const recentScreenings = [
    {
      id: 'S001',
      date: '2026-01-28',
      eye: 'Mắt phải',
      risk: 'low' as const,
      status: 'doctor-validated' as const,
      confidence: 95
    },
    {
      id: 'S002',
      date: '2026-01-15',
      eye: 'Mắt trái',
      risk: 'medium' as const,
      status: 'doctor-validated' as const,
      confidence: 87
    },
    {
      id: 'S003',
      date: '2025-12-10',
      eye: 'Mắt phải',
      risk: 'low' as const,
      status: 'ai-only' as const,
      confidence: 92
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Chào mừng trở lại! 👋</h2>
        <p className="text-blue-100 mb-4">
          Sức khỏe đôi mắt của bạn rất quan trọng. Hãy thực hiện sàng lọc định kỳ để bảo vệ thị lực.
        </p>
        <Button
          onClick={() => onNavigate('upload')}
          className="bg-white text-blue-600 hover:bg-blue-50"
        >
          <Upload className="w-4 h-4 mr-2" />
          Sàng lọc mới
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Tổng số lần sàng lọc"
          value={recentScreenings.length}
          icon={Eye}
          color="blue"
        />
        <StatsCard
          title="Lần gần nhất"
          value={recentScreenings[0]?.date || '-'}
          subtitle={recentScreenings[0]?.eye}
          icon={History}
          color="green"
        />
        <StatsCard
          title="Độ tin cậy trung bình"
          value={`${Math.round(recentScreenings.reduce((sum, s) => sum + s.confidence, 0) / recentScreenings.length)}%`}
          icon={AlertCircle}
          color="purple"
        />
      </div>

      {/* Recent Screenings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Kết quả gần đây</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('history')}
            >
              Xem tất cả →
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentScreenings.map((screening) => (
              <div
                key={screening.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-semibold text-gray-900">{screening.eye}</p>
                    <RiskBadge level={screening.risk} />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{screening.date}</span>
                    <StatusBadge status={screening.status} />
                    <span>Độ tin cậy: {screening.confidence}%</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // In a real app, we'd navigate to the specific result
                    onNavigate('history');
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Xem
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors cursor-pointer"
              onClick={() => onNavigate('upload')}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Tạo lần sàng lọc mới</h3>
                <p className="text-sm text-gray-600">Tải lên ảnh võng mạc để phân tích</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200 hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => onNavigate('history')}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                <History className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Xem lịch sử sàng lọc</h3>
                <p className="text-sm text-gray-600">Theo dõi các kết quả đã thực hiện</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Information Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Lưu ý quan trọng</h4>
            <p className="text-sm text-blue-800">
              Kết quả AI chỉ mang tính chất tham khảo. Để có chẩn đoán chính xác, 
              vui lòng đến gặp bác sĩ nhãn khoa hoặc chờ bác sĩ xác nhận kết quả.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
