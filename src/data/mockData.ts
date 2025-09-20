import { Department, Doctor, TimeSlot } from '../types/medical';

export const departments: Department[] = [
  {
    id: '1',
    name: 'Tim mạch',
    description: 'Khoa chuyên điều trị các bệnh lý về tim mạch và huyết áp',
    icon: 'Heart'
  },
  {
    id: '2', 
    name: 'Thần kinh',
    description: 'Khoa chuyên điều trị các bệnh lý về hệ thần kinh',
    icon: 'Brain'
  },
  {
    id: '3',
    name: 'Nhi khoa',
    description: 'Khoa chuyên chăm sóc sức khỏe trẻ em từ sơ sinh đến 18 tuổi',
    icon: 'Baby'
  },
  {
    id: '4',
    name: 'Da liễu',
    description: 'Khoa chuyên điều trị các bệnh lý về da và thẩm mỹ da',
    icon: 'Sparkles'
  },
  {
    id: '5',
    name: 'Nội khoa',
    description: 'Khoa chuyên điều trị các bệnh lý nội khoa tổng quát',
    icon: 'Stethoscope'
  },
  {
    id: '6',
    name: 'Ngoại khoa',
    description: 'Khoa chuyên thực hiện các ca phẫu thuật và điều trị ngoại khoa',
    icon: 'Scissors'
  }
];

const generateTimeSlots = (doctorId: string): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const today = new Date();
  
  // Tạo lịch cho 14 ngày tới
  for (let day = 1; day <= 14; day++) {
    const date = new Date(today);
    date.setDate(today.getDate() + day);
    const dateStr = date.toISOString().split('T')[0];
    
    // Skip chủ nhật
    if (date.getDay() === 0) continue;
    
    // Tạo khung giờ sáng (8:00-11:30)
    for (let hour = 8; hour <= 11; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 11 && minute === 30) break;
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          id: `${doctorId}-${dateStr}-${time}`,
          date: dateStr,
          time,
          available: Math.random() > 0.3 // 70% khả năng có slot trống
        });
      }
    }
    
    // Tạo khung giờ chiều (13:30-17:00)
    for (let hour = 13; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 13 && minute === 0) continue;
        if (hour === 17 && minute === 30) break;
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          id: `${doctorId}-${dateStr}-${time}`,
          date: dateStr,
          time,
          available: Math.random() > 0.4 // 60% khả năng có slot trống
        });
      }
    }
  }
  
  return slots;
};

export const doctors: Doctor[] = [
  // Tim mạch
  {
    id: 'doctor-1',
    name: 'BS.CK2 Nguyễn Văn Minh',
    title: 'Bác sĩ chuyên khoa II',
    specialization: 'Tim mạch can thiệp',
    departmentId: '1',
    experience: 15,
    education: [
      'Tiến sĩ Y học - Đại học Y Hà Nội',
      'Chuyên khoa Tim mạch - Bệnh viện Bạch Mai',
      'Đào tạo Tim mạch can thiệp - Nhật Bản'
    ],
    image: 'https://images.unsplash.com/photo-1728474372689-c3072b79806e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZG9jdG9yJTIwaG9zcGl0YWx8ZW58MXx8fHwxNzU4MzA2NzE4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.8,
    reviewCount: 156,
    consultationFee: 300000,
    languages: ['Tiếng Việt', 'English'],
    availableSlots: []
  },
  {
    id: 'doctor-2',
    name: 'BS.CK1 Lê Thị Hương',
    title: 'Bác sĩ chuyên khoa I',
    specialization: 'Tim mạch tổng quát',
    departmentId: '1',
    experience: 8,
    education: [
      'Bác sĩ Y học - Đại học Y Hồ Chí Minh',
      'Chuyên khoa Tim mạch - Bệnh viện Chợ Rẫy'
    ],
    image: 'https://images.unsplash.com/photo-1728474372689-c3072b79806e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZG9jdG9yJTIwaG9zcGl0YWx8ZW58MXx8fHwxNzU4MzA2NzE4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.6,
    reviewCount: 89,
    consultationFee: 250000,
    languages: ['Tiếng Việt'],
    availableSlots: []
  },
  // Thần kinh
  {
    id: 'doctor-3',
    name: 'PGS.TS Trần Văn Đức',
    title: 'Phó Giáo sư - Tiến sĩ',
    specialization: 'Thần kinh học',
    departmentId: '2',
    experience: 20,
    education: [
      'Tiến sĩ Y học - Đại học Y Hà Nội',
      'Phó Giáo sư Thần kinh học',
      'Fellowship tại Mayo Clinic, Mỹ'
    ],
    image: 'https://images.unsplash.com/photo-1728474372689-c3072b79806e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZG9jdG9yJTIwaG9zcGl0YWx8ZW58MXx8fHwxNzU4MzA2NzE4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.9,
    reviewCount: 201,
    consultationFee: 400000,
    languages: ['Tiếng Việt', 'English', 'Français'],
    availableSlots: []
  },
  // Nhi khoa
  {
    id: 'doctor-4',
    name: 'BS.CK2 Phạm Thị Lan',
    title: 'Bác sĩ chuyên khoa II',
    specialization: 'Nhi khoa tổng quát',
    departmentId: '3',
    experience: 12,
    education: [
      'Bác sĩ Y học - Đại học Y Hà Nội',
      'Chuyên khoa Nhi - Bệnh viện Nhi Trung Ương',
      'Đào tạo Nhi khoa tại Úc'
    ],
    image: 'https://images.unsplash.com/photo-1728474372689-c3072b79806e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZG9jdG9yJTIwaG9zcGl0YWx8ZW58MXx8fHwxNzU4MzA2NzE4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.7,
    reviewCount: 134,
    consultationFee: 280000,
    languages: ['Tiếng Việt', 'English'],
    availableSlots: []
  },
  // Da liễu
  {
    id: 'doctor-5',
    name: 'BS.CK1 Võ Thị Mai',
    title: 'Bác sĩ chuyên khoa I',
    specialization: 'Da liễu thẩm mỹ',
    departmentId: '4',
    experience: 7,
    education: [
      'Bác sĩ Y học - Đại học Y Dược Hồ Chí Minh',
      'Chuyên khoa Da liễu - Bệnh viện Da liễu TP.HCM'
    ],
    image: 'https://images.unsplash.com/photo-1728474372689-c3072b79806e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZG9jdG9yJTIwaG9zcGl0YWx8ZW58MXx8fHwxNzU4MzA2NzE4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.5,
    reviewCount: 76,
    consultationFee: 200000,
    languages: ['Tiếng Việt'],
    availableSlots: []
  },
  // Nội khoa
  {
    id: 'doctor-6',
    name: 'ThS.BS Hoàng Văn Nam',
    title: 'Thạc sĩ - Bác sĩ',
    specialization: 'Nội tiêu hóa',
    departmentId: '5',
    experience: 10,
    education: [
      'Thạc sĩ Y học - Đại học Y Hà Nội',
      'Chuyên khoa Nội khoa - Bệnh viện Việt Đức'
    ],
    image: 'https://images.unsplash.com/photo-1728474372689-c3072b79806e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZG9jdG9yJTIwaG9zcGl0YWx8ZW58MXx8fHwxNzU4MzA2NzE4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.4,
    reviewCount: 92,
    consultationFee: 220000,
    languages: ['Tiếng Việt', 'English'],
    availableSlots: []
  }
];

// Tạo lịch cho tất cả bác sĩ
doctors.forEach(doctor => {
  doctor.availableSlots = generateTimeSlots(doctor.id);
});

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};