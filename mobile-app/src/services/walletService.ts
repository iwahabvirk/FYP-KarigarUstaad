import { api } from './api';

export interface WalletInfo {
  balance: number;
  pending: number;
}

export const getWallet = async (): Promise<WalletInfo> => {
  const response = await api.get<{ success: boolean; data: WalletInfo }>('/wallet');
  return response.data.data;
};

export const withdrawFromWallet = async (amount: number): Promise<{ success: boolean; message: string; newBalance: number }> => {
  const response = await api.post<{ success: boolean; message: string; newBalance: number }>('/wallet/withdraw', { amount });
  return response.data;
};