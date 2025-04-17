const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const Item = require('../models/Item');

// Admin can get commission  summary across  all restaurants
exports.getAdminCommissions = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().select('name totalCommission');
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin or restaurant owner  can view commission breakdown by restaurant  ID
exports.getRestaurantCommissions = async (req, res) => {
  try {
    const orders = await Order.find({ restaurant: req.params.id }).populate('commissionDetails.item');
    let totalCommission = 0;
    const breakdown = [];

    orders.forEach(order => {
      order.commissionDetails.forEach(cd => {
        totalCommission += cd.commission;
        breakdown.push({
          orderId: order._id,
          item: cd.item.name,
          commission: cd.commission
        });
      });
    });

    res.json({ totalCommission, breakdown });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
