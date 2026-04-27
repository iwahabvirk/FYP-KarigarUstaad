import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = 'karigarAuthToken';
const USER_DATA_KEY = 'karigarUserData';

export const getAuthToken = async (): Promise<string | null> => {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  console.log(`🔑 AuthToken: ${token ? 'token found' : 'no token found'}`);
  return token;
};

export const setAuthToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  console.log('🔑 AuthToken: saved');
};

export const clearAuthToken = async (): Promise<void> => {
  await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  console.log('🔑 AuthToken: cleared');
};

export const getStoredUser = async (): Promise<any | null> => {
  const userData = await AsyncStorage.getItem(USER_DATA_KEY);
  if (!userData) {
    return null;
  }

  try {
    return JSON.parse(userData);
  } catch (error) {
    console.error('❌ AuthToken: Failed to parse stored user', error);
    return null;
  }
};

export const setStoredUser = async (user: any): Promise<void> => {
  await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  console.log('👤 User data stored');
};

export const clearStoredUser = async (): Promise<void> => {
  await AsyncStorage.removeItem(USER_DATA_KEY);
  console.log('👤 Stored user cleared');
};

export const clearAuthStorage = async (): Promise<void> => {
  await Promise.all([clearAuthToken(), clearStoredUser()]);
  console.log('🔐 Auth storage cleared');
};
