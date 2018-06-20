const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/auth');

const OrdersController = require('../controllers/orders');

router.get('/', checkAuth, OrdersController.orders_get_all);

router.post('/save', checkAuth, OrdersController.orders_create_order);

router.get('/get/:orderId', checkAuth, OrdersController.orders_get_order);

router.delete('/delete/:orderId', checkAuth, OrdersController.orders_delete_order);

module.exports = router;