import React from 'react';
import { Hospital, Phone, Mail, Clock, User, LogOut, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Logo } from './Logo';
import { toast } from 'sonner';

export function Header() {
  const { user, profile, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Đăng xuất thành công!');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đăng xuất');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between py-2 text-sm font-semibold text-muted-foreground border-b">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>Hotline: 0236 3 999 999</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>info@phuckhang.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>24/7 cấp cứu</span>
            </div>
          </div>
        </div>
        
        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Logo size="md" />
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button variant="outline">Tra cứu kết quả</Button>
                <Button>Đặt lịch khám</Button>
                
                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={user?.username} />
                        <AvatarFallback>
                          {user?.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{profile?.fullname || user?.username}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user?.email}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {user?.role === 'patient' ? 'Bệnh nhân' : user?.role === 'doctor' ? 'Bác sĩ' : 'Quản trị viên'}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Hồ sơ cá nhân</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Cài đặt</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="outline">Tra cứu kết quả</Button>
                <Button>Đặt lịch khám</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
