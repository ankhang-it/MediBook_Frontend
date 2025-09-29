import React from 'react';

export const AdminAppointmentsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Quản lý Lịch hẹn</h2>
              <p className="text-gray-600 mt-1">Quản lý lịch hẹn khám bệnh</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center py-8">
              <p className="text-gray-500">Chức năng quản lý lịch hẹn đang được phát triển...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
