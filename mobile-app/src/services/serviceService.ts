import { api } from './api';

export interface ServiceItem {
  id: string;
  _id?: string;
  title: string;
  description: string;
  price: number;
  category: string;
  isActive: boolean;
  worker: {
    id?: string;
    _id?: string;
    name: string;
    email?: string;
    rating?: number;
    skills?: string[];
    location?: string;
  };
}

export interface CreateServicePayload {
  title: string;
  description: string;
  price: number;
  category: string;
}

const normalizeService = (service: any): ServiceItem => {
  if (!service.id && service._id) {
    service.id = service._id;
  }

  if (service.worker && !service.worker.id && service.worker._id) {
    service.worker.id = service.worker._id;
  }

  return service as ServiceItem;
};

const normalizeServices = (services: any[]): ServiceItem[] => services.map(normalizeService);

export const getAllServices = async (category?: string): Promise<ServiceItem[]> => {
  const response = await api.get<{ success: boolean; data: ServiceItem[] }>('/services', {
    params: category ? { category } : undefined,
  });

  return normalizeServices(response.data.data);
};

export const getMyServices = async (): Promise<ServiceItem[]> => {
  const response = await api.get<{ success: boolean; data: ServiceItem[] }>('/services/my');
  return normalizeServices(response.data.data);
};

export const getServiceById = async (serviceId: string): Promise<ServiceItem> => {
  const response = await api.get<{ success: boolean; data: ServiceItem }>(`/services/${serviceId}`);
  return normalizeService(response.data.data);
};

export const createService = async (payload: CreateServicePayload): Promise<ServiceItem> => {
  const response = await api.post<{ success: boolean; data: ServiceItem }>('/services', payload);
  return normalizeService(response.data.data);
};

export const hireService = async (
  serviceId: string,
  location?: string,
): Promise<{ success: boolean; message: string; data: { job: any; service: ServiceItem } }> => {
  const response = await api.post<{ success: boolean; message: string; data: { job: any; service: ServiceItem } }>(
    `/services/${serviceId}/hire`,
    { location },
  );

  return {
    ...response.data,
    data: {
      ...response.data.data,
      service: normalizeService(response.data.data.service),
    },
  };
};
