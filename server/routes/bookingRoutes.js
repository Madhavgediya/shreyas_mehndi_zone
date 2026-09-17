const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
} = require('../controllers/bookingController');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/:id', optionalAuth, getBookingById);

router.get('/', protect, adminOnly, getAllBookings);
router.put('/:id/status', protect, adminOnly, updateBookingStatus);
router.delete('/:id', protect, adminOnly, deleteBooking);

module.exports = router;
