const supabase = require('../services/supabase');
const midtransService = require('../services/midtrans');
const { mapPaymentStatus } = require('../utils/helpers');

/**
 * Handle Midtrans webhook notification
 * @route POST /api/midtrans/webhook
 */
async function handleWebhook(req, res) {
    try {
        const notification = req.body;
        console.log('Received webhook:', JSON.stringify(notification, null, 2));

        // Verify notification with Midtrans
        const statusResponse = await midtransService.verifyNotification(notification);

        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;
        const paymentType = statusResponse.payment_type;

        // Map to internal payment status
        const internalStatus = mapPaymentStatus(transactionStatus, fraudStatus);

        // Get order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

        if (orderError || !order) {
            console.error('Order not found for webhook:', orderId);
            // Return 200 to prevent Midtrans retrying
            return res.status(200).json({ message: 'Order not found' });
        }

        // Log payment
        const { error: logError } = await supabase
            .from('payment_logs')
            .insert({
                order_id: order.id,
                transaction_id: statusResponse.transaction_id,
                transaction_status: transactionStatus,
                payment_type: paymentType,
                raw_webhook: notification,
            });

        if (logError) {
            console.error('Failed to log payment:', logError);
        }

        // Update order status
        const { error: updateError } = await supabase
            .from('orders')
            .update({
                status_payment: internalStatus,
            })
            .eq('id', order.id);

        if (updateError) {
            console.error('Failed to update order:', updateError);
        }

        console.log(`Order ${orderId} updated to status: ${internalStatus}`);

        // Always return 200 to acknowledge webhook
        res.status(200).json({
            success: true,
            message: 'Webhook processed',
        });
    } catch (error) {
        console.error('Webhook handler error:', error);
        // Still return 200 to prevent Midtrans retrying
        res.status(200).json({
            success: false,
            message: 'Webhook processing failed',
        });
    }
}

/**
 * Get transaction status (for manual checking)
 * @route GET /api/midtrans/status/:orderId
 */
async function getTransactionStatus(req, res) {
    try {
        const { orderId } = req.params;

        const status = await midtransService.getTransactionStatus(orderId);

        res.json({
            success: true,
            data: status,
        });
    } catch (error) {
        console.error('Get transaction status error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil status transaksi',
        });
    }
}

module.exports = {
    handleWebhook,
    getTransactionStatus,
};
