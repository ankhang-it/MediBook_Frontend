import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Calendar, Clock, DollarSign, Users, CalendarDays, CheckCircle, AlertCircle } from 'lucide-react';
import { Layout } from '../components/Layout';

interface Appointment {
  id: string;
  patient_name: string;
  patient_phone: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  fee: number;
  notes?: string;
}

interface TimeSlot {
  id: string;
  date: string;
  time: string;
  is_available: boolean;
}

export const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Mock data - sẽ thay thế bằng API calls
  useEffect(() => {
    // Mock appointments
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        patient_name: 'Nguyễn Văn A',
        patient_phone: '0123456789',
        date: '2024-01-15',
        time: '09:00',
        status: 'confirmed',
        fee: 500000,
        notes: 'Khám tim mạch'
      },
      {
        id: '2',
        patient_name: 'Trần Thị B',
        patient_phone: '0987654321',
        date: '2024-01-15',
        time: '10:30',
        status: 'pending',
        fee: 500000,
        notes: 'Tái khám huyết áp'
      },
      {
        id: '3',
        patient_name: 'Lê Văn C',
        patient_phone: '0369852147',
        date: '2024-01-16',
        time: '14:00',
        status: 'completed',
        fee: 500000,
        notes: 'Khám tổng quát'
      }
    ];

    // Mock time slots
    const mockTimeSlots: TimeSlot[] = [
      { id: '1', date: '2024-01-15', time: '08:00', is_available: true },
      { id: '2', date: '2024-01-15', time: '08:30', is_available: false },
      { id: '3', date: '2024-01-15', time: '09:00', is_available: false },
      { id: '4', date: '2024-01-15', time: '09:30', is_available: true },
      { id: '5', date: '2024-01-15', time: '10:00', is_available: true },
      { id: '6', date: '2024-01-15', time: '10:30', is_available: false },
    ];

    setAppointments(mockAppointments);
    setTimeSlots(mockTimeSlots);
    setTotalRevenue(1500000); // Mock total revenue
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const todayAppointments = appointments.filter(apt => apt.date === selectedDate);
  const availableSlots = timeSlots.filter(slot => slot.date === selectedDate && slot.is_available);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-primary p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-foreground mb-2">
              Dashboard Bác sĩ
            </h1>
            <p className="text-lg font-semibold text-muted-foreground">
              Chào mừng, Bác sĩ {user?.username}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="card-primary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalRevenue.toLocaleString('vi-VN')} VNĐ</div>
                <p className="text-xs text-muted-foreground">Tháng này</p>
              </CardContent>
            </Card>

            <Card className="card-primary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lịch hôm nay</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayAppointments.length}</div>
                <p className="text-xs text-muted-foreground">Cuộc hẹn</p>
              </CardContent>
            </Card>

            <Card className="card-primary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lịch trống</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{availableSlots.length}</div>
                <p className="text-xs text-muted-foreground">Khung giờ trống</p>
              </CardContent>
            </Card>

            <Card className="card-primary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bệnh nhân</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{appointments.length}</div>
                <p className="text-xs text-muted-foreground">Tổng số lịch</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Appointments */}
            <Card className="card-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Lịch hẹn hôm nay
                </CardTitle>
                <CardDescription>
                  Danh sách các cuộc hẹn trong ngày {selectedDate}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayAppointments.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      Không có lịch hẹn nào trong ngày
                    </p>
                  ) : (
                    todayAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{appointment.patient_name}</h4>
                            <Badge variant="outline" className={getStatusColor(appointment.status)}>
                              {getStatusText(appointment.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {appointment.time} - {appointment.patient_phone}
                          </p>
                          {appointment.notes && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {appointment.notes}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">
                            {appointment.fee.toLocaleString('vi-VN')} VNĐ
                          </p>
                          <div className="flex gap-2 mt-2">
                            {appointment.status === 'pending' && (
                              <Button size="sm" variant="outline">
                                Xác nhận
                              </Button>
                            )}
                            {appointment.status === 'confirmed' && (
                              <Button size="sm" variant="outline">
                                Hoàn thành
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Available Time Slots */}
            <Card className="card-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Lịch trống
                </CardTitle>
                <CardDescription>
                  Các khung giờ còn trống trong ngày {selectedDate}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.length === 0 ? (
                    <p className="col-span-3 text-center text-muted-foreground py-4">
                      Không có lịch trống nào
                    </p>
                  ) : (
                    availableSlots.map((slot) => (
                      <Button
                        key={slot.id}
                        variant="outline"
                        className="h-12 text-sm"
                        onClick={() => {
                          // Handle slot selection
                          console.log('Selected slot:', slot);
                        }}
                      >
                        {slot.time}
                      </Button>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* All Appointments */}
          <Card className="card-primary mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Tất cả lịch hẹn
              </CardTitle>
              <CardDescription>
                Danh sách tất cả các cuộc hẹn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{appointment.patient_name}</h4>
                        <Badge variant="outline" className={getStatusColor(appointment.status)}>
                          {getStatusText(appointment.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {appointment.date} - {appointment.time} - {appointment.patient_phone}
                      </p>
                      {appointment.notes && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {appointment.notes}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">
                        {appointment.fee.toLocaleString('vi-VN')} VNĐ
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
