import { Doctor } from '../types/medical';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Star, Calendar, Languages, GraduationCap } from 'lucide-react';
import { formatCurrency } from '../data/mockData';

interface DoctorListProps {
  doctors: Doctor[];
  selectedDoctor: string | null;
  onSelectDoctor: (doctorId: string) => void;
}

export function DoctorList({ doctors, selectedDoctor, onSelectDoctor }: DoctorListProps) {
  if (doctors.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Vui lòng chọn khoa để xem danh sách bác sĩ</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl">Chọn bác sĩ</h2>
        <p className="text-muted-foreground mt-2">
          Danh sách bác sĩ có kinh nghiệm trong khoa đã chọn
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {doctors.map((doctor) => {
          const availableSlots = doctor.availableSlots.filter(slot => slot.available).length;
          
          return (
            <Card 
              key={doctor.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedDoctor === doctor.id 
                  ? 'ring-2 ring-primary shadow-lg' 
                  : ''
              }`}
              onClick={() => onSelectDoctor(doctor.id)}
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={doctor.image} alt={doctor.name} />
                    <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <CardTitle className="text-xl">{doctor.name}</CardTitle>
                    <p className="text-muted-foreground">{doctor.title}</p>
                    <p className="text-primary mt-1">{doctor.specialization}</p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm">{doctor.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({doctor.reviewCount} đánh giá)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <GraduationCap className="w-4 h-4" />
                      <span>Kinh nghiệm</span>
                    </div>
                    <p className="text-muted-foreground">{doctor.experience} năm</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span>Lịch khám</span>
                    </div>
                    <p className="text-muted-foreground">{availableSlots} slot trống</p>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Languages className="w-4 h-4" />
                    <span className="text-sm">Ngôn ngữ</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {doctor.languages.map((lang, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Phí khám</p>
                      <p className="text-lg">{formatCurrency(doctor.consultationFee)}</p>
                    </div>
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDoctor(doctor.id);
                      }}
                      className={selectedDoctor === doctor.id ? 'bg-primary' : ''}
                    >
                      {selectedDoctor === doctor.id ? 'Đã chọn' : 'Chọn bác sĩ'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}