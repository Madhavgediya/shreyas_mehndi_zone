const express = require('express');
const router = express.Router();
const {
  toggleFavorite,
  getMyFavorites,
} = require('../controllers/favoriteController');
const { optionalAuth } = require('../middleware/auth');

router.post('/toggle', optionalAuth, toggleFavorite);
router.get('/', optionalAuth, getMyFavorites);

module.exports = router;
