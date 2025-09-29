import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { FileText, Calendar, User, Stethoscope, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { apiService } from '../services/api';

interface MedicalRecord {
  record_id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id?: string;
  diagnosis: string;
  treatment: string;
  prescription?: string;
  notes?: string;
  created_at: string;
  doctor?: {
    doctor_id: string;
    fullname: string;
    specialty?: {
      specialty_id: string;
      name: string;
    };
  };
}

export const PatientMedicalHistory: React.FC = () => {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMedicalHistory();
  }, []);

  const loadMedicalHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getPatientMedicalHistory();
      
      if (response.success && response.data) {
        setMedicalRecords(response.data.data || []);
      } else {
        setError('Không thể tải lịch sử bệnh án');
      }
    } catch (error) {
      console.error('Error loading medical history:', error);
      setError('Lỗi khi tải lịch sử bệnh án');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeverityColor = (diagnosis: string) => {
    const lowerDiagnosis = diagnosis.toLowerCase();
    if (lowerDiagnosis.includes('cấp') || lowerDiagnosis.includes('nghiêm trọng')) {
      return 'bg-red-100 text-red-800 border-red-200';
    } else if (lowerDiagnosis.includes('mạn') || lowerDiagnosis.includes('kéo dài')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else {
      return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Đang tải lịch sử bệnh án...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={loadMedicalHistory}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lịch sử bệnh án</h1>
        <p className="text-gray-600 mt-1">Xem lại các lần khám bệnh và điều trị</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng số lần khám</p>
                <p className="text-2xl font-bold text-gray-900">{medicalRecords.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Stethoscope className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Bác sĩ đã khám</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(medicalRecords.map(record => record.doctor_id)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Lần khám gần nhất</p>
                <p className="text-sm font-bold text-gray-900">
                  {medicalRecords.length > 0 
                    ? formatDate(medicalRecords[0].created_at).split(' ')[0]
                    : 'Chưa có'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medical Records */}
      {medicalRecords.length > 0 ? (
        <div className="space-y-4">
          {medicalRecords.map((record, index) => (
            <Card key={record.record_id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        Lần khám #{medicalRecords.length - index}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(record.created_at)}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getSeverityColor(record.diagnosis)}>
                    {record.diagnosis.toLowerCase().includes('cấp') ? 'Cấp tính' : 
                     record.diagnosis.toLowerCase().includes('mạn') ? 'Mạn tính' : 'Thường'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Doctor Info */}
                {record.doctor && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{record.doctor.fullname}</p>
                      {record.doctor.specialty && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Stethoscope className="h-3 w-3" />
                          {record.doctor.specialty.name}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Diagnosis */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    Chẩn đoán
                  </h4>
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-gray-800">{record.diagnosis}</p>
                  </div>
                </div>

                {/* Treatment */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Điều trị
                  </h4>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-gray-800">{record.treatment}</p>
                  </div>
                </div>

                {/* Prescription */}
                {record.prescription && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      Đơn thuốc
                    </h4>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-gray-800 whitespace-pre-line">{record.prescription}</p>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {record.notes && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      Ghi chú
                    </h4>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-gray-800">{record.notes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có lịch sử bệnh án</h3>
            <p className="text-gray-600 mb-4">
              Bạn chưa có lịch sử khám bệnh nào. Lịch sử bệnh án sẽ được cập nhật sau mỗi lần khám.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
