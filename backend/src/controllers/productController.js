const supabase = require('../services/supabase');

/**
 * Get all active products
 * @route GET /api/products
 */
async function getAllProducts(req, res) {
    try {
        const { platform, sub_platform, page = 1, limit = 20, sort_by = 'created_at', order = 'desc' } = req.query;

        // Validate pagination params
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Max 100 per page
        const offset = (pageNum - 1) * limitNum;

        // Validate sort params
        const allowedSortFields = ['name', 'price', 'platform', 'created_at'];
        const sortField = allowedSortFields.includes(sort_by) ? sort_by : 'created_at';
        const sortOrder = order.toLowerCase() === 'asc' ? true : false; // Supabase uses boolean

        let query = supabase
            .from('products')
            .select('id, platform, sub_platform, name, description, price, image_url', { count: 'exact' })
            .eq('is_active', true);

        if (platform) {
            query = query.eq('platform', platform);
        }
        if (sub_platform) {
            query = query.eq('sub_platform', sub_platform);
        }

        // Apply sorting
        query = query.order(sortField, { ascending: sortOrder });

        // Apply pagination
        query = query.range(offset, offset + limitNum - 1);

        const { data, error, count } = await query;

        if (error) throw error;

        res.json({
            success: true,
            data,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: count,
                totalPages: Math.ceil(count / limitNum)
            }
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data produk',
        });
    }
}

/**
 * Get product by ID
 * @route GET /api/product/:id
 */
async function getProductById(req, res) {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .eq('is_active', true)
            .single();

        if (error || !data) {
            return res.status(404).json({
                success: false,
                message: 'Produk tidak ditemukan',
            });
        }

        res.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data produk',
        });
    }
}

/**
 * Get platforms list
 * @route GET /api/platforms
 */
async function getPlatforms(req, res) {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('platform')
            .eq('is_active', true);

        if (error) throw error;

        // Get unique platforms
        const platforms = [...new Set(data.map(p => p.platform))];

        res.json({
            success: true,
            data: platforms,
        });
    } catch (error) {
        console.error('Get platforms error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data platform',
        });
    }
}

/**
 * Get sub-platforms for a platform
 * @route GET /api/platforms/:platform/sub-platforms
 */
async function getSubPlatforms(req, res) {
    try {
        const { platform } = req.params;

        const { data, error } = await supabase
            .from('products')
            .select('sub_platform')
            .eq('platform', platform)
            .eq('is_active', true)
            .not('sub_platform', 'is', null);

        if (error) throw error;

        // Get unique sub-platforms
        const subPlatforms = [...new Set(data.map(p => p.sub_platform).filter(Boolean))];

        res.json({
            success: true,
            data: subPlatforms,
        });
    } catch (error) {
        console.error('Get sub-platforms error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data sub-platform',
        });
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    getPlatforms,
    getSubPlatforms,
};
