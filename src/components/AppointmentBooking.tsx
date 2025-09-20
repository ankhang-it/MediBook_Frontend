import { useState } from 'react';
import { Doctor, TimeSlot, Appointment } from '../types/medical';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Calendar, Clock, User, Phone, Mail, FileText } from 'lucide-react';
import { formatDate, formatCurrency } from '../data/mockData';

interface AppointmentBookingProps {
  doctor: Doctor;
  selectedSlot: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void;
  onBookAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => void;
}

export function AppointmentBooking({
  doctor,
  selectedSlot,
  onSelectSlot,
  onBookAppointment
}: AppointmentBookingProps) {
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    phone: '',
    email: '',
    symptoms: ''
  });

  // Nhóm các slot theo ngày
  const slotsByDate = doctor.availableSlots
    .filter(slot => slot.available)
    .reduce((acc, slot) => {
      if (!acc[slot.date]) {
        acc[slot.date] = [];
      }
      acc[slot.date].push(slot);
      return acc;
    }, {} as Record<string, TimeSlot[]>);

  const dates = Object.keys(slotsByDate).sort().slice(0, 7); // Hiển thị 7 ngày đầu

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !patientInfo.name || !patientInfo.phone || !patientInfo.email) {
      return;
    }

    onBookAppointment({
      patientName: patientInfo.name,
      patientPhone: patientInfo.phone,
      patientEmail: patientInfo.email,
      doctorId: doctor.id,
      departmentId: doctor.departmentId,
      date: selectedSlot.date,
      time: selectedSlot.time,
      symptoms: patientInfo.symptoms,
      consultationFee: doctor.consultationFee
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl">Đặt lịch khám</h2>
        <p className="text-muted-foreground mt-2">
          Chọn thời gian và điền thông tin để đặt lịch khám
        </p>
      </div>

      {/* Thông tin bác sĩ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Bác sĩ được chọn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg">{doctor.name}</h3>
              <p className="text-muted-foreground">{doctor.specialization}</p>
              <p className="text-primary mt-1">
                Phí khám: {formatCurrency(doctor.consultationFee)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chọn thời gian */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Chọn thời gian khám
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {dates.map(date => (
            <div key={date}>
              <h4 className="mb-3">{formatDate(date)}</h4>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {slotsByDate[date].map(slot => (
                  <Button
                    key={slot.id}
                    variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSelectSlot(slot)}
                    className="text-xs"
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Thông tin bệnh nhân */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Thông tin bệnh nhân
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên *</Label>
                <Input
                  id="name"
                  placeholder="Nhập họ và tên"
                  value={patientInfo.name}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại *</Label>
                <Input
                  id="phone"
                  placeholder="Nhập số điện thoại"
                  value={patientInfo.phone}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Nhập địa chỉ email"
                value={patientInfo.email}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="symptoms">Triệu chứng và mô tả</Label>
              <Textarea
                id="symptoms"
                placeholder="Mô tả triệu chứng, tình trạng sức khỏe..."
                value={patientInfo.symptoms}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, symptoms: e.target.value }))}
                rows={4}
              />
            </div>

            {/* Tóm tắt đặt lịch */}
            {selectedSlot && (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <h4 className="text-sm">Tóm tắt lịch khám:</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Bác sĩ:</span>
                    <span>{doctor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thời gian:</span>
                    <span>{formatDate(selectedSlot.date)} - {selectedSlot.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí khám:</span>
                    <span className="text-primary">{formatCurrency(doctor.consultationFee)}</span>
                  </div>
                </div>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!selectedSlot || !patientInfo.name || !patientInfo.phone || !patientInfo.email}
            >
              Tiếp tục thanh toán
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}