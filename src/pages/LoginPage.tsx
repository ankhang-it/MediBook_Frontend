import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthPage } from '../components/auth/AuthPage';
import { Layout } from '../components/Layout';

export const LoginPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get the return URL from location state
  const from = location.state?.from?.pathname || '/';

  // After successful login, redirection is handled by AuthContext

  return (
    <Layout hideHeaderAndFooter={true}>
      <AuthPage />
    </Layout>
  );
};
