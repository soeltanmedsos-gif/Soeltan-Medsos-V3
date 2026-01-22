import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  CreditCard, 
  CheckCircle, 
  MessageCircle,
  ArrowRight,
  Package,
  Clock,
  Shield
} from 'lucide-react';

export default function HowToBuy() {
  const steps = [
    {
      icon: <ShoppingCart size={32} />,
      title: 'Pilih Layanan',
      description: 'Browse katalog layanan kami dan pilih paket yang sesuai dengan kebutuhan Anda.',
      details: [
        'Lihat berbagai kategori layanan (Instagram, TikTok, YouTube, dll)',
        'Baca deskripsi lengkap setiap layanan',
        'Perhatikan harga dan estimasi waktu pengerjaan'
      ]
    },
    {
      icon: <Package size={32} />,
      title: 'Isi Detail Pesanan',
      description: 'Masukkan link/username target dan jumlah yang diinginkan, lalu tambahkan ke keranjang.',
      details: [
        'Pastikan link/username yang diinput benar',
        'Pilih kuantitas sesuai kebutuhan',
        'Tambahkan ke keranjang untuk checkout',
        'Anda bisa memesan beberapa layanan sekaligus'
      ]
    },
    {
      icon: <CreditCard size={32} />,
      title: 'Checkout & Bayar',
      description: 'Isi data diri (nama & WhatsApp), lalu lakukan pembayaran melalui Midtrans.',
      details: [
        'Isi nama lengkap dan nomor WhatsApp aktif',
        'Klik tombol "Bayar Sekarang"',
        'Pilih metode pembayaran (Transfer Bank, E-Wallet, Kartu Kredit)',
        'Selesaikan pembayaran sesuai instruksi'
      ]
    },
    {
      icon: <CheckCircle size={32} />,
      title: 'Dapatkan Kode Pembelian',
      description: 'Setelah checkout, Anda akan mendapat kode pembelian unik untuk tracking pesanan.',
      details: [
        'Simpan kode pembelian dengan baik',
        'Salin atau download bukti pembelian',
        'Gunakan kode untuk cek status pesanan kapan saja',
        'Kode akan dikirim ke WhatsApp jika sudah terdaftar'
      ]
    },
    {
      icon: <MessageCircle size={32} />,
      title: 'Konfirmasi ke Admin',
      description: 'Klik tombol "Konfirmasi via WhatsApp" untuk mengirim detail pesanan ke admin.',
      details: [
        'Tombol otomatis membuka WhatsApp dengan pesan terformat',
        'Pesan berisi kode pembelian dan detail pesanan',
        'Admin akan memproses pesanan Anda',
        'Anda akan mendapat notifikasi progress via WhatsApp'
      ]
    },
    {
      icon: <Clock size={32} />,
      title: 'Proses & Selesai',
      description: 'Tim kami akan memproses pesanan Anda dalam 1-24 jam setelah pembayaran dikonfirmasi.',
      details: [
        'Pesanan akan diproses sesuai antrian',
        'Estimasi waktu: 1-24 jam (tergantung layanan)',
        'Cek status pesanan via menu "Cek Pesanan"',
        'Hubungi admin jika ada pertanyaan'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Cara Pembelian
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Panduan lengkap untuk melakukan pemesanan layanan di Soeltan Medsos. 
            Proses mudah, cepat, dan aman!
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-6 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6 md:p-8 hover:border-indigo-500/50 transition-all group"
            >
              <div className="flex gap-6">
                {/* Step Number & Icon */}
                <div className="flex flex-col items-center gap-3 shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
                    {index + 1}
                  </div>
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 mb-4">{step.description}</p>
                  <ul className="space-y-2">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                        <ArrowRight size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tips Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6 md:p-8 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center shrink-0">
              <Shield size={24} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3">💡 Tips & Catatan Penting</h3>
              <ul className="space-y-2 text-slate-300">
                <li>• Pastikan link/username yang Anda input sudah benar sebelum checkout</li>
                <li>• Akun target harus bersifat <strong>Publik</strong>, bukan Private</li>
                <li>• Simpan kode pembelian untuk tracking dan komplain (jika ada)</li>
                <li>• Pembayaran menggunakan gateway Midtrans yang aman dan terpercaya</li>
                <li>• Proses dimulai setelah pembayaran dikonfirmasi (biasanya otomatis)</li>
                <li>• Hubungi admin jika pesanan tidak diproses dalam 24 jam</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/products"
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-purple-500 transition-all flex items-center justify-center gap-2 group"
          >
            <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
            Mulai Belanja Sekarang
          </Link>
          <Link
            to="/faq"
            className="px-8 py-4 bg-slate-800 text-white rounded-xl font-bold border border-slate-700 hover:border-indigo-500/50 transition-all flex items-center justify-center gap-2"
          >
            Lihat FAQ
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
