const Restaurant = require('../models/Restaurant');

// GET all restaurants
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate('owner', 'fullName email');
    res.status(200).json(restaurants);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch restaurants' });
  }
};

// CREATE new restaurant (admin only)
exports.createRestaurant = async (req, res) => {
  try {
    const { name, category, commissionRate, owner } = req.body;

    const existing = await Restaurant.findOne({ name, owner });
    if (existing) return res.status(400).json({ message: 'Restaurant already exists for this owner' });

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newRestaurant = new Restaurant({
      name,
      category,
      commissionRate,
      image,
      owner
    });

    await newRestaurant.save();
    res.status(201).json({ message: 'Restaurant created', restaurant: newRestaurant });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create restaurant', error: err });
  }
};

// UPDATE restaurant
exports.updateRestaurant = async (req, res) => {
  try {
    const updates = req.body;
    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`;
    }

    const updated = await Restaurant.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.status(200).json({ message: 'Restaurant updated', restaurant: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update restaurant', error: err });
  }
};

// DELETE restaurant
exports.deleteRestaurant = async (req, res) => {
  try {
    await Restaurant.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Restaurant deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete restaurant' });
  }
};

// ✅ GET restaurant by owner ID
exports.getRestaurantByOwner = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.params.ownerId });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.status(200).json({ restaurant });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch restaurant by owner', error: err.message });
  }
};