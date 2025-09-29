import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { DashboardOverview } from '../components/admin/DashboardOverview';
import { Button } from '../components/ui/button';
import { User, LogOut, Home, Users, Stethoscope, Building2, Calendar } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/admin' },
    { id: 'users', label: 'Quản lý Người dùng', icon: Users, path: '/admin/users' },
    { id: 'doctors', label: 'Quản lý Bác sĩ', icon: Stethoscope, path: '/admin/doctors' },
    { id: 'patients', label: 'Quản lý Bệnh nhân', icon: User, path: '/admin/patients' },
    { id: 'specialties', label: 'Quản lý Chuyên khoa', icon: Building2, path: '/admin/specialties' },
    { id: 'appointments', label: 'Quản lý Lịch hẹn', icon: Calendar, path: '/admin/appointments' },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
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
      {/* Left Sidebar */}
      <div className="w-64 h-screen bg-white shadow-lg border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MB</span>
            </div>
            <span className="text-xl font-bold text-gray-900">MediBook</span>
          </div>
          
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
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
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{user?.username}</div>
                  <div className="text-gray-500">Admin</div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <DashboardOverview />
        </div>
      </div>
    </div>
  );
};
