const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
  loginUser,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const { verifyToken, restrictTo, authorizeRoles } = require('../middlewares/authMiddleware');

// ✅ Multer setup for image upload
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

// ✅ Public route
router.post('/login', loginUser);

// ✅ Admin-only routes
router.get('/', verifyToken, restrictTo('admin', 'restaurant'), getAllUsers);
router.post('/',  upload.single('image'), createUser);
router.put('/:id', verifyToken, restrictTo('admin'), upload.single('image'), updateUser);
router.delete('/:id', verifyToken, restrictTo('admin'), deleteUser);

module.exports = router;
