require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',

    supabase: {
        url: process.env.SUPABASE_URL,
        serviceKey: process.env.SUPABASE_SERVICE_KEY,
    },

    midtrans: {
        serverKey: process.env.MIDTRANS_SERVER_KEY,
        clientKey: process.env.MIDTRANS_CLIENT_KEY,
        isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    },

    jwt: {
        secret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },

    admin: {
        whatsapp: process.env.ADMIN_WHATSAPP || '082352835382',
    },

    frontend: {
        url: process.env.FRONTEND_URL || 'http://localhost:5173',
    },
};
