import { PageHeader } from '@/app/components/shared/PageHeader';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Bell, CheckCircle, AlertTriangle } from 'lucide-react';

interface DoctorNotificationsPageProps {
  onNavigate: (page: string) => void;
}

export function DoctorNotificationsPage({ onNavigate }: DoctorNotificationsPageProps) {
  const notifications = [
    {
      id: 'N001',
      type: 'urgent',
      title: 'Ca mới cần duyệt gấp',
      message: 'Bệnh nhân Lê Văn C (P789) - Mức độ nguy cơ: Nghiêm trọng',
      time: '5 phút trước',
      read: false
    },
    {
      id: 'N002',
      type: 'info',
      title: 'Ca đã được hoàn thành',
      message: 'Kết quả xác nhận cho bệnh nhân Nguyễn Văn A đã được gửi',
      time: '2 giờ trước',
      read: false
    },
    {
      id: 'N003',
      type: 'success',
      title: 'Đã duyệt thành công',
      message: 'Ca C002 - Trần Thị B đã được xác nhận và thông báo',
      time: '1 ngày trước',
      read: true
    }
  ];

  return (
    <div>
      <PageHeader
        title="Thông báo"
        description={`${notifications.filter(n => !n.read).length} thông báo mới`}
      />

      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className={!notification.read ? 'border-2 border-blue-200' : ''}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  notification.type === 'urgent' ? 'bg-red-100' :
                  notification.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {notification.type === 'urgent' ? (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  ) : notification.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Bell className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                    {!notification.read && (
                      <Badge variant="default" className="ml-2">Mới</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
