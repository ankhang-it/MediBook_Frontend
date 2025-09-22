import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Toaster } from './ui/sonner';

interface LayoutProps {
  children: ReactNode;
  hideHeaderAndFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, hideHeaderAndFooter = false }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {!hideHeaderAndFooter && <Header />}

      <div className="flex-grow">
        {children}
      </div>

      {!hideHeaderAndFooter && (
        <footer className="bg-muted py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-extrabold">Trung tâm Y khoa Phúc Khang Đà Nẵng</h3>
                <p className="text-sm font-semibold text-muted-foreground mt-2">
                  Chăm sóc sức khỏe toàn diện với đội ngũ bác sĩ chuyên nghiệp và trang thiết bị hiện đại.
                  Hơn 11 năm kinh nghiệm phục vụ cộng đồng.
                </p>
              </div>

              <div>
                <h4 className="font-bold">Liên hệ</h4>
                <div className="text-sm font-semibold text-muted-foreground space-y-1 mt-2">
                  <p>Hotline: 0236 3 999 999</p>
                  <p>Email: info@phuckhang.com</p>
                  <p>Địa chỉ: 123 Đường Lê Duẩn, Hải Châu, Đà Nẵng</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold">Giờ làm việc</h4>
                <div className="text-sm font-semibold text-muted-foreground space-y-1 mt-2">
                  <p>Thứ 2 - Thứ 6: 7:00 - 17:00</p>
                  <p>Thứ 7: 7:00 - 12:00</p>
                  <p>Cấp cứu: 24/7</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold">Dịch vụ</h4>
                <div className="text-sm font-semibold text-muted-foreground space-y-1 mt-2">
                  <p>Khám tổng quát</p>
                  <p>Khám chuyên khoa</p>
                  <p>Xét nghiệm</p>
                  <p>Chẩn đoán hình ảnh</p>
                </div>
              </div>
            </div>

            <div className="border-t mt-8 pt-8 text-center text-sm font-semibold text-muted-foreground">
              <p>&copy; 2024 Trung tâm Y khoa Phúc Khang Đà Nẵng. Tất cả quyền được bảo lưu.</p>
            </div>
          </div>
        </footer>
      )}
      <Toaster />
    </div>
  );
};