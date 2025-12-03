const express = require('express');
const router = express.Router();
const {
  createOffer,
  getCarOffers,
  getMyOffers,
  getSellerRequests,
  updateOfferStatus,
} = require('../controllers/offerController');
const { protect, sellerOnly, buyerOnly } = require('../middleware/authMiddleware');

router.post('/', protect, buyerOnly, createOffer);
router.get('/my-offers', protect, getMyOffers);
router.get('/seller-requests', protect, sellerOnly, getSellerRequests);
router.get('/car/:carId', protect, getCarOffers);
router.put('/:id/status', protect, sellerOnly, updateOfferStatus);

module.exports = router;

