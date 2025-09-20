export interface Department {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialization: string;
  departmentId: string;
  experience: number;
  education: string[];
  image: string;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  languages: string[];
  availableSlots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  doctorId: string;
  departmentId: string;
  date: string;
  time: string;
  symptoms: string;
  consultationFee: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface PaymentInfo {
  method: 'credit_card' | 'bank_transfer' | 'cash';
  cardNumber?: string;
  cardHolderName?: string;
  expiryDate?: string;
  cvv?: string;
}