const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
  getAllRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantByOwner
} = require('../controllers/restaurantController');

const { verifyToken, restrictTo } = require('../middlewares/authMiddleware');

// ✅ Multer config for restaurant image upload
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// ✅ Admin-only CRUD routes for restaurants
router.get('/', verifyToken, restrictTo('admin', 'customer', 'restaurant'), getAllRestaurants);

router.post('/', verifyToken, restrictTo('admin'), upload.single('image'), createRestaurant);
router.put('/:id', verifyToken, restrictTo('admin'), upload.single('image'), updateRestaurant);
router.delete('/:id', verifyToken, restrictTo('admin'), deleteRestaurant);

// ✅ Restaurant Owner: get their own restaurant by user ID
router.get('/user/:ownerId', verifyToken, restrictTo('restaurant'), getRestaurantByOwner);

module.exports = router;
