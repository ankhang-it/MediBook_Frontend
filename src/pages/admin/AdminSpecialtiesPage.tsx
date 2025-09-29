import React from 'react';
import { SpecialtyManagement } from '../../components/admin/SpecialtyManagement';

export const AdminSpecialtiesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <SpecialtyManagement />
      </div>
    </div>
  );
};
