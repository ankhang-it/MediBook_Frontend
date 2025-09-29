import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, Plus, Edit, Trash2, Eye, User, Phone, Mail, Calendar, MapPin } from 'lucide-react';
import { apiService } from '../../services/api';

interface Patient {
  patient_id: string;
  user_id: string;
  fullname: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  medical_history?: string;
  created_at: string;
  user: {
    user_id: string;
    username: string;
    email: string;
    phone?: string;
    role: 'patient';
  };
}

export const PatientManagement: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data from API
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getAdminPatients({ per_page: 50 });
      if (response.success && response.data) {
        setPatients(response.data.data || []);
      } else {
        setError('Không thể tải danh sách bệnh nhân');
      }
    } catch (error) {
      console.error('Error loading patients:', error);
      setError('Lỗi khi tải danh sách bệnh nhân');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.user.phone?.includes(searchTerm) ||
    patient.user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPatient = async (data: any) => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await apiService.createUser({
        ...data,
        role: 'patient'
      });
      
      if (response.success) {
        await loadPatients(); // Reload patients list
        setIsAddDialogOpen(false);
      } else {
        setError(response.message || 'Không thể thêm bệnh nhân');
      }
    } catch (error) {
      console.error('Error adding patient:', error);
      setError('Lỗi khi thêm bệnh nhân');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPatient = async (data: any) => {
    if (!editingPatient) return;
    
    setIsLoading(true);
    try {
      setError(null);
      const response = await apiService.updateUser(editingPatient.user.user_id, data);
      
      if (response.success) {
        await loadPatients(); // Reload patients list
        setIsEditDialogOpen(false);
        setEditingPatient(null);
      } else {
        setError(response.message || 'Không thể cập nhật bệnh nhân');
      }
    } catch (error) {
      console.error('Error editing patient:', error);
      setError('Lỗi khi cập nhật bệnh nhân');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePatient = async (patientId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bệnh nhân này?')) {
      try {
        setError(null);
        const response = await apiService.deleteUser(patientId);
        
        if (response.success) {
          await loadPatients(); // Reload patients list
        } else {
          setError(response.message || 'Không thể xóa bệnh nhân');
        }
      } catch (error) {
        console.error('Error deleting patient:', error);
        setError('Lỗi khi xóa bệnh nhân');
      }
    }
  };

  const getGenderText = (gender?: string) => {
    switch (gender) {
      case 'male': return 'Nam';
      case 'female': return 'Nữ';
      case 'other': return 'Khác';
      default: return 'Chưa xác định';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Bệnh nhân</h2>
          <p className="text-gray-600 mt-1">Quản lý thông tin bệnh nhân trong hệ thống</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm bệnh nhân
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm bệnh nhân mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin bệnh nhân mới
              </DialogDescription>
            </DialogHeader>
            <PatientForm 
              onSubmit={handleAddPatient} 
              isLoading={isLoading}
              submitText="Thêm bệnh nhân"
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm bệnh nhân..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="outline">
          Tổng: {filteredPatients.length} bệnh nhân
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

      {/* Patients List */}
      {!isLoading && (
        <div className="grid gap-4">
          {filteredPatients.map((patient) => (
            <Card key={patient.patient_id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{patient.fullname}</h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-4 w-4" />
                            <span>{patient.user.email}</span>
                          </div>
                          {patient.user.phone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="h-4 w-4" />
                              <span>{patient.user.phone}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          {patient.dob && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(patient.dob)}</span>
                            </div>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {getGenderText(patient.gender)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {patient.user.username}
                          </Badge>
                        </div>
                        {patient.address && (
                          <div className="flex items-center space-x-1 mt-2 text-sm text-gray-500">
                            <MapPin className="h-4 w-4" />
                            <span>{patient.address}</span>
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
                        setEditingPatient(patient);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeletePatient(patient.user.user_id)}
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa bệnh nhân</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin bệnh nhân
            </DialogDescription>
          </DialogHeader>
          <PatientForm 
            onSubmit={handleEditPatient} 
            isLoading={isLoading}
            submitText="Cập nhật"
            initialData={editingPatient}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Patient Form Component
interface PatientFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
  submitText: string;
  initialData?: Patient | null;
}

const PatientForm: React.FC<PatientFormProps> = ({ onSubmit, isLoading, submitText, initialData }) => {
  const [formData, setFormData] = useState({
    username: initialData?.user?.username || '',
    email: initialData?.user?.email || '',
    password: '',
    fullname: initialData?.fullname || '',
    phone: initialData?.user?.phone || '',
    dob: initialData?.dob || '',
    gender: initialData?.gender || 'male',
    address: initialData?.address || '',
    medical_history: initialData?.medical_history || ''
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
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dob">Ngày sinh</Label>
          <Input
            id="dob"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="gender">Giới tính</Label>
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
      
      <div>
        <Label htmlFor="address">Địa chỉ</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
        />
      </div>
      
      <div>
        <Label htmlFor="medical_history">Lịch sử bệnh án</Label>
        <Textarea
          id="medical_history"
          name="medical_history"
          value={formData.medical_history}
          onChange={handleInputChange}
          rows={3}
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
