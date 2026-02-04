import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export function ContactSection() {
  return (
    <section id="contact" className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-cyan-50/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block px-4 py-2 bg-cyan-100 text-cyan-600 rounded-full mb-4">
            Liên hệ
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Thông tin liên hệ
          </h2>
          <p className="text-lg text-gray-600">
            Hãy liên hệ với chúng tôi để được tư vấn và đặt lịch khám
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow border-cyan-100">
            <CardContent className="pt-6">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Địa chỉ</h3>
              <p className="text-sm text-gray-600">
                123 Đường ABC, Quận 1<br />
                TP. Hồ Chí Minh
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow border-cyan-100">
            <CardContent className="pt-6">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Điện thoại</h3>
              <p className="text-sm text-gray-600">
                Hotline: 1900 xxxx<br />
                Mobile: 0912 345 678
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow border-cyan-100">
            <CardContent className="pt-6">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-sm text-gray-600">
                info@aura-clinic.vn<br />
                support@aura-clinic.vn
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow border-cyan-100">
            <CardContent className="pt-6">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Giờ làm việc</h3>
              <p className="text-sm text-gray-600">
                Thứ 2 - Thứ 7: 8:00 - 18:00<br />
                Chủ nhật: 8:00 - 12:00
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Map */}
        <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
          <div className="aspect-video bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-700 font-semibold">Google Maps</p>
              <p className="text-sm text-gray-600">123 Đường ABC, Quận 1, TP. HCM</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}