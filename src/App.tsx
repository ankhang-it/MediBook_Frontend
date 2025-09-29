import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { DoctorsPage } from './pages/DoctorsPage';
import { BookingPage } from './pages/BookingPage';
import { PaymentPage } from './pages/PaymentPage';
import { SuccessPage } from './pages/SuccessPage';
import { LoginPage } from './pages/LoginPage';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { PatientDashboard } from './pages/PatientDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminDoctorsPage } from './pages/admin/AdminDoctorsPage';
import { AdminPatientsPage } from './pages/admin/AdminPatientsPage';
import { AdminSpecialtiesPage } from './pages/admin/AdminSpecialtiesPage';
import { AdminAppointmentsPage } from './pages/admin/AdminAppointmentsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <Layout>
              <HomePage />
            </Layout>
          } />

          <Route path="/doctors/:departmentId" element={
            <Layout>
              <DoctorsPage />
            </Layout>
          } />

          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route path="/booking/:doctorId" element={
            <ProtectedRoute>
              <Layout>
                <BookingPage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/payment" element={
            <ProtectedRoute>
              <Layout>
                <PaymentPage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/success" element={
            <ProtectedRoute>
              <Layout>
                <SuccessPage />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Role-based Dashboard Routes */}
          <Route path="/patient-dashboard" element={
            <ProtectedRoute requiredRole="patient">
              <PatientDashboard />
            </ProtectedRoute>
          } />

          <Route path="/doctor-dashboard" element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin/users" element={
            <ProtectedRoute requiredRole="admin">
              <AdminUsersPage />
            </ProtectedRoute>
          } />

          <Route path="/admin/doctors" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDoctorsPage />
            </ProtectedRoute>
          } />

          <Route path="/admin/patients" element={
            <ProtectedRoute requiredRole="admin">
              <AdminPatientsPage />
            </ProtectedRoute>
          } />

          <Route path="/admin/specialties" element={
            <ProtectedRoute requiredRole="admin">
              <AdminSpecialtiesPage />
            </ProtectedRoute>
          } />

          <Route path="/admin/appointments" element={
            <ProtectedRoute requiredRole="admin">
              <AdminAppointmentsPage />
            </ProtectedRoute>
          } />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
