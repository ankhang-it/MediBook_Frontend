import { useState } from 'react';
import { Header } from './components/Header';
import { DepartmentSelection } from './components/DepartmentSelection';
import { DoctorList } from './components/DoctorList';
import { AppointmentBooking } from './components/AppointmentBooking';
import { PaymentForm } from './components/PaymentForm';
import { SuccessPage } from './components/SuccessPage';
import { departments, doctors } from './data/mockData';
import { TimeSlot, Appointment } from './types/medical';
import { Toaster } from './components/ui/sonner';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

type Step = 'department' | 'doctor' | 'booking' | 'payment' | 'success';

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>('department');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [appointmentData, setAppointmentData] = useState<Omit<Appointment, 'id' | 'status'> | null>(null);

  const selectedDepartmentData = departments.find(d => d.id === selectedDepartment);
  const departmentDoctors = doctors.filter(d => d.departmentId === selectedDepartment);
  const selectedDoctorData = doctors.find(d => d.id === selectedDoctor);

  const handleSelectDepartment = (departmentId: string) => {
    setSelectedDepartment(departmentId);
    setSelectedDoctor(null);
    setSelectedSlot(null);
    setCurrentStep('doctor');
  };

  const handleSelectDoctor = (doctorId: string) => {
    setSelectedDoctor(doctorId);
    setSelectedSlot(null);
    setCurrentStep('booking');
  };

  const handleSelectSlot = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleBookAppointment = (appointment: Omit<Appointment, 'id' | 'status'>) => {
    setAppointmentData(appointment);
    setCurrentStep('payment');
  };

  const handlePaymentComplete = () => {
    setCurrentStep('success');
  };

  const handleStartOver = () => {
    setCurrentStep('department');
    setSelectedDepartment(null);
    setSelectedDoctor(null);
    setSelectedSlot(null);
    setAppointmentData(null);
  };

  const handleBack = () => {
    if (currentStep === 'payment') {
      setCurrentStep('booking');
    } else if (currentStep === 'booking') {
      setCurrentStep('doctor');
    } else if (currentStep === 'doctor') {
      setCurrentStep('department');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 py-16">
        <div className="absolute inset-0 overflow-hidden">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1643055419804-397de33fe331?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3NwaXRhbCUyMGJ1aWxkaW5nJTIwaGVhbHRoY2FyZXxlbnwxfHx8fDE3NTgzMDk1MDh8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Hospital building"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl text-primary mb-4">
            Đặt lịch khám bệnh trực tuyến
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hệ thống đặt lịch thông minh, tiện lợi và nhanh chóng. 
            Chọn bác sĩ phù hợp và đặt lịch khám chỉ trong vài phút.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {currentStep === 'department' && (
          <DepartmentSelection
            departments={departments}
            selectedDepartment={selectedDepartment}
            onSelectDepartment={handleSelectDepartment}
          />
        )}

        {currentStep === 'doctor' && (
          <DoctorList
            doctors={departmentDoctors}
            selectedDoctor={selectedDoctor}
            onSelectDoctor={handleSelectDoctor}
          />
        )}

        {currentStep === 'booking' && selectedDoctorData && (
          <AppointmentBooking
            doctor={selectedDoctorData}
            selectedSlot={selectedSlot}
            onSelectSlot={handleSelectSlot}
            onBookAppointment={handleBookAppointment}
          />
        )}

        {currentStep === 'payment' && appointmentData && selectedDoctorData && (
          <PaymentForm
            appointment={appointmentData}
            doctorName={selectedDoctorData.name}
            onPaymentComplete={handlePaymentComplete}
            onBack={handleBack}
          />
        )}

        {currentStep === 'success' && appointmentData && selectedDoctorData && (
          <SuccessPage
            appointment={appointmentData}
            doctorName={selectedDoctorData.name}
            onStartOver={handleStartOver}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-muted py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3>Bệnh viện Đa khoa Trung ương</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Chăm sóc sức khỏe toàn diện với đội ngũ bác sĩ chuyên nghiệp và trang thiết bị hiện đại.
              </p>
            </div>
            
            <div>
              <h4>Liên hệ</h4>
              <div className="text-sm text-muted-foreground space-y-1 mt-2">
                <p>Hotline: 1900 1234</p>
                <p>Email: info@hospital.vn</p>
                <p>Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</p>
              </div>
            </div>
            
            <div>
              <h4>Giờ làm việc</h4>
              <div className="text-sm text-muted-foreground space-y-1 mt-2">
                <p>Thứ 2 - Thứ 6: 7:00 - 17:00</p>
                <p>Thứ 7: 7:00 - 12:00</p>
                <p>Cấp cứu: 24/7</p>
              </div>
            </div>
            
            <div>
              <h4>Dịch vụ</h4>
              <div className="text-sm text-muted-foreground space-y-1 mt-2">
                <p>Khám tổng quát</p>
                <p>Khám chuyên khoa</p>
                <p>Xét nghiệm</p>
                <p>Chẩn đoán hình ảnh</p>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Bệnh viện Đa khoa Trung ương. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}