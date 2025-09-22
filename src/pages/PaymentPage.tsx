import React from 'react';
import { PaymentForm } from '../components/PaymentForm';
import { useLocation, useNavigate } from 'react-router-dom';
import { Appointment } from '../types/medical';
import { toast } from 'sonner';

export const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { appointment, doctorName } = location.state as { appointment: Omit<Appointment, 'id' | 'status'>; doctorName: string };

  const handlePaymentComplete = () => {
    toast.success('Thanh toán thành công!');
    navigate('/success', { state: { appointment, doctorName } });
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page (booking)
  };

  if (!appointment || !doctorName) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-500">Không có thông tin thanh toán.</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-primary hover:underline">Quay lại trang chủ</button>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PaymentForm
        appointment={appointment}
        doctorName={doctorName}
        onPaymentComplete={handlePaymentComplete}
        onBack={handleBack}
      />
    </main>
  );
};