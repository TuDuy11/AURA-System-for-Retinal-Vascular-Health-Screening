import { useState } from 'react';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { RiskBadge } from '@/app/components/shared/RiskBadge';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { AlertCircle, Save, Check, ZoomIn, ZoomOut, Info } from 'lucide-react';

interface DoctorCaseDetailPageProps {
  caseId: string;
  onNavigate: (page: string) => void;
}

export function DoctorCaseDetailPage({ caseId, onNavigate }: DoctorCaseDetailPageProps) {
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [reviewedRisk, setReviewedRisk] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');

  // Mock case data
  const caseData = {
    id: caseId,
    patientName: 'Nguyễn Văn A',
    patientId: 'P123',
    patientAge: 45,
    patientGender: 'Nam',
    date: '2026-02-02',
    time: '14:30',
    eye: 'Mắt phải',
    aiRisk: 'high' as const,
    aiConfidence: 89,
    aiFindings: [
      { type: 'Microaneurysms', severity: 'moderate', location: 'Superior temporal quadrant', confidence: 87 },
      { type: 'Hard exudates', severity: 'moderate', location: 'Macular region', confidence: 91 }
    ],
    aiRecommendation: 'Phát hiện dấu hiệu tiểu đường võng mạc. Khuyến nghị khám chuyên khoa ngay.',
    previousScreenings: [
      { date: '2025-12-10', risk: 'low', notes: 'Võng mạc khỏe mạnh' },
      { date: '2025-06-15', risk: 'low', notes: 'Không có bất thường' }
    ]
  };

  const handleSubmitReview = () => {
    if (!reviewedRisk) {
      alert('Vui lòng chọn mức độ nguy cơ sau đánh giá');
      return;
    }

    if (!doctorNotes) {
      alert('Vui lòng nhập ghi chú y khoa');
      return;
    }

    // In real app, save to backend
    alert(`Ca ${caseId} đã được xác nhận với mức độ nguy cơ: ${reviewedRisk}`);
    onNavigate('cases');
  };

  return (
    <div>
      <PageHeader
        title={`Xem xét ca ${caseData.id}`}
        description={`Bệnh nhân: ${caseData.patientName} (${caseData.patientId})`}
        backButton={{
          label: 'Quay lại danh sách',
          onClick: () => onNavigate('cases')
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Patient Info & History */}
        <div className="lg:col-span-1 space-y-6">
          {/* Patient Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin bệnh nhân</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Họ tên:</span>
                <span className="font-medium">{caseData.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ID:</span>
                <span className="font-medium">{caseData.patientId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tuổi:</span>
                <span className="font-medium">{caseData.patientAge}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Giới tính:</span>
                <span className="font-medium">{caseData.patientGender}</span>
              </div>
            </CardContent>
          </Card>

          {/* Previous Screenings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lịch sử sàng lọc</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {caseData.previousScreenings.map((screening, index) => (
                <div key={index} className="border-l-2 border-gray-300 pl-3 py-2">
                  <div className="text-sm font-medium">{screening.date}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    <RiskBadge level={screening.risk as any} />
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{screening.notes}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Audit Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-800">
                Tất cả thao tác xác nhận sẽ được ghi log và lưu trữ theo quy định.
              </p>
            </div>
          </div>
        </div>

        {/* Center Column - Image & AI Findings */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Analysis */}
          <Card className="border-2 border-orange-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Kết quả phân tích AI</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    {caseData.date} • {caseData.time} • {caseData.eye}
                  </p>
                </div>
                <RiskBadge level={caseData.aiRisk} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-orange-50 p-4 rounded-lg mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Độ tin cậy AI:</span>
                  <span className="text-lg font-bold text-orange-600">{caseData.aiConfidence}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Retinal Image */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Hình ảnh võng mạc</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="annotations"
                      checked={showAnnotations}
                      onCheckedChange={setShowAnnotations}
                    />
                    <Label htmlFor="annotations" className="cursor-pointer text-sm">
                      Chú thích
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(50, zoom - 25))}>
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-medium min-w-[3rem] text-center">{zoom}%</span>
                    <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(200, zoom + 25))}>
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800"
                  alt="Retinal scan"
                  className="w-full h-auto"
                  style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center', transition: 'transform 0.2s' }}
                />
                {showAnnotations && (
                  <>
                    <div className="absolute top-1/3 right-1/3 w-16 h-16 border-4 border-red-500 rounded-full" />
                    <div className="absolute bottom-1/3 left-1/2 w-12 h-12 border-4 border-yellow-500 rounded-full" />
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Findings */}
          <Card>
            <CardHeader>
              <CardTitle>Các phát hiện của AI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {caseData.aiFindings.map((finding, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{finding.type}</h4>
                    <span className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-700">
                      {finding.severity === 'moderate' ? 'Trung bình' : finding.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Vị trí:</strong> {finding.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Độ tin cậy:</strong> {finding.confidence}%
                  </p>
                </div>
              ))}
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Khuyến nghị AI:</strong> {caseData.aiRecommendation}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Doctor Review Form */}
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle>Xác nhận của bác sĩ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reviewed-risk">Đánh giá mức độ nguy cơ *</Label>
                <Select value={reviewedRisk} onValueChange={setReviewedRisk}>
                  <SelectTrigger id="reviewed-risk">
                    <SelectValue placeholder="Chọn mức độ nguy cơ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Nguy cơ thấp</SelectItem>
                    <SelectItem value="medium">Nguy cơ trung bình</SelectItem>
                    <SelectItem value="high">Nguy cơ cao</SelectItem>
                    <SelectItem value="critical">Nghiêm trọng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctor-notes">Ghi chú y khoa *</Label>
                <Textarea
                  id="doctor-notes"
                  placeholder="Nhập chẩn đoán, khuyến nghị điều trị, và các ghi chú khác..."
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-800">
                    Vui lòng kiểm tra kỹ trước khi xác nhận. Thông tin này sẽ được gửi đến bệnh nhân.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => onNavigate('cases')}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleSubmitReview}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Xác nhận & Thông báo BN
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
