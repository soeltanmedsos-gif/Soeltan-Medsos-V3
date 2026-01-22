const { body, param, validationResult } = require('express-validator');

/**
 * Validation error handler middleware
 */
function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validasi gagal',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg,
            })),
        });
    }
    next();
}

// Order creation validation
const validateOrderCreate = [
    body('product_id')
        .notEmpty().withMessage('Product ID wajib diisi')
        .isUUID().withMessage('Product ID tidak valid'),
    body('buyer_phone')
        .notEmpty().withMessage('Nomor telepon wajib diisi')
        .isLength({ min: 10, max: 15 }).withMessage('Nomor telepon harus 10-15 digit'),
    body('target_link')
        .optional()
        .custom((value) => {
            // Allow either URL format or simple username/text
            // Just check if not empty and reasonable length
            if (value && (value.length < 2 || value.length > 500)) {
                throw new Error('Target link/username harus 2-500 karakter');
            }
            return true;
        }),
    body('quantity')
        .optional()
        .isInt({ min: 1 }).withMessage('Jumlah minimal 1'),
    handleValidationErrors,
];

// Admin login validation
const validateAdminLogin = [
    body('email')
        .notEmpty().withMessage('Email wajib diisi')
        .isEmail().withMessage('Format email tidak valid'),
    body('password')
        .notEmpty().withMessage('Password wajib diisi')
        .isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
    handleValidationErrors,
];

// Product creation validation
const validateProductCreate = [
    body('name')
        .notEmpty().withMessage('Nama produk wajib diisi')
        .isLength({ max: 200 }).withMessage('Nama produk maksimal 200 karakter'),
    body('platform')
        .notEmpty().withMessage('Platform wajib diisi'),
    body('price')
        .notEmpty().withMessage('Harga wajib diisi')
        .isInt({ min: 1 }).withMessage('Harga harus bilangan positif'),
    body('description')
        .optional()
        .isLength({ max: 500 }).withMessage('Deskripsi maksimal 500 karakter'),
    handleValidationErrors,
];

// Product update validation
const validateProductUpdate = [
    param('id')
        .isUUID().withMessage('Product ID tidak valid'),
    body('name')
        .optional()
        .isLength({ max: 200 }).withMessage('Nama produk maksimal 200 karakter'),
    body('price')
        .optional()
        .isInt({ min: 1 }).withMessage('Harga harus bilangan positif'),
    handleValidationErrors,
];

// Status seller update validation
const validateStatusSellerUpdate = [
    param('id')
        .isUUID().withMessage('Order ID tidak valid'),
    body('status_seller')
        .notEmpty().withMessage('Status seller wajib diisi')
        .isIn(['pending', 'process', 'done']).withMessage('Status tidak valid'),
    handleValidationErrors,
];


// Status payment update validation
const validateStatusPaymentUpdate = [
    param('id')
        .isUUID().withMessage('Order ID tidak valid'),
    body('status_payment')
        .notEmpty().withMessage('Status payment wajib diisi')
        .isIn(['pending', 'waiting_payment', 'paid', 'expire']).withMessage('Status pembayaran tidak valid'),
    handleValidationErrors,
];

// Purchase code validation
const validatePurchaseCode = [
    param('purchase_code')
        .notEmpty().withMessage('Purchase code wajib diisi')
        .matches(/^SM-[A-Z0-9]{8}$/).withMessage('Format purchase code tidak valid'),
    handleValidationErrors,
];

module.exports = {
    handleValidationErrors,
    validateOrderCreate,
    validateAdminLogin,
    validateProductCreate,
    validateProductUpdate,
    validateStatusSellerUpdate,
    validateStatusPaymentUpdate,
    validatePurchaseCode,
};
