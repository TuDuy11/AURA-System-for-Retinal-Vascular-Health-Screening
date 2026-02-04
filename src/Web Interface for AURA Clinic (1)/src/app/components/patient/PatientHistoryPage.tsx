import { useState } from 'react';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { RiskBadge, StatusBadge } from '@/app/components/shared/RiskBadge';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Search, Eye, Calendar, Upload, Filter } from 'lucide-react';

interface Screening {
  id: string;
  date: string;
  time: string;
  eye: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'ai-only' | 'doctor-validated';
  confidence: number;
  doctor?: string;
}

interface PatientHistoryPageProps {
  onNavigate: (page: string) => void;
}

export function PatientHistoryPage({ onNavigate }: PatientHistoryPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data
  const screenings: Screening[] = [
    {
      id: 'S004',
      date: '2026-02-02',
      time: '14:30',
      eye: 'Mắt phải',
      riskLevel: 'medium',
      status: 'ai-only',
      confidence: 87
    },
    {
      id: 'S003',
      date: '2026-01-28',
      time: '10:15',
      eye: 'Mắt phải',
      riskLevel: 'low',
      status: 'doctor-validated',
      confidence: 95,
      doctor: 'BS. Nguyễn Văn A'
    },
    {
      id: 'S002',
      date: '2026-01-15',
      time: '09:00',
      eye: 'Mắt trái',
      riskLevel: 'medium',
      status: 'doctor-validated',
      confidence: 87,
      doctor: 'BS. Trần Thị B'
    },
    {
      id: 'S001',
      date: '2025-12-10',
      time: '16:45',
      eye: 'Mắt phải',
      riskLevel: 'low',
      status: 'ai-only',
      confidence: 92
    }
  ];

  // Filter logic
  const filteredScreenings = screenings.filter((screening) => {
    const matchesSearch = screening.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         screening.eye.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = filterRisk === 'all' || screening.riskLevel === filterRisk;
    const matchesStatus = filterStatus === 'all' || screening.status === filterStatus;
    
    return matchesSearch && matchesRisk && matchesStatus;
  });

  if (screenings.length === 0) {
    return (
      <div>
        <PageHeader
          title="Lịch sử sàng lọc"
          description="Xem lại tất cả các lần sàng lọc võng mạc"
        />
        <Card>
          <CardContent className="pt-6">
            <EmptyState
              icon={<Eye className="w-10 h-10 text-gray-400" />}
              title="Chưa có lần sàng lọc nào"
              description="Bắt đầu sàng lọc võng mạc để theo dõi sức khỏe đôi mắt của bạn"
              actionLabel="Tạo sàng lọc mới"
              onAction={() => onNavigate('upload')}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Lịch sử sàng lọc"
        description={`Tổng ${screenings.length} lần sàng lọc`}
        action={{
          label: 'Sàng lọc mới',
          icon: <Upload className="w-4 h-4 mr-2" />,
          onClick: () => onNavigate('upload')
        }}
      />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo mã hoặc mắt..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Risk Filter */}
            <Select value={filterRisk} onValueChange={setFilterRisk}>
              <SelectTrigger>
                <SelectValue placeholder="Lọc theo nguy cơ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả mức độ</SelectItem>
                <SelectItem value="low">Nguy cơ thấp</SelectItem>
                <SelectItem value="medium">Nguy cơ trung bình</SelectItem>
                <SelectItem value="high">Nguy cơ cao</SelectItem>
                <SelectItem value="critical">Nghiêm trọng</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="pending">Chờ duyệt</SelectItem>
                <SelectItem value="ai-only">AI phân tích</SelectItem>
                <SelectItem value="doctor-validated">Bác sĩ xác nhận</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      {filteredScreenings.length > 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã</TableHead>
                    <TableHead>Ngày & Giờ</TableHead>
                    <TableHead>Mắt</TableHead>
                    <TableHead>Nguy cơ</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Độ tin cậy</TableHead>
                    <TableHead>Bác sĩ</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredScreenings.map((screening) => (
                    <TableRow key={screening.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{screening.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <div>{screening.date}</div>
                            <div className="text-gray-500 text-xs">{screening.time}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{screening.eye}</TableCell>
                      <TableCell>
                        <RiskBadge level={screening.riskLevel} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={screening.status} />
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{screening.confidence}%</span>
                      </TableCell>
                      <TableCell>
                        {screening.doctor ? (
                          <span className="text-sm">{screening.doctor}</span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // In real app, navigate to specific result
                            alert(`Viewing result: ${screening.id}`);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Xem
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <EmptyState
              icon={<Filter className="w-10 h-10 text-gray-400" />}
              title="Không tìm thấy kết quả"
              description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
