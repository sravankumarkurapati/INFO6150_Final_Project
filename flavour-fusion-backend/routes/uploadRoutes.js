const express = require('express');
const multer = require('multer');
const { verifyToken } = require('../middlewares/authMiddleware');
const { uploadImage } = require('../controllers/uploadController');

const router = express.Router();

// Multer  config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/profiles/'), // ✅ matches your controller response
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ✅ Correct middleware usage
router.post('/', verifyToken, upload.single('image'), uploadImage);

module.exports = router;
