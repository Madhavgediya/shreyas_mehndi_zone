const express = require('express');
const router = express.Router();
const {
  submitInquiry,
  getAllInquiries,
  updateInquiryStatus,
  deleteInquiry,
} = require('../controllers/inquiryController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', submitInquiry);

router.get('/', protect, adminOnly, getAllInquiries);
router.put('/:id/status', protect, adminOnly, updateInquiryStatus);
router.delete('/:id', protect, adminOnly, deleteInquiry);

module.exports = router;
