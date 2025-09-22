import React from 'react';
import { DoctorList } from '../components/DoctorList';
import { doctors, departments } from '../data/mockData';
import { useParams, useNavigate } from 'react-router-dom';

export const DoctorsPage: React.FC = () => {
  const { departmentId } = useParams<{ departmentId: string }>();
  const navigate = useNavigate();

  const selectedDepartmentData = departments.find(d => d.id === departmentId);
  const departmentDoctors = doctors.filter(d => d.departmentId === departmentId);

  const handleSelectDoctor = (doctorId: string) => {
    navigate(`/booking/${doctorId}`);
  };

  if (!selectedDepartmentData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-500">Không tìm thấy khoa này.</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-primary hover:underline">Quay lại trang chủ</button>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <DoctorList
        doctors={departmentDoctors}
        selectedDoctor={null}
        onSelectDoctor={handleSelectDoctor}
      />
    </main>
  );
};