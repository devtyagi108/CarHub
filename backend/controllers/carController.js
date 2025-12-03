const Car = require('../models/Car');

// @desc    Get all cars with search, filter, sort, pagination
// @route   GET /api/cars
// @access  Public
const getCars = async (req, res) => {
  try {
    const {
      search,
      brand,
      minYear,
      maxYear,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = { status: 'available' };

    // Search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filters
    if (brand) query.brand = { $regex: brand, $options: 'i' };
    if (minYear || maxYear) {
      query.year = {};
      if (minYear) query.year.$gte = parseInt(minYear);
      if (maxYear) query.year.$lte = parseInt(maxYear);
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Sort
    let sortOption = {};
    if (sort === 'price-asc') sortOption.price = 1;
    else if (sort === 'price-desc') sortOption.price = -1;
    else if (sort === 'year-desc') sortOption.year = -1;
    else if (sort === 'year-asc') sortOption.year = 1;
    else sortOption.createdAt = -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const cars = await Car.find(query)
      .populate('sellerId', 'name email')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Car.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      cars,
      page: parseInt(page),
      totalPages,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get car by ID
// @route   GET /api/cars/:id
// @access  Public
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate('sellerId', 'name email');
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new car
// @route   POST /api/cars
// @access  Private (Seller only)
const createCar = async (req, res) => {
  try {
    const { title, brand, model, year, price, description } = req.body;

    if (!title || !brand || !model || !year || !price) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const car = await Car.create({
      title,
      brand,
      model,
      year: parseInt(year),
      price: parseFloat(price),
      description: description || '',
      images,
      sellerId: req.user._id,
    });

    const populatedCar = await Car.findById(car._id).populate('sellerId', 'name email');
    res.status(201).json(populatedCar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a car
// @route   PUT /api/cars/:id
// @access  Private (Seller only, owner only)
const updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    if (car.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this car' });
    }

    const { title, brand, model, year, price, description } = req.body;
    const updateData = {};

    if (title) updateData.title = title;
    if (brand) updateData.brand = brand;
    if (model) updateData.model = model;
    if (year) updateData.year = parseInt(year);
    if (price) updateData.price = parseFloat(price);
    if (description !== undefined) updateData.description = description;

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      updateData.images = [...car.images, ...newImages];
    }

    const updatedCar = await Car.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate('sellerId', 'name email');

    res.json(updatedCar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a car
// @route   DELETE /api/cars/:id
// @access  Private (Seller only, owner only)
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    if (car.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this car' });
    }

    await Car.findByIdAndDelete(req.params.id);
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get seller's cars
// @route   GET /api/cars/my-cars
// @access  Private (Seller only)
const getMyCars = async (req, res) => {
  try {
    const cars = await Car.find({ sellerId: req.user._id })
      .populate('sellerId', 'name email')
      .sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  getMyCars,
};

