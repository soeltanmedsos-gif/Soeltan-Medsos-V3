import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productApi } from '../services/api';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import Tooltip from '../components/Tooltip';
import EmptyState from '../components/EmptyState';
import { PageLoader } from '../components/LoadingSpinner';
import { motion } from 'framer-motion';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { Input, Select } from '../components/ui';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const PLATFORMS = [
  'Tiktok Paket FYP',
  'TikTok',
  'Instagram',
  'YouTube',
  'Facebook',
  'Whatsapp',
  'Telegram',
  'Google Maps',
  'Aplikasi Premium',
];

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  useEffect(() => {
    loadProducts();
  }, [selectedPlatform, sortBy, pagination.page]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: 20,
        sort_by: sortBy,
        order: sortBy === 'price' ? 'asc' : 'desc'
      };
      if (selectedPlatform) params.platform = selectedPlatform;
      
      const response = await productApi.getAll(params);
      setProducts(response.data.data);
      if (response.data.pagination) {
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.pagination.totalPages,
          total: response.data.pagination.total
        }));
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      toast.error('Gagal memuat produk');
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = (product) => {
    navigate(`/product/${product.id}`);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProducts = products.filter((product) => {
    if (!searchQuery) return true;
    return (
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const seoTitle = selectedPlatform 
    ? `${selectedPlatform} - Layanan SMM | Soeltan Medsos`
    : 'Semua Layanan SMM - Followers, Likes, Views | Soeltan Medsos';

  return (
    <>
      <SEO 
        title={seoTitle}
        description={`Layanan ${selectedPlatform || 'Social Media Marketing'} terbaik. Followers, Likes, Views berkualitas tinggi dengan harga terjangkau.`}
      />
    <div className="pt-24 pb-12 min-h-screen bg-slate-900">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-4"
          >
            Semua <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Layanan</span>
          </motion.h1>
          <p className="text-slate-400 text-lg">Pilih layanan terbaik untuk social media Anda</p>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6 relative z-30">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-1">
              <label className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                <Search size={16} className="text-blue-400" /> Cari Produk
              </label>
              <Input
                placeholder="Cari layanan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-indigo-500"
              />
            </div>

            {/* Filter Platform */}
            <div className="md:col-span-1">
              <label className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                <Filter size={16} className="text-purple-400" /> Platform
              </label>
              <Select
                value={selectedPlatform}
                onChange={(value) => {
                  setSelectedPlatform(value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                options={[
                  { value: '', label: 'Semua Platform' },
                  ...PLATFORMS.map(p => ({ value: p, label: p }))
                ]}
                className="bg-slate-900/50 border-slate-600 text-white focus:border-purple-500"
              />
            </div>

            {/* Sort */}
            <div className="md:col-span-1">
              <label className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                <ArrowUpDown size={16} className="text-cyan-400" /> Urutkan
              </label>
              <Select
                value={sortBy}
                onChange={(value) => setSortBy(value)}
                options={[
                   { value: 'created_at', label: 'Terbaru' },
                   { value: 'name', label: 'Nama (A-Z)' },
                   { value: 'price', label: 'Harga Terendah' }
                ]}
                className="bg-slate-900/50 border-slate-600 text-white focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <EmptyState 
            title="Tidak ada layanan ditemukan"
            description="Coba gunakan kata kunci lain atau reset filter pencarian Anda."
            action={
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedPlatform('');
                }}
                className="text-indigo-400 hover:text-indigo-300 font-medium underline"
              >
                Reset Filter
              </button>
            }
          />
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onBuy={handleBuy} />
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && filteredProducts.length > 0 && pagination.totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-3">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 hover:border-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-medium shadow-lg disabled:hover:bg-slate-800 disabled:hover:border-slate-700"
            >
              ← Prev
            </button>
            
            <div className="flex gap-2">
              {[...Array(Math.min(5, pagination.totalPages))].map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-12 h-12 rounded-xl font-bold transition-all shadow-lg ${
                      pagination.page === pageNum
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white scale-110 shadow-indigo-500/50'
                        : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-indigo-500 hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 hover:border-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-medium shadow-lg disabled:hover:bg-slate-800 disabled:hover:border-slate-700"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
