const Item = require('../models/Item');

// @desc Restaurant adds an item with image
exports.createItem = async (req, res) => {
  try {
    const { name, price, category, restaurant, availability, quantity } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    const exists = await Item.findOne({ name, restaurant });
    if (exists) {
      return res.status(400).json({ message: 'Item already exists in this restaurant.' });
    }

    const item = await Item.create({
      name,
      price,
      category,
      restaurant,
      image: imagePath,
      availability: availability === 'false' ? false : true,
      quantity: parseInt(quantity) || 0
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get all items for a restaurant
exports.getItemsByRestaurant = async (req, res) => {
  try {
    const items = await Item.find({ restaurant: req.params.id });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update item availability
exports.updateItemAvailability = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.availability = req.body.availability === 'true';
    await item.save();

    res.json({ message: 'Availability updated', item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update item quantity
exports.updateItemQuantity = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const newQuantity = parseInt(req.body.quantity);
    if (isNaN(newQuantity)) return res.status(400).json({ message: 'Invalid quantity' });

    item.quantity = newQuantity;
    item.availability = newQuantity > 0;

    await item.save();

    res.json({ message: 'Quantity updated', item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};