import React, { useState, useEffect } from 'react';
import { AppointmentBooking } from '../components/AppointmentBooking';
import { doctors } from '../data/mockData';
import { TimeSlot, Appointment } from '../types/medical';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { apiService } from '../services/api';

export const BookingPage: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [appointmentData, setAppointmentData] = useState<Omit<Appointment, 'id' | 'status'> | null>(null);

  const selectedDoctorData = doctors.find(d => d.id === doctorId);

  const handleSelectSlot = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleBookAppointment = async (appointment: Omit<Appointment, 'id' | 'status'>) => {
    try {
      // Create appointment via API
      const response = await apiService.createAppointment({
        doctor_id: doctorId,
        date: appointment.date,
        time: appointment.time,
        symptoms: appointment.symptoms,
        notes: appointment.symptoms, // Using symptoms as notes for now
      });

      if (response.success) {
        setAppointmentData(appointment);
        navigate('/payment', { state: { appointment, doctorName: selectedDoctorData?.name } });
        toast.success('Đặt lịch thành công! Vui lòng thanh toán để hoàn tất.');
      } else {
        toast.error(response.message || 'Không thể đặt lịch hẹn');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Lỗi khi đặt lịch hẹn');
    }
  };

  if (!selectedDoctorData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-500">Không tìm thấy bác sĩ này.</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-primary hover:underline">Quay lại trang chủ</button>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <AppointmentBooking
        doctor={selectedDoctorData}
        selectedSlot={selectedSlot}
        onSelectSlot={handleSelectSlot}
        onBookAppointment={handleBookAppointment}
      />
    </main>
  );
};
