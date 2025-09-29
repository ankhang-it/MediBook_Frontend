import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Users, Stethoscope, Building2, Calendar, TrendingUp, Activity, Clock, CheckCircle, Settings } from 'lucide-react';
import { apiService } from '../../services/api';

interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  totalSpecialties: number;
  totalAppointments: number;
  todayAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  revenue: number;
}

interface RecentActivity {
  id: string;
  type: 'patient_registered' | 'doctor_added' | 'appointment_booked' | 'appointment_completed';
  message: string;
  timestamp: string;
  user?: string;
}

export const DashboardOverview: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    totalDoctors: 0,
    totalSpecialties: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    revenue: 0
  });

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  // Load dashboard data from API
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await apiService.getAdminDashboard();
      if (response.success && response.data) {
        const data = response.data;
        setStats({
          totalPatients: data.total_patients || 0,
          totalDoctors: data.total_doctors || 0,
          totalSpecialties: 10, // TODO: Get from API
          totalAppointments: data.total_appointments || 0,
          todayAppointments: 0, // TODO: Calculate from appointments
          pendingAppointments: data.pending_appointments || 0,
          completedAppointments: data.completed_appointments || 0,
          revenue: data.total_revenue || 0
        });

        // Convert recent appointments to activities
        if (data.recent_appointments) {
          const activities = data.recent_appointments.map((appointment: any, index: number) => ({
            id: appointment.appointment_id || index.toString(),
            type: 'appointment_booked',
            message: `Lịch hẹn mới với ${appointment.doctor?.fullname || 'Bác sĩ'}`,
            timestamp: appointment.created_at,
            user: appointment.patient?.fullname || 'Bệnh nhân'
          }));
          setRecentActivities(activities);
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Fallback to mock data if API fails
      setStats({
        totalPatients: 0,
        totalDoctors: 0,
        totalSpecialties: 0,
        totalAppointments: 0,
        todayAppointments: 0,
        pendingAppointments: 0,
        completedAppointments: 0,
        revenue: 0
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'patient_registered':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'doctor_added':
        return <Stethoscope className="h-4 w-4 text-green-500" />;
      case 'appointment_booked':
        return <Calendar className="h-4 w-4 text-orange-500" />;
      case 'appointment_completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'patient_registered':
        return 'bg-blue-50 border-blue-200';
      case 'doctor_added':
        return 'bg-green-50 border-green-200';
      case 'appointment_booked':
        return 'bg-orange-50 border-orange-200';
      case 'appointment_completed':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Check the sales, value and bounce rate by country.</p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tổng Bệnh nhân</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalPatients}</div>
            <p className="text-xs text-gray-500 mt-1">
              Bệnh nhân đã đăng ký
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tổng Bác sĩ</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <Stethoscope className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalDoctors}</div>
            <p className="text-xs text-gray-500 mt-1">
              Bác sĩ trong hệ thống
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Lịch hẹn</CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</div>
            <p className="text-xs text-gray-500 mt-1">
              Tổng số lịch hẹn
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Doanh thu</CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.revenue)}</div>
            <p className="text-xs text-gray-500 mt-1">
              Tổng doanh thu
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Website Views</CardTitle>
            <CardDescription className="text-gray-600">Last Campaign Performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-400 mb-2">📊</div>
                <p className="text-gray-500">Chart placeholder</p>
                <p className="text-sm text-gray-400 mt-2">Views: 76</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>campaign sent 2 days ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Daily Sales</CardTitle>
            <CardDescription className="text-gray-600">(+15%) increase in today sales.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-400 mb-2">📈</div>
                <p className="text-gray-500">Chart placeholder</p>
                <p className="text-sm text-gray-400 mt-2">Sales trend</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>updated 4 min ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Completed Tasks</CardTitle>
            <CardDescription className="text-gray-600">Last Campaign Performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-400 mb-2">✅</div>
                <p className="text-gray-500">Chart placeholder</p>
                <p className="text-sm text-gray-400 mt-2">Tasks completed</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>just updated</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-400 mb-2">📋</div>
                <p className="text-gray-500">Projects placeholder</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">Orders overview</CardTitle>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-400 mb-2">📦</div>
                <p className="text-gray-500">Orders placeholder</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
