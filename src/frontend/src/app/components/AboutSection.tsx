import { ImageWithFallback } from './figma/ImageWithFallback';
import { Award, Shield, Star, User } from 'lucide-react';

export function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block px-4 py-2 bg-cyan-100 text-cyan-600 rounded-full mb-4">
            Về chúng tôi
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Phòng khám AURA - Chuyên sâu sàng lọc võng mạc
          </h2>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1762625570087-6d98fca29531?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtZWRpY2FsJTIwY2xpbmljJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY3NjE0MDcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Phòng khám AURA"
              className="rounded-2xl shadow-2xl w-full"
            />
          </div>

          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              AURA là phòng khám chuyên sâu về sàng lọc và chẩn đoán các bệnh lý võng mạc, 
              được thành lập với sứ mệnh bảo vệ thị lực cho cộng đồng thông qua công nghệ 
              y tế tiên tiến và đội ngũ chuyên gia giàu kinh nghiệm.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Với hơn 15 năm kinh nghiệm trong lĩnh vực nhãn khoa, chúng tôi tự hào là đơn vị 
              đầu tiên tại Việt Nam ứng dụng công nghệ AI trong sàng lọc và phát hiện sớm các 
              bệnh lý võng mạc.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3 p-4 bg-cyan-50 rounded-lg border border-cyan-100">
                <Award className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-gray-800">Chứng nhận</div>
                  <div className="text-sm text-gray-600">ISO 9001:2015</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <Shield className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-gray-800">An toàn</div>
                  <div className="text-sm text-gray-600">Đạt chuẩn y tế</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-cyan-50 rounded-lg border border-cyan-100">
                <Star className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-gray-800">Uy tín</div>
                  <div className="text-sm text-gray-600">10K+ khách hàng</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <User className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-gray-800">Chuyên gia</div>
                  <div className="text-sm text-gray-600">Giàu kinh nghiệm</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-gradient-to-br from-cyan-50/50 to-blue-50/30 rounded-2xl p-8 md:p-12 border border-cyan-100">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8">
            Đội ngũ chuyên gia
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'TS. BS. Nguyễn Văn A',
                title: 'Giám đốc chuyên môn',
                speciality: 'Chuyên khoa Võng mạc - Thần kinh Nhãn',
              },
              {
                name: 'ThS. BS. Trần Thị B',
                title: 'Trưởng khoa Chẩn đoán',
                speciality: 'Chuyên gia OCT & Chụp ảnh Võng mạc',
              },
              {
                name: 'BS. Lê Văn C',
                title: 'Bác sĩ điều trị',
                speciality: 'Chuyên khoa Mắt - Võng mạc',
              },
            ].map((doctor, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow border border-cyan-100">
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h4 className="font-bold text-gray-800 mb-1">{doctor.name}</h4>
                <p className="text-sm text-cyan-600 mb-2">{doctor.title}</p>
                <p className="text-sm text-gray-600">{doctor.speciality}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}