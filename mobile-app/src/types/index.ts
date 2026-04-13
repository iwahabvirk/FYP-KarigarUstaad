export interface Worker {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  distance: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
  totalEarnings?: number;
  location?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  budget: number;
  category: string;
  customerId: string;
  workerId?: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed';
}

export interface Address {
  id: string;
  label: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Booking {
  id: string;
  workerId: string;
  customerId: string;
  serviceCategory: string;
  selectedAddress: Address;
  totalCost: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed';
  scheduledTime: string;
}

export interface Review {
  id: string;
  workerId: string;
  customerId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image?: string;
}
