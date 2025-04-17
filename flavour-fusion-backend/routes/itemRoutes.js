const express = require('express');
const multer = require('multer');
const { verifyToken, restrictTo } = require('../middlewares/authMiddleware');
const itemController = require('../controllers/itemController');

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Routes
router.post('/', verifyToken, restrictTo('restaurant'), upload.single('image'), itemController.createItem);
router.get('/:id', verifyToken, itemController.getItemsByRestaurant);
router.patch('/:id/availability', verifyToken, restrictTo('restaurant'), itemController.updateItemAvailability);
router.patch('/:id/quantity', verifyToken, restrictTo('restaurant'), itemController.updateItemQuantity);

module.exports = router;
