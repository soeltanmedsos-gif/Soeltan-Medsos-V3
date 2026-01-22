const express = require('express');
const webhookController = require('../controllers/webhookController');
const { webhookLimiter } = require('../middleware/rateLimit');
const Order = require('../services/supabase'); // Directly accessing DB for dev helper

const router = express.Router();

// Midtrans webhook
router.post('/midtrans/webhook', webhookLimiter, webhookController.handleWebhook);

// Transaction status check (for debugging)
router.get('/midtrans/status/:orderId', webhookController.getTransactionStatus);

// DEVELOPMENT ONLY: Force update status for dummy payment simulation
if (process.env.NODE_ENV !== 'production') {
    router.post('/dev/force-success', async (req, res) => {
        try {
            const { purchase_code } = req.body;
            if (!purchase_code) return res.status(400).json({ error: 'Purchase code required' });

            // Directly update database to 'paid'
            const { data, error } = await Order.from('orders')
                .update({
                    status_payment: 'paid',
                    updated_at: new Date()
                })
                .eq('purchase_code', purchase_code)
                .select();

            if (error) throw error;

            res.json({ success: true, message: 'Forced success for dev testing', data });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}

module.exports = router;
