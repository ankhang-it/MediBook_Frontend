import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Search, Plus, Edit, Trash2, Building2, Users } from 'lucide-react';

interface Specialty {
  specialty_id: string;
  name: string;
  description: string;
  created_at: string;
  doctor_count?: number;
}

export const SpecialtyManagement: React.FC = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - sẽ thay thế bằng API calls
  useEffect(() => {
    const mockSpecialties: Specialty[] = [
      {
        specialty_id: '1',
        name: 'Tim mạch',
        description: 'Khoa chuyên điều trị các bệnh lý về tim mạch và huyết áp',
        created_at: '2024-01-01',
        doctor_count: 5
      },
      {
        specialty_id: '2',
        name: 'Thần kinh',
        description: 'Khoa chuyên điều trị các bệnh lý về hệ thần kinh',
        created_at: '2024-01-01',
        doctor_count: 3
      },
      {
        specialty_id: '3',
        name: 'Nhi khoa',
        description: 'Khoa chuyên chăm sóc sức khỏe trẻ em từ sơ sinh đến 18 tuổi',
        created_at: '2024-01-01',
        doctor_count: 4
      },
      {
        specialty_id: '4',
        name: 'Da liễu',
        description: 'Khoa chuyên điều trị các bệnh lý về da và thẩm mỹ da',
        created_at: '2024-01-01',
        doctor_count: 2
      },
      {
        specialty_id: '5',
        name: 'Nội khoa',
        description: 'Khoa chuyên điều trị các bệnh lý nội khoa tổng quát',
        created_at: '2024-01-01',
        doctor_count: 6
      },
      {
        specialty_id: '6',
        name: 'Ngoại khoa',
        description: 'Khoa chuyên thực hiện các ca phẫu thuật và điều trị ngoại khoa',
        created_at: '2024-01-01',
        doctor_count: 4
      }
    ];
    setSpecialties(mockSpecialties);
  }, []);

  const filteredSpecialties = specialties.filter(specialty =>
    specialty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    specialty.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSpecialty = async (data: any) => {
    setIsLoading(true);
    try {
      // TODO: API call to add specialty
      console.log('Adding specialty:', data);
      
      // Mock add
      const newSpecialty: Specialty = {
        specialty_id: Date.now().toString(),
        ...data,
        created_at: new Date().toISOString().split('T')[0],
        doctor_count: 0
      };
      
      setSpecialties(prev => [...prev, newSpecialty]);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding specialty:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSpecialty = async (data: any) => {
    setIsLoading(true);
    try {
      // TODO: API call to edit specialty
      console.log('Editing specialty:', data);
      
      // Mock edit
      setSpecialties(prev => prev.map(specialty => 
        specialty.specialty_id === editingSpecialty?.specialty_id 
          ? { ...specialty, ...data }
          : specialty
      ));
      
      setIsEditDialogOpen(false);
      setEditingSpecialty(null);
    } catch (error) {
      console.error('Error editing specialty:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSpecialty = async (specialtyId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chuyên khoa này?')) {
      try {
        // TODO: API call to delete specialty
        console.log('Deleting specialty:', specialtyId);
        
        // Mock delete
        setSpecialties(prev => prev.filter(specialty => specialty.specialty_id !== specialtyId));
      } catch (error) {
        console.error('Error deleting specialty:', error);
      }
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
        <Badge variant="outline">
          Tổng: {filteredSpecialties.length} chuyên khoa
        </Badge>
      </div>

      {/* Specialties Grid */}
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
                        {specialty.doctor_count} bác sĩ
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
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>ID: {specialty.specialty_id}</span>
                  <span>Tạo: {new Date(specialty.created_at).toLocaleDateString('vi-VN')}</span>
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
