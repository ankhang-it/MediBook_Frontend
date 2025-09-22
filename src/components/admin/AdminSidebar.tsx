import React from 'react';
import { Users, Stethoscope, Building2, Calendar, BarChart3, Settings, LogOut, User } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { LogoIcon } from '../Logo';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  {
    id: 'dashboard',
    label: 'Tổng quan',
    icon: BarChart3,
    description: 'Thống kê tổng quan'
  },
  {
    id: 'patients',
    label: 'Bệnh nhân',
    icon: Users,
    description: 'Quản lý bệnh nhân'
  },
  {
    id: 'doctors',
    label: 'Bác sĩ',
    icon: Stethoscope,
    description: 'Quản lý bác sĩ'
  },
  {
    id: 'specialties',
    label: 'Chuyên khoa',
    icon: Building2,
    description: 'Quản lý chuyên khoa'
  },
  {
    id: 'appointments',
    label: 'Lịch hẹn',
    icon: Calendar,
    description: 'Quản lý lịch hẹn'
  },
  {
    id: 'settings',
    label: 'Cài đặt',
    icon: Settings,
    description: 'Cài đặt hệ thống'
  }
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, onTabChange }) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Đăng xuất thành công!');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đăng xuất');
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-slate-50 to-white flex flex-col h-full shadow-lg">
      {/* Header Section */}
      <div className="p-4 border-b border-emerald-200/50 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="flex flex-col items-center space-y-3">
          <LogoIcon size="lg" className="shadow-lg" />
          <div className="text-center">
            <h2 className="text-sm font-bold text-emerald-800">Phúc Khang</h2>
            <p className="text-xs text-emerald-600">Medical Center</p>
          </div>
        </div>
      </div>

      {/* Main Navigation Section */}
      <div className="flex-1 p-3 space-y-1 overflow-y-auto bg-gradient-to-b from-white to-slate-50/50">
        <div className="mb-3">
          <h3 className="text-xs font-semibold text-emerald-700 uppercase tracking-wider text-center px-2 py-1 bg-emerald-100/50 rounded-lg">
            Quản lý
          </h3>
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-center h-auto p-3 text-center transition-all duration-200 rounded-lg group",
                  isActive 
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg transform scale-105" 
                    : "hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 text-slate-700 hover:text-emerald-700 hover:shadow-md"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <div className="flex flex-col items-center space-y-1 w-full">
                  <Icon className={cn(
                    "h-5 w-5 flex-shrink-0 transition-colors",
                    isActive ? "text-white" : "text-slate-600 group-hover:text-emerald-600"
                  )} />
                  <p className={cn(
                    "text-xs font-medium truncate transition-colors",
                    isActive ? "text-white" : "text-slate-700 group-hover:text-emerald-700"
                  )}>{item.label}</p>
                </div>
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Account Section */}
      <div className="p-3 border-t border-emerald-200/50 bg-gradient-to-br from-emerald-50/50 to-teal-50/50">
        <div className="mb-2">
          <h3 className="text-xs font-semibold text-emerald-700 uppercase tracking-wider text-center px-2 py-1 bg-emerald-100/50 rounded-lg">
            Tài khoản
          </h3>
        </div>
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-center text-slate-700 hover:bg-emerald-100 hover:text-emerald-700 h-8 text-xs rounded-lg transition-all duration-200"
          >
            <User className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-center text-slate-700 hover:bg-emerald-100 hover:text-emerald-700 h-8 text-xs rounded-lg transition-all duration-200"
          >
            <LogOut className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Footer Section */}
      <div className="p-3 border-t border-emerald-200/50 space-y-1 bg-gradient-to-br from-slate-100/50 to-emerald-50/30">
        <Button
          variant="outline"
          className="w-full justify-center text-emerald-600 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 h-7 text-xs rounded-lg transition-all duration-200"
        >
          Docs
        </Button>
        <Button
          className="w-full justify-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white h-7 text-xs rounded-lg transition-all duration-200 shadow-md"
        >
          Pro
        </Button>
      </div>
    </div>
  );
};
