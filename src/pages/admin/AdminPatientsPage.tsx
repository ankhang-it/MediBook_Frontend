import React from 'react';
import { PatientManagement } from '../../components/admin/PatientManagement';

export const AdminPatientsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <PatientManagement />
      </div>
    </div>
  );
};
