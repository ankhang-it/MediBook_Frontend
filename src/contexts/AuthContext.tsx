import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiService, User, LoginResponse } from '../services/api';

// Types
interface AuthState {
  user: User | null;
  profile: any | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  clearError: () => void;
}

// Initial state
const initialState: AuthState = {
  user: null,
  profile: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Action types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; profile?: any; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_CLEAR_ERROR' }
  | { type: 'AUTH_LOADING'; payload: boolean };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        profile: action.payload.profile || null,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        profile: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        profile: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'AUTH_CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'AUTH_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = apiService.getToken();
      
      if (token) {
        try {
          const response = await apiService.getMe();
          if (response.success && response.data?.user) {
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: {
                user: response.data.user,
                profile: response.data.profile,
                token,
              },
            });
          } else {
            // Token is invalid, clear it
            apiService.setToken(null);
            dispatch({ type: 'AUTH_LOGOUT' });
          }
        } catch (error) {
          // Token is invalid, clear it
          apiService.setToken(null);
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } else {
        dispatch({ type: 'AUTH_LOADING', payload: false });
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await apiService.login(email, password);
      
      if (response.success && response.data?.token && response.data?.user) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: response.data.user,
            profile: response.data.profile,
            token: response.data.token,
          },
        });
        
        // Redirect based on user role
        const userRole = response.data.user.role;
        let redirectPath = '/';
        
        switch (userRole) {
          case 'doctor':
            redirectPath = '/doctor-dashboard';
            break;
          case 'admin':
            redirectPath = '/admin';
            break;
          case 'patient':
          default:
            // For patients, redirect to patient dashboard
            redirectPath = '/patient-dashboard';
            break;
        }
        
        navigate(redirectPath, { replace: true });
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.message || 'Login failed' });
      }
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message || 'Login failed' });
    }
  };

  // Register function
  const register = async (data: any) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await apiService.register(data);
      
      if (response.success && response.data?.token && response.data?.user) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: response.data.user,
            profile: response.data.profile,
            token: response.data.token,
          },
        });
        
        // Redirect based on user role
        const userRole = response.data.user.role;
        let redirectPath = '/';
        
        switch (userRole) {
          case 'doctor':
            redirectPath = '/doctor-dashboard';
            break;
          case 'admin':
            redirectPath = '/admin';
            break;
          case 'patient':
          default:
            redirectPath = '/patient-dashboard';
            break;
        }
        
        navigate(redirectPath, { replace: true });
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.message || 'Registration failed' });
      }
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message || 'Registration failed' });
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      apiService.setToken(null);
      dispatch({ type: 'AUTH_LOGOUT' });
      navigate('/', { replace: true });
    }
  };

  // Update profile function
  const updateProfile = async (data: any) => {
    try {
      const response = await apiService.updateProfile(data);
      
      if (response.success) {
        // Refresh user data
        const meResponse = await apiService.getMe();
        if (meResponse.success && meResponse.data) {
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user: meResponse.data.user,
              profile: meResponse.data.profile,
              token: state.token!,
            },
          });
        }
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.message || 'Profile update failed' });
      }
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message || 'Profile update failed' });
    }
  };

  // Change password function
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const response = await apiService.changePassword(currentPassword, newPassword);
      
      if (!response.success) {
        dispatch({ type: 'AUTH_FAILURE', payload: response.message || 'Password change failed' });
      }
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message || 'Password change failed' });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'AUTH_CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
