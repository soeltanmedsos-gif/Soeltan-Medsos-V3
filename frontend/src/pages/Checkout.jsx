import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, CheckCircle, Smartphone, User, CreditCard, Loader2, Copy, MessageCircle, Upload, QrCode } from 'lucide-react';
import { orderApi } from '../services/api';
import { Input } from '../components/ui';
import { getWhatsAppLink, shortenLink } from '../utils/formatters';
import { initializeMidtrans } from '../utils/midtransHelper';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { cart, removeFromCart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState('cart'); // cart, info, paying, success
  const [results, setResults] = useState([]); 
  const [orderData, setOrderData] = useState(null);
  
  // Buyer Info State
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('manual'); // Default to manual while Midtrans is MT
  const [paymentProof, setPaymentProof] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  // Transaction Group
  const [transactionGroupId, setTransactionGroupId] = useState(null);


  useEffect(() => {
    // Dynamic Snap.js loader for Production
    const snapUrl = 'https://app.midtrans.com/snap/snap.js'; 
    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY; 

    if (clientKey && !document.getElementById('midtrans-script')) {
      const script = document.createElement('script');
      script.id = 'midtrans-script';
      script.src = snapUrl;
      script.setAttribute('data-client-key', clientKey);
      script.async = true;
      script.onload = () => {
        console.log('Midtrans Snap loaded');
        // Initialize mobile enhancements
        setTimeout(() => {
          initializeMidtrans();
        }, 100);
      };
      document.body.appendChild(script);
    } else if (window.snap) {
      // Initialize if Snap is already loaded
      initializeMidtrans();
    }
  }, []);

  const handleProcessOrder = async () => {
    if (cart.length === 0) return;
    
    // Validations
    if (!buyerName || buyerName.trim().length < 3) {
      toast.error('Mohon isi nama lengkap Anda (min 3 karakter)');
      return;
    }
    if (!buyerPhone || buyerPhone.length < 10) {
      toast.error('Mohon masukkan nomor WhatsApp yang valid (min 10 digit)');
      return;
    }


    if (paymentMethod === 'manual' && !paymentProof) {
        toast.error('Mohon upload bukti pembayaran untuk metode Transfer Manual');
        return;
    }

    setProcessing(true);
    setResults([]);
    // Generate Group ID for this transaction batch
    const groupId = `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setTransactionGroupId(groupId);

    setCurrentStep('paying');

    const orderResults = [];
    let lastOrderData = null;
    
    // Process items sequentially
    for (const item of cart) {
      try {
        const requestData = {
          product_id: item.id,
          target_link: item.target_link,
          quantity: item.quantity,
          buyer_name: buyerName,
          buyer_phone: buyerPhone,
          notes: `Item: ${item.name}`,
          transaction_group_id: groupId // Send Group ID
        };
        
        const response = await orderApi.create(requestData);
        const order = response.data.data;
        
        orderResults.push({ 
          name: item.name, 
          status: 'success',
          purchase_code: order.purchase_code,
          order_id: order.order_id,
          amount: order.amount
        });
        
        lastOrderData = order;
      } catch (error) {
        console.error(`Failed to order ${item.name}`, error);
        orderResults.push({ 
            name: item.name, 
            status: 'error', 
            message: error.response?.data?.message || 'Gagal memproses' 
        });
      }
    }

    setResults(orderResults);
    setOrderData(lastOrderData);
    
    // Check if any order was successful
    const successfulOrders = orderResults.filter(r => r.status === 'success');
    
    if (successfulOrders.length > 0 && lastOrderData) {
      try {
        if (paymentMethod === 'midtrans') {
            // Initiate Midtrans payment
            const paymentResponse = await orderApi.createPayment(lastOrderData.purchase_code);
            const { snap_token } = paymentResponse.data.data;
            
            // Open Midtrans Snap popup with mobile-friendly configuration
            if (snap_token && window.snap) {
              const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
              
              window.snap.pay(snap_token, {
                // Enhanced mobile configuration
                skipOrderSummary: false,
                gopayMode: isMobile ? 'deeplink' : 'redirect',
                language: 'id',
                
                onSuccess: function(result) {
                  clearCart();
                  setCurrentStep('success');
                  toast.success('Pembayaran berhasil!');
                },
                onPending: function(result) {
                  clearCart();
                  setCurrentStep('success');
                  toast.info('Pembayaran sedang diproses');
                },
                onError: function(result) {
                  clearCart();
                  setCurrentStep('success');
                  toast.error('Pembayaran gagal, silakan hubungi admin');
                },
                onClose: function() {
                  clearCart();
                  setCurrentStep('success');
                  toast.warning('Jendela pembayaran ditutup, silakan lanjutkan pembayaran dari halaman cek pesanan');
                }
              });
            } else {
              toast.error('Payment gateway tidak tersedia');
              clearCart();
              setCurrentStep('success');
            }
        } else {
            // Manual Payment (Upload Proof)
            const formData = new FormData();
            // Usage Group ID instead of individual purchase code
            formData.append('purchase_code', groupId);
            formData.append('payment_proof', paymentProof);

            await orderApi.submitPaymentProof(formData);
            
            clearCart();
            setCurrentStep('success');
            toast.success('Bukti pembayaran terkirim! Menunggu verifikasi admin.');
        }
      } catch (error) {
        console.error('Payment process error:', error);
        toast.error('Gagal memproses pembayaran. Silakan hubungi admin.');
        clearCart(); // Still clear cart but show success page with "Manual verification needed" context via toast
        setCurrentStep('success');
      }
    } else {
      clearCart();
      setCurrentStep('success');
    }
    
    setProcessing(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB');
        return;
      }
      setPaymentProof(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Success/Results Screen
  if (currentStep === 'success') {
    const successfulOrders = results.filter(r => r.status === 'success');
    const failedOrders = results.filter(r => r.status === 'error');
    
    return (
      <div className="min-h-screen bg-slate-900 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
           <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 text-center animate-fade-in">
              <div className={`w-20 h-20 ${successfulOrders.length > 0 ? 'bg-green-500/10 border-green-500/20' : 'bg-yellow-500/10 border-yellow-500/20'} rounded-full flex items-center justify-center mx-auto mb-6 border`}>
                <CheckCircle size={40} className={successfulOrders.length > 0 ? 'text-green-500' : 'text-yellow-500'} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {successfulOrders.length > 0 ? 'Pesanan Dibuat!' : 'Ada Kendala'}
              </h2>
              <p className="text-slate-400 mb-6">
                {successfulOrders.length > 0 
                  ? paymentMethod === 'midtrans' 
                      ? `Terima kasih, ${buyerName}! Pesanan Anda sedang diproses.`
                      : `Terima kasih, ${buyerName}! Bukti pembayaran Anda telah kami terima dan sedang diverifikasi.`
                  : 'Beberapa pesanan mengalami kendala.'}
              </p>
              
              {/* Show Single Transaction Code */}
              {successfulOrders.length > 0 && transactionGroupId && (
                <div className="bg-slate-900/50 rounded-xl p-4 mb-6 border border-slate-700">
                  <p className="text-sm text-slate-400 mb-3">Kode Transaksi (Simpan kode ini):</p>
                  <div className="flex items-center justify-center gap-3">
                      <code className="bg-indigo-500/20 text-indigo-400 px-4 py-2 rounded-lg font-mono text-xl font-bold tracking-wider">
                        {transactionGroupId}
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(transactionGroupId);
                          toast.success('Kode berhasil disalin!');
                        }}
                        className="p-2 hover:bg-indigo-500/10 rounded-lg transition-colors"
                        title="Copy kode"
                      >
                        <Copy size={20} className="text-indigo-400" />
                      </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                      Gunakan kode ini untuk mengecek status semua item pesanan Anda.
                  </p>
                </div>
              )}

              {/* Order results list (Clean) */}
              <div className="bg-slate-900/30 rounded-xl p-4 mb-6 text-left space-y-2">
                 <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Detail Item:</p>
                 {results.map((res, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                       <span className="text-white truncate pr-4">{res.name}</span>
                       <span className={res.status === 'success' ? 'text-green-400' : 'text-red-400'}>
                           {res.status === 'success' ? '✔' : '✖'}
                       </span>
                    </div>
                 ))}
              </div>

              {/* WhatsApp Confirmation - PROMINENT */}
              {successfulOrders.length > 0 && (
                <div className="mb-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4">
                  <p className="text-white text-sm font-semibold mb-2">📱 Konfirmasi Pesanan</p>
                  <p className="text-slate-300 text-xs mb-3">
                    Hubungi admin via WhatsApp untuk konfirmasi pesanan Anda.
                  </p>
                  <button 
                    onClick={() => {
                      const message = `Halo Admin, saya ingin konfirmasi pesanan:\n\nKode Transaksi: ${transactionGroupId}\nNama: ${buyerName}\nItem: ${successfulOrders.length} item\n\nTerima kasih!`;
                      const waLink = getWhatsAppLink(message);
                      window.open(waLink, '_blank');
                    }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-500 hover:to-emerald-500 transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={20} />
                    Konfirmasi via WhatsApp
                  </button>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                 <button 
                   onClick={() => navigate('/products')}
                   className="px-6 py-3 bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-600 transition-colors"
                 >
                   Kembali Belanja
                 </button>
                 {/* Remove Check Status for now or link to global status check later */}
              </div>
           </div>
        </div>
      </div>
    );
  }

  // Processing Screen
  if (currentStep === 'paying') {
    return (
      <div className="min-h-screen bg-slate-900 pt-24 pb-12 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 text-center">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
              <Loader2 size={40} className="text-indigo-400 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Memproses Pesanan...</h2>
            <p className="text-slate-400 text-sm">
              Mohon tunggu, sistem sedang memproses pesanan Anda.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main Checkout View
  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Kembali</span>
        </button>

        <h1 className="text-2xl font-bold text-white mb-6">Checkout Pesanan</h1>

        <div className="grid lg:grid-cols-3 gap-6">
           {/* Left Column: Cart & Buyer Info */}
           <div className="lg:col-span-2 space-y-6">

              {/* Buyer Info */}
              <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-5 space-y-4">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                      <User size={18} className="text-indigo-400" />
                      Data Pembeli
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                          <label className="text-xs font-medium text-slate-400 ml-1">Nama Lengkap</label>
                          <Input
                              value={buyerName}
                              onChange={(e) => setBuyerName(e.target.value)} 
                              placeholder="Nama Anda"
                              className="bg-slate-900 border-slate-600 focus:bg-slate-800 text-sm py-2"
                              required
                          />
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-xs font-medium text-slate-400 ml-1">WhatsApp</label>
                          <Input
                              value={buyerPhone}
                              onChange={(e) => setBuyerPhone(e.target.value.replace(/[^0-9]/g, ''))}
                              placeholder="08xxxxxxxxxx"
                              className="bg-slate-900 border-slate-600 focus:bg-slate-800 text-sm py-2"
                              type="tel"
                              required
                          />
                      </div>
                  </div>
              </div>
              
              {/* Cart Summary (Compact) */}
              <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
                  <div className="p-4 border-b border-slate-700 bg-slate-800/80">
                      <h3 className="font-semibold text-white">Item Pesanan ({cart.length})</h3>
                  </div>
                  <div className="divide-y divide-slate-700/50">
                    {cart.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-slate-400 text-sm">Keranjang kosong</p>
                            <button onClick={() => navigate('/products')} className="mt-2 text-indigo-400 text-sm font-semibold hover:underline">Belanja Sekarang</button>
                        </div>
                    ) : (
                        cart.map((item) => (
                        <div key={item.uniqueId} className="p-4 flex gap-3 hover:bg-slate-800/30 transition-colors">
                            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700 shrink-0">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">{item.platform?.substring(0, 2)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="text-white text-sm font-medium truncate pr-2">{item.name}</h4>
                                    <button onClick={() => removeFromCart(item.uniqueId)} className="text-slate-500 hover:text-red-400"><Trash2 size={14} /></button>
                                </div>
                                <div className="flex items-center justify-between text-xs text-slate-400">
                                    <div className="flex gap-2">
                                        <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">{item.quantity}x</span>
                                        <span className="truncate max-w-[150px]">{shortenLink(item.target_link, 25)}</span>
                                    </div>
                                    <span className="text-indigo-400 font-semibold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        </div>
                        ))
                    )}
                  </div>
              </div>

           </div>

           {/* Right Column: Payment & Total */}
           <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden sticky top-24">
                  <div className="p-5 border-b border-slate-700 bg-slate-800/80">
                      <h3 className="font-semibold text-white flex items-center gap-2">
                          <CreditCard size={18} className="text-indigo-400" />
                          Pembayaran
                      </h3>
                  </div>
                  
                  <div className="p-5 space-y-5">
                      {/* Payment Method Tabs */}
                      <div className="bg-slate-900 p-1 rounded-xl flex text-sm font-medium relative">
                          <button
                              disabled
                              className="flex-1 py-2.5 rounded-lg text-slate-600 cursor-not-allowed flex flex-col items-center justify-center relative overflow-hidden"
                          >
                              <span>Otomatis</span>
                              <span className="text-[10px] font-bold bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded mt-0.5 border border-red-500/20">MAINTENANCE</span>
                          </button>
                          <button
                              onClick={() => setPaymentMethod('manual')}
                              className={`flex-1 py-2.5 rounded-lg transition-all ${
                                  paymentMethod === 'manual' 
                                  ? 'bg-indigo-600 text-white shadow-lg' 
                                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                              }`}
                          >
                              Manual
                          </button>
                      </div>

                      {/* Payment Content */}
                      <div className="min-h-[180px]">
                          {paymentMethod === 'midtrans' ? (
                              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 text-center animate-fade-in">
                                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                                      <CreditCard className="text-indigo-600" size={24} />
                                  </div>
                                  <h4 className="text-white font-medium mb-1">QRIS / E-Wallet / VA</h4>
                                  <p className="text-xs text-slate-400 leading-relaxed">
                                      Pembayaran instan diproses otomatis oleh Midtrans. Mendukung semua bank & e-wallet.
                                  </p>
                              </div>
                          ) : (
                              <div className="space-y-4 animate-fade-in">
                                  {/* Compact QRIS & Bank Info */}
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        {/* QRIS Image */}
                                        <div className="w-full sm:w-24 group">
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 sm:hidden">SCAN QRIS</p>
                                            <div className="aspect-square sm:w-24 sm:h-24 bg-white rounded-xl p-1 shrink-0 shadow-lg relative overflow-hidden">
                                                <div className="w-full h-full bg-slate-100 rounded-lg overflow-hidden relative">
                                                    <img src="/images/qris-image.webp" alt="QRIS" className="w-full h-full object-contain" />
                                                    <div className="absolute inset-0 border-2 border-slate-900/10 rounded-lg pointer-events-none"></div>
                                                </div>
                                            </div>
                                        </div>
                                                                                <div className="flex-1 min-w-0">
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">TRANSFER KE</p>
                                                <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-700 divide-y divide-white/5">
                                                    {/* Bank BCA */}
                                                    <div className="flex flex-col gap-1 pb-3">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <span className="text-[9px] font-black bg-white/5 px-1.5 py-0.5 rounded text-slate-400 border border-white/5 italic shrink-0">BCA</span>
                                                            <button 
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText('3271332007');
                                                                    toast.success('Nomor BCA disalin!');
                                                                }}
                                                                className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20 active:scale-95"
                                                            >
                                                                <Copy size={12} />
                                                                <span>SALIN</span>
                                                            </button>
                                                        </div>
                                                        <div className="mt-0.5">
                                                            <p className="text-white font-mono text-sm sm:text-base font-bold tracking-tight select-all">3271332007</p>
                                                            <p className="text-[9px] text-slate-500 font-medium">A/n Didik Fajar</p>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Bank BRI */}
                                                    <div className="flex flex-col gap-1 pt-3">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <span className="text-[9px] font-black bg-white/5 px-1.5 py-0.5 rounded text-slate-400 border border-white/5 italic shrink-0">BRI</span>
                                                            <button 
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText('014901080052508');
                                                                    toast.success('Nomor BRI disalin!');
                                                                }}
                                                                className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20 active:scale-95"
                                                            >
                                                                <Copy size={12} />
                                                                <span>SALIN</span>
                                                            </button>
                                                        </div>
                                                        <div className="mt-0.5">
                                                            <p className="text-white font-mono text-sm sm:text-base font-bold tracking-tight select-all">014901080052508</p>
                                                            <p className="text-[9px] text-slate-500 font-medium">A/n Didik Fajar</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                  {/* Upload Section */}
                                    <div className="relative group mt-2">
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="payment-proof-upload"
                                        />
                                        <label 
                                            htmlFor="payment-proof-upload"
                                            className={`flex items-center gap-3 w-full p-4 border-dashed border-2 rounded-2xl cursor-pointer transition-all ${
                                                previewUrl 
                                                ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/5' 
                                                : 'border-slate-600 hover:border-indigo-500 hover:bg-slate-800/80 hover:shadow-xl'
                                            }`}
                                        >
                                            {previewUrl ? (
                                                <>
                                                    <div className="relative shrink-0">
                                                        <img src={previewUrl} alt="Preview" className="w-12 h-12 object-cover rounded-lg shadow-md border border-indigo-500/30" />
                                                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center border-2 border-slate-900 shadow-sm">
                                                            <CheckCircle size={10} className="text-white" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0 pr-2">
                                                        <p className="text-xs font-bold text-white mb-0.5 break-all line-clamp-1">{paymentProof?.name}</p>
                                                        <p className="text-[10px] text-indigo-400 font-semibold group-hover:text-indigo-300">Klik untuk ganti bukti</p>
                                                    </div>
                                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                                                        <Upload size={16} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:scale-110 transition-all border border-slate-700 shadow-inner shrink-0">
                                                        <Upload size={22} />
                                                    </div>
                                                    <div className="text-left flex-1">
                                                        <p className="text-sm font-bold text-slate-100 group-hover:text-white">Upload Bukti Pay</p>
                                                        <p className="text-[11px] text-slate-500 font-medium">Pilih foto dari galeri (Max 5MB)</p>
                                                    </div>
                                                </>
                                            )}
                                        </label>
                                    </div>
                              </div>
                          )}
                      </div>

                      {/* Total & Action */}
                      <div className="pt-4 border-t border-slate-700/50 space-y-3">
                          <div className="flex justify-between items-end">
                              <span className="text-slate-400 text-sm mb-1">Total Bayar</span>
                              <span className="text-2xl font-bold text-white tracking-tight">Rp {cartTotal.toLocaleString('id-ID')}</span>
                          </div>
                          
                          <button
                              onClick={handleProcessOrder}
                              disabled={processing || cart.length === 0}
                              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group transform active:scale-[0.98]"
                          >
                              {processing ? (
                                  <>
                                      <Loader2 size={18} className="animate-spin" />
                                      <span>Memproses...</span>
                                  </>
                              ) : (
                                  <>
                                      <CreditCard size={18} />
                                      <span>Bayar Sekarang</span>
                                  </>
                              )}
                          </button>
                      </div>
                  </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
