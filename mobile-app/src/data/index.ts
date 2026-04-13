import { Worker, Job, Address, Category, OnboardingSlide } from '../types';

export const dummyWorkers: Worker[] = [
  {
    id: '1',
    name: 'Ali Raza',
    rating: 4.8,
    reviews: 127,
    distance: '2.3 km',
    price: 1500,
    category: 'Electrician',
    description: 'Certified electrician with 8 years experience. Expert in wiring, repairs, and installations.',
    totalEarnings: 250000,
  },
  {
    id: '2',
    name: 'Hamza Khan',
    rating: 4.9,
    reviews: 89,
    distance: '1.5 km',
    price: 1200,
    category: 'Plumber',
    description: 'Professional plumber with 10 years experience. Quick fixes and reliable service.',
    totalEarnings: 185000,
  },
  {
    id: '3',
    name: 'Saad Ahmed',
    rating: 4.6,
    reviews: 156,
    distance: '3.1 km',
    price: 1000,
    category: 'Painter',
    description: 'Expert painter with modern techniques. Interior and exterior painting.',
    totalEarnings: 280000,
  },
  {
    id: '4',
    name: 'Bilal Hassan',
    rating: 4.7,
    reviews: 94,
    distance: '2.8 km',
    price: 2000,
    category: 'Carpenter',
    description: 'Skilled carpenter. Custom furniture and home repairs.',
    totalEarnings: 320000,
  },
  {
    id: '5',
    name: 'Ayyan Malik',
    rating: 4.9,
    reviews: 112,
    distance: '1.2 km',
    price: 2500,
    category: 'AC Repair',
    description: 'AC specialist. Installation, maintenance, and emergency repairs.',
    totalEarnings: 425000,
  },
  {
    id: '6',
    name: 'Usama Tariq',
    rating: 4.5,
    reviews: 67,
    distance: '4.2 km',
    price: 1500,
    category: 'Electrician',
    description: 'Experienced electrician. Grid work and maintenance.',
    totalEarnings: 195000,
  },
];

export const dummyCategories: Category[] = [
  { id: '1', name: 'Electrician', icon: '⚡' },
  { id: '2', name: 'Plumber', icon: '🔧' },
  { id: '3', name: 'Painter', icon: '🎨' },
  { id: '4', name: 'Carpenter', icon: '🪵' },
  { id: '5', name: 'AC Repair', icon: '❄️' },
];

export const dummyAddresses: Address[] = [
  {
    id: '1',
    label: 'Home',
    address: 'Model Town, Lahore',
    coordinates: { lat: 31.5497, lng: 74.3436 },
  },
  {
    id: '2',
    label: 'Office',
    address: 'DHA Lahore, Lahore',
    coordinates: { lat: 31.5585, lng: 74.3678 },
  },
  {
    id: '3',
    label: 'Gulberg',
    address: 'Gulberg III, Lahore',
    coordinates: { lat: 31.5204, lng: 74.3587 },
  },
];

export const dummyJobs: Job[] = [
  {
    id: 'j1',
    title: 'Fix Wiring Issue',
    description: 'Need to fix faulty wiring in the bedroom. Switch not working properly.',
    location: 'Johar Town, Lahore',
    budget: 2000,
    category: 'Electrician',
    customerId: 'c1',
    status: 'pending',
  },
  {
    id: 'j2',
    title: 'Leaky Tap Repair',
    description: 'Kitchen tap is leaking. Need urgent repair.',
    location: 'Bahria Town, Lahore',
    budget: 1500,
    category: 'Plumber',
    customerId: 'c1',
    status: 'pending',
  },
  {
    id: 'j3',
    title: 'Paint Room',
    description: 'Need to repaint the entire living room. Size: 20x15 ft',
    location: 'Gulberg, Lahore',
    budget: 5000,
    category: 'Painter',
    customerId: 'c1',
    status: 'pending',
  },
  {
    id: 'j4',
    title: 'Install New Shelves',
    description: 'Install wooden shelves in bedroom. 3 pieces needed.',
    location: 'DHA Lahore, Lahore',
    budget: 3500,
    category: 'Carpenter',
    customerId: 'c1',
    status: 'pending',
  },
  {
    id: 'j5',
    title: 'Fix AC',
    description: 'Annual AC maintenance. Hot air not blowing properly.',
    location: 'DHA Lahore, Lahore',
    budget: 3000,
    category: 'AC Repair',
    customerId: 'c1',
    status: 'pending',
  },
];

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Book Trusted Workers Instantly',
    description: 'Find Nearby Skilled Workers in Lahore & Karachi',
  },
  {
    id: '2',
    title: 'Find Verified Professionals',
    description: 'Browse top-rated workers offering the services you need. Check ratings and reviews.',
  },
  {
    id: '3',
    title: 'Safe Payments in PKR',
    description: 'Secure payment options and real-time tracking. Know exactly when your worker arrives.',
  },
];

export const getWorkersByCategory = (category: string): Worker[] => {
  return dummyWorkers.filter((w) => w.category === category);
};

export const getWorkerById = (id: string): Worker | undefined => {
  return dummyWorkers.find((w) => w.id === id);
};

export const getJobById = (id: string): Job | undefined => {
  return dummyJobs.find((j) => j.id === id);
};

export const getFeaturedWorkers = (): Worker[] => {
  return dummyWorkers.slice(0, 4);
};
