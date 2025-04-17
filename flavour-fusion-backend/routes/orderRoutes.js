
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, restrictTo } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, restrictTo('customer'), orderController.createOrder);
router.get('/customer', verifyToken, restrictTo('customer'), orderController.getOrdersByCustomer);
router.get('/restaurant/:restaurantId', verifyToken, restrictTo('restaurant'), orderController.getOrdersByRestaurant);
router.get('/delivery/:deliveryPersonId', verifyToken, restrictTo('delivery'), orderController.getOrdersByDeliveryPerson);
router.put('/:orderId/status', verifyToken, orderController.updateOrderStatus);
router.put('/:orderId/assign', verifyToken, restrictTo('restaurant'), orderController.assignDeliveryPerson);
router.put('/:orderId/completePayment', verifyToken, restrictTo('customer'), orderController.completePayment);
router.get('/income/:restaurantId', verifyToken, restrictTo('restaurant'), orderController.getRestaurantIncome);
router.get('/restaurant/:restaurantId/stats', verifyToken, restrictTo('restaurant'), orderController.getRestaurantStats);
router.get('/admin/restaurant-commissions', verifyToken, restrictTo('admin'), orderController.getRestaurantCommissions);

module.exports = router;