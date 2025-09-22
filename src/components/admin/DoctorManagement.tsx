import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, Plus, Edit, Trash2, Stethoscope, User, Phone, Mail, GraduationCap, Award } from 'lucide-react';

interface Doctor {
  user_id: string;
  username: string;
  email: string;
  phone?: string;
  role: 'doctor';
  fullname: string;
  specialty_id?: string;
  specialty_name?: string;
  experience?: string;
  license_number?: string;
  created_at: string;
}

interface Specialty {
  specialty_id: string;
  name: string;
  description: string;
}

export const DoctorManagement: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - sẽ thay thế bằng API calls
  useEffect(() => {
    const mockSpecialties: Specialty[] = [
      { specialty_id: '1', name: 'Tim mạch', description: 'Khoa chuyên điều trị các bệnh lý về tim mạch và huyết áp' },
      { specialty_id: '2', name: 'Thần kinh', description: 'Khoa chuyên điều trị các bệnh lý về hệ thần kinh' },
      { specialty_id: '3', name: 'Nhi khoa', description: 'Khoa chuyên chăm sóc sức khỏe trẻ em từ sơ sinh đến 18 tuổi' },
      { specialty_id: '4', name: 'Da liễu', description: 'Khoa chuyên điều trị các bệnh lý về da và thẩm mỹ da' },
      { specialty_id: '5', name: 'Nội khoa', description: 'Khoa chuyên điều trị các bệnh lý nội khoa tổng quát' },
      { specialty_id: '6', name: 'Ngoại khoa', description: 'Khoa chuyên thực hiện các ca phẫu thuật và điều trị ngoại khoa' },
    ];

    const mockDoctors: Doctor[] = [
      {
        user_id: '1',
        username: 'doctor1',
        email: 'doctor1@example.com',
        phone: '0123456789',
        role: 'doctor',
        fullname: 'Bác sĩ Nguyễn Văn A',
        specialty_id: '1',
        specialty_name: 'Tim mạch',
        experience: '10 năm kinh nghiệm trong lĩnh vực tim mạch',
        license_number: 'BS001234',
        created_at: '2024-01-01'
      },
      {
        user_id: '2',
        username: 'doctor2',
        email: 'doctor2@example.com',
        phone: '0987654321',
        role: 'doctor',
        fullname: 'Bác sĩ Trần Thị B',
        specialty_id: '2',
        specialty_name: 'Thần kinh',
        experience: '8 năm kinh nghiệm trong lĩnh vực thần kinh',
        license_number: 'BS002345',
        created_at: '2024-01-02'
      },
      {
        user_id: '3',
        username: 'doctor3',
        email: 'doctor3@example.com',
        phone: '0369852147',
        role: 'doctor',
        fullname: 'Bác sĩ Lê Văn C',
        specialty_id: '3',
        specialty_name: 'Nhi khoa',
        experience: '12 năm kinh nghiệm trong lĩnh vực nhi khoa',
        license_number: 'BS003456',
        created_at: '2024-01-03'
      }
    ];

    setSpecialties(mockSpecialties);
    setDoctors(mockDoctors);
  }, []);

  const filteredDoctors = doctors.filter(doctor =>
    doctor.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.phone?.includes(searchTerm) ||
    doctor.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDoctor = async (data: any) => {
    setIsLoading(true);
    try {
      // TODO: API call to add doctor
      console.log('Adding doctor:', data);
      
      const specialty = specialties.find(s => s.specialty_id === data.specialty_id);
      
      // Mock add
      const newDoctor: Doctor = {
        user_id: Date.now().toString(),
        ...data,
        role: 'doctor',
        specialty_name: specialty?.name,
        created_at: new Date().toISOString().split('T')[0]
      };
      
      setDoctors(prev => [...prev, newDoctor]);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding doctor:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditDoctor = async (data: any) => {
    setIsLoading(true);
    try {
      // TODO: API call to edit doctor
      console.log('Editing doctor:', data);
      
      const specialty = specialties.find(s => s.specialty_id === data.specialty_id);
      
      // Mock edit
      setDoctors(prev => prev.map(doctor => 
        doctor.user_id === editingDoctor?.user_id 
          ? { ...doctor, ...data, specialty_name: specialty?.name }
          : doctor
      ));
      
      setIsEditDialogOpen(false);
      setEditingDoctor(null);
    } catch (error) {
      console.error('Error editing doctor:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDoctor = async (doctorId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bác sĩ này?')) {
      try {
        // TODO: API call to delete doctor
        console.log('Deleting doctor:', doctorId);
        
        // Mock delete
        setDoctors(prev => prev.filter(doctor => doctor.user_id !== doctorId));
      } catch (error) {
        console.error('Error deleting doctor:', error);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Bác sĩ</h2>
          <p className="text-gray-600 mt-1">Quản lý thông tin bác sĩ trong hệ thống</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm bác sĩ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm bác sĩ mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin bác sĩ mới
              </DialogDescription>
            </DialogHeader>
            <DoctorForm 
              onSubmit={handleAddDoctor} 
              isLoading={isLoading}
              submitText="Thêm bác sĩ"
              specialties={specialties}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm bác sĩ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="outline">
          Tổng: {filteredDoctors.length} bác sĩ
        </Badge>
      </div>

      {/* Doctors List */}
      <div className="grid gap-4">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.user_id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                      <Stethoscope className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{doctor.fullname}</h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>{doctor.email}</span>
                        </div>
                        {doctor.phone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4" />
                            <span>{doctor.phone}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <Badge variant="outline" className="text-xs">
                          {doctor.specialty_name}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {doctor.username}
                        </Badge>
                        {doctor.license_number && (
                          <div className="flex items-center space-x-1">
                            <Award className="h-4 w-4" />
                            <span>{doctor.license_number}</span>
                          </div>
                        )}
                      </div>
                      {doctor.experience && (
                        <div className="flex items-center space-x-1 mt-2 text-sm text-gray-500">
                          <GraduationCap className="h-4 w-4" />
                          <span>{doctor.experience}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingDoctor(doctor);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteDoctor(doctor.user_id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa bác sĩ</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin bác sĩ
            </DialogDescription>
          </DialogHeader>
          <DoctorForm 
            onSubmit={handleEditDoctor} 
            isLoading={isLoading}
            submitText="Cập nhật"
            specialties={specialties}
            initialData={editingDoctor}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Doctor Form Component
interface DoctorFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
  submitText: string;
  specialties: Specialty[];
  initialData?: Doctor | null;
}

const DoctorForm: React.FC<DoctorFormProps> = ({ onSubmit, isLoading, submitText, specialties, initialData }) => {
  const [formData, setFormData] = useState({
    username: initialData?.username || '',
    email: initialData?.email || '',
    password: '',
    fullname: initialData?.fullname || '',
    phone: initialData?.phone || '',
    specialty_id: initialData?.specialty_id || '',
    experience: initialData?.experience || '',
    license_number: initialData?.license_number || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="username">Tên đăng nhập *</Label>
          <Input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
      
      {!initialData && (
        <div>
          <Label htmlFor="password">Mật khẩu *</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullname">Họ và tên *</Label>
          <Input
            id="fullname"
            name="fullname"
            value={formData.fullname}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      <div>
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
      
      <div>
        <Label htmlFor="experience">Kinh nghiệm</Label>
        <Textarea
          id="experience"
          name="experience"
          value={formData.experience}
          onChange={handleInputChange}
          rows={3}
        />
      </div>
      
      <div>
        <Label htmlFor="license_number">Số chứng chỉ hành nghề</Label>
        <Input
          id="license_number"
          name="license_number"
          value={formData.license_number}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Đang xử lý...' : submitText}
        </Button>
      </div>
    </form>
  );
};
