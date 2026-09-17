const express = require('express');
const router = express.Router();
const {
  getPricing,
  createPricing,
  updatePricing,
  deletePricing,
} = require('../controllers/pricingController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getPricing);

router.post('/', protect, adminOnly, createPricing);
router.put('/:id', protect, adminOnly, updatePricing);
router.delete('/:id', protect, adminOnly, deletePricing);

module.exports = router;
