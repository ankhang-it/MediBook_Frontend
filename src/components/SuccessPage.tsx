import React from 'react';
import { CheckCircle, Calendar, Clock, User, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { formatDate, formatCurrency } from '../data/mockData';

interface SuccessPageProps {
  appointment: {
    patientName: string;
    patientPhone: string;
    patientEmail: string;
    date: string;
    time: string;
    consultationFee: number;
  };
  doctorName: string;
  onStartOver: () => void;
}

export function SuccessPage({ appointment, doctorName, onStartOver }: SuccessPageProps) {
  const appointmentId = `BV${Date.now().toString().slice(-6)}`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success message */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>
        
        <div>
          <h2 className="text-3xl text-green-600">Đặt lịch thành công!</h2>
          <p className="text-muted-foreground mt-2">
            Lịch khám của bạn đã được xác nhận. Thông tin chi tiết đã được gửi qua email.
          </p>
        </div>
        
        <Badge variant="secondary" className="text-sm px-4 py-2">
          Mã đặt lịch: {appointmentId}
        </Badge>
      </div>

      {/* Appointment details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Thông tin lịch khám
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Bác sĩ</Label>
                <p className="flex items-center gap-2 mt-1">
                  <User className="w-4 h-4" />
                  {doctorName}
                </p>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Thời gian khám</Label>
                <p className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4" />
                  {formatDate(appointment.date)} - {appointment.time}
                </p>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Phí khám</Label>
                <p className="text-lg text-primary mt-1">
                  {formatCurrency(appointment.consultationFee)}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Bệnh nhân</Label>
                <p className="mt-1">{appointment.patientName}</p>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Số điện thoại</Label>
                <p className="flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4" />
                  {appointment.patientPhone}
                </p>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Email</Label>
                <p className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {appointment.patientEmail}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Lưu ý quan trọng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-primary-foreground">1</span>
              </div>
              <div>
                <p>Vui lòng có mặt tại bệnh viện <strong>trước 15 phút</strong> so với giờ hẹn để làm thủ tục.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-primary-foreground">2</span>
              </div>
              <div>
                <p>Mang theo <strong>CMND/CCCD</strong> và các <strong>kết quả xét nghiệm</strong> liên quan (nếu có).</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-primary-foreground">3</span>
              </div>
              <div>
                <p>Nếu cần thay đổi lịch hẹn, vui lòng liên hệ <strong>hotline 1900 1234</strong> trước 24 giờ.</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p><strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP.HCM</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Tầng 2, Khoa Khám bệnh - Phòng số sẽ được thông báo tại quầy lễ tân
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button variant="outline" className="flex-1">
          In thông tin
        </Button>
        <Button onClick={onStartOver} className="flex-1">
          Đặt lịch khám khác
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return <span className={className}>{children}</span>;
}