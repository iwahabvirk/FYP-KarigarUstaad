import { api } from './api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'worker' | 'employer';
  skills: string[];
  experience: string;
  location?: {
    lat: number;
    lng: number;
  };
  rating: number;
  totalReviews: number;
  completedJobs: number;
  profileImage?: string;
}

export interface WorkerProfile extends UserProfile {
  reviews: {
    id: string;
    employer: {
      id: string;
      name: string;
    };
    job: {
      id: string;
      title: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
  }[];
}

export const getMe = async (): Promise<UserProfile> => {
  const response = await api.get<{ success: boolean; data: UserProfile }>('/users/me');
  return response.data.data;
};

export const updateMe = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
  const response = await api.put<{ success: boolean; data: UserProfile }>('/users/me', updates);
  return response.data.data;
};

export const getWorkerProfile = async (workerId: string): Promise<WorkerProfile> => {
  const response = await api.get<{ success: boolean; data: WorkerProfile }>(`/workers/${workerId}`);
  return response.data.data;
};