import { api } from './api';

export const suggestCategory = async (description: string): Promise<string> => {
  console.log('🤖 AIService: Requesting category suggestion...');

  const payload = { description };
  const response = await api.post<{ success: boolean; category: string }>('/ai/suggest-category', payload);

  if (!response.data?.success || !response.data.category) {
    throw new Error('AI could not suggest a category.');
  }

  console.log('✅ AIService: Category suggested:', response.data.category);
  return response.data.category;
};
