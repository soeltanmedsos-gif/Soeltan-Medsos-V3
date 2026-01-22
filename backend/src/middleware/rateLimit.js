const rateLimit = require('express-rate-limit');

// General API rate limit
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Terlalu banyak permintaan. Silakan coba lagi nanti.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Stricter limit for auth endpoints
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 login attempts per hour
    message: {
        success: false,
        message: 'Terlalu banyak percobaan login. Silakan coba lagi dalam 1 jam.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Order creation limit
const orderLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 orders per minute
    message: {
        success: false,
        message: 'Terlalu banyak pesanan. Silakan tunggu sebentar.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Webhook limit (should be generous for Midtrans)
const webhookLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // Generous limit for webhooks
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    apiLimiter,
    authLimiter,
    orderLimiter,
    webhookLimiter,
};
