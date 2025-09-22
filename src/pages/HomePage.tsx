import React from 'react';
import { DepartmentSelection } from '../components/DepartmentSelection';
import { departments } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectDepartment = (departmentId: string) => {
    navigate(`/doctors/${departmentId}`);
  };

  return (
    <>
      {/* Hero Section - Re-added for consistency with original App.tsx */}
      <div className="relative bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 py-16">
        <div className="absolute inset-0 overflow-hidden">
          {/* ImageWithFallback component would go here if needed */}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">
            Đặt lịch khám bệnh trực tuyến
          </h1>
          <p className="text-xl font-semibold text-muted-foreground max-w-2xl mx-auto">
            Hệ thống đặt lịch thông minh, tiện lợi và nhanh chóng.
            Chọn bác sĩ phù hợp và đặt lịch khám chỉ trong vài phút.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <DepartmentSelection
          departments={departments}
          selectedDepartment={null} // No initial selection on home page
          onSelectDepartment={handleSelectDepartment}
        />
      </main>
    </>
  );
};