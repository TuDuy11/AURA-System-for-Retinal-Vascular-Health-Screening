import { useState } from 'react';
import { Download, Eye, Share2, AlertTriangle, CheckCircle, Info, ZoomIn, ZoomOut } from 'lucide-react';
import { RiskBadge, StatusBadge } from '@/app/components/shared/RiskBadge';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';

interface PatientResultPageProps {
  onNavigate: (page: string) => void;
}

export function PatientResultPage({ onNavigate }: PatientResultPageProps) {
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [zoom, setZoom] = useState(100);

  // Mock result data
  const result = {
    id: 'S004',
    date: '2026-02-02',
    eye: 'Mắt phải',
    riskLevel: 'medium' as const,
    status: 'ai-only' as const,
    confidence: 87,
    findings: [
      { type: 'Microaneurysms', severity: 'mild', location: 'Superior temporal quadrant' },
      { type: 'Hard exudates', severity: 'moderate', location: 'Macular region' }
    ],
    recommendation: 'Cần theo dõi sát hơn. Khuyến nghị tái khám sau 3 tháng để đánh giá tiến triển.',
    aiNotes: 'Phát hiện dấu hiệu tiểu đường võng mạc giai đoạn sớm. Khuyến nghị kiểm soát đường huyết và tái khám định kỳ.'
  };

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 25, 50));
  };

  return (
    <div>
      <PageHeader
        title="Kết quả sàng lọc"
        description={`Kết quả phân tích AI cho ${result.eye}`}
        backButton={{
          label: 'Quay về trang chủ',
          onClick: () => onNavigate('dashboard')
        }}
        action={{
          label: 'Tải báo cáo PDF',
          icon: <Download className="w-4 h-4 mr-2" />,
          onClick: () => alert('Tính năng đang phát triển')
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Result */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Card */}
          <Card className="border-2 border-orange-200 bg-orange-50/50">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Mức độ nguy cơ</h3>
                    <RiskBadge level={result.riskLevel} className="mt-1" />
                  </div>
                </div>
                <StatusBadge status={result.status} />
              </div>

              <div className="bg-white rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Độ tin cậy AI:</span>
                  <span className="font-semibold text-gray-900">{result.confidence}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Ngày phân tích:</span>
                  <span className="font-semibold text-gray-900">{result.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Mắt:</span>
                  <span className="font-semibold text-gray-900">{result.eye}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image Viewer */}
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
                      Hiển thị chú thích
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleZoomOut}>
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-medium min-w-[3rem] text-center">{zoom}%</span>
                    <Button variant="outline" size="sm" onClick={handleZoomIn}>
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
                    {/* Simulated annotation overlays */}
                    <div className="absolute top-1/3 right-1/3 w-16 h-16 border-4 border-red-500 rounded-full animate-pulse" />
                    <div className="absolute bottom-1/3 left-1/2 w-12 h-12 border-4 border-yellow-500 rounded-full animate-pulse" />
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Các vùng được đánh dấu cho thấy vị trí phát hiện bất thường
              </p>
            </CardContent>
          </Card>

          {/* Findings */}
          <Card>
            <CardHeader>
              <CardTitle>Các phát hiện chi tiết</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.findings.map((finding, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{finding.type}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      finding.severity === 'mild' ? 'bg-yellow-100 text-yellow-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {finding.severity === 'mild' ? 'Nhẹ' : 'Trung bình'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    <strong>Vị trí:</strong> {finding.location}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Nhận xét từ AI</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{result.aiNotes}</p>
            </CardContent>
          </Card>

          {/* Recommendation */}
          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                Khuyến nghị
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{result.recommendation}</p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onNavigate('history')}
            >
              Xem lịch sử
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
              onClick={() => onNavigate('upload')}
            >
              Sàng lọc mới
            </Button>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Important Notice */}
            <Card className="border-2 border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-2">Lưu ý quan trọng</h3>
                    <p className="text-sm text-yellow-800">
                      Kết quả này chỉ mang tính chất tham khảo. Để có chẩn đoán chính xác, 
                      vui lòng đến gặp bác sĩ nhãn khoa.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Các bước tiếp theo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                    1
                  </div>
                  <p className="text-sm text-gray-700">
                    Lưu lại kết quả này để tham khảo
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                    2
                  </div>
                  <p className="text-sm text-gray-700">
                    Đặt lịch khám với bác sĩ nhãn khoa
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                    3
                  </div>
                  <p className="text-sm text-gray-700">
                    Theo dõi định kỳ theo khuyến nghị
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Share Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Chia sẻ kết quả</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Gửi cho bác sĩ
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Tải PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
