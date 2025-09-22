import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { DashboardOverview } from '../components/admin/DashboardOverview';
import { PatientManagement } from '../components/admin/PatientManagement';
import { DoctorManagement } from '../components/admin/DoctorManagement';
import { SpecialtyManagement } from '../components/admin/SpecialtyManagement';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Search, Bell, Settings, Star, Menu, X, User, LogOut } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'patients':
        return <PatientManagement />;
      case 'doctors':
        return <DoctorManagement />;
      case 'specialties':
        return <SpecialtyManagement />;
      case 'appointments':
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900">Quản lý Lịch hẹn</h3>
            <p className="text-gray-500 mt-2">Tính năng đang được phát triển</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900">Cài đặt Hệ thống</h3>
            <p className="text-gray-500 mt-2">Tính năng đang được phát triển</p>
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'patients': return 'Quản lý Bệnh nhân';
      case 'doctors': return 'Quản lý Bác sĩ';
      case 'specialties': return 'Quản lý Chuyên khoa';
      case 'appointments': return 'Quản lý Lịch hẹn';
      case 'settings': return 'Cài đặt Hệ thống';
      default: return 'Dashboard';
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar - 1/6 of screen width */}
      <div className="w-1/6 h-screen bg-white shadow-lg border-r border-gray-200">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Main Content Area - 6/7 of screen height */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PK</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Pages / </span>
                  <span className="text-sm font-medium text-gray-900">{getPageTitle()}</span>
                </div>
              </div>
            </div>

            {/* Center Section - Search */}
            <div className="flex-1 max-w-xs mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white h-9 text-sm"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              <Button size="sm" className="bg-pink-500 hover:bg-pink-600 text-white">
                Online Builder
              </Button>
              
              <div className="flex items-center space-x-1 text-gray-600">
                <Star className="h-4 w-4" />
                <span className="text-sm font-medium">11,178</span>
              </div>
              
              <Button variant="ghost" size="sm">
                <Settings className="h-5 w-5" />
              </Button>
              
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500">
                  3
                </Badge>
              </Button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900">{user?.username}</div>
                  <div className="text-xs text-gray-500">{user?.role}</div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6">
            <div className="animate-fade-in">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
