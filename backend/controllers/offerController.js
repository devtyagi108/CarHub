const Offer = require('../models/Offer');
const Car = require('../models/Car');

// @desc    Create an offer
// @route   POST /api/offers
// @access  Private (Buyer only)
const createOffer = async (req, res) => {
  try {
    const { carId, amount, message } = req.body;

    if (!carId || !amount) {
      return res.status(400).json({ message: 'Please provide car ID and amount' });
    }

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    if (car.sellerId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot make an offer on your own car' });
    }

    if (car.status !== 'available') {
      return res.status(400).json({ message: 'Car is not available' });
    }

    const offer = await Offer.create({
      carId,
      buyerId: req.user._id,
      amount: parseFloat(amount),
      message: message || '',
    });

    const populatedOffer = await Offer.findById(offer._id)
      .populate('buyerId', 'name email')
      .populate('carId', 'title brand model price');

    res.status(201).json(populatedOffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get offers for a car
// @route   GET /api/offers/car/:carId
// @access  Private
const getCarOffers = async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Only seller can see offers for their car
    if (car.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these offers' });
    }

    const offers = await Offer.find({ carId: req.params.carId })
      .populate('buyerId', 'name email')
      .populate('carId', 'title brand model price')
      .sort({ createdAt: -1 });

    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my offers (buyer)
// @route   GET /api/offers/my-offers
// @access  Private
const getMyOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ buyerId: req.user._id })
      .populate('carId', 'title brand model price images sellerId')
      .populate('carId.sellerId', 'name email')
      .sort({ createdAt: -1 });

    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all requests for seller's cars
// @route   GET /api/offers/seller-requests
// @access  Private (Seller only)
const getSellerRequests = async (req, res) => {
  try {
    const myCars = await Car.find({ sellerId: req.user._id });
    const carIds = myCars.map(car => car._id);

    const offers = await Offer.find({ carId: { $in: carIds } })
      .populate('buyerId', 'name email')
      .populate('carId', 'title brand model price images')
      .sort({ createdAt: -1 });

    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update offer status
// @route   PUT /api/offers/:id/status
// @access  Private (Seller only)
const updateOfferStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const offer = await Offer.findById(req.params.id).populate('carId');
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    if (offer.carId.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    offer.status = status;
    await offer.save();

    if (status === 'accepted') {
      await Car.findByIdAndUpdate(offer.carId._id, { status: 'sold' });
    }

    const populatedOffer = await Offer.findById(offer._id)
      .populate('buyerId', 'name email')
      .populate('carId', 'title brand model price');

    res.json(populatedOffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOffer,
  getCarOffers,
  getMyOffers,
  getSellerRequests,
  updateOfferStatus,
};

