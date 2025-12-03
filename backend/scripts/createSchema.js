const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Import models to register them
const User = require('../models/User');
const Car = require('../models/Car');
const Offer = require('../models/Offer');

const createSchema = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/carhub';
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB successfully!');

    // Create indexes for better performance
    console.log('\nCreating indexes...');

    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    console.log('✓ User email index created');

    // Car indexes
    await Car.collection.createIndex({ sellerId: 1 });
    await Car.collection.createIndex({ brand: 1 });
    await Car.collection.createIndex({ year: 1 });
    await Car.collection.createIndex({ price: 1 });
    await Car.collection.createIndex({ status: 1 });
    await Car.collection.createIndex({ createdAt: -1 });
    // Text search index
    await Car.collection.createIndex({ 
      title: 'text', 
      brand: 'text', 
      model: 'text', 
      description: 'text' 
    });
    console.log('✓ Car indexes created');

    // Offer indexes
    await Offer.collection.createIndex({ carId: 1 });
    await Offer.collection.createIndex({ buyerId: 1 });
    await Offer.collection.createIndex({ status: 1 });
    await Offer.collection.createIndex({ createdAt: -1 });
    console.log('✓ Offer indexes created');

    console.log('\n✅ Schema setup completed successfully!');
    console.log('\nCollections created:');
    console.log('  - users');
    console.log('  - cars');
    console.log('  - offers');

    // Display schema information
    console.log('\n📋 Schema Details:');
    console.log('\n1. Users Collection:');
    console.log('   - name: String (required)');
    console.log('   - email: String (required, unique, lowercase)');
    console.log('   - password: String (required, minlength: 6, hashed)');
    console.log('   - role: String (enum: ["seller", "buyer"], default: "buyer")');
    console.log('   - createdAt: Date');
    console.log('   - updatedAt: Date');

    console.log('\n2. Cars Collection:');
    console.log('   - title: String (required)');
    console.log('   - brand: String (required)');
    console.log('   - model: String (required)');
    console.log('   - year: Number (required, min: 1900)');
    console.log('   - price: Number (required, min: 0)');
    console.log('   - description: String');
    console.log('   - images: [String] (array of image URLs)');
    console.log('   - sellerId: ObjectId (ref: User, required)');
    console.log('   - status: String (enum: ["available", "sold", "pending"], default: "available")');
    console.log('   - createdAt: Date');
    console.log('   - updatedAt: Date');

    console.log('\n3. Offers Collection:');
    console.log('   - carId: ObjectId (ref: Car, required)');
    console.log('   - buyerId: ObjectId (ref: User, required)');
    console.log('   - amount: Number (required, min: 0)');
    console.log('   - message: String');
    console.log('   - status: String (enum: ["pending", "accepted", "rejected"], default: "pending")');
    console.log('   - createdAt: Date');
    console.log('   - updatedAt: Date');

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up schema:', error);
    process.exit(1);
  }
};

createSchema();

