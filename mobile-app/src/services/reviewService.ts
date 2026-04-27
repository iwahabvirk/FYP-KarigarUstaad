import { api } from './api';

export interface CreateReviewPayload {
  worker: string;
  job: string;
  rating: number;
  comment: string;
}

export const createReview = async (
  payload: CreateReviewPayload,
): Promise<{ success: boolean; data: unknown }> => {
  const response = await api.post<{ success: boolean; data: unknown }>('/reviews', payload);
  return response.data;
};
