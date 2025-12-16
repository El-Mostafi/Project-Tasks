import api from './api';
import { AuthResponse } from '../types';

export const authService = {
  register: async (fullName: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', {
      fullName,
      email,
      password
    });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  },

  saveAuth: (authResponse: AuthResponse) => {
    localStorage.setItem('token', authResponse.accessToken);
    localStorage.setItem('userId', authResponse.userId.toString());
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  }
};
