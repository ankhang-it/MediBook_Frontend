import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, Clock, User, Stethoscope, MapPin, Phone, Mail, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { apiService } from '../services/api';
import { toast } from 'sonner';

interface Appointment {
  appointment_id: string;
  patient_id: string;
  doctor_id: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  doctor?: {
    doctor_id: string;
    fullname: string;
    specialty?: {
      specialty_id: string;
      name: string;
    };
  };
}

export const PatientAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getPatientAppointments();
      
      if (response.success && response.data) {
        setAppointments(response.data.data || []);
      } else {
        setError('Không thể tải danh sách lịch hẹn');
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      setError('Lỗi khi tải danh sách lịch hẹn');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) {
      try {
        const response = await apiService.cancelAppointment(appointmentId);
        
        if (response.success) {
          await loadAppointments(); // Reload appointments
          toast.success('Hủy lịch hẹn thành công!');
        } else {
          toast.error(response.message || 'Không thể hủy lịch hẹn');
        }
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        toast.error('Lỗi khi hủy lịch hẹn');
      }
    }
  };

  const upcomingAppointments = appointments.filter(apt => 
    apt.status === 'pending' || apt.status === 'confirmed'
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastAppointments = appointments.filter(apt => 
    apt.status === 'completed' || apt.status === 'cancelled'
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Đang tải danh sách lịch hẹn...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <Button onClick={loadAppointments}>Thử lại</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lịch hẹn của tôi</h1>
        <p className="text-gray-600 mt-1">Quản lý các lịch hẹn khám bệnh</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng lịch hẹn</p>
                <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Sắp tới</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingAppointments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Đã hoàn thành</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(apt => apt.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Lịch hẹn sắp tới
            </CardTitle>
            <CardDescription>
              Các lịch hẹn đang chờ xác nhận hoặc đã được xác nhận
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.appointment_id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {appointment.doctor?.fullname || 'Bác sĩ'}
                        </h3>
                        <Badge className={getStatusColor(appointment.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(appointment.status)}
                            {getStatusText(appointment.status)}
                          </div>
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(appointment.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(appointment.time)}</span>
                        </div>
                        {appointment.doctor?.specialty && (
                          <div className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4" />
                            <span>{appointment.doctor.specialty.name}</span>
                          </div>
                        )}
                      </div>
                      
                      {appointment.notes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                          <strong>Ghi chú:</strong> {appointment.notes}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {appointment.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelAppointment(appointment.appointment_id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Hủy lịch
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Lịch hẹn đã hoàn thành
            </CardTitle>
            <CardDescription>
              Lịch sử các lịch hẹn đã hoàn thành hoặc bị hủy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pastAppointments.map((appointment) => (
                <div key={appointment.appointment_id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {appointment.doctor?.fullname || 'Bác sĩ'}
                        </h3>
                        <Badge className={getStatusColor(appointment.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(appointment.status)}
                            {getStatusText(appointment.status)}
                          </div>
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(appointment.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(appointment.time)}</span>
                        </div>
                        {appointment.doctor?.specialty && (
                          <div className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4" />
                            <span>{appointment.doctor.specialty.name}</span>
                          </div>
                        )}
                      </div>
                      
                      {appointment.notes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                          <strong>Ghi chú:</strong> {appointment.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {appointments.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có lịch hẹn nào</h3>
            <p className="text-gray-600 mb-4">
              Bạn chưa có lịch hẹn khám bệnh nào. Hãy đặt lịch để bắt đầu sử dụng dịch vụ.
            </p>
            <Button>
              Đặt lịch khám
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
