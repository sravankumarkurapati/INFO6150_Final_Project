const express = require('express');
const { verifyToken, restrictTo } = require('../middlewares/authMiddleware');
const {
  getAdminCommissions,
  getRestaurantCommissions
} = require('../controllers/commissionController');

const router = express.Router();

// Admin can view all   restaurant commissions
router.get('/admin', verifyToken, restrictTo('admin'), getAdminCommissions);

// Admin or restaurant  owner can view a specific restaurant's commissions
router.get('/restaurant/:id', verifyToken, restrictTo('restaurant', 'admin'), getRestaurantCommissions);

module.exports = router;
