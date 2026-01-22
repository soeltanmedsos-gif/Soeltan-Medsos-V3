const supabase = require('../services/supabase');
const midtransService = require('../services/midtrans');
const { generatePurchaseCode, sanitizePhone, mapPaymentStatus } = require('../utils/helpers');

/**
 * Create a new order
 * @route POST /api/order/create
 */
async function createOrder(req, res) {
    try {
        const { product_id, buyer_phone, buyer_name, target_link, quantity = 1, notes } = req.body;

        // Get product
        const { data: product, error: productError } = await supabase
            .from('products')
            .select('*')
            .eq('id', product_id)
            .eq('is_active', true)
            .single();

        if (productError || !product) {
            return res.status(404).json({
                success: false,
                message: 'Produk tidak ditemukan',
            });
        }

        // Calculate total amount
        const amount = product.price * quantity;

        // Generate purchase code
        const purchase_code = generatePurchaseCode();

        // Sanitize phone
        const cleanPhone = sanitizePhone(buyer_phone);

        // Create order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                product_id,
                purchase_code,
                buyer_phone: cleanPhone,
                buyer_name: buyer_name || null,
                target_link: target_link || null,
                quantity,
                amount,
                notes: notes || null,
                status_payment: 'pending', // Pending until payment via Midtrans
                status_seller: 'pending',
            })
            .select()
            .single();

        if (orderError) throw orderError;

        res.status(201).json({
            success: true,
            message: 'Order berhasil dibuat',
            data: {
                order_id: order.id,
                purchase_code: order.purchase_code,
                amount: order.amount,
                product: {
                    id: product.id,
                    name: product.name,
                    platform: product.platform,
                    price: product.price,
                },
            },
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal membuat order',
        });
    }
}

/**
 * Get order status by purchase code
 * @route GET /api/order/status/:purchase_code
 */
async function getOrderStatus(req, res) {
    try {
        const { purchase_code } = req.params;

        const { data: order, error } = await supabase
            .from('orders')
            .select(`
        id,
        purchase_code,
        buyer_phone,
        target_link,
        quantity,
        amount,
        status_payment,
        status_seller,
        created_at,
        products (
          id,
          name,
          platform,
          price,
          description
        )
      `)
            .eq('purchase_code', purchase_code.toUpperCase())
            .single();

        if (error || !order) {
            return res.status(404).json({
                success: false,
                message: 'Order tidak ditemukan. Pastikan kode pembelian benar.',
            });
        }

        res.json({
            success: true,
            data: {
                purchase_code: order.purchase_code,
                product: order.products,
                quantity: order.quantity,
                amount: order.amount,
                status_payment: order.status_payment,
                status_seller: order.status_seller,
                created_at: order.created_at,
            },
        });
    } catch (error) {
        console.error('Get order status error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil status order',
        });
    }
}

/**
 * Generate payment token for an order
 * @route POST /api/order/pay
 */
async function createPayment(req, res) {
    try {
        const { purchase_code } = req.body;

        // Get order with product
        const { data: order, error } = await supabase
            .from('orders')
            .select(`
        *,
        products (*)
      `)
            .eq('purchase_code', purchase_code.toUpperCase())
            .single();

        if (error || !order) {
            return res.status(404).json({
                success: false,
                message: 'Order tidak ditemukan',
            });
        }

        // Check if already paid
        if (order.status_payment === 'paid') {
            return res.status(400).json({
                success: false,
                message: 'Order sudah dibayar',
            });
        }

        // Check if expired
        if (order.status_payment === 'expire') {
            return res.status(400).json({
                success: false,
                message: 'Order sudah kadaluarsa. Silakan buat order baru.',
            });
        }

        // If already has snap token, return it
        if (order.snap_token) {
            return res.json({
                success: true,
                data: {
                    snap_token: order.snap_token,
                    snap_redirect_url: order.snap_redirect_url,
                },
            });
        }

        // Create Midtrans transaction
        const transaction = await midtransService.createSnapTransaction(order, order.products);

        // Update order with snap token
        const { error: updateError } = await supabase
            .from('orders')
            .update({
                snap_token: transaction.token,
                snap_redirect_url: transaction.redirect_url,
                midtrans_order_id: order.id,
                status_payment: 'waiting_payment',
            })
            .eq('id', order.id);

        if (updateError) throw updateError;

        res.json({
            success: true,
            data: {
                snap_token: transaction.token,
                snap_redirect_url: transaction.redirect_url,
            },
        });
    } catch (error) {
        console.error('Create payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal membuat pembayaran',
        });
    }
}

/**
 * Get order by ID (for internal use)
 */
async function getOrderById(orderId) {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

    if (error) throw error;
    return data;
}

/**
 * Refresh payment status from Midtrans (for development/manual check)
 * @route POST /api/orders/:purchaseCode/refresh-status
 */
async function refreshPaymentStatus(req, res) {
    try {
        const { purchaseCode } = req.params;

        // Get order by purchase code
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('purchase_code', purchaseCode)
            .single();

        if (orderError || !order) {
            return res.status(404).json({
                success: false,
                message: 'Order tidak ditemukan',
            });
        }

        // Check Midtrans transaction status
        const transactionStatus = await midtransService.getTransactionStatus(order.id);

        // Map to internal status
        const newStatus = mapPaymentStatus(
            transactionStatus.transaction_status,
            transactionStatus.fraud_status
        );

        // Update order status
        const { data: updatedOrder, error: updateError } = await supabase
            .from('orders')
            .update({ status_payment: newStatus })
            .eq('id', order.id)
            .select('*, product:product_id(*)')
            .single();

        if (updateError) throw updateError;

        res.json({
            success: true,
            message: 'Status berhasil diperbarui',
            data: updatedOrder,
        });
    } catch (error) {
        console.error('Refresh payment status error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui status pembayaran',
        });
    }
}

module.exports = {
    createOrder,
    getOrderStatus,
    createPayment,
    getOrderById,
    refreshPaymentStatus,
};
