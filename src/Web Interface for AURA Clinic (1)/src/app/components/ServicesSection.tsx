import { Eye, ScanEye, Shield, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const services = [
  {
    icon: Eye,
    title: 'Chụp ảnh võng mạc',
    description: 'Hình ảnh võng mạc độ phân giải cao với công nghệ không xâm lấn, giúp phát hiện các bất thường sớm nhất.',
    features: ['Không cần thuốc nhỏ mắt', 'Kết quả nhanh chóng', 'An toàn tuyệt đối'],
  },
  {
    icon: ScanEye,
    title: 'OCT - Chụp cắt lớp võng mạc',
    description: 'Công nghệ OCT tiên tiến giúp phát hiện các tổn thương võng mạc ở giai đoạn sớm nhất.',
    features: ['Độ chính xác cao', 'Phát hiện sớm bệnh lý', 'Theo dõi tiến triển'],
  },
  {
    icon: Shield,
    title: 'Sàng lọc bệnh tiểu đường',
    description: 'Chương trình sàng lọc đặc biệt cho bệnh nhân tiểu đường, phòng ngừa biến chứng võng mạc.',
    features: ['Phát hiện sớm DR', 'Tư vấn điều trị', 'Theo dõi định kỳ'],
  },
  {
    icon: Activity,
    title: 'Đánh giá toàn diện',
    description: 'Kiểm tra sức khỏe toàn diện của võng mạc và thần kinh thị giác.',
    features: ['Báo cáo chi tiết', 'Tư vấn chuyên sâu', 'Hồ sơ số hóa'],
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-cyan-50/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block px-4 py-2 bg-cyan-100 text-cyan-600 rounded-full mb-4">
            Dịch vụ của chúng tôi
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Các dịch vụ sàng lọc võng mạc
          </h2>
          <p className="text-lg text-gray-600">
            AURA cung cấp đầy đủ các dịch vụ chẩn đoán và sàng lọc võng mạc với công nghệ tiên tiến nhất
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="border-2 border-cyan-100 hover:border-cyan-300 transition-all hover:shadow-lg group">
                <CardHeader>
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-cyan-600" />
                  </div>
                  <CardTitle className="text-xl text-gray-800">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <svg className="w-4 h-4 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Why Choose Us */}
        <div className="mt-16 bg-gradient-to-br from-[#0a1f3d] to-[#0d2d4a] rounded-2xl p-8 md:p-12 border border-cyan-500/20 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `
                linear-gradient(to right, rgba(0, 212, 255, 0.3) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0, 212, 255, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Tại sao chọn AURA?
              </h3>
              <p className="text-gray-300 mb-6">
                Chúng tôi cam kết mang đến dịch vụ chăm sóc mắt chất lượng cao nhất với đội ngũ chuyên gia 
                giàu kinh nghiệm và công nghệ tiên tiến.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-white">Chuyên gia hàng đầu</div>
                    <div className="text-sm text-gray-400">Đội ngũ bác sĩ chuyên khoa mắt giàu kinh nghiệm</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-white">Công nghệ AI hiện đại</div>
                    <div className="text-sm text-gray-400">Trang thiết bị y tế tiên tiến, được chứng nhận quốc tế</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-white">Quy trình chuẩn quốc tế</div>
                    <div className="text-sm text-gray-400">Tuân thủ nghiêm ngặt các tiêu chuẩn y tế</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-2xl"></div>
              <img
                src="https://images.unsplash.com/photo-1606206873764-fd15e242df52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3Njc0NzkzMjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Công nghệ y tế"
                className="rounded-xl shadow-2xl w-full relative border border-cyan-500/30"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}