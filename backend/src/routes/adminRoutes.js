const express = require('express');
const adminController = require('../controllers/adminController');
const { authMiddleware, superAdminOnly } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimit');
const {
    validateAdminLogin,
    validateProductCreate,
    validateProductUpdate,
    validateStatusSellerUpdate,
    validateStatusPaymentUpdate
} = require('../middleware/validation');

const router = express.Router();

// Auth (no middleware)
router.post('/login', authLimiter, validateAdminLogin, adminController.login);

// Protected routes (require auth)
router.use(authMiddleware);

// Profile
router.get('/profile', adminController.getProfile);

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// Products
router.get('/products', adminController.getAllProducts);
router.post('/product', validateProductCreate, adminController.createProduct);
router.put('/product/:id', validateProductUpdate, adminController.updateProduct);
router.delete('/product/:id', adminController.deleteProduct);

// Orders
router.get('/orders', adminController.getAllOrders);
router.get('/order/:id', adminController.getOrderDetail);
router.put('/order/:id/status-seller', validateStatusSellerUpdate, adminController.updateSellerStatus);
router.put('/order/:id/status-payment', validateStatusPaymentUpdate, adminController.updatePaymentStatus);
router.delete('/order/:id', adminController.deleteOrder);
router.delete('/orders/batch', adminController.batchDeleteOrders);

// Payment logs
router.get('/payment-logs', adminController.getPaymentLogs);

// Admin users (superadmin only)
router.post('/users', superAdminOnly, adminController.createAdmin);

module.exports = router;
