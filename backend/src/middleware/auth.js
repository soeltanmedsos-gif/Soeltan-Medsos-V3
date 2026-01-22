const jwt = require('jsonwebtoken');
const config = require('../config');
const supabase = require('../services/supabase');

/**
 * JWT Authentication Middleware
 * Verifies JWT token and attaches admin user to request
 */
async function authMiddleware(req, res, next) {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Token tidak ditemukan. Silakan login terlebih dahulu.',
            });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, config.jwt.secret);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token sudah kadaluarsa. Silakan login kembali.',
                });
            }
            return res.status(401).json({
                success: false,
                message: 'Token tidak valid.',
            });
        }

        // Get admin user from database
        const { data: admin, error } = await supabase
            .from('admin_users')
            .select('id, email, name, role, is_active')
            .eq('id', decoded.id)
            .single();

        if (error || !admin) {
            return res.status(401).json({
                success: false,
                message: 'Admin tidak ditemukan.',
            });
        }

        if (!admin.is_active) {
            return res.status(403).json({
                success: false,
                message: 'Akun admin tidak aktif.',
            });
        }

        // Attach admin to request
        req.admin = admin;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server.',
        });
    }
}

/**
 * SuperAdmin Only Middleware
 * Must be used after authMiddleware
 */
function superAdminOnly(req, res, next) {
    if (req.admin.role !== 'superadmin') {
        return res.status(403).json({
            success: false,
            message: 'Hanya SuperAdmin yang dapat mengakses fitur ini.',
        });
    }
    next();
}

module.exports = {
    authMiddleware,
    superAdminOnly,
};
