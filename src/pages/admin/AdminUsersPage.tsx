import React from 'react';
import { DashboardOverview } from '../../components/admin/DashboardOverview';

export const AdminUsersPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <DashboardOverview />
      </div>
    </div>
  );
};
