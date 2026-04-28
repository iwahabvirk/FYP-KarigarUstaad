import { api } from './api';

export interface InHouseStaff {
  id: string;
  name: string;
  skills: string[];
  category: string;
  hourlyRate: number;
  rating: number;
  location: string;
  phone: string;
  availability: boolean;
}

export interface StaffBookingPayload {
  staffId: string;
  jobDetails: {
    title: string;
    description: string;
    budget: number;
    location: string;
  };
}

export interface StaffBookingResponse {
  success: boolean;
  message: string;
  data: {
    job: any;
    staff: InHouseStaff;
  };
}

export const getAllStaff = async (category?: string): Promise<InHouseStaff[]> => {
  const params = category ? { category } : {};
  const response = await api.get<{ success: boolean; data: InHouseStaff[] }>('/staff', { params });
  return response.data.data;
};

export const bookStaff = async (payload: StaffBookingPayload): Promise<StaffBookingResponse> => {
  const response = await api.post<StaffBookingResponse>('/staff/book', payload);
  return response.data;
};