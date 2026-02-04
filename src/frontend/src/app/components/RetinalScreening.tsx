import { useState, useRef } from 'react';
import { Camera, Upload, Eye, AlertCircle, CheckCircle, XCircle, Loader2, FileImage, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';

interface AnalysisResult {
  condition: string;
  confidence: number;
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  findings: string[];
  recommendations: string[];
  timestamp: string;
  imageUrl: string;
}

const mockAIAnalysis = (imageUrl: string): Promise<AnalysisResult> => {
  return new Promise((resolve) => {
    // Simulate AI processing time
    setTimeout(() => {
      const conditions = [
        {
          condition: 'Bình thường',
          severity: 'normal' as const,
          confidence: 95 + Math.random() * 4,
          findings: [
            'Võng mạc có màu sắc và cấu trúc bình thường',
            'Gai thị không có dấu hiệu phù nề',
            'Mạch máu võng mạc phân bố đều',
            'Không phát hiện xuất huyết hoặc thẩm xuất'
          ],
          recommendations: [
            'Duy trì lối sống lành mạnh',
            'Kiểm tra định kỳ 1 năm/lần',
            'Bảo vệ mắt khỏi ánh sáng mạnh',
            'Ăn nhiều rau xanh và thực phẩm giàu vitamin A'
          ]
        },
        {
          condition: 'Bệnh võng mạc đái tháo đường',
          severity: Math.random() > 0.5 ? 'mild' as const : 'moderate' as const,
          confidence: 82 + Math.random() * 10,
          findings: [
            'Phát hiện vi phình mạch (microaneurysms)',
            'Xuất huyết nhỏ rải rác trên võng mạc',
            'Có dấu hiệu thẩm xuất cứng (hard exudates)',
            'Mạch máu võng mạc có biểu hiện giãn nở'
          ],
          recommendations: [
            'Khám bác sĩ nhãn khoa chuyên sâu ngay',
            'Kiểm soát đường huyết nghiêm ngặt',
            'Theo dõi định kỳ 3-6 tháng/lần',
            'Có thể cần điều trị laser võng mạc',
            'Tránh hoạt động gắng sức mạnh'
          ]
        },
        {
          condition: 'Nghi ngờ Glaucoma (Tăng nhãn áp)',
          severity: 'moderate' as const,
          confidence: 78 + Math.random() * 12,
          findings: [
            'Tỷ lệ chén/đĩa thị tăng cao (C/D ratio > 0.6)',
            'Gai thị có dấu hiệu teo viền',
            'Lớp sợi thần kinh võng mạc mỏng đi',
            'Có thể có tổn thương trường nhìn'
          ],
          recommendations: [
            'Đo nhãn áp và kiểm tra trường nhìn ngay',
            'Khám bác sĩ nhãn khoa chuyên khoa glaucoma',
            'Có thể cần dùng thuốc nhỏ mắt hạ nhãn áp',
            'Theo dõi chặt chẽ định kỳ 3 tháng/lần',
            'Tránh căng thẳng, stress'
          ]
        },
        {
          condition: 'Thoái hóa điểm vàng tuổi già (AMD)',
          severity: Math.random() > 0.6 ? 'mild' as const : 'moderate' as const,
          confidence: 80 + Math.random() * 12,
          findings: [
            'Phát hiện drusen (các đốm màu vàng) ở hoàng điểm',
            'Thay đổi sắc tố ở vùng điểm vàng',
            'Có dấu hiệu thoái hóa lớp biểu mô sắc tố',
            'Giảm độ rõ nét vùng trung tâm võng mạc'
          ],
          recommendations: [
            'Khám bác sĩ để đánh giá mức độ thoái hóa',
            'Có thể cần chụp OCT hoặc FA để đánh giá chính xác',
            'Bổ sung vitamin AREDS (Lutein, Zeaxanthin)',
            'Tránh hút thuốc lá',
            'Đeo kính chống tia UV',
            'Kiểm tra định kỳ 6 tháng/lần'
          ]
        },
        {
          condition: 'Xuất huyết võng mạc',
          severity: 'moderate' as const,
          confidence: 85 + Math.random() * 10,
          findings: [
            'Phát hiện vùng xuất huyết trên võng mạc',
            'Mạch máu võng mạc có dấu hiệu bất thường',
            'Có thể do tăng huyết áp hoặc đái tháo đường',
            'Cần theo dõi để loại trừ các biến chứng'
          ],
          recommendations: [
            'Khám bác sĩ nhãn khoa NGAY LẬP TỨC',
            'Kiểm tra huyết áp và đường huyết',
            'Có thể cần điều trị nội khoa kết hợp',
            'Theo dõi sát định kỳ',
            'Tránh hoạt động gắng sức'
          ]
        }
      ];

      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      
      resolve({
        ...randomCondition,
        timestamp: new Date().toISOString(),
        imageUrl: imageUrl
      });
    }, 2000 + Math.random() * 1000); // 2-3 seconds simulation
  });
};

export function RetinalScreening() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      const result = await mockAIAnalysis(selectedImage);
      setAnalysisResult(result);
      
      // Save to history
      const updatedHistory = [result, ...history].slice(0, 10); // Keep last 10
      setHistory(updatedHistory);
      localStorage.setItem('retinal_screening_history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Có lỗi xảy ra khi phân tích. Vui lòng thử lại.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'normal':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'mild':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'moderate':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'severe':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'normal':
        return <CheckCircle className="w-5 h-5" />;
      case 'mild':
      case 'moderate':
        return <AlertCircle className="w-5 h-5" />;
      case 'severe':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Eye className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-6 h-6 text-blue-600" />
            Sàng lọc võng mạc bằng AI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <strong>Hướng dẫn:</strong> Chụp hoặc tải lên hình ảnh võng mạc của bạn. Hệ thống AI sẽ phân tích và đưa ra nhận định ban đầu. 
            <span className="block mt-2 font-semibold">⚠️ Lưu ý: Kết quả chỉ mang tính chất tham khảo. Vui lòng đến gặp bác sĩ để được chẩn đoán chính xác.</span>
          </div>

          {!selectedImage ? (
            <div className="grid md:grid-cols-2 gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleCameraCapture}
                className="hidden"
              />

              <Button
                onClick={() => cameraInputRef.current?.click()}
                variant="outline"
                size="lg"
                className="h-32 flex flex-col gap-2 border-2 border-dashed hover:border-blue-500 hover:bg-blue-50"
              >
                <Camera className="w-8 h-8 text-blue-600" />
                <span>Chụp ảnh</span>
              </Button>

              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="lg"
                className="h-32 flex flex-col gap-2 border-2 border-dashed hover:border-blue-500 hover:bg-blue-50"
              >
                <Upload className="w-8 h-8 text-blue-600" />
                <span>Tải ảnh lên</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
                <img
                  src={selectedImage}
                  alt="Retinal scan"
                  className="w-full h-auto max-h-96 object-contain bg-black"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang phân tích...
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Phân tích với AI
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleClear}
                  variant="outline"
                  size="lg"
                  disabled={isAnalyzing}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Result */}
      {analysisResult && (
        <Card className="border-2">
          <CardHeader className={`${getSeverityColor(analysisResult.severity)} border-b-2`}>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getSeverityIcon(analysisResult.severity)}
                Kết quả phân tích
              </div>
              <Badge variant="secondary" className="text-sm">
                Độ chính xác: {analysisResult.confidence.toFixed(1)}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Condition */}
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <FileImage className="w-5 h-5 text-blue-600" />
                Chẩn đoán:
              </h3>
              <p className="text-2xl font-bold text-gray-900">{analysisResult.condition}</p>
              <p className="text-sm text-gray-500 mt-1">
                Phân tích lúc: {new Date(analysisResult.timestamp).toLocaleString('vi-VN')}
              </p>
            </div>

            {/* Findings */}
            <div>
              <h3 className="font-semibold text-lg mb-3">🔍 Các phát hiện:</h3>
              <ul className="space-y-2">
                {analysisResult.findings.map((finding, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className={`p-4 rounded-lg border-2 ${
              analysisResult.severity === 'normal' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-orange-50 border-orange-200'
            }`}>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Khuyến nghị:
              </h3>
              <ul className="space-y-2">
                {analysisResult.recommendations.map((rec, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="font-bold">{index + 1}.</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Warning */}
            {analysisResult.severity !== 'normal' && (
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Quan trọng:</strong> Kết quả AI chỉ mang tính tham khảo. Vui lòng đặt lịch khám với bác sĩ nhãn khoa chuyên môn để được chẩn đoán và điều trị chính xác.
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={() => {/* TODO: Navigate to appointment booking */}}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              size="lg"
            >
              Đặt lịch khám với bác sĩ
            </Button>
          </CardContent>
        </Card>
      )}

      {/* History */}
      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Lịch sử sàng lọc</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {history.slice(0, 5).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                  onClick={() => setAnalysisResult(item)}
                >
                  <img
                    src={item.imageUrl}
                    alt="History scan"
                    className="w-16 h-16 object-cover rounded border"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.condition}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(item.timestamp).toLocaleString('vi-VN')}
                    </p>
                  </div>
                  <Badge className={getSeverityColor(item.severity)}>
                    {item.confidence.toFixed(0)}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
