import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Shield, Zap, TrendingUp, Clock, Smartphone, ChevronRight, CheckCircle2, Star, ArrowRight, HelpCircle, Package, CreditCard, MessageCircle, ChevronDown, ShoppingCart } from 'lucide-react';
import { Button } from '../components/ui';
import SEO from '../components/SEO';
import { useState } from 'react';
import { getWhatsAppLink } from '../utils/formatters';


export default function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // FAQ Data
  const faqCategories = [
    {
      category: 'Umum',
      questions: [
        { q: 'Apa itu Soeltan Medsos?', a: 'Soeltan Medsos adalah platform Social Media Marketing (SMM) yang menyediakan layanan untuk meningkatkan engagement media sosial seperti followers, likes, views, dan lainnya secara aman dan terpercaya.' },
        { q: 'Apakah layanan ini aman dan legal?', a: 'Ya, layanan kami menggunakan metode organik yang aman. Namun, penggunaan layanan SMM tetap merupakan tanggung jawab pengguna.' },
        { q: 'Berapa lama waktu pengerjaan pesanan?', a: 'Waktu pengerjaan bervariasi tergantung jenis layanan dan jumlah pesanan. Umumnya 1-24 jam setelah pembayaran dikonfirmasi.' }
      ]
    },
    {
      category: 'Pemesanan',
      questions: [
        { q: 'Bagaimana cara memesan layanan?', a: 'Pilih layanan yang diinginkan, masukkan link/username target dan jumlah, tambahkan ke keranjang, lalu lakukan checkout dengan mengisi data diri dan melakukan pembayaran.' },
        { q: 'Apakah perlu login untuk memesan?', a: 'Tidak perlu! Anda cukup isi nama dan nomor WhatsApp saat checkout.' },
        { q: 'Kenapa harus input nomor WhatsApp?', a: 'Nomor WhatsApp digunakan untuk konfirmasi pesanan dan komunikasi jika ada kendala atau update terkait pesanan Anda.' }
      ]
    },
    {
      category: 'Pembayaran',
      questions: [
        { q: 'Metode pembayaran apa saja yang tersedia?', a: 'Kami menggunakan payment gateway Midtrans yang menerima: Transfer Bank, E-Wallet (GoPay, OVO, DANA, ShopeePay), Kartu Kredit/Debit, dan Indomaret/Alfamart.' },
        { q: 'Apakah pembayaran aman?', a: 'Sangat aman! Kami menggunakan Midtrans, payment gateway terpercaya di Indonesia dengan sertifikasi keamanan internasional (PCI DSS Level 1).' }
      ]
    }
  ];

  // Buying Steps Data
  const buyingSteps = [
    {
      icon: <ShoppingCart size={24} />,
      title: 'Pilih Layanan',
      description: 'Browse katalog layanan dan pilih paket yang sesuai kebutuhan Anda'
    },
    {
      icon: <Package size={24} />,
      title: 'Isi Detail',
      description: 'Masukkan link/username target dan jumlah, lalu tambah ke keranjang'
    },
    {
      icon: <CreditCard size={24} />,
      title: 'Checkout & Bayar',
      description: 'Isi data diri dan lakukan pembayaran melalui Midtrans'
    },
    {
      icon: <MessageCircle size={24} />,
      title: 'Konfirmasi',
      description: 'Hubungi admin via WhatsApp dengan kode pembelian Anda'
    },
    {
      icon: <Clock size={24} />,
      title: 'Proses & Selesai',
      description: 'Tim kami proses pesanan dalam 1-24 jam setelah bayar'
    }
  ];

  return (
    <>
      <SEO />
      <div className="overflow-hidden">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center pt-20">
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Large Logo */}
                <motion.div
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, type: "spring" }}
                  className="mb-8 relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-3xl opacity-40 animate-pulse"></div>
                  <img 
                    src="/LOGO-.png" 
                    alt="Soeltan Medsos" 
                    className="relative h-32 md:h-40 w-auto mx-auto drop-shadow-2xl"
                  />
                </motion.div>

                <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold tracking-wide uppercase mb-8">
                  🚀 #1 Most Trusted SMM Panel
                </span>
                
                <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] mb-8 tracking-tight">
                  Scale Your Social Growth <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Without Limits.</span>
                </h1>
                
                <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                  Professional marketing tools to boost your social media presence. 
                  Instant delivery, secure processing, and premium quality results.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/products">
                    <Button className="h-14 px-10 text-lg rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border-0 shadow-lg shadow-indigo-500/50">
                      Get Started <ChevronRight size={20} />
                    </Button>
                  </Link>
                  <Link to="/cek-pesanan">
                    <Button variant="secondary" className="h-14 px-10 text-lg rounded-2xl bg-slate-800 hover:bg-slate-700 text-white border-slate-700">
                      Track Order
                    </Button>
                  </Link>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mt-20 relative"
              >
                <div className="absolute inset-x-0 -top-20 -bottom-20 bg-purple-600/10 blur-3xl rounded-full"></div>
                <div className="relative bg-slate-800/50 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden p-2 md:p-4 backdrop-blur-xl">
                   <div className="bg-slate-900/80 rounded-2xl border border-slate-700 aspect-[16/7] w-full flex items-center justify-center relative overflow-hidden">
                      {/* Abstract Representation of Growth */}
                      <div className="absolute inset-0 grid grid-cols-6 grid-rows-3 gap-4 p-8 opacity-30">
                         <div className="col-span-2 row-span-2 bg-slate-700 rounded-xl"></div>
                         <div className="col-span-2 row-span-1 bg-indigo-900/50 rounded-xl"></div>
                         <div className="col-span-2 row-span-3 bg-slate-700 rounded-xl"></div>
                         <div className="col-span-2 row-span-1 bg-purple-900/50 rounded-xl"></div>
                         <div className="col-span-1 row-span-1 bg-slate-700 rounded-xl"></div>
                      </div>
                      <div className="text-center relative z-10">
                         <p className="font-bold text-slate-600 text-4xl mb-2">Social Growth Engine</p>
                         <p className="text-slate-600 text-sm tracking-[0.3em]">AUTOMATED SYSTEM</p>
                      </div>
                   </div>
                </div>
              </motion.div>

          </div>
        </div>
      </section>

      {/* Stats / Trust */}
      <section className="py-12 border-y border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-60">
             <div className="text-2xl font-bold text-slate-500 flex items-center gap-2">Instagram</div>
             <div className="text-2xl font-bold text-slate-500 flex items-center gap-2">TikTok</div>
             <div className="text-2xl font-bold text-slate-500 flex items-center gap-2">YouTube</div>
             <div className="text-2xl font-bold text-slate-500 flex items-center gap-2">Facebook</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Shield size={32} className="text-blue-400" />}
              title="Secure & Private"
              desc="We strictly prioritize your data privacy. No password required for 99% of our services."
            />
            <FeatureCard 
              icon={<Zap size={32} className="text-purple-400" />}
              title="Instant Delivery"
              desc="Our automated system processes your orders immediately after payment confirmation."
            />
            <FeatureCard 
              icon={<Star size={32} className="text-cyan-400" />}
              title="Premium Quality"
              desc="Only high-quality accounts and real interactions to ensure safety for your profile."
            />
          </div>
        </div>
      </section>
      {/* Web Dev Promo Section */}
      <section className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-600/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            <div className="flex-1 space-y-6 md:space-y-8 text-center md:text-left">
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-wide uppercase">
                New Service Available
              </span>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                Ingin Punya Website <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Seperti Ini?</span>
              </h2>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-xl mx-auto md:mx-0">
                Tingkatkan kredibilitas bisnis Anda dengan website profesional. Desain modern, cepat, dan responsif untuk semua perangkat.
                Kami siap membantu mewujudkan website impian Anda.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
                <a 
                  href="https://wa.me/6282352835382?text=Halo%20Admin,%20saya%20tertarik%20jasa%20pembuatan%20website"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button className="w-full sm:w-auto h-14 px-8 bg-white text-slate-900 hover:bg-slate-100 border-none shadow-xl shadow-blue-900/20">
                    Konsultasi Gratis <ArrowRight size={20} />
                  </Button>
                </a>
              </div>

              <div className="flex justify-center md:justify-start gap-8 pt-4 border-t border-slate-800">
                <div>
                  <div className="text-2xl font-bold text-white">50+</div>
                  <div className="text-sm text-slate-500">Projects Done</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-sm text-slate-500">Satisfaction</div>
                </div>
              </div>
            </div>

            <div className="flex-1 relative w-full">
               <motion.div
                 whileHover={{ scale: 1.02 }}
                 className="relative z-10 bg-slate-800/80 backdrop-blur-xl rounded-3xl p-3 md:p-4 border border-slate-700 shadow-2xl"
               >
                 {/* Browser Mockup */}
                 <div className="bg-slate-900 rounded-2xl overflow-hidden aspect-[4/3] border border-slate-800 relative group">
                    <div className="absolute top-0 left-0 right-0 h-10 bg-slate-800 flex items-center px-4 gap-2 border-b border-slate-700 z-20">
                       <div className="w-3 h-3 rounded-full bg-red-500"></div>
                       <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                       <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    
                    {/* Simplified UI Mockup */}
                    <div className="absolute inset-0 pt-10 flex flex-col items-center justify-center p-8 opacity-80 group-hover:opacity-100 transition-opacity">
                       <div className="w-3/4 h-4 bg-slate-700 rounded-full mb-4"></div>
                       <div className="w-1/2 h-4 bg-slate-700 rounded-full mb-8"></div>
                       <div className="grid grid-cols-2 gap-4 w-full">
                          <div className="h-24 bg-indigo-900/30 rounded-xl border border-indigo-500/20"></div>
                          <div className="h-24 bg-purple-900/30 rounded-xl border border-purple-500/20"></div>
                       </div>
                    </div>

                    {/* Floating Label */}
                     <div className="absolute bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg z-30 flex items-center gap-2">
                        <Smartphone size={16} /> Start 100k
                     </div>
                 </div>
               </motion.div>
            </div>
          </div>
        </div>
      </section>


      {/* FAQ Section - Shows First */}
      <section id="faq" className="py-24 bg-slate-900">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <HelpCircle size={32} className="text-indigo-400" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Pertanyaan Umum</span>
            </h2>
            <p className="text-slate-400 text-lg">
              Jawaban untuk pertanyaan yang sering diajukan
            </p>
          </motion.div>

          {/* FAQ Items */}
          <div className="space-y-8">
            {faqCategories.map((category, catIndex) => (
              <motion.div
                key={catIndex}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.1 }}
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-indigo-400">#</span>
                  {category.category}
                </h3>
                <div className="space-y-3">
                  {category.questions.map((faq, qIndex) => {
                    const index = `${catIndex}-${qIndex}`;
                    const isOpen = openFaqIndex === index;
                    
                    return (
                      <div
                        key={qIndex}
                        className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 overflow-hidden hover:border-indigo-500/50 transition-all"
                      >
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                          className="w-full px-6 py-4 flex items-center justify-between text-left transition-colors hover:bg-slate-800/80"
                        >
                          <span className="text-white font-semibold pr-4">{faq.q}</span>
                          <ChevronDown
                            size={20}
                            className={`text-indigo-400 shrink-0 transition-transform ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="px-6 pb-4 pt-2 text-slate-300 border-t border-slate-700">
                                {faq.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-12 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-8 text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-3">
              Tidak Menemukan Jawaban?
            </h3>
            <p className="text-slate-400 mb-6">
              Hubungi admin kami untuk bantuan lebih lanjut. Kami siap membantu Anda!
            </p>
            <a
              href={getWhatsAppLink('Halo Admin, saya ada pertanyaan...')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-green-500/25 hover:from-green-500 hover:to-emerald-500 transition-all"
            >
              <MessageCircle size={20} />
              Hubungi via WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      {/* How to Buy Section - Shows After FAQ */}
      <section id="cara-beli" className="py-24 bg-slate-900/50">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Cara Pembelian</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Proses mudah, cepat, dan aman dalam 5 langkah sederhana
            </p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {buyingSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6 hover:border-indigo-500/50 transition-all group"
              >
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12"
          >
            <Link to="/products">
              <Button className="h-14 px-10 text-lg rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border-0 shadow-lg shadow-indigo-500/50">
                Mulai Belanja Sekarang <ArrowRight size={20} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
    </>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-slate-800/50 backdrop-blur-sm p-10 rounded-3xl border border-slate-700 shadow-lg hover:shadow-2xl hover:border-indigo-500/50 transition-all duration-300"
    >
      <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 border border-slate-700">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-slate-400 leading-relaxed font-medium">{desc}</p>
    </motion.div>
  );
}
