import { api } from './api';

export interface ApplicantItem {
  id: string;
  worker: {
    id: string;
    name: string;
    email: string;
    rating: number;
    skills: string[];
  };
  status: string;
  createdAt: string;
}

export interface ApplicationItem {
  id: string;
  job: {
    id: string;
    title: string;
    category: string;
    budget: number;
  };
  status: string;
  coverLetter?: string;
}

export const applyToJob = async (
  jobId: string,
  coverLetter: string,
): Promise<{ success: boolean; message: string }> => {
  const response = await api.post<{ success: boolean; message: string }>(
    `/jobs/${jobId}/apply`,
    { coverLetter },
  );
  return response.data;
};

export const getMyApplications = async (): Promise<ApplicationItem[]> => {
  const response = await api.get<{ success: boolean; data: ApplicationItem[] }>(
    '/applications/my',
  );
  return response.data.data;
};

export const getApplicants = async (jobId: string): Promise<ApplicantItem[]> => {
  const response = await api.get<{ success: boolean; data: ApplicantItem[] }>(
    `/jobs/${jobId}/applicants`,
  );
  return response.data.data;
};

export const updateApplicationStatus = async (
  applicationId: string,
  status: 'pending' | 'accepted' | 'rejected',
): Promise<{ success: boolean; message: string }> => {
  const response = await api.patch<{ success: boolean; message: string }>(
    `/applications/${applicationId}/status`,
    { status },
  );
  return response.data;
};
