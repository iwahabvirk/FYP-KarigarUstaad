import { api } from './api';

export interface JobPayload {
  title: string;
  description: string;
  budget: number;
  location: string;
  category: string;
  requiredSkills: string[];
}

export interface JobItem {
  id: string;
  title: string;
  description: string;
  budget: number;
  location: string;
  category: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'paid';
  requiredSkills: string[];
  applicationCount: number;
  employer?: {
    id: string;
    name: string;
    email: string;
  };
}

export const getAllJobs = async (): Promise<JobItem[]> => {
  const response = await api.get<{ success: boolean; data: JobItem[] }>('/jobs');
  return response.data.data;
};

export const getMyJobs = async (): Promise<JobItem[]> => {
  const response = await api.get<{ success: boolean; data: JobItem[] }>('/jobs/my');
  return response.data.data;
};

export const getJobById = async (jobId: string): Promise<JobItem> => {
  const response = await api.get<{ success: boolean; data: JobItem }>(`/jobs/${jobId}`);
  return response.data.data;
};

export const createJob = async (payload: JobPayload): Promise<JobItem> => {
  const response = await api.post<{ success: boolean; data: JobItem }>('/jobs', payload);
  return response.data.data;
};

export const updateJobStatus = async (
  jobId: string,
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'paid',
): Promise<{ success: boolean; message: string }> => {
  const response = await api.put<{ success: boolean; message: string }>(
    `/jobs/${jobId}/status`,
    { status },
  );
  return response.data;
};
