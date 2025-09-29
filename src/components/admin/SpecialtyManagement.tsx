import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Search, Plus, Edit, Trash2, Building2, Users, Stethoscope, Mail, Phone, Award, GraduationCap, Eye } from 'lucide-react';
import { apiService } from '../../services/api';

interface Specialty {
  specialty_id: string;
  name: string;
  description: string;
  created_at: string;
  doctors_count?: number;
}

interface Doctor {
  doctor_id: string;
  user_id: string;
  fullname: string;
  specialty_id?: string;
  experience?: string;
  license_number?: string;
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

export const SpecialtyManagement: React.FC = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // New states for doctors modal
  const [isDoctorsModalOpen, setIsDoctorsModalOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [doctorsError, setDoctorsError] = useState<string | null>(null);

  // Load specialties from API
  useEffect(() => {
    loadSpecialties();
  }, []);

  const loadSpecialties = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getSpecialties({ per_page: 50 });
      if (response.success && response.data) {
        setSpecialties(response.data.data || []);
      } else {
        console.error('Failed to load specialties:', response.message);
      }
    } catch (error) {
      console.error('Error loading specialties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSpecialties = specialties.filter(specialty =>
    specialty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    specialty.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSpecialty = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await apiService.createSpecialty(data);
      if (response.success) {
        await loadSpecialties(); // Reload specialties list
        setIsAddDialogOpen(false);
      } else {
        console.error('Error adding specialty:', response.message);
      }
    } catch (error) {
      console.error('Error adding specialty:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSpecialty = async (data: any) => {
    if (!editingSpecialty) return;
    
    setIsLoading(true);
    try {
      const response = await apiService.updateSpecialty(editingSpecialty.specialty_id, data);
      if (response.success) {
        await loadSpecialties(); // Reload specialties list
        setIsEditDialogOpen(false);
        setEditingSpecialty(null);
      } else {
        console.error('Error editing specialty:', response.message);
      }
    } catch (error) {
      console.error('Error editing specialty:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSpecialty = async (specialtyId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chuyên khoa này?')) {
      try {
        const response = await apiService.deleteSpecialty(specialtyId);
        if (response.success) {
          await loadSpecialties(); // Reload specialties list
        } else {
          console.error('Error deleting specialty:', response.message);
          alert(response.message || 'Không thể xóa chuyên khoa này');
        }
      } catch (error) {
        console.error('Error deleting specialty:', error);
        alert('Lỗi khi xóa chuyên khoa');
      }
    }
  };

  const handleViewDoctors = async (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
    setIsDoctorsModalOpen(true);
    await loadDoctorsBySpecialty(specialty.specialty_id);
  };

  const loadDoctorsBySpecialty = async (specialtyId: string) => {
    try {
      setDoctorsLoading(true);
      setDoctorsError(null);
      
      const response = await apiService.getDoctorsBySpecialty(specialtyId, { per_page: 50 });
      
      if (response.success && response.data) {
        const doctorsData = response.data.data || [];
        setDoctors(doctorsData);
      } else {
        console.error('API Error:', response.message);
        setDoctorsError(response.message || 'Không thể tải danh sách bác sĩ');
        setDoctors([]);
      }
    } catch (error) {
      console.error('Error loading doctors by specialty:', error);
      setDoctorsError('Lỗi khi tải danh sách bác sĩ');
      setDoctors([]);
    } finally {
      setDoctorsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Chuyên khoa</h2>
          <p className="text-gray-600 mt-1">Quản lý các chuyên khoa khám bệnh</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm chuyên khoa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm chuyên khoa mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin chuyên khoa mới
              </DialogDescription>
            </DialogHeader>
            <SpecialtyForm 
              onSubmit={handleAddSpecialty} 
              isLoading={isLoading}
              submitText="Thêm chuyên khoa"
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm chuyên khoa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            Tổng: {filteredSpecialties.length} chuyên khoa
          </Badge>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="text-gray-500">Đang tải danh sách chuyên khoa...</div>
        </div>
      )}

      {/* Specialties Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpecialties.map((specialty) => (
          <Card key={specialty.specialty_id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{specialty.name}</CardTitle>
                    <div className="flex items-center space-x-1 mt-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {specialty.doctors_count || 0} bác sĩ
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingSpecialty(specialty);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteSpecialty(specialty.specialty_id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm leading-relaxed">
                {specialty.description}
              </CardDescription>
              <div className="mt-4 pt-3 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewDoctors(specialty)}
                  className="w-full"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Xem bác sĩ ({specialty.doctors_count || 0})
                </Button>
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
            <DialogTitle>Chỉnh sửa chuyên khoa</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin chuyên khoa
            </DialogDescription>
          </DialogHeader>
          <SpecialtyForm 
            onSubmit={handleEditSpecialty} 
            isLoading={isLoading}
            submitText="Cập nhật"
            initialData={editingSpecialty}
          />
        </DialogContent>
      </Dialog>

      {/* Doctors Modal */}
      {isDoctorsModalOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            <div style={{ padding: '24px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                marginBottom: '16px' 
              }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>
                  Bác sĩ thuộc chuyên khoa: {selectedSpecialty?.name}
                </h2>
                <button
                  onClick={() => setIsDoctorsModalOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    color: '#6b7280',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  ×
                </button>
              </div>
              
              <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                Danh sách các bác sĩ thuộc chuyên khoa này
              </p>

              {doctorsLoading ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div style={{ color: '#6b7280' }}>Đang tải danh sách bác sĩ...</div>
                </div>
              ) : doctorsError ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div style={{ color: '#ef4444', marginBottom: '16px' }}>{doctorsError}</div>
                  <Button
                    onClick={() => selectedSpecialty && loadDoctorsBySpecialty(selectedSpecialty.specialty_id)}
                    variant="outline"
                  >
                    Thử lại
                  </Button>
                </div>
              ) : (
                <div>
                  {doctors.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px 0' }}>
                      <div style={{ color: '#6b7280' }}>Chưa có bác sĩ nào thuộc chuyên khoa này</div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {doctors.map((doctor) => (
                        <div 
                          key={doctor.doctor_id}
                          style={{
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '16px',
                            backgroundColor: '#f9fafb'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '48px',
                              height: '48px',
                              backgroundColor: '#dbeafe',
                              borderRadius: '50%'
                            }}>
                              <Stethoscope className="h-6 w-6" style={{ color: '#3b82f6' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <h3 style={{ 
                                fontSize: '18px', 
                                fontWeight: '600', 
                                color: '#111827',
                                margin: '0 0 8px 0'
                              }}>
                                {doctor.fullname}
                              </h3>
                              <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '16px', 
                                marginBottom: '8px',
                                fontSize: '14px',
                                color: '#6b7280'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Mail className="h-4 w-4" />
                                  <span>{doctor.user.email}</span>
                                </div>
                                {doctor.user.phone && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Phone className="h-4 w-4" />
                                    <span>{doctor.user.phone}</span>
                                  </div>
                                )}
                              </div>
                              <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '16px',
                                fontSize: '14px',
                                color: '#6b7280'
                              }}>
                                <Badge variant="outline" className="text-xs">
                                  {doctor.user.username}
                                </Badge>
                                {doctor.license_number && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Award className="h-4 w-4" />
                                    <span>{doctor.license_number}</span>
                                  </div>
                                )}
                              </div>
                              {doctor.experience && (
                                <div style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '4px',
                                  marginTop: '8px',
                                  fontSize: '14px',
                                  color: '#6b7280'
                                }}>
                                  <GraduationCap className="h-4 w-4" />
                                  <span>{doctor.experience}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Specialty Form Component
interface SpecialtyFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
  submitText: string;
  initialData?: Specialty | null;
}

const SpecialtyForm: React.FC<SpecialtyFormProps> = ({ onSubmit, isLoading, submitText, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || ''
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Tên chuyên khoa *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Nhập tên chuyên khoa"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Mô tả *</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Nhập mô tả chuyên khoa"
          rows={4}
          required
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
