const mongoose = require('mongoose');

const carSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Please add a brand'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Please add a model'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Please add a year'],
      min: [1900, 'Year must be after 1900'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the future'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price must be positive'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'sold', 'pending'],
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Car', carSchema);

