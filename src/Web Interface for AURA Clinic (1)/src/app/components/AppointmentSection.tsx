import { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function AppointmentSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    service: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Cảm ơn bạn đã đặt lịch! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
    // Reset form
    setFormData({
      name: '',
      phone: '',
      email: '',
      date: '',
      time: '',
      service: '',
      notes: '',
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="appointment" className="py-16 md:py-24 bg-gradient-to-br from-cyan-50/30 via-blue-50/20 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-cyan-100 text-cyan-600 rounded-full mb-4">
              Đặt lịch khám
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Đặt lịch hẹn ngay hôm nay
            </h2>
            <p className="text-lg text-gray-600">
              Điền thông tin bên dưới và chúng tôi sẽ liên hệ xác nhận lịch hẹn của bạn
            </p>
          </div>

          <Card className="shadow-xl border-2 border-cyan-100">
            <CardHeader>
              <CardTitle className="text-gray-800">Thông tin đặt lịch</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      <User className="w-4 h-4 inline mr-2" />
                      Họ và tên *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Nguyễn Văn A"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Số điện thoại *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="0912 345 678"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>

                {/* Appointment Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="date">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Ngày khám *
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Giờ khám *
                    </Label>
                    <Select value={formData.time} onValueChange={(value) => handleChange('time', value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giờ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="08:00">08:00 - 09:00</SelectItem>
                        <SelectItem value="09:00">09:00 - 10:00</SelectItem>
                        <SelectItem value="10:00">10:00 - 11:00</SelectItem>
                        <SelectItem value="11:00">11:00 - 12:00</SelectItem>
                        <SelectItem value="14:00">14:00 - 15:00</SelectItem>
                        <SelectItem value="15:00">15:00 - 16:00</SelectItem>
                        <SelectItem value="16:00">16:00 - 17:00</SelectItem>
                        <SelectItem value="17:00">17:00 - 18:00</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service">Dịch vụ *</Label>
                  <Select value={formData.service} onValueChange={(value) => handleChange('service', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn dịch vụ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retina-photo">Chụp ảnh võng mạc</SelectItem>
                      <SelectItem value="oct">OCT - Chụp cắt lớp võng mạc</SelectItem>
                      <SelectItem value="diabetes">Sàng lọc bệnh tiểu đường</SelectItem>
                      <SelectItem value="comprehensive">Đánh giá toàn diện</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Ghi chú</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="Các thông tin bổ sung hoặc yêu cầu đặc biệt..."
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/30" size="lg">
                  Xác nhận đặt lịch
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  * Chúng tôi sẽ liên hệ xác nhận lịch hẹn trong vòng 24 giờ
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}