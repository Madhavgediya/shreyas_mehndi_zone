const express = require('express');
const router = express.Router();
const {
  getApprovedTestimonials,
  submitTestimonial,
  getAllTestimonials,
  updateTestimonialStatus,
  deleteTestimonial,
} = require('../controllers/testimonialController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getApprovedTestimonials);
router.post('/', submitTestimonial);

router.get('/all', protect, adminOnly, getAllTestimonials);
router.put('/:id', protect, adminOnly, updateTestimonialStatus);
router.delete('/:id', protect, adminOnly, deleteTestimonial);

module.exports = router;
