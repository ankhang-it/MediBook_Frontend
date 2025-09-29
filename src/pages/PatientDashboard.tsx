import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/Layout';
import { PatientProfile } from '../components/PatientProfile';
import { PatientAppointments } from '../components/PatientAppointments';
import { PatientMedicalHistory } from '../components/PatientMedicalHistory';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { User, Calendar, FileText, Home, LogOut } from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'profile', label: 'Hồ sơ cá nhân', icon: User },
    { id: 'appointments', label: 'Lịch hẹn', icon: Calendar },
    { id: 'medical-history', label: 'Lịch sử bệnh án', icon: FileText },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <PatientProfile />;
      case 'appointments':
        return <PatientAppointments />;
      case 'medical-history':
        return <PatientMedicalHistory />;
      case 'dashboard':
      default:
        return <DashboardOverview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white shadow-sm border-b">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Dashboard Bệnh nhân</h1>
                  <p className="text-gray-600 mt-1">Chào mừng, {user?.username}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Đăng xuất
                </Button>
              </div>
            </div>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
              <nav className="p-4">
                <div className="space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          isActive
                            ? 'bg-primary text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Dashboard Overview Component
const DashboardOverview: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Chào mừng trở lại!
          </CardTitle>
          <CardDescription>
            Quản lý thông tin sức khỏe và lịch hẹn của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{user?.username}</h3>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500">Bệnh nhân</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('profile')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Hồ sơ cá nhân</h3>
                <p className="text-sm text-gray-600">Cập nhật thông tin cá nhân</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('appointments')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Lịch hẹn</h3>
                <p className="text-sm text-gray-600">Xem và quản lý lịch hẹn</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('medical-history')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Lịch sử bệnh án</h3>
                <p className="text-sm text-gray-600">Xem lịch sử khám bệnh</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
          <CardDescription>
            Các hoạt động và cập nhật mới nhất
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Đăng nhập thành công</p>
                <p className="text-xs text-gray-500">Vừa xong</p>
              </div>
            </div>
            <div className="text-center py-8 text-gray-500">
              <p>Chưa có hoạt động nào khác</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
