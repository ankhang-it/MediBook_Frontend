import React, { useState, useEffect } from 'react';
// Updated: Removed DoctorForm component - using inline form instead
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, Plus, Edit, Trash2, Stethoscope, User, Phone, Mail, GraduationCap, Award } from 'lucide-react';
import { apiService } from '../../services/api';

interface Doctor {
  doctor_id: string;
  user_id: string;
  fullname: string;
  specialty_id?: string;
  experience?: string;
  license_number?: string;
  schedule?: any;
  created_at: string;
  user: {
    user_id: string;
    username: string;
    email: string;
    phone?: string;
    role: 'doctor';
  };
  specialty?: {
    specialty_id: string;
    name: string;
    description: string;
  };
}

interface DoctorFormData {
  username: string;
  email: string;
  password: string;
  phone: string;
  fullname: string;
  specialty_id: string;
  experience: string;
  license_number: string;
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
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<DoctorFormData>({
    username: '',
    email: '',
    password: '',
    phone: '',
    fullname: '',
    specialty_id: '',
    experience: '',
    license_number: ''
  });

  // Load data from API
  useEffect(() => {
    loadDoctors();
    loadSpecialties();
  }, []);

  const loadDoctors = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getAdminDoctors({ per_page: 50 });
      if (response.success && response.data) {
        setDoctors(response.data.data || []);
      } else {
        setError('Không thể tải danh sách bác sĩ');
      }
    } catch (error) {
      console.error('Error loading doctors:', error);
      setError('Lỗi khi tải danh sách bác sĩ');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSpecialties = async () => {
    try {
      const response = await apiService.getSpecialties({ per_page: 100 });
      if (response.success && response.data) {
        setSpecialties(response.data.data || []);
      } else {
        console.error('Failed to load specialties:', response.message);
      }
    } catch (error) {
      console.error('Error loading specialties:', error);
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.user.phone?.includes(searchTerm) ||
    doctor.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDoctor = async (data: DoctorFormData) => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await apiService.createUser({
        username: data.username,
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: 'doctor',
        fullname: data.fullname,
        specialty_id: data.specialty_id,
        experience: data.experience,
        license_number: data.license_number
      });
      
      if (response.success) {
        await loadDoctors(); // Reload doctors list
        setIsAddDialogOpen(false);
        resetForm();
      } else {
        setError(response.message || 'Không thể thêm bác sĩ');
      }
    } catch (error) {
      console.error('Error adding doctor:', error);
      setError('Lỗi khi thêm bác sĩ');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      phone: '',
      fullname: '',
      specialty_id: '',
      experience: '',
      license_number: ''
    });
  };

  const handleInputChange = (field: keyof DoctorFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditDoctor = async (data: any) => {
    if (!editingDoctor) return;
    
    setIsLoading(true);
    try {
      setError(null);
      const response = await apiService.updateUser(editingDoctor.user.user_id, data);
      
      if (response.success) {
        await loadDoctors(); // Reload doctors list
        setIsEditDialogOpen(false);
        setEditingDoctor(null);
      } else {
        setError(response.message || 'Không thể cập nhật bác sĩ');
      }
    } catch (error) {
      console.error('Error editing doctor:', error);
      setError('Lỗi khi cập nhật bác sĩ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDoctor = async (doctorId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bác sĩ này?')) {
      try {
        setError(null);
        const response = await apiService.deleteUser(doctorId);
        
        if (response.success) {
          await loadDoctors(); // Reload doctors list
        } else {
          setError(response.message || 'Không thể xóa bác sĩ');
        }
      } catch (error) {
        console.error('Error deleting doctor:', error);
        setError('Lỗi khi xóa bác sĩ');
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
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm bác sĩ
        </Button>
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

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="text-gray-500">Đang tải dữ liệu...</div>
        </div>
      )}

      {/* Doctors List */}
      {!isLoading && (
        <div className="grid gap-4">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.doctor_id}>
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
                            <span>{doctor.user.email}</span>
                          </div>
                          {doctor.user.phone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="h-4 w-4" />
                              <span>{doctor.user.phone}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <Badge variant="outline" className="text-xs">
                            {doctor.specialty?.name || 'Chưa có chuyên khoa'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {doctor.user.username}
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
                      onClick={() => handleDeleteDoctor(doctor.user.user_id)}
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
      )}

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm bác sĩ mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin bác sĩ mới
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Thông tin cơ bản */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Thông tin cơ bản</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">Tên đăng nhập *</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder="Nhập tên đăng nhập"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Nhập email"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Mật khẩu *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Nhập mật khẩu"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>
            </div>

            {/* Thông tin chuyên môn */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Thông tin chuyên môn</h3>
              
              <div>
                <Label htmlFor="fullname">Họ và tên *</Label>
                <Input
                  id="fullname"
                  value={formData.fullname}
                  onChange={(e) => handleInputChange('fullname', e.target.value)}
                  placeholder="Nhập họ và tên đầy đủ"
                  required
                />
              </div>

              <div>
                <Label htmlFor="specialty">Chuyên khoa *</Label>
                <Select value={formData.specialty_id} onValueChange={(value) => handleInputChange('specialty_id', value)}>
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
                <Label htmlFor="license_number">Số chứng chỉ hành nghề</Label>
                <Input
                  id="license_number"
                  value={formData.license_number}
                  onChange={(e) => handleInputChange('license_number', e.target.value)}
                  placeholder="Nhập số chứng chỉ hành nghề"
                />
              </div>

              <div>
                <Label htmlFor="experience">Kinh nghiệm</Label>
                <Textarea
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  placeholder="Mô tả kinh nghiệm làm việc..."
                  rows={3}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  resetForm();
                }}
              >
                Hủy
              </Button>
              <Button
                onClick={() => handleAddDoctor(formData)}
                disabled={isLoading || !formData.username || !formData.email || !formData.password || !formData.fullname || !formData.specialty_id}
              >
                {isLoading ? 'Đang thêm...' : 'Thêm bác sĩ'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa bác sĩ</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin bác sĩ
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-gray-500">Chức năng chỉnh sửa đang được phát triển...</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

