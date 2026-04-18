import { api } from './api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'worker' | 'employer' | 'customer';
  profileImage?: string;
  phone: string;
  bio: string;
  skills: string[];
  experience: string;
  location: string;
  rating: number;
  totalReviews: number;
  completedJobs?: number;
  responseTime?: string;
  availability?: boolean;
  wallet?: {
    balance: number;
    pending: number;
  };
  totalJobsPosted?: number;
}

export interface WorkerProfile extends UserProfile {
  reviews: {
    id: string;
    customer: {
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

export interface CustomerProfile extends UserProfile {
  recentBookings: {
    id: string;
    worker: {
      id: string;
      name: string;
      skills: string[];
    };
    job: {
      id: string;
      title: string;
    };
    status: 'completed' | 'in-progress' | 'cancelled';
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

export const getWorkerProfile = async (id: string): Promise<WorkerProfile> => {
  const response = await api.get<{ success: boolean; data: WorkerProfile }>(`/users/worker/${id}`);
  return response.data.data;
};

export const getCustomerProfile = async (): Promise<CustomerProfile> => {
  const response = await api.get<{ success: boolean; data: CustomerProfile }>('/users/me');
  return response.data.data;
};

export interface RecommendedWorker {
  name: string;
  skills: string[];
  rating: number;
  reviews: number;
  location: string;
  score: number;
}

export const getRecommendedWorkers = async (category: string, location: string): Promise<RecommendedWorker[]> => {
  const response = await api.get<{ success: boolean; data: RecommendedWorker[] }>(`/workers/recommend?category=${encodeURIComponent(category)}&location=${encodeURIComponent(location)}`);
  return response.data.data;
};