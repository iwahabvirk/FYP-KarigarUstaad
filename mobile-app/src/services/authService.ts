import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setAuthToken, clearAuthToken } from './api';

export interface UserPayload {
  id: string;
  name: string;
  email: string;
  role: 'worker' | 'employer';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: UserPayload;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: 'worker' | 'employer';
}

const AUTH_TOKEN_KEY = 'karigarAuthToken';

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', payload);
  await setAuthToken(response.data.token);
  return response.data;
};

export const registerUser = async (
  payload: RegisterPayload,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', payload);
  await setAuthToken(response.data.token);
  return response.data;
};

export const getCurrentUser = async (): Promise<UserPayload> => {
  const response = await api.get<{ success: boolean; user: UserPayload }>('/auth/me');
  return response.data.user;
};

export const logoutUser = async (): Promise<void> => {
  await clearAuthToken();
};

export const getStoredToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(AUTH_TOKEN_KEY);
};
