const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const matchedUser = await User.findOne({ email });

    if (!matchedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, matchedUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: matchedUser._id, type: matchedUser.type },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      _id: matchedUser._id,
      fullName: matchedUser.fullName,
      email: matchedUser.email,
      type: matchedUser.type,
      address: matchedUser.address || '',
      profileImage: matchedUser.profileImage,
      token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👤 GET all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'fullName email type address profileImage');
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// ➕ CREATE user (admin or signup)
exports.createUser = async (req, res) => {
  try {
    const { fullName, email, password, type, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      type,
      address,
      profileImage
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user', error });
  }
};

// 📝 UPDATE user (admin only)
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = { ...req.body };

    // If a new password is provided, hash it
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    } else {
      delete updates.password; // Avoid resetting password to undefined
    }

    // If new image uploaded, update image path
    if (req.file) {
      updates.profileImage = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Update User Error:', error);
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
};

// ❌ DELETE user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};