const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('../models/User');
const Car = require('../models/Car');
const Offer = require('../models/Offer');

const seedData = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/carhub';
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB successfully!');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('\nClearing existing data...');
    await User.deleteMany({});
    await Car.deleteMany({});
    await Offer.deleteMany({});
    console.log('✓ Existing data cleared');

    // Create sample users
    console.log('\nCreating sample users...');
    const sellerPassword = await bcrypt.hash('seller123', 10);
    const buyerPassword = await bcrypt.hash('buyer123', 10);

    const seller = await User.create({
      name: 'John Seller',
      email: 'seller@carhub.com',
      password: sellerPassword,
      role: 'seller',
    });

    const buyer1 = await User.create({
      name: 'Alice Buyer',
      email: 'buyer@carhub.com',
      password: buyerPassword,
      role: 'buyer',
    });

    const buyer2 = await User.create({
      name: 'Bob Customer',
      email: 'bob@carhub.com',
      password: buyerPassword,
      role: 'buyer',
    });

    console.log('✓ Sample users created');

    // Create sample cars
    console.log('\nCreating sample cars...');
    const cars = await Car.create([
      {
        title: '2023 Tesla Model 3',
        brand: 'Tesla',
        model: 'Model 3',
        year: 2023,
        price: 45000,
        description: 'Excellent condition, low mileage, fully electric vehicle with autopilot.',
        images: [],
        sellerId: seller._id,
        status: 'available',
      },
      {
        title: '2022 BMW 3 Series',
        brand: 'BMW',
        model: '3 Series',
        year: 2022,
        price: 38000,
        description: 'Luxury sedan with premium features, well maintained.',
        images: [],
        sellerId: seller._id,
        status: 'available',
      },
      {
        title: '2021 Honda Civic',
        brand: 'Honda',
        model: 'Civic',
        year: 2021,
        price: 22000,
        description: 'Reliable and fuel-efficient, perfect for daily commute.',
        images: [],
        sellerId: seller._id,
        status: 'available',
      },
      {
        title: '2020 Mercedes-Benz C-Class',
        brand: 'Mercedes',
        model: 'C-Class',
        year: 2020,
        price: 35000,
        description: 'Elegant luxury sedan with advanced technology features.',
        images: [],
        sellerId: seller._id,
        status: 'available',
      },
    ]);

    console.log('✓ Sample cars created');

    // Create sample offers
    console.log('\nCreating sample offers...');
    await Offer.create([
      {
        carId: cars[0]._id,
        buyerId: buyer1._id,
        amount: 43000,
        message: 'I am very interested in this car. Can we negotiate the price?',
        status: 'pending',
      },
      {
        carId: cars[1]._id,
        buyerId: buyer1._id,
        amount: 36000,
        message: 'Would you consider this offer?',
        status: 'pending',
      },
      {
        carId: cars[0]._id,
        buyerId: buyer2._id,
        amount: 44000,
        message: 'Ready to purchase immediately if price is acceptable.',
        status: 'pending',
      },
    ]);

    console.log('✓ Sample offers created');

    console.log('\n✅ Seed data created successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('\nSeller:');
    console.log('  Email: seller@carhub.com');
    console.log('  Password: seller123');
    console.log('\nBuyer:');
    console.log('  Email: buyer@carhub.com');
    console.log('  Password: buyer123');

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

