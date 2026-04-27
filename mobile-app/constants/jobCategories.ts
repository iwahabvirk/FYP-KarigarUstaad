export const JOB_CATEGORIES = [
  { label: 'Plumber', value: 'plumbing' },
  { label: 'Electrician', value: 'electrical' },
  { label: 'Painter', value: 'painting' },
  { label: 'Cleaner', value: 'cleaning' },
  { label: 'Carpenter', value: 'carpentry' },
] as const;

export type JobCategory = (typeof JOB_CATEGORIES)[number]['value'];

export const getCategoryLabel = (value: string): string => {
  const category = JOB_CATEGORIES.find(cat => cat.value === value);
  return category ? category.label : value;
};
