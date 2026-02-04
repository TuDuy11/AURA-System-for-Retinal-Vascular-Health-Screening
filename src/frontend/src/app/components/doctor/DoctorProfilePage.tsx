import { PageHeader } from '@/app/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { User, Mail, Phone, Briefcase, Award, CheckCircle } from 'lucide-react';

interface DoctorProfilePageProps {
  onNavigate: (page: string) => void;
}

export function DoctorProfilePage({ onNavigate }: DoctorProfilePageProps) {
  const profile = {
    fullName: 'TS. BS. Nguyễn Văn A',
    email: 'doctor@aura.vn',
    phone: '0912 345 678',
    specialization: 'Nhãn khoa',
    licenseNumber: '12345/BYT-HN',
    yearsOfExperience: '15 năm',
    status: 'verified',
    totalReviews: 156,
    avgReviewTime: '12 phút'
  };

  return (
    <div>
      <PageHeader
        title="Hồ sơ bác sĩ"
        description="Thông tin tài khoản và thống kê hoạt động"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-4xl">
                    {profile.fullName.charAt(profile.fullName.indexOf('Nguyễn'))}
                  </span>
                </div>
                <h3 className="font-semibold text-lg text-gray-900">{profile.fullName}</h3>
                <p className="text-sm text-gray-500">{profile.specialization}</p>
                <Badge className="mt-2 bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Đã xác thực
                </Badge>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID:</span>
                  <span className="font-medium">D001</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số GPHH:</span>
                  <span className="font-medium">{profile.licenseNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kinh nghiệm:</span>
                  <span className="font-medium">{profile.yearsOfExperience}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin liên hệ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Số điện thoại</p>
                  <p className="font-medium">{profile.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Chuyên khoa</p>
                  <p className="font-medium">{profile.specialization}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thống kê hoạt động</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{profile.totalReviews}</p>
                  <p className="text-sm text-gray-600">Tổng ca đã duyệt</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{profile.avgReviewTime}</p>
                  <p className="text-sm text-gray-600">Thời gian TB/ca</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
