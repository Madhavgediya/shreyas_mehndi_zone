const express = require('express');
const router = express.Router();
const {
  getSiteSettings,
  updateSiteSettings,
} = require('../controllers/settingsController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getSiteSettings);
router.put('/', protect, adminOnly, updateSiteSettings);

module.exports = router;
