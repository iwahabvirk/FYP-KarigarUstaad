import { api, getAuthToken } from './api';

export interface UserProfile {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'worker' | 'employer' | 'customer';
  profileImage?: string;
  phone?: string;
  bio?: string;
  skills?: string[];
  experience?: string;
  location?: string;
  rating?: number;
  totalReviews?: number;
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
  reviews?: {
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
  recentBookings?: {
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

// Helper to normalize user response
const normalizeUser = (user: any): UserProfile => {
  if (!user.id && user._id) {
    user.id = user._id;
  }
  return user as UserProfile;
};

export const getMe = async (): Promise<UserProfile> => {
  console.log('👤 UserService: Fetching current user profile...');
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await api.get<{ success: boolean; data: UserProfile }>('/users/me');
    const normalizedUser = normalizeUser(response.data.data);
    console.log(`✅ UserService: Got user profile for ${normalizedUser.name}`);
    return normalizedUser;
  } catch (error) {
    console.error('❌ UserService: Failed to fetch user profile', error);
    throw error;
  }
};

export const updateMe = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
  console.log('👤 UserService: Updating user profile...', Object.keys(updates));
  try {
    const response = await api.put<{ success: boolean; data: UserProfile }>('/users/me', updates);
    const normalizedUser = normalizeUser(response.data.data);
    console.log('✅ UserService: User profile updated successfully');
    return normalizedUser;
  } catch (error) {
    console.error('❌ UserService: Failed to update user profile', error);
    throw error;
  }
};

export const getWorkerProfile = async (id: string): Promise<WorkerProfile> => {
  console.log(`👤 UserService: Fetching worker profile for ${id}...`);
  try {
    const response = await api.get<{ success: boolean; data: WorkerProfile }>(`/users/worker/${id}`);
    const normalizedUser = normalizeUser(response.data.data);
    console.log('✅ UserService: Got worker profile');
    return normalizedUser as WorkerProfile;
  } catch (error) {
    console.error('❌ UserService: Failed to fetch worker profile', error);
    throw error;
  }
};

export const getCustomerProfile = async (): Promise<CustomerProfile> => {
  console.log('👤 UserService: Fetching customer profile...');
  try {
    const response = await api.get<{ success: boolean; data: CustomerProfile }>('/users/me');
    const normalizedUser = normalizeUser(response.data.data);
    console.log('✅ UserService: Got customer profile');
    return normalizedUser as CustomerProfile;
  } catch (error) {
    console.error('❌ UserService: Failed to fetch customer profile', error);
    throw error;
  }
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
  console.log('👤 UserService: Fetching recommended workers...', { category, location });
  try {
    const response = await api.get<{ success: boolean; data: RecommendedWorker[] }>(
      `/workers/recommend?category=${encodeURIComponent(category)}&location=${encodeURIComponent(location)}`
    );
    console.log(`✅ UserService: Got ${response.data.data.length} recommended workers`);
    return response.data.data;
  } catch (error) {
    console.error('❌ UserService: Failed to fetch recommended workers', error);
    throw error;
  }
};