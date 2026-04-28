const mongoose = require('mongoose');
const User = require('./models/User');
const Job = require('./models/Job');
const Service = require('./models/Service');
const InHouseStaff = require('./models/InHouseStaff');
const bcrypt = require('bcryptjs');

require('dotenv').config();

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Seed users
const seedUsers = async () => {
  console.log('🌱 Seeding users...');

  const hashedPassword = await bcrypt.hash('test123', 10);

  const users = [
    // Customers
    {
      name: 'Ali Khan',
      email: 'ali@gmail.com',
      password: hashedPassword,
      role: 'customer',
      location: 'Lahore',
      phone: '+92-300-1234567',
    },
    {
      name: 'Sara Ahmed',
      email: 'sara@gmail.com',
      password: hashedPassword,
      role: 'customer',
      location: 'Karachi',
      phone: '+92-300-2345678',
    },
    {
      name: 'Usman Tariq',
      email: 'usman@gmail.com',
      password: hashedPassword,
      role: 'customer',
      location: 'Islamabad',
      phone: '+92-300-3456789',
    },
    // Workers
    {
      name: 'Bilal Hussain',
      email: 'bilal@gmail.com',
      password: hashedPassword,
      role: 'worker',
      location: 'Lahore',
      phone: '+92-300-4567890',
      skills: ['Plumbing', 'Electrical'],
      experience: '5 years',
      bio: 'Professional plumber and electrician with 5 years of experience.',
      rating: 4.8,
      totalReviews: 25,
      completedJobs: 50,
      responseTime: '2 hours',
      availability: true,
      wallet: { balance: 15000, pending: 2000 },
    },
    {
      name: 'Ahmed Raza',
      email: 'ahmed@gmail.com',
      password: hashedPassword,
      role: 'worker',
      location: 'Karachi',
      phone: '+92-300-5678901',
      skills: ['Electrical', 'Installation'],
      experience: '3 years',
      bio: 'Skilled electrician specializing in home wiring and installations.',
      rating: 4.6,
      totalReviews: 18,
      completedJobs: 35,
      responseTime: '4 hours',
      availability: true,
      wallet: { balance: 12000, pending: 1500 },
    },
    {
      name: 'Hassan Ali',
      email: 'hassan@gmail.com',
      password: hashedPassword,
      role: 'worker',
      location: 'Islamabad',
      phone: '+92-300-6789012',
      skills: ['Painting', 'Carpentry'],
      experience: '4 years',
      bio: 'Expert painter and carpenter for all your home improvement needs.',
      rating: 4.7,
      totalReviews: 22,
      completedJobs: 40,
      responseTime: '3 hours',
      availability: true,
      wallet: { balance: 18000, pending: 2500 },
    },
  ];

  await User.deleteMany({});
  await User.insertMany(users);
  console.log('✅ Users seeded successfully');
};

// Seed services
const seedServices = async () => {
  console.log('🌱 Seeding services...');

  const users = await User.find({ role: 'worker' });

  const services = [
    // Bilal's services
    {
      title: 'Plumbing Service',
      description: 'Complete plumbing solutions including pipe repair, installation, and maintenance.',
      price: 2000,
      category: 'Plumbing',
      worker: users.find(u => u.email === 'bilal@gmail.com')._id,
      isActive: true,
    },
    {
      title: 'Electrical Service',
      description: 'Professional electrical work including wiring, outlets, and repairs.',
      price: 2500,
      category: 'Electrical',
      worker: users.find(u => u.email === 'bilal@gmail.com')._id,
      isActive: true,
    },
    // Ahmed's services
    {
      title: 'House Wiring',
      description: 'Complete house wiring, electrical panel installation, and safety checks.',
      price: 5000,
      category: 'Electrical',
      worker: users.find(u => u.email === 'ahmed@gmail.com')._id,
      isActive: true,
    },
    {
      title: 'Appliance Installation',
      description: 'Installation of electrical appliances including AC, fans, and lighting.',
      price: 1500,
      category: 'other',
      worker: users.find(u => u.email === 'ahmed@gmail.com')._id,
      isActive: true,
    },
    // Hassan's services
    {
      title: 'House Painting',
      description: 'Interior and exterior painting services with premium quality paints.',
      price: 8000,
      category: 'Painting',
      worker: users.find(u => u.email === 'hassan@gmail.com')._id,
      isActive: true,
    },
    {
      title: 'Carpentry Work',
      description: 'Custom furniture, door installation, and woodwork repairs.',
      price: 3500,
      category: 'Carpentry',
      worker: users.find(u => u.email === 'hassan@gmail.com')._id,
      isActive: true,
    },
  ];

  await Service.deleteMany({});
  await Service.insertMany(services);
  console.log('✅ Services seeded successfully');
};

// Seed in-house staff
const seedInHouseStaff = async () => {
  console.log('🌱 Seeding in-house staff...');

  const staff = [
    {
      name: 'Muhammad Asif',
      skills: ['pipe repair', 'leak fixing', 'drain cleaning'],
      category: 'plumbing',
      hourlyRate: 1500,
      rating: 4.5,
      location: 'Lahore',
      phone: '+92-300-1111111',
      availability: true,
    },
    {
      name: 'Ahmed Electrical',
      skills: ['wiring', 'outlet installation', 'panel repair'],
      category: 'electrical',
      hourlyRate: 1800,
      rating: 4.7,
      location: 'Karachi',
      phone: '+92-300-2222222',
      availability: true,
    },
    {
      name: 'Fatima Painter',
      skills: ['interior painting', 'wall preparation', 'color matching'],
      category: 'painting',
      hourlyRate: 1200,
      rating: 4.3,
      location: 'Islamabad',
      phone: '+92-300-3333333',
      availability: true,
    },
    {
      name: 'Hassan Carpenter',
      skills: ['furniture repair', 'door installation', 'cabinet making'],
      category: 'carpentry',
      hourlyRate: 2000,
      rating: 4.6,
      location: 'Lahore',
      phone: '+92-300-4444444',
      availability: true,
    },
    {
      name: 'Ayesha Cleaning',
      skills: ['deep cleaning', 'carpet cleaning', 'window cleaning'],
      category: 'cleaning',
      hourlyRate: 800,
      rating: 4.4,
      location: 'Karachi',
      phone: '+92-300-5555555',
      availability: true,
    },
  ];

  await InHouseStaff.deleteMany({});
  await InHouseStaff.insertMany(staff);
  console.log('✅ In-house staff seeded successfully');
};

// Seed jobs
const seedJobs = async () => {
  console.log('🌱 Seeding jobs...');

  const users = await User.find({ role: 'customer' });

  const jobs = [
    // Ali's jobs
    {
      title: 'Fix kitchen sink',
      description: 'Kitchen sink is leaking and needs immediate repair. The faucet is also not working properly.',
      budget: 1500,
      location: 'Lahore',
      category: 'Plumbing',
      employer: users.find(u => u.email === 'ali@gmail.com')._id,
      status: 'pending',
      requiredSkills: ['Plumbing'],
    },
    // Sara's jobs
    {
      title: 'House wiring issue',
      description: 'Multiple electrical outlets in the living room are not working. Need complete wiring check.',
      budget: 5000,
      location: 'Karachi',
      category: 'Electrical',
      employer: users.find(u => u.email === 'sara@gmail.com')._id,
      status: 'pending',
      requiredSkills: ['Electrical'],
    },
    // Usman's jobs
    {
      title: 'Room painting',
      description: 'Need to paint two bedrooms and hallway. Walls need preparation and two coats of paint.',
      budget: 10000,
      location: 'Islamabad',
      category: 'Painting',
      employer: users.find(u => u.email === 'usman@gmail.com')._id,
      status: 'pending',
      requiredSkills: ['Painting'],
    },
  ];

  await Job.deleteMany({});
  await Job.insertMany(jobs);
  console.log('✅ Jobs seeded successfully');
};

// Main seed function
const seedDatabase = async () => {
  try {
    await connectDB();
    await seedUsers();
    await seedServices();
    await seedInHouseStaff();
    await seedJobs();
    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();