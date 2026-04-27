import { api } from './api';

export interface JobPayload {
  title: string;
  description: string;
  budget: number;
  location: string;
  category: string;
  requiredSkills: string[];
  customerId?: string;
}

export interface JobItem {
  id: string;
  _id?: string;
  title: string;
  description: string;
  budget: number;
  location: string;
  category: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'paid';
  requiredSkills: string[];
  applicationCount: number;
  customerId?: string;
  employer?: {
    id: string;
    name: string;
    email: string;
  };
  assignedWorker?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Helper to normalize job response (handle both _id and id)
const normalizeJob = (job: any): JobItem => {
  if (!job.id && job._id) {
    job.id = job._id;
  }
  return job as JobItem;
};

const normalizeJobs = (jobs: any[]): JobItem[] => {
  return jobs.map(normalizeJob);
};

export const getAllJobs = async (): Promise<JobItem[]> => {
  console.log('📋 JobService: Fetching all jobs...');
  try {
    const response = await api.get<{ success: boolean; data: JobItem[] }>('/jobs');
    const normalizedJobs = normalizeJobs(response.data.data);
    console.log(`📋 JobService: Got ${normalizedJobs.length} jobs`);
    return normalizedJobs;
  } catch (error) {
    console.error('❌ JobService: Failed to fetch jobs', error);
    throw error;
  }
};

export const getMyJobs = async (): Promise<JobItem[]> => {
  console.log('📋 JobService: Fetching my jobs...');
  try {
    const response = await api.get<{ success: boolean; data: JobItem[] }>('/jobs/my');
    const normalizedJobs = normalizeJobs(response.data.data);
    console.log(`📋 JobService: Got ${normalizedJobs.length} of my jobs`);
    return normalizedJobs;
  } catch (error) {
    console.error('❌ JobService: Failed to fetch my jobs', error);
    throw error;
  }
};

export const getJobById = async (jobId: string): Promise<JobItem> => {
  console.log(`📋 JobService: Fetching job ${jobId}...`);

  try {
    const response = await api.get<{ success: boolean; data: JobItem }>(`/jobs/${jobId}`);
    const normalizedJob = normalizeJob(response.data.data);
    console.log(`📋 JobService: Got job: ${normalizedJob.title}`);
    return normalizedJob;
  } catch (error) {
    console.error(`❌ JobService: Failed to fetch job ${jobId}`, error);
    throw error;
  }
};

export const createJob = async (payload: JobPayload): Promise<JobItem> => {
  console.log(`📋 JobService: Creating job: ${payload.title}...`);
  try {
    const response = await api.post<{ success: boolean; data: JobItem }>('/jobs', payload);
    const normalizedJob = normalizeJob(response.data.data);
    console.log(`✅ JobService: Job created with ID: ${normalizedJob.id}`);
    return normalizedJob;
  } catch (error) {
    console.error('❌ JobService: Failed to create job', error);
    throw error;
  }
};

export const updateJobStatus = async (
  jobId: string,
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'paid',
): Promise<{ success: boolean; message: string }> => {
  console.log(`📋 JobService: Updating job ${jobId} status to ${status}...`);
  try {
    const response = await api.put<{ success: boolean; message: string }>(
      `/jobs/${jobId}/status`,
      { status },
    );
    console.log(`✅ JobService: Job status updated: ${response.data.message}`);
    return response.data;
  } catch (error) {
    console.error(`❌ JobService: Failed to update job status`, error);
    throw error;
  }
};

export const completeJob = async (
  jobId: string,
  notes?: string,
): Promise<{ success: boolean; message: string; data: JobItem }> => {
  console.log(`📋 JobService: Completing job ${jobId}...`);

  try {
    const response = await api.put<{ success: boolean; message: string; data: JobItem }>(
      `/jobs/${jobId}/complete`,
      { notes },
    );
    console.log(`✅ JobService: Job completed: ${response.data.message}`);
    return {
      ...response.data,
      data: normalizeJob(response.data.data),
    };
  } catch (error) {
    console.error(`❌ JobService: Failed to complete job`, error);
    throw error;
  }
};

export const acceptJob = async (jobId: string): Promise<{ success: boolean; message: string; data: JobItem }> => {
  console.log(`📋 JobService: Accepting job ${jobId}...`);

  try {
    const response = await api.put<{ success: boolean; message: string; data: JobItem }>(
      `/jobs/${jobId}/accept`,
      {},
    );
    console.log(`✅ JobService: Job accepted: ${response.data.message}`);
    return {
      ...response.data,
      data: normalizeJob(response.data.data),
    };
  } catch (error) {
    console.error(`❌ JobService: Failed to accept job`, error);
    throw error;
  }
};
