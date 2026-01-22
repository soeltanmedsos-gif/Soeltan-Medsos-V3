const express = require('express');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const { validateOrderCreate, validatePurchaseCode } = require('../middleware/validation');
const { orderLimiter } = require('../middleware/rateLimit');

const router = express.Router();

// Products
router.get('/products', productController.getAllProducts);
router.get('/product/:id', productController.getProductById);
router.get('/platforms', productController.getPlatforms);
router.get('/platforms/:platform/sub-platforms', productController.getSubPlatforms);

// Orders
router.post('/order/create', orderLimiter, validateOrderCreate, orderController.createOrder);
router.get('/order/status/:purchase_code', validatePurchaseCode, orderController.getOrderStatus);
router.post('/order/pay', orderController.createPayment);
router.post('/order/:purchaseCode/refresh-status', orderController.refreshPaymentStatus);

module.exports = router;
