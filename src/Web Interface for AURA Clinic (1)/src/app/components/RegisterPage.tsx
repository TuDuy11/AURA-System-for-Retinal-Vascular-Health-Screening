import { useState } from 'react';
import { User, Lock, Eye, EyeOff, Mail, Phone, Calendar, UserCircle, Briefcase, UserCircle2, Stethoscope } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
const logoImage = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22%3E%3Crect fill=%22%234f46e5%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2248%22 font-weight=%22bold%22%3EAURA%3C/text%3E%3C/svg%3E';
import { LoginResponse } from '@/app/services/auth/types';

interface RegisterPageProps {
  onBackToLogin: () => void;
  onRegisterSuccess: (role: 'doctor' | 'patient', userId: string, loginResponse: LoginResponse) => void;
}

interface PatientFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
}

interface DoctorFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  specialization: string;
  licenseNumber: string;
  yearsOfExperience: string;
}

export function RegisterPage({ onBackToLogin, onRegisterSuccess }: RegisterPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [patientLoading, setPatientLoading] = useState(false);
  const [patientError, setPatientError] = useState('');
  const [doctorLoading, setDoctorLoading] = useState(false);
  const [doctorError, setDoctorError] = useState('');
  
  const [patientForm, setPatientForm] = useState<PatientFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
  });

  const [doctorForm, setDoctorForm] = useState<DoctorFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    specialization: '',
    licenseNumber: '',
    yearsOfExperience: '',
  });

  const validatePatientForm = (): boolean => {
    if (!patientForm.fullName || !patientForm.email || !patientForm.password || !patientForm.phone) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return false;
    }

    if (patientForm.password.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }

    if (patientForm.password !== patientForm.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(patientForm.email)) {
      alert('Email không hợp lệ');
      return false;
    }

    return true;
  };

  const validateDoctorForm = (): boolean => {
    if (!doctorForm.fullName || !doctorForm.email || !doctorForm.password || !doctorForm.phone || !doctorForm.licenseNumber) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return false;
    }

    if (doctorForm.password.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }

    if (doctorForm.password !== doctorForm.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(doctorForm.email)) {
      alert('Email không hợp lệ');
      return false;
    }

    return true;
  };

  const handlePatientRegister = async () => {
    if (!validatePatientForm()) return;

    try {
      setPatientLoading(true);
      setPatientError('');

      // Gọi API backend trực tiếp
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9999/api';
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: patientForm.email,
          password: patientForm.password,
          fullName: patientForm.fullName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Lỗi đăng ký');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Lỗi đăng ký');
      }

      // Success
      setPatientLoading(false);
      onRegisterSuccess('patient', data.data.user.id, {
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
        user: data.data.user,
        roles: data.data.roles,
      });
    } catch (error) {
      setPatientLoading(false);
      if (error instanceof Error) {
        if (error.message.includes('Email')) {
          setPatientError('Email này đã được đăng ký');
        } else {
          setPatientError(error.message);
        }
      } else {
        setPatientError('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    }
  };

  const handleDoctorRegister = async () => {
    if (!validateDoctorForm()) return;

    try {
      setDoctorLoading(true);
      setDoctorError('');

      // Gọi API backend trực tiếp
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9999/api';
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: doctorForm.email,
          password: doctorForm.password,
          fullName: doctorForm.fullName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Lỗi đăng ký');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Lỗi đăng ký');
      }

      // Success
      setDoctorLoading(false);
      onRegisterSuccess('doctor', data.data.user.id, {
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
        user: data.data.user,
        roles: data.data.roles,
      });
    } catch (error) {
      setDoctorLoading(false);
      if (error instanceof Error) {
        if (error.message.includes('Email')) {
          setDoctorError('Email này đã được đăng ký');
        } else {
          setDoctorError(error.message);
        }
      } else {
        setDoctorError('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1f3d] via-[#0d2d4a] to-[#0a1f3d] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Medical Grid Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 212, 255, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 212, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-8">
          <button 
            onClick={onBackToLogin}
            className="flex items-center justify-center mb-6 mx-auto transition-transform hover:scale-105"
            title="Quay về trang chủ"
          >
            <img 
              src={logoImage} 
              alt="AURA Logo" 
              className="h-28 w-auto"
            />
          </button>
          <h2 className="text-3xl font-bold text-white mb-2">Đăng ký tài khoản</h2>
          <p className="text-cyan-200/80">Tạo tài khoản mới để sử dụng dịch vụ</p>
        </div>

        <Card className="shadow-2xl border-2 border-cyan-500/30 bg-white/98 backdrop-blur-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-2xl text-gray-900">Chọn loại tài khoản</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="patient" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1">
                <TabsTrigger value="patient" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
                  <UserCircle2 className="w-4 h-4 mr-2" />
                  Bệnh nhân
                </TabsTrigger>
                <TabsTrigger value="doctor" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Bác sĩ
                </TabsTrigger>
              </TabsList>

              {/* Patient Registration Form */}
              <TabsContent value="patient" className="space-y-4 mt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient-name">Họ và tên *</Label>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="patient-name"
                        placeholder="Nguyễn Văn A"
                        className="pl-10"
                        value={patientForm.fullName}
                        onChange={(e) => setPatientForm({ ...patientForm, fullName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patient-phone">Số điện thoại *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="patient-phone"
                        placeholder="0912 345 678"
                        className="pl-10"
                        value={patientForm.phone}
                        onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patient-email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="patient-email"
                      type="email"
                      placeholder="email@example.com"
                      className="pl-10"
                      value={patientForm.email}
                      onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient-dob">Ngày sinh</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="patient-dob"
                        type="date"
                        className="pl-10"
                        value={patientForm.dateOfBirth}
                        onChange={(e) => setPatientForm({ ...patientForm, dateOfBirth: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patient-gender">Giới tính</Label>
                    <Select
                      value={patientForm.gender}
                      onValueChange={(value) => setPatientForm({ ...patientForm, gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Nam</SelectItem>
                        <SelectItem value="female">Nữ</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient-password">Mật khẩu *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="patient-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Ít nhất 6 ký tự"
                        className="pl-10 pr-10"
                        value={patientForm.password}
                        onChange={(e) => setPatientForm({ ...patientForm, password: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patient-confirm-password">Xác nhận mật khẩu *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="patient-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Nhập lại mật khẩu"
                        className="pl-10 pr-10"
                        value={patientForm.confirmPassword}
                        onChange={(e) => setPatientForm({ ...patientForm, confirmPassword: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {patientError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                    {patientError}
                  </div>
                )}

                <Button
                  onClick={handlePatientRegister}
                  disabled={patientLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg disabled:opacity-50"
                  size="lg"
                >
                  {patientLoading ? 'Đang đăng ký...' : 'Đăng ký tài khoản'}
                  {!patientLoading && <UserCircle2 className="w-4 h-4 ml-2" />}
                </Button>
              </TabsContent>

              {/* Doctor Registration Form */}
              <TabsContent value="doctor" className="space-y-4 mt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor-name">Họ và tên *</Label>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="doctor-name"
                        placeholder="TS. BS. Nguyễn Văn A"
                        className="pl-10"
                        value={doctorForm.fullName}
                        onChange={(e) => setDoctorForm({ ...doctorForm, fullName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doctor-phone">Số điện thoại *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="doctor-phone"
                        placeholder="0912 345 678"
                        className="pl-10"
                        value={doctorForm.phone}
                        onChange={(e) => setDoctorForm({ ...doctorForm, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doctor-email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="doctor-email"
                      type="email"
                      placeholder="doctor@example.com"
                      className="pl-10"
                      value={doctorForm.email}
                      onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor-specialization">Chuyên khoa *</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="doctor-specialization"
                        placeholder="Nhãn khoa"
                        className="pl-10"
                        value={doctorForm.specialization}
                        onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doctor-license">Số chứng chỉ hành nghề *</Label>
                    <Input
                      id="doctor-license"
                      placeholder="12345/BYT-HN"
                      value={doctorForm.licenseNumber}
                      onChange={(e) => setDoctorForm({ ...doctorForm, licenseNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doctor-experience">Số năm kinh nghiệm</Label>
                  <Input
                    id="doctor-experience"
                    type="number"
                    placeholder="10"
                    value={doctorForm.yearsOfExperience}
                    onChange={(e) => setDoctorForm({ ...doctorForm, yearsOfExperience: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor-password">Mật khẩu *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="doctor-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Ít nhất 6 ký tự"
                        className="pl-10 pr-10"
                        value={doctorForm.password}
                        onChange={(e) => setDoctorForm({ ...doctorForm, password: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doctor-confirm-password">Xác nhận mật khẩu *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="doctor-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Nhập lại mật khẩu"
                        className="pl-10 pr-10"
                        value={doctorForm.confirmPassword}
                        onChange={(e) => setDoctorForm({ ...doctorForm, confirmPassword: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                  <strong>Lưu ý:</strong> Tài khoản bác sĩ cần được xác thực trước khi sử dụng đầy đủ tính năng.
                </div>

                {doctorError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                    {doctorError}
                  </div>
                )}

                <Button
                  onClick={handleDoctorRegister}
                  disabled={doctorLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg disabled:opacity-50"
                  size="lg"
                >
                  {doctorLoading ? 'Đang đăng ký...' : 'Đăng ký tài khoản'}
                  {!doctorLoading && <Stethoscope className="w-4 h-4 ml-2" />}
                </Button>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <button
                onClick={onBackToLogin}
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                ← Quay lại đăng nhập
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}