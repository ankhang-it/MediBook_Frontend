import { Hospital, Phone, Mail, Clock } from 'lucide-react';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between py-2 text-sm text-muted-foreground border-b">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>Hotline: 1900 1234</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>info@hospital.vn</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>24/7 cấp cứu</span>
            </div>
          </div>
        </div>
        
        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg">
              <Hospital className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl text-primary">Bệnh viện Đa khoa Trung ương</h1>
              <p className="text-sm text-muted-foreground">Chăm sóc sức khỏe toàn diện</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline">Tra cứu kết quả</Button>
            <Button>Đặt lịch khám</Button>
          </div>
        </div>
      </div>
    </header>
  );
}