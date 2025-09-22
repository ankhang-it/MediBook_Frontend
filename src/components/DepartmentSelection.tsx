import React from 'react';
import { Department } from '../types/medical';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Heart, Brain, Baby, Sparkles, Stethoscope, Scissors } from 'lucide-react';

const iconMap = {
  Heart,
  Brain, 
  Baby,
  Sparkles,
  Stethoscope,
  Scissors
};

interface DepartmentSelectionProps {
  departments: Department[];
  selectedDepartment: string | null;
  onSelectDepartment: (departmentId: string) => void;
}

export function DepartmentSelection({
  departments,
  selectedDepartment,
  onSelectDepartment
}: DepartmentSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold">Chọn khoa khám</h2>
        <p className="text-muted-foreground font-semibold mt-2">
          Vui lòng chọn khoa phù hợp với triệu chứng của bạn
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => {
          const IconComponent = iconMap[department.icon as keyof typeof iconMap];
          return (
            <Card 
              key={department.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedDepartment === department.id 
                  ? 'ring-2 ring-primary shadow-lg' 
                  : ''
              }`}
              onClick={() => onSelectDepartment(department.id)}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-xl font-extrabold">{department.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center leading-relaxed font-semibold">
                  {department.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
