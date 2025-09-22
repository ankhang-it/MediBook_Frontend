import React from 'react';
import { SuccessPage as SuccessPageComponent } from '../components/SuccessPage';
import { useLocation, useNavigate } from 'react-router-dom';
import { Appointment } from '../types/medical';

export const SuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { appointment, doctorName } = location.state as { appointment: Omit<Appointment, 'id' | 'status'>; doctorName: string };

  const handleStartOver = () => {
    navigate('/');
  };

  if (!appointment || !doctorName) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-500">Không có thông tin đặt lịch thành công.</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-primary hover:underline">Quay lại trang chủ</button>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SuccessPageComponent
        appointment={appointment}
        doctorName={doctorName}
        onStartOver={handleStartOver}
      />
    </main>
  );
};