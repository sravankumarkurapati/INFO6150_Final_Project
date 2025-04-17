const path = require('path');

exports.uploadImage = (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.status(200).json({ imagePath: `/uploads/profile/${req.file.filename}` });
};
