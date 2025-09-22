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
import { AdminDashboard } from './pages/AdminDashboard';

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
          <Route path="/doctor-dashboard" element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin-dashboard" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
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
