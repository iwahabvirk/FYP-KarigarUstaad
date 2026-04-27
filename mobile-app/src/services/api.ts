import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// The API base URL should be configured through environment variables in production.
// For local development, set EXPO_PUBLIC_API_URL in your .env file.
// Example values:
//   - http://localhost:5000/api (local machine)
//   - http://192.168.x.x:5000/api (local network - replace with your backend IP)
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';
const AUTH_TOKEN_KEY = 'karigarAuthToken';
let isLoggingOut = false;

// Debug logging
console.log('🔧 API Configuration:');
console.log(`   Base URL: ${API_BASE_URL}`);
console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);

export const getAuthToken = async (): Promise<string | null> => {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  console.log(`🔑 Retrieved auth token: ${token ? 'exists' : 'not found'}`);
  return token;
};

export const setAuthToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  console.log('🔑 Auth token saved');
};

export const clearAuthToken = async (): Promise<void> => {
  await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  console.log('🔑 Auth token cleared');
};

export const setLoggingOut = (value: boolean): void => {
  isLoggingOut = value;
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAuthToken();

    if (token && config.headers) {
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }

    // Log request
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`, {
      data: config.data,
      hasAuth: !!token,
    });

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Interceptor Error:', error.message);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  async (error: AxiosError) => {
    const data = error.response?.data as Record<string, unknown> | undefined;
    const message =
      (data?.message as string | undefined) ||
      error.message ||
      'An unexpected error occurred';

    console.error('❌ API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: message,
      error: error.response?.data,
      networkError: error.code === 'ECONNREFUSED' ? 'Cannot reach server - check API_BASE_URL' : null,
    });

    if (error.response?.status === 401 && !isLoggingOut) {
      console.log('🔐 Auth token expired, clearing...');
      await clearAuthToken();
    }

    return Promise.reject(new Error(message));
  },
);

