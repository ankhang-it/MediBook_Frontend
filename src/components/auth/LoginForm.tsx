import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Checkbox } from '../ui/checkbox';
import { LogIn, ArrowRight, Heart, Shield, Clock } from 'lucide-react';
import { Logo } from '../Logo';
import { toast } from 'sonner';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const { login, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!formData.email || !formData.password) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      await login(formData.email, formData.password);
      toast.success('Đăng nhập thành công!');
    } catch (error) {
      // Error is handled by AuthContext
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-primary p-4">
      <div className="w-full max-w-6xl mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh]">
          {/* Left Side - Branding */}
          <div className="hidden lg:block space-y-8">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <Logo size="lg" />
              </div>
              
              <h2 className="text-4xl font-extrabold text-foreground mb-4">
                Chào mừng trở lại!
              </h2>
              <p className="text-xl font-semibold text-muted-foreground mb-8">
                Đăng nhập để tiếp tục sử dụng dịch vụ chăm sóc sức khỏe tại Trung tâm Y khoa Phúc Khang
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Bảo mật tuyệt đối</h3>
                  <p className="text-sm font-medium text-muted-foreground">Thông tin cá nhân được mã hóa an toàn</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Đặt lịch 24/7</h3>
                  <p className="text-sm font-medium text-muted-foreground">Đặt lịch khám mọi lúc, mọi nơi</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <Card className="card-primary glass animate-fade-in">
              <CardHeader className="text-center pb-8">
                <div className="flex justify-center mb-6">
                  <Logo size="xl" showText={false} />
                </div>
            <CardTitle className="text-3xl font-extrabold text-primary-dark">
              Đăng nhập
            </CardTitle>
                <CardDescription className="text-base font-semibold">
                  Nhập thông tin để truy cập tài khoản của bạn
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-8 pb-8">
                {error && (
                  <Alert className="mb-6 border-red-200 bg-red-50" variant="destructive">
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-bold">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Nhập email của bạn"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-primary h-12 rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-bold">Mật khẩu</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Nhập mật khẩu"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="input-primary h-12 rounded-xl"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rememberMe"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, rememberMe: !!checked }))}
                      />
                      <Label htmlFor="rememberMe" className="text-sm text-muted-foreground">
                        Ghi nhớ đăng nhập
                      </Label>
                    </div>
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm text-primary hover:text-primary/80 p-0 h-auto"
                      onClick={() => {
                        toast.info('Tính năng quên mật khẩu đang được phát triển');
                      }}
                    >
                      Quên mật khẩu?
                    </Button>
                  </div>

              <Button
                type="submit"
                className="btn-primary w-full h-12 font-semibold rounded-xl"
                disabled={isLoading}
              >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full w-5 h-5 border-b-2 border-white mr-3" />
                        Đang đăng nhập...
                      </>
                    ) : (
                      <>
                        Đăng nhập
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-8 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-muted" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-muted-foreground">Hoặc</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-6">
                    Chưa có tài khoản?{' '}
                    <Button
                      variant="link"
                      className="p-0 h-auto font-semibold text-primary hover:text-primary/80"
                      onClick={onSwitchToRegister}
                    >
                      Đăng ký ngay
                    </Button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
