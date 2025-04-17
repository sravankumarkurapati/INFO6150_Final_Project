
const Order = require('../models/Order');
const Item = require('../models/Item');
const User = require('../models/User');

// Customer  places an order
exports.createOrder = async (req, res) => {
  try {
    const { restaurant, items, totalAmount } = req.body;

    for (const orderItem of items) {
      const item = await Item.findById(orderItem.item);
      if (!item) return res.status(404).json({ message: 'Item not found' });

      if (item.quantity < orderItem.quantity) {
        return res.status(400).json({
          message: `Item '${item.name}' is out of stock or insufficient quantity.`
        });
      }
    }

    for (const orderItem of items) {
      const item = await Item.findById(orderItem.item);
      item.quantity -= orderItem.quantity;
      if (item.quantity === 0) item.availability = false;
      await item.save();
    }

    const order = await Order.create({
      customer: req.user._id,
      restaurant,
      items,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending'
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrdersByRestaurant = async (req, res) => {
  try {
    const orders = await Order.find({ restaurant: req.params.restaurantId })
      .populate('items.item')
      .populate('customer')
      .populate('deliveryPerson');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrdersByCustomer = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('items.item')
      .populate('restaurant')
      .populate('deliveryPerson');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'accepted', 'preparing', 'delivering', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.assignDeliveryPerson = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryPersonId } = req.body;

    const deliveryUser = await User.findById(deliveryPersonId);
    if (!deliveryUser || deliveryUser.type !== 'delivery') {
      return res.status(400).json({ message: 'Invalid delivery person ID' });
    }

    const order = await Order.findByIdAndUpdate(orderId, { deliveryPerson: deliveryPersonId }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrdersByDeliveryPerson = async (req, res) => {
  try {
    const orders = await Order.find({ deliveryPerson: req.params.deliveryPersonId })
      .populate('items.item')
      .populate('restaurant')
      .populate('customer');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.completePayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentStatus = "paid";
    await order.save();
    res.json({ message: "Payment marked as completed", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRestaurantIncome = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const paidOrders = await Order.find({
      restaurant: restaurantId,
      status: "completed",
      paymentStatus: "paid"
    });

    const totalIncome = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    res.json({ totalIncome, orders: paidOrders.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRestaurantStats = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const orders = await Order.find({ restaurant: restaurantId, paymentStatus: 'paid' });

    let totalRevenue = 0;
    let totalOrders = orders.length;

    for (const order of orders) {
      totalRevenue += order.totalAmount;
    }

    const totalCommission = totalRevenue * 0.10;

    res.json({ totalRevenue, totalCommission, totalOrders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin route to get total commission from all restaurants
exports.getRestaurantCommissions = async (req, res) => {
  try {
    const paidOrders = await Order.find({ paymentStatus: 'paid' }).populate('restaurant');

    const commissionMap = {};

    paidOrders.forEach(order => {
      const restId = order.restaurant._id;
      const restName = order.restaurant.name;
      if (!commissionMap[restId]) {
        commissionMap[restId] = {
          restaurantId: restId,
          restaurantName: restName,
          totalCommission: 0,
          totalRevenue: 0,
          orderCount: 0
        };
      }
      commissionMap[restId].totalCommission += order.totalAmount * 0.10;
      commissionMap[restId].totalRevenue += order.totalAmount;
      commissionMap[restId].orderCount += 1;
    });

    const result = Object.values(commissionMap);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to calculate commissions', error: err.message });
  }
};