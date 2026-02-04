import { useEffect, useState } from 'react';
import { Loader2, Brain, Eye, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';

interface PatientProcessingPageProps {
  file: File;
  eye: string;
  onProcessingComplete: () => void;
}

const processingSteps = [
  { label: 'Đang tải lên ảnh...', duration: 1000 },
  { label: 'Tiền xử lý hình ảnh...', duration: 1500 },
  { label: 'AI đang phân tích võng mạc...', duration: 3000 },
  { label: 'Phát hiện các vùng bất thường...', duration: 2000 },
  { label: 'Tính toán mức độ nguy cơ...', duration: 1500 },
  { label: 'Tạo báo cáo kết quả...', duration: 1000 }
];

export function PatientProcessingPage({ file, eye, onProcessingComplete }: PatientProcessingPageProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate processing steps
    let totalTime = 0;
    const totalDuration = processingSteps.reduce((sum, step) => sum + step.duration, 0);

    processingSteps.forEach((step, index) => {
      totalTime += step.duration;
      
      setTimeout(() => {
        setCurrentStepIndex(index);
        setProgress(((index + 1) / processingSteps.length) * 100);
      }, totalTime);
    });

    // Complete processing
    setTimeout(() => {
      onProcessingComplete();
    }, totalDuration + 500);
  }, [onProcessingComplete]);

  const eyeLabel = eye === 'left' ? 'Mắt trái' : 'Mắt phải';

  return (
    <div className="flex items-center justify-center min-h-[600px]">
      <Card className="w-full max-w-2xl">
        <CardContent className="pt-12 pb-12">
          <div className="text-center space-y-8">
            {/* Animated Icon */}
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-75"></div>
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                <Brain className="w-12 h-12 text-white animate-pulse" />
              </div>
            </div>

            {/* Title */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Đang phân tích võng mạc
              </h2>
              <p className="text-gray-600">
                AI đang xử lý ảnh {eyeLabel} của bạn...
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-3">
              <Progress value={progress} className="h-3" />
              <p className="text-sm font-medium text-blue-600">
                {Math.round(progress)}% hoàn thành
              </p>
            </div>

            {/* Current Step */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <p className="font-medium text-blue-900">
                  {processingSteps[currentStepIndex]?.label || 'Đang xử lý...'}
                </p>
              </div>
            </div>

            {/* Processing Steps List */}
            <div className="text-left space-y-3">
              {processingSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    index < currentStepIndex
                      ? 'bg-green-50 border border-green-200'
                      : index === currentStepIndex
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  {index < currentStepIndex ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : index === currentStepIndex ? (
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                  )}
                  <span
                    className={`text-sm ${
                      index < currentStepIndex
                        ? 'text-green-700 font-medium'
                        : index === currentStepIndex
                        ? 'text-blue-700 font-medium'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left">
              <p className="text-sm text-gray-700">
                <strong>Lưu ý:</strong> Quá trình phân tích có thể mất 10-30 giây tùy thuộc vào 
                chất lượng và kích thước ảnh. Vui lòng không tắt trình duyệt.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
