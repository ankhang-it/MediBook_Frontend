import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User, Edit, Camera, Calendar, MapPin, FileText, Phone, Mail, Save, X } from 'lucide-react';
import { apiService } from '../services/api';
import { toast } from 'sonner';

interface PatientProfile {
  patient_id: string;
  user_id: string;
  fullname: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  medical_history?: string;
  avatar_url?: string;
  created_at: string;
  user: {
    user_id: string;
    username: string;
    email: string;
    phone?: string;
    role: 'patient';
  };
}

export const PatientProfile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullname: '',
    dob: '',
    gender: 'male' as 'male' | 'female' | 'other',
    address: '',
    medical_history: '',
    phone: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getPatientProfile();
      
      if (response.success && response.data) {
        const profileData = response.data;
        setProfile(profileData);
        setFormData({
          fullname: profileData.fullname || '',
          dob: profileData.dob || '',
          gender: profileData.gender || 'male',
          address: profileData.address || '',
          medical_history: profileData.medical_history || '',
          phone: profileData.user?.phone || '',
        });
      } else {
        setError('Không thể tải thông tin hồ sơ');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Lỗi khi tải thông tin hồ sơ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      const response = await apiService.updatePatientProfile(formData);
      
      if (response.success) {
        await loadProfile(); // Reload profile
        setIsEditing(false);
        toast.success('Cập nhật hồ sơ thành công!');
      } else {
        setError(response.message || 'Không thể cập nhật hồ sơ');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Lỗi khi cập nhật hồ sơ');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        fullname: profile.fullname || '',
        dob: profile.dob || '',
        gender: profile.gender || 'male',
        address: profile.address || '',
        medical_history: profile.medical_history || '',
        phone: profile.user?.phone || '',
      });
    }
    setIsEditing(false);
    setError(null);
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

  const handleAvatarUpload = async (file: File) => {
    try {
      const response = await apiService.uploadPatientAvatar(file);
      
      if (response.success && response.data?.avatar_url) {
        await loadProfile(); // Reload profile to get updated avatar
        toast.success('Cập nhật ảnh đại diện thành công!');
      } else {
        toast.error('Không thể cập nhật ảnh đại diện');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Lỗi khi cập nhật ảnh đại diện');
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Đang tải thông tin hồ sơ...</div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <Button onClick={loadProfile}>Thử lại</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
          <p className="text-gray-600 mt-1">Quản lý thông tin cá nhân của bạn</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Thông tin cá nhân
          </CardTitle>
          <CardDescription>
            Thông tin cơ bản và liên hệ
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-primary" />
                )}
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                    variant="outline"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cập nhật ảnh đại diện</DialogTitle>
                    <DialogDescription>
                      Chọn ảnh mới cho hồ sơ của bạn
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleAvatarUpload(file);
                        }
                      }}
                      className="w-full"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{profile?.fullname || 'Chưa cập nhật'}</h3>
              <p className="text-gray-600">{profile?.user?.email}</p>
              <Badge variant="outline" className="mt-1">
                {profile?.user?.username}
              </Badge>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullname">Họ và tên *</Label>
              {isEditing ? (
                <Input
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md">
                  {profile?.fullname || 'Chưa cập nhật'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  {profile?.user?.phone || 'Chưa cập nhật'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Ngày sinh</Label>
              {isEditing ? (
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {formatDate(profile?.dob)}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Giới tính</Label>
              {isEditing ? (
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
              ) : (
                <div className="p-3 bg-gray-50 rounded-md">
                  {getGenderText(profile?.gender)}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ</Label>
            {isEditing ? (
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Nhập địa chỉ"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-md flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                {profile?.address || 'Chưa cập nhật'}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="medical_history">Lịch sử bệnh án</Label>
            {isEditing ? (
              <Textarea
                id="medical_history"
                name="medical_history"
                value={formData.medical_history}
                onChange={handleInputChange}
                placeholder="Mô tả lịch sử bệnh án (nếu có)"
                rows={4}
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-md">
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-gray-400 mt-1" />
                  <div className="text-sm">
                    {profile?.medical_history || 'Chưa có thông tin lịch sử bệnh án'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                <X className="h-4 w-4 mr-2" />
                Hủy
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
