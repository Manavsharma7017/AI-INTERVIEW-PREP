import { apiClient } from './api';
import type { LoginRequest, RegisterRequest, User, AdminUser } from '../types/types';


export const authService = {
  async loginUser(credentials: LoginRequest): Promise<{ token: string; user: User ,message: string }> {
    const response = await apiClient.post('/user/login', credentials);
    return response.data;
  },

  async registerUser(userData: RegisterRequest): Promise<{ token: string; user: User, message: string }> {
    const response = await apiClient.post('/user/signup', userData);
    return response.data;
  },

  async loginAdmin(credentials: LoginRequest): Promise<{ token: string; user: AdminUser,message: string  }> {
    const response = await apiClient.post('/admin/login', credentials);
    return response.data;
  },

  async registerAdmin(userData: RegisterRequest): Promise<{ token: string; user: AdminUser,message: string  }> {
    const response = await apiClient.post('/admin/signup', userData,{
      headers: {
        'Content-Type': 'application/json',
        'Admin-Password': userData.AdminPassword || '',
      },
    });
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/users/');
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};