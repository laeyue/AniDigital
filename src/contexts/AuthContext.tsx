import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  farmLocation: string;
  farmSize: string;
  crops: string[];
  role: 'farmer' | 'buyer' | 'cooperative';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Partial<User> & { email: string; password: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('ani_digital_user');
    const token = localStorage.getItem('ani_digital_token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      const { token, user: userData } = response.data;
      
      setUser(userData);
      localStorage.setItem('ani_digital_user', JSON.stringify(userData));
      localStorage.setItem('ani_digital_token', token);
      navigate('/app/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: Partial<User> & { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const response = await authAPI.signup(userData);
      const { token, user: newUser } = response.data;
      
      setUser(newUser);
      localStorage.setItem('ani_digital_user', JSON.stringify(newUser));
      localStorage.setItem('ani_digital_token', token);
      navigate('/app/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Signup failed';
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ani_digital_user');
    localStorage.removeItem('ani_digital_token');
    navigate('/app/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
