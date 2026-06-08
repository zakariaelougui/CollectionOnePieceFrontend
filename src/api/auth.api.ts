import api from './axios';
import { LoginResponse, RegisterResponse } from '../types/api.types';

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>('/auth/login', { email, password });
    return res.data;
  },

  register: async (username: string, email: string, password: string): Promise<RegisterResponse> => {
    const res = await api.post<RegisterResponse>('/auth/register', { username, email, password });
    return res.data;
  },

  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const res = await api.post<{ accessToken: string }>('/auth/refresh', { refreshToken });
    return res.data;
  },
};
