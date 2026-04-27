import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setAuthToken, clearAuthToken } from './api';

export interface UserPayload {
  id: string;
  name: string;
  email: string;
  role: 'worker' | 'employer' | 'customer';
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
  role: 'worker' | 'employer' | 'customer';
}

const AUTH_TOKEN_KEY = 'karigarAuthToken';
const USER_DATA_KEY = 'karigarUserData';

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', payload);
  await setAuthToken(response.data.token);
  // Store user data for quick access
  await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data.user));
  console.log('✅ AuthService: User logged in successfully');
  return response.data;
};

export const registerUser = async (
  payload: RegisterPayload,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', payload);
  await setAuthToken(response.data.token);
  // Store user data for quick access
  await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data.user));
  console.log('✅ AuthService: User registered successfully');
  return response.data;
};

export const getCurrentUser = async (): Promise<UserPayload> => {
  const response = await api.get<{ success: boolean; user: UserPayload }>('/auth/me');
  return response.data.user;
};

export const logoutUser = async (): Promise<void> => {
  try {
    // Call logout endpoint to server
    console.log('🔑 AuthService: Calling logout endpoint...');
    await api.post('/auth/logout', {});
  } catch (error) {
    console.warn('⚠️  AuthService: Logout endpoint call failed (clearing locally anyway):', error);
  }
  
  // Clear local storage
  await clearAuthToken();
  await AsyncStorage.removeItem(USER_DATA_KEY);
  console.log('✅ AuthService: User logged out successfully');
};

export const getStoredToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(AUTH_TOKEN_KEY);
};

export const getStoredUser = async (): Promise<UserPayload | null> => {
  const userData = await AsyncStorage.getItem(USER_DATA_KEY);
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('❌ AuthService: Failed to parse stored user data', error);
      return null;
    }
  }
  return null;
};
