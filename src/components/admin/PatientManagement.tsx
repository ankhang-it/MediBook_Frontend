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

interface Patient {
  user_id: string;
  username: string;
  email: string;
  phone?: string;
  role: 'patient';
  fullname: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  medical_history?: string;
  created_at: string;
}

export const PatientManagement: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - sẽ thay thế bằng API calls
  useEffect(() => {
    const mockPatients: Patient[] = [
      {
        user_id: '1',
        username: 'patient1',
        email: 'patient1@example.com',
        phone: '0123456789',
        role: 'patient',
        fullname: 'Nguyễn Văn A',
        dob: '1990-01-01',
        gender: 'male',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        medical_history: 'Tiền sử bệnh tim',
        created_at: '2024-01-01'
      },
      {
        user_id: '2',
        username: 'patient2',
        email: 'patient2@example.com',
        phone: '0987654321',
        role: 'patient',
        fullname: 'Trần Thị B',
        dob: '1985-05-15',
        gender: 'female',
        address: '456 Đường XYZ, Quận 2, TP.HCM',
        medical_history: 'Tiền sử bệnh huyết áp',
        created_at: '2024-01-02'
      },
      {
        user_id: '3',
        username: 'patient3',
        email: 'patient3@example.com',
        phone: '0369852147',
        role: 'patient',
        fullname: 'Lê Văn C',
        dob: '1992-12-20',
        gender: 'male',
        address: '789 Đường DEF, Quận 3, TP.HCM',
        created_at: '2024-01-03'
      }
    ];
    setPatients(mockPatients);
  }, []);

  const filteredPatients = patients.filter(patient =>
    patient.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone?.includes(searchTerm) ||
    patient.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPatient = async (data: any) => {
    setIsLoading(true);
    try {
      // TODO: API call to add patient
      console.log('Adding patient:', data);
      
      // Mock add
      const newPatient: Patient = {
        user_id: Date.now().toString(),
        ...data,
        role: 'patient',
        created_at: new Date().toISOString().split('T')[0]
      };
      
      setPatients(prev => [...prev, newPatient]);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding patient:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPatient = async (data: any) => {
    setIsLoading(true);
    try {
      // TODO: API call to edit patient
      console.log('Editing patient:', data);
      
      // Mock edit
      setPatients(prev => prev.map(patient => 
        patient.user_id === editingPatient?.user_id 
          ? { ...patient, ...data }
          : patient
      ));
      
      setIsEditDialogOpen(false);
      setEditingPatient(null);
    } catch (error) {
      console.error('Error editing patient:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePatient = async (patientId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bệnh nhân này?')) {
      try {
        // TODO: API call to delete patient
        console.log('Deleting patient:', patientId);
        
        // Mock delete
        setPatients(prev => prev.filter(patient => patient.user_id !== patientId));
      } catch (error) {
        console.error('Error deleting patient:', error);
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

      {/* Patients List */}
      <div className="grid gap-4">
        {filteredPatients.map((patient) => (
          <Card key={patient.user_id}>
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
                          <span>{patient.email}</span>
                        </div>
                        {patient.phone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4" />
                            <span>{patient.phone}</span>
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
                          {patient.username}
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
                    onClick={() => handleDeletePatient(patient.user_id)}
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
    username: initialData?.username || '',
    email: initialData?.email || '',
    password: '',
    fullname: initialData?.fullname || '',
    phone: initialData?.phone || '',
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
