import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { UserPlus, User, Phone, Calendar, MapPin, FileText, GraduationCap, Award } from 'lucide-react';
import { Logo } from '../Logo';
import { toast } from 'sonner';
import { apiService } from '../../services/api';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

interface Specialty {
  specialty_id: string;
  name: string;
  description: string;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const { register, isLoading, error, clearError } = useAuth();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    role: 'patient' as 'patient' | 'doctor',
    fullname: '',
    dob: '',
    gender: 'male' as 'male' | 'female' | 'other',
    address: '',
    medical_history: '',
    // Doctor specific fields
    specialty_id: '',
    experience: '',
    license_number: '',
  });

  // Load specialties for doctors
  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        // TODO: Replace with actual API call when specialties endpoint is ready
        // const response = await apiService.getSpecialties();
        // setSpecialties(response.data);
        
        // For now, use mock data that matches the seeded data
        const mockSpecialties: Specialty[] = [
          { specialty_id: '1', name: 'Tim mạch', description: 'Khoa chuyên điều trị các bệnh lý về tim mạch và huyết áp' },
          { specialty_id: '2', name: 'Thần kinh', description: 'Khoa chuyên điều trị các bệnh lý về hệ thần kinh' },
          { specialty_id: '3', name: 'Nhi khoa', description: 'Khoa chuyên chăm sóc sức khỏe trẻ em từ sơ sinh đến 18 tuổi' },
          { specialty_id: '4', name: 'Da liễu', description: 'Khoa chuyên điều trị các bệnh lý về da và thẩm mỹ da' },
          { specialty_id: '5', name: 'Nội khoa', description: 'Khoa chuyên điều trị các bệnh lý nội khoa tổng quát' },
          { specialty_id: '6', name: 'Ngoại khoa', description: 'Khoa chuyên thực hiện các ca phẫu thuật và điều trị ngoại khoa' },
        ];
        setSpecialties(mockSpecialties);
      } catch (error) {
        console.error('Failed to load specialties:', error);
      }
    };

    loadSpecialties();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Validation
    if (!formData.username || !formData.email || !formData.password || !formData.fullname) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    if (formData.role === 'doctor' && !formData.specialty_id) {
      toast.error('Vui lòng chọn chuyên khoa');
      return;
    }

    try {
      await register(formData);
      toast.success('Đăng ký thành công! Email chào mừng đã được gửi đến hộp thư của bạn.', {
        duration: 5000,
      });
    } catch (error) {
      // Error is handled by AuthContext
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-primary p-4">
      <div className="w-full max-w-4xl mx-auto py-8">
        <Card className="card-primary glass animate-fade-in">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-6">
              <Logo size="xl" showText={false} />
            </div>
            <CardTitle className="text-3xl font-extrabold text-primary-dark">
              Đăng ký tài khoản
            </CardTitle>
            <CardDescription className="text-base font-semibold">
              Tạo tài khoản để sử dụng dịch vụ đặt lịch khám tại Trung tâm Y khoa Phúc Khang
            </CardDescription>
          </CardHeader>
      
          <CardContent className="px-8 pb-8">
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50" variant="destructive">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div className="space-y-3">
            <Label>Loại tài khoản *</Label>
            <RadioGroup
              value={formData.role}
              onValueChange={(value) => handleSelectChange('role', value)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="patient" id="patient" />
                <Label htmlFor="patient">Bệnh nhân</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="doctor" id="doctor" />
                <Label htmlFor="doctor">Bác sĩ</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập *</Label>
              <div className="relative">
                <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  name="username"
                  placeholder="Nhập tên đăng nhập"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="pr-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Nhập email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Xác nhận mật khẩu *</Label>
              <Input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={formData.password_confirmation}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullname">Họ và tên *</Label>
              <div className="relative">
                <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullname"
                  name="fullname"
                  placeholder="Nhập họ và tên"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  className="pr-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <div className="relative">
                <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Nhập số điện thoại"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="pr-10"
                />
              </div>
            </div>
          </div>

          {/* Patient specific fields */}
          {formData.role === 'patient' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dob">Ngày sinh</Label>
                  <div className="relative">
                    <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="dob"
                      name="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="pr-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Giới tính</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
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

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    name="address"
                    placeholder="Nhập địa chỉ"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medical_history">Lịch sử bệnh án</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="medical_history"
                    name="medical_history"
                    placeholder="Mô tả lịch sử bệnh án (nếu có)"
                    value={formData.medical_history}
                    onChange={handleInputChange}
                    className="pl-10"
                    rows={3}
                  />
                </div>
              </div>
            </>
          )}

          {/* Doctor specific fields */}
          {formData.role === 'doctor' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="specialty_id">Chuyên khoa *</Label>
                <Select value={formData.specialty_id} onValueChange={(value) => handleSelectChange('specialty_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chuyên khoa" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty.specialty_id} value={specialty.specialty_id}>
                        {specialty.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Kinh nghiệm</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="experience"
                    name="experience"
                    placeholder="Mô tả kinh nghiệm làm việc"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="pl-10"
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="license_number">Số chứng chỉ hành nghề</Label>
                <div className="relative">
                  <Award className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="license_number"
                    name="license_number"
                    placeholder="Nhập số chứng chỉ hành nghề"
                    value={formData.license_number}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
              </div>
            </>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full w-4 h-4 border-b-2 border-white mr-2" />
                Đang đăng ký...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Đăng ký tài khoản
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Đã có tài khoản?{' '}
            <Button
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={onSwitchToLogin}
            >
              Đăng nhập ngay
            </Button>
          </p>
        </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
