import { useState } from 'react';
import { Stepper, Step } from '@/app/components/shared/Stepper';
import { FileUploader } from '@/app/components/shared/FileUploader';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { AlertCircle, CheckCircle, Eye, Lightbulb } from 'lucide-react';

interface PatientUploadPageProps {
  onNavigate: (page: string) => void;
  onStartProcessing: (file: File, eye: string) => void;
}

const steps: Step[] = [
  { id: 'upload', label: 'Tải ảnh', description: 'Chọn ảnh võng mạc' },
  { id: 'confirm', label: 'Xác nhận', description: 'Kiểm tra thông tin' },
  { id: 'consent', label: 'Đồng ý', description: 'Xác nhận quyền riêng tư' }
];

export function PatientUploadPage({ onNavigate, onStartProcessing }: PatientUploadPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedEye, setSelectedEye] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
  };

  const handleNext = () => {
    if (currentStep === 1 && !selectedFile) {
      alert('Vui lòng chọn ảnh võng mạc');
      return;
    }
    if (currentStep === 2 && !selectedEye) {
      alert('Vui lòng chọn mắt cần sàng lọc');
      return;
    }
    if (currentStep === 3 && !acceptedTerms) {
      alert('Vui lòng đồng ý với điều khoản sử dụng');
      return;
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Start processing
      if (selectedFile && selectedEye) {
        onStartProcessing(selectedFile, selectedEye);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onNavigate('dashboard');
    }
  };

  return (
    <div>
      <PageHeader
        title="Sàng lọc võng mạc mới"
        description="Tải lên ảnh võng mạc để AI phân tích và đánh giá"
        backButton={{
          label: 'Quay lại',
          onClick: () => onNavigate('dashboard')
        }}
      />

      {/* Stepper */}
      <Stepper steps={steps} currentStep={currentStep} />

      {/* Step Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Tải lên ảnh võng mạc</h3>
                    <FileUploader
                      onFileSelect={handleFileSelect}
                      onFileRemove={handleFileRemove}
                      selectedFile={selectedFile}
                      accept="image/*"
                      maxSizeMB={10}
                    />
                  </div>

                  {selectedFile && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-green-900 mb-1">Tệp đã được chọn</h4>
                          <p className="text-sm text-green-800">
                            Bạn có thể tiếp tục sang bước tiếp theo để xác nhận thông tin.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Xác nhận thông tin</h3>
                    
                    {/* Preview image */}
                    {selectedFile && (
                      <div className="mb-6">
                        <Label className="mb-2 block">Ảnh đã chọn:</Label>
                        <div className="relative">
                          <img
                            src={URL.createObjectURL(selectedFile)}
                            alt="Preview"
                            className="max-h-64 rounded-lg border-2 border-gray-200 mx-auto"
                          />
                        </div>
                      </div>
                    )}

                    {/* Eye selection */}
                    <div className="space-y-2">
                      <Label htmlFor="eye-select">Mắt cần sàng lọc *</Label>
                      <Select value={selectedEye} onValueChange={setSelectedEye}>
                        <SelectTrigger id="eye-select">
                          <SelectValue placeholder="Chọn mắt" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">
                            <div className="flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              Mắt trái (Left)
                            </div>
                          </SelectItem>
                          <SelectItem value="right">
                            <div className="flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              Mắt phải (Right)
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Điều khoản và đồng ý</h3>
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 max-h-96 overflow-y-auto">
                      <h4 className="font-semibold mb-3">Điều khoản sử dụng dịch vụ sàng lọc AI</h4>
                      
                      <div className="space-y-4 text-sm text-gray-700">
                        <p>
                          <strong>1. Mục đích sử dụng:</strong> Dịch vụ sàng lọc võng mạc bằng AI của AURA 
                          nhằm hỗ trợ phát hiện sớm các bệnh lý võng mạc. Kết quả chỉ mang tính chất tham khảo 
                          và không thay thế cho chẩn đoán y khoa chính thức.
                        </p>
                        
                        <p>
                          <strong>2. Quyền riêng tư:</strong> Hình ảnh và dữ liệu của bạn được mã hóa và 
                          bảo mật theo tiêu chuẩn y tế. Chúng tôi chỉ sử dụng dữ liệu để phân tích và cải 
                          thiện dịch vụ.
                        </p>
                        
                        <p>
                          <strong>3. Độ chính xác:</strong> AI có độ chính xác cao nhưng không tuyệt đối. 
                          Kết quả có thể có sai số. Bạn nên tham khảo ý kiến bác sĩ chuyên khoa.
                        </p>
                        
                        <p>
                          <strong>4. Trách nhiệm:</strong> AURA không chịu trách nhiệm cho các quyết định 
                          y tế dựa hoàn toàn vào kết quả AI. Luôn tham khảo bác sĩ trước khi điều trị.
                        </p>

                        <p>
                          <strong>5. Lưu trữ dữ liệu:</strong> Hình ảnh và kết quả sẽ được lưu trữ trong 
                          hệ thống để bạn có thể xem lại. Bạn có quyền yêu cầu xóa dữ liệu bất kỳ lúc nào.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="terms"
                        checked={acceptedTerms}
                        onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                      />
                      <Label htmlFor="terms" className="cursor-pointer">
                        Tôi đã đọc và đồng ý với các điều khoản sử dụng. Tôi hiểu rằng kết quả AI 
                        chỉ mang tính chất tham khảo và cần được bác sĩ xác nhận.
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  {currentStep === 1 ? 'Hủy' : 'Quay lại'}
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                  disabled={currentStep === 1 && !selectedFile}
                >
                  {currentStep === 3 ? 'Phân tích ngay' : 'Tiếp tục'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guidelines Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                <h3 className="font-semibold">Hướng dẫn chụp ảnh</h3>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-semibold">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Ánh sáng đầy đủ</p>
                    <p className="text-gray-600">Đảm bảo ảnh được chụp trong điều kiện đủ sáng</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-semibold">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Hình ảnh rõ nét</p>
                    <p className="text-gray-600">Không mờ, không bị rung lắc</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-semibold">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Chất lượng cao</p>
                    <p className="text-gray-600">Ảnh có độ phân giải tốt, không quá tối hoặc quá sáng</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-semibold">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Toàn bộ võng mạc</p>
                    <p className="text-gray-600">Ảnh phải bao gồm toàn bộ vùng võng mạc</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-800">
                    Chất lượng ảnh ảnh hưởng trực tiếp đến độ chính xác của kết quả AI
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
