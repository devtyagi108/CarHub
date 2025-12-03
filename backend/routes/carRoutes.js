const express = require('express');
const router = express.Router();
const {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  getMyCars,
} = require('../controllers/carController');
const { protect, sellerOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getCars);
router.get('/my-cars', protect, sellerOnly, getMyCars);
router.get('/:id', getCarById);
router.post('/', protect, sellerOnly, upload.array('images', 10), createCar);
router.put('/:id', protect, sellerOnly, upload.array('images', 10), updateCar);
router.delete('/:id', protect, sellerOnly, deleteCar);

module.exports = router;

