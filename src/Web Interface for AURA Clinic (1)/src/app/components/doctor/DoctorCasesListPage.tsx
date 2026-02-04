import { useState } from 'react';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { RiskBadge } from '@/app/components/shared/RiskBadge';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
import { Search, Eye, FileText, Filter, Clock } from 'lucide-react';

interface Case {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  time: string;
  eye: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  waitTime: string;
  status: 'pending' | 'in-review' | 'completed';
}

interface DoctorCasesListPageProps {
  onNavigate: (page: string) => void;
  onCaseSelect?: (caseId: string) => void;
}

export function DoctorCasesListPage({ onNavigate, onCaseSelect }: DoctorCasesListPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data
  const cases: Case[] = [
    {
      id: 'C001',
      patientName: 'Nguyễn Văn A',
      patientId: 'P123',
      date: '2026-02-02',
      time: '14:30',
      eye: 'Mắt phải',
      riskLevel: 'high',
      confidence: 89,
      waitTime: '2 giờ',
      status: 'pending'
    },
    {
      id: 'C002',
      patientName: 'Trần Thị B',
      patientId: 'P456',
      date: '2026-02-02',
      time: '10:15',
      eye: 'Mắt trái',
      riskLevel: 'medium',
      confidence: 85,
      waitTime: '4 giờ',
      status: 'pending'
    },
    {
      id: 'C003',
      patientName: 'Lê Văn C',
      patientId: 'P789',
      date: '2026-02-01',
      time: '16:45',
      eye: 'Mắt phải',
      riskLevel: 'critical',
      confidence: 92,
      waitTime: '1 ngày',
      status: 'pending'
    },
    {
      id: 'C004',
      patientName: 'Phạm Thị D',
      patientId: 'P101',
      date: '2026-02-01',
      time: '09:00',
      eye: 'Mắt trái',
      riskLevel: 'low',
      confidence: 94,
      waitTime: '1 ngày',
      status: 'completed'
    },
    {
      id: 'C005',
      patientName: 'Hoàng Văn E',
      patientId: 'P202',
      date: '2026-01-31',
      time: '15:20',
      eye: 'Mắt phải',
      riskLevel: 'medium',
      confidence: 87,
      waitTime: '2 ngày',
      status: 'completed'
    }
  ];

  // Filter logic
  const filteredCases = cases.filter((case_) => {
    const matchesSearch = 
      case_.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      case_.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      case_.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = filterRisk === 'all' || case_.riskLevel === filterRisk;
    const matchesStatus = filterStatus === 'all' || case_.status === filterStatus;
    
    return matchesSearch && matchesRisk && matchesStatus;
  });

  // Sort by priority (critical > high > medium > low, then by wait time)
  const sortedCases = [...filteredCases].sort((a, b) => {
    const riskOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    const riskDiff = riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
    if (riskDiff !== 0) return riskDiff;
    return b.waitTime.localeCompare(a.waitTime);
  });

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { variant: 'default' as const, label: 'Chờ duyệt' },
      'in-review': { variant: 'secondary' as const, label: 'Đang duyệt' },
      completed: { variant: 'outline' as const, label: 'Hoàn thành' }
    };
    const config = configs[status as keyof typeof configs];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (cases.length === 0) {
    return (
      <div>
        <PageHeader
          title="Danh sách ca bệnh"
          description="Quản lý và xem xét các ca sàng lọc"
        />
        <Card>
          <CardContent className="pt-6">
            <EmptyState
              icon={<FileText className="w-10 h-10 text-gray-400" />}
              title="Chưa có ca bệnh nào"
              description="Các ca sàng lọc mới sẽ xuất hiện ở đây"
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Danh sách ca bệnh"
        description={`Tổng ${cases.length} ca • ${cases.filter(c => c.status === 'pending').length} chờ duyệt`}
      />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên, ID bệnh nhân hoặc mã ca..."
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
                <SelectItem value="in-review">Đang duyệt</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      {sortedCases.length > 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã ca</TableHead>
                    <TableHead>Bệnh nhân</TableHead>
                    <TableHead>Ngày & Giờ</TableHead>
                    <TableHead>Mắt</TableHead>
                    <TableHead>Nguy cơ</TableHead>
                    <TableHead>AI</TableHead>
                    <TableHead>Chờ</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCases.map((case_) => (
                    <TableRow 
                      key={case_.id} 
                      className={`hover:bg-gray-50 ${
                        case_.riskLevel === 'critical' || case_.riskLevel === 'high'
                          ? 'bg-red-50/30'
                          : ''
                      }`}
                    >
                      <TableCell className="font-medium">{case_.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{case_.patientName}</div>
                          <div className="text-xs text-gray-500">{case_.patientId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{case_.date}</div>
                          <div className="text-gray-500">{case_.time}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{case_.eye}</TableCell>
                      <TableCell>
                        <RiskBadge level={case_.riskLevel} />
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">{case_.confidence}%</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="w-3 h-3 text-orange-500" />
                          <span className="text-orange-600 font-medium">{case_.waitTime}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(case_.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant={case_.status === 'pending' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            if (onCaseSelect) {
                              onCaseSelect(case_.id);
                            }
                          }}
                          className={case_.status === 'pending' ? 'bg-gradient-to-r from-blue-600 to-cyan-500' : ''}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          {case_.status === 'pending' ? 'Duyệt' : 'Xem'}
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
