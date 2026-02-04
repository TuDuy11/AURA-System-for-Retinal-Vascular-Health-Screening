import { Mail, Phone, MapPin } from 'lucide-react';
const logoImage = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22%3E%3Crect fill=%22%234f46e5%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2248%22 font-weight=%22bold%22%3EAURA%3C/text%3E%3C/svg%3E';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#0a1f3d] to-[#051423] text-gray-300 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 212, 255, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 212, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={logoImage} 
                alt="AURA Logo" 
                className="h-12 w-auto"
              />
            </div>
            <p className="text-sm text-gray-400">
              Phòng khám chuyên sâu về sàng lọc và chẩn đoán các bệnh lý võng mạc với công nghệ AI tiên tiến
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#home" className="hover:text-cyan-400 transition-colors">Trang chủ</a>
              </li>
              <li>
                <a href="#services" className="hover:text-cyan-400 transition-colors">Dịch vụ</a>
              </li>
              <li>
                <a href="#about" className="hover:text-cyan-400 transition-colors">Về chúng tôi</a>
              </li>
              <li>
                <a href="#appointment" className="hover:text-cyan-400 transition-colors">Đặt lịch</a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4">Dịch vụ</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Chụp ảnh võng mạc</li>
              <li>OCT - Chụp cắt lớp</li>
              <li>Sàng lọc tiểu đường</li>
              <li>Đánh giá toàn diện</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Liên hệ</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-1 text-cyan-400" />
                <span>123 Đường ABC, Quận 1, TP.HCM</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-cyan-400" />
                <span>1900 xxxx</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0 text-cyan-400" />
                <span>info@aura-clinic.vn</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cyan-500/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© 2026 AURA Retinal Screening Clinic. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-cyan-400 transition-colors">Chính sách bảo mật</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Điều khoản sử dụng</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}