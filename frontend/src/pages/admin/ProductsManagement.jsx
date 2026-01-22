import { useState, useEffect } from 'react';
import { adminApi, productApi } from '../../services/api';
import { formatRupiah } from '../../utils/formatters';
import { PageLoader } from '../../components/LoadingSpinner';
import { Button, Input } from '../../components/ui';
import toast from 'react-hot-toast';
import { X, Search, Edit, Trash2, Plus, Save, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}

export default function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  
  // Form State
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(true); // Default open as per request "di atas sendiri saja"
  
  // Platform Logic
  const [existingPlatforms, setExistingPlatforms] = useState([]);
  const [isNewPlatform, setIsNewPlatform] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', platform: '', sub_platform: '', description: '', price: '', is_active: true
  });

  useEffect(() => {
    loadProducts();
    loadPlatforms();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [debouncedSearch]);

  const loadProducts = async () => {
    try {
      const response = await adminApi.getProducts({ limit: 100, search });
      setProducts(response.data.data);
    } catch (error) {
      toast.error('Gagal memuat produk');
    } finally {
      setLoading(false);
    }
  };

  const loadPlatforms = async () => {
    try {
      const response = await productApi.getPlatforms();
      setExistingPlatforms(response.data.data || []);
    } catch (error) {
      console.error("Failed load platforms");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      platform: product.platform,
      sub_platform: product.sub_platform || '',
      description: product.description || '',
      price: product.price,
      is_active: product.is_active,
    });
    setIsNewPlatform(false);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetForm = () => {
    setEditingProduct(null);
    setFormData({ name: '', platform: '', sub_platform: '', description: '', price: '', is_active: true });
    setIsNewPlatform(false);
  };

  const handlePlatformChange = (e) => {
    const val = e.target.value;
    if (val === 'NEW_PLATFORM') {
      setIsNewPlatform(true);
      setFormData({ ...formData, platform: '' });
    } else {
      setIsNewPlatform(false);
      setFormData({ ...formData, platform: val });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Menyimpan produk...');
    try {
      if (editingProduct) {
        await adminApi.updateProduct(editingProduct.id, { ...formData, price: parseInt(formData.price) });
      } else {
        await adminApi.createProduct({ ...formData, price: parseInt(formData.price) });
      }
      handleResetForm();
      loadProducts();
      loadPlatforms();
      toast.success(editingProduct ? 'Produk diperbarui!' : 'Produk ditambahkan!', { id: loadingToast });
    } catch (error) {
      toast.error('Gagal menyimpan produk', { id: loadingToast });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin hapus produk ini?')) return;
    const loadingToast = toast.loading('Menghapus...');
    try {
      await adminApi.deleteProduct(id);
      loadProducts();
      toast.success('Produk dihapus', { id: loadingToast });
    } catch (error) {
      toast.error('Gagal menghapus produk', { id: loadingToast });
    }
  };

  if (loading) return <PageLoader />;

  const platformOptions = [
    { value: '', label: '-- Pilih Platform --' },
    ...existingPlatforms.map(p => ({ value: p, label: p })),
    { value: 'NEW_PLATFORM', label: '+ Tambah Platform Baru' }
  ];

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold text-white mb-2">Manajemen Produk</h1>
           <p className="text-slate-400">Kelola layanan dan harga produk.</p>
        </div>
      </div>

      {/* PRODUCT FORM SECTION (TOP) */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-xl overflow-hidden transition-all">
        <div 
          className="p-6 border-b border-slate-700/50 flex justify-between items-center cursor-pointer bg-slate-800/80 hover:bg-slate-800 transition-colors"
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${editingProduct ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
              {editingProduct ? <Edit size={20} /> : <Package size={20} />}
            </div>
            <h2 className="text-lg font-bold text-white">
              {editingProduct ? `Edit Produk: ${editingProduct.name}` : 'Tambah Produk Baru'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
             {editingProduct && (
               <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleResetForm(); }} className="text-slate-400 hover:text-white">
                 Batal Edit
               </Button>
             )}
             <div className={`transform transition-transform duration-300 ${isFormOpen ? 'rotate-180' : ''}`}>
               <Plus size={20} className="text-slate-400" />
             </div>
          </div>
        </div>

        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6 lg:p-8 bg-slate-900/30">
                <form id="productForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left Col: Basics */}
                  <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name - Full Width in Left Col */}
                    <div className="md:col-span-2">
                       <Input 
                        label="Nama Layanan"
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        placeholder="Contoh: TikTok Followers HQ" 
                        required 
                        className="bg-slate-950 border-slate-700 focus:bg-slate-900"
                      />
                    </div>

                    {/* Platform */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-400 ml-1">Platform</label>
                      <select
                        value={isNewPlatform ? 'NEW_PLATFORM' : formData.platform}
                        onChange={handlePlatformChange}
                        className="w-full px-5 py-3.5 rounded-xl bg-slate-950 border border-slate-700 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-white appearance-none cursor-pointer"
                      >
                        {platformOptions.map((opt) => (
                           <option key={opt.value} value={opt.value} className="bg-slate-900">{opt.label}</option>
                        ))}
                      </select>

                      {isNewPlatform && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-2"
                        >
                          <Input
                            placeholder="Nama platform baru..."
                            value={formData.platform}
                            onChange={(e) => setFormData({...formData, platform: e.target.value})}
                            autoFocus
                            className="bg-indigo-900/20 border-indigo-500/30 text-indigo-300"
                          />
                        </motion.div>
                      )}
                    </div>
                    
                    {/* Sub Platform */}
                    <div>
                      <Input 
                        label="Sub Kategori"
                        value={formData.sub_platform} 
                        onChange={(e) => setFormData({...formData, sub_platform: e.target.value})} 
                        placeholder="Contoh: Likes"
                        className="bg-slate-950 border-slate-700 focus:bg-slate-900"
                      />
                    </div>

                    {/* Description - Full Width in Left Col */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-semibold text-slate-400 ml-1">Deskripsi</label>
                      <textarea 
                        value={formData.description} 
                        onChange={(e) => setFormData({...formData, description: e.target.value})} 
                        placeholder="Detail layanan..." 
                        className="w-full px-5 py-3.5 rounded-xl bg-slate-950 border border-slate-700 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-white min-h-[100px] resize-y placeholder:text-slate-600" 
                      />
                    </div>
                  </div>

                  {/* Right Col: Settings & Submit */}
                  <div className="md:col-span-4 space-y-6">
                    <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/50 space-y-6">
                       <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Pengaturan Harga</h3>
                       
                       <Input 
                        label="Harga (Rp)"
                        type="number" 
                        value={formData.price} 
                        onChange={(e) => setFormData({...formData, price: e.target.value})} 
                        placeholder="10000" 
                        required 
                        className="bg-slate-900 border-slate-700 focus:bg-slate-800 font-mono text-lg text-indigo-400"
                      />

                      <div 
                        className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${formData.is_active ? 'bg-green-500/10 border-green-500/30' : 'bg-slate-900 border-slate-700'}`}
                        onClick={() => setFormData({...formData, is_active: !formData.is_active})}
                      >
                         <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${formData.is_active ? 'bg-green-500 border-green-500' : 'border-slate-500 bg-transparent'}`}>
                            {formData.is_active && <X size={14} className="text-white rotate-45" />} 
                         </div>
                         <label className={`text-sm font-semibold cursor-pointer ${formData.is_active ? 'text-green-400' : 'text-slate-400'}`}>
                           Status Aktif
                         </label>
                      </div>

                      <Button type="submit" className="w-full py-4 text-base bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20">
                        {editingProduct ? <><Save size={18} /> Simpan Perubahan</> : <><Plus size={18} /> Tambah Produk</>}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* TABLE SECTION */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700/50 shadow-sm inline-flex w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari produk..."
              className="bg-transparent border-none pl-12 h-10 focus:ring-0 text-white placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-900/50 text-slate-400 font-semibold uppercase tracking-wider text-xs border-b border-slate-700/50">
                <tr>
                  <th className="px-6 py-5">Produk</th>
                  <th className="px-6 py-5">Platform</th>
                  <th className="px-6 py-5">Harga</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                      Tidak ada produk ditemukan.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-800/50 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-bold text-white group-hover:text-indigo-300 transition-colors">{product.name}</p>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{product.description}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-slate-300">
                          <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                          {product.platform}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-medium text-emerald-400">
                        {formatRupiah(product.price)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${product.is_active ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${product.is_active ? 'bg-green-400' : 'bg-slate-500'}`}></span>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(product)} className="p-2 hover:bg-slate-700 text-slate-400 hover:text-indigo-400 rounded-lg transition-colors" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-slate-700 text-slate-400 hover:text-red-400 rounded-lg transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
