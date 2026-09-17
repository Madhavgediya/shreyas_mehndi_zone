const express = require('express');
const router = express.Router();
const {
  getDesigns,
  getFeaturedDesigns,
  getDesignBySlug,
  recordShare,
  createDesign,
  updateDesign,
  deleteDesign,
} = require('../controllers/designController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getDesigns);
router.get('/featured', getFeaturedDesigns);
router.get('/:slug', getDesignBySlug);
router.post('/:id/share', recordShare);

router.post('/', protect, adminOnly, createDesign);
router.put('/:id', protect, adminOnly, updateDesign);
router.delete('/:id', protect, adminOnly, deleteDesign);

module.exports = router;
