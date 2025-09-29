import React from 'react';
import { DoctorManagement } from '../../components/admin/DoctorManagement';

export const AdminDoctorsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <DoctorManagement />
      </div>
    </div>
  );
};
