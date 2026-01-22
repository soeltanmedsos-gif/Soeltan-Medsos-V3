import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, MessageCircle, HelpCircle } from 'lucide-react';
import { getWhatsAppLink } from '../utils/formatters';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: 'Umum',
      questions: [
        {
          q: 'Apa itu Soeltan Medsos?',
          a: 'Soeltan Medsos adalah platform Social Media Marketing (SMM) yang menyediakan layanan untuk meningkatkan engagement media sosial seperti followers, likes, views, dan lainnya secara aman dan terpercaya.'
        },
        {
          q: 'Apakah layanan ini aman dan legal?',
          a: 'Ya, layanan kami menggunakan metode organik yang aman. Namun, penggunaan layanan SMM tetap merupakan tanggung jawab pengguna. Kami menyarankan untuk menggunakan layanan ini secara bijak dan sesuai ketentuan platform media sosial yang berlaku.'
        },
        {
          q: 'Berapa lama waktu pengerjaan pesanan?',
          a: 'Waktu pengerjaan bervariasi tergantung jenis layanan dan jumlah pesanan. Umumnya 1-24 jam setelah pembayaran dikonfirmasi. Untuk pesanan dalam jumlah besar mungkin memerlukan waktu lebih lama.'
        }
      ]
    },
    {
      category: 'Pemesanan',
      questions: [
        {
          q: 'Bagaimana cara memesan layanan?',
          a: 'Pilih layanan yang diinginkan, masukkan link/username target dan jumlah, tambahkan ke keranjang, lalu lakukan checkout dengan mengisi data diri dan melakukan pembayaran. Lihat panduan lengkap di halaman Cara Beli.'
        },
        {
          q: 'Apakah bisa memesan lebih dari satu layanan sekaligus?',
          a: 'Ya, Anda bisa menambahkan beberapa layanan ke keranjang dan checkout sekaligus. Setiap pesanan akan mendapat kode pembelian terpisah untuk tracking.'
        },
        {
          q: 'Apakah perlu login untuk memesan?',
          a: 'Tidak perlu! Anda cukup isi nama dan nomor WhatsApp saat checkout. Namun untuk admin, login diperlukan untuk mengelola pesanan.'
        },
        {
          q: 'Kenapa harus input nomor WhatsApp?',
          a: 'Nomor WhatsApp digunakan untuk konfirmasi pesanan dan komunikasi jika ada kendala atau update terkait pesanan Anda.'
        }
      ]
    },
    {
      category: 'Pembayaran',
      questions: [
        {
          q: 'Metode pembayaran apa saja yang tersedia?',
          a: 'Kami menggunakan payment gateway Midtrans yang menerima berbagai metode: Transfer Bank (BCA, BNI, Mandiri, dll), E-Wallet (GoPay, OVO, DANA, ShopeePay), Kartu Kredit/Debit, dan Indomaret/Alfamart.'
        },
        {
          q: 'Apakah pembayaran aman?',
          a: 'Sangat aman! Kami menggunakan Midtrans, payment gateway terpercaya di Indonesia dengan sertifikasi keamanan internasional (PCI DSS Level 1). Data pembayaran Anda terenkripsi dan aman.'
        },
        {
          q: 'Berapa lama pembayaran dikonfirmasi?',
          a: 'Pembayaran melalui transfer bank virtual account dan e-wallet biasanya otomatis terkonfirmasi dalam hitungan detik hingga beberapa menit. Untuk metode lain mungkin memerlukan waktu lebih lama.'
        },
        {
          q: 'Bagaimana jika pembayaran gagal?',
          a: 'Jika pembayaran gagal, Anda bisa mencoba ulang melalui halaman detail pesanan dengan kode pembelian yang sudah diberikan, atau hubungi admin untuk bantuan.'
        }
      ]
    },
    {
      category: 'Pesanan & Tracking',
      questions: [
        {
          q: 'Bagaimana cara melacak pesanan saya?',
          a: 'Gunakan kode pembelian yang diberikan setelah checkout. Masuk ke menu "Cek Pesanan" dan input kode Anda untuk melihat status terkini.'
        },
        {
          q: 'Apa itu kode pembelian?',
          a: 'Kode pembelian adalah kode unik yang diberikan setelah Anda checkout. Kode ini digunakan untuk tracking status pesanan dan bukti transaksi.'
        },
        {
          q: 'Apakah pesanan langsung dikerjakan setelah bayar?',
          a: 'Ya, setelah pembayaran dikonfirmasi, pesanan akan masuk antrian dan dikerjakan sesuai urutan. Status akan berubah dari "Pending" ke "Paid" lalu "Process" dan akhirnya "Done".'
        },
        {
          q: 'Pesanan saya belum diproses, bagaimana?',
          a: 'Pastikan pembayaran sudah dikonfirmasi (status "Paid"). Jika sudah lebih dari 24 jam dan belum diproses, hubungi admin via WhatsApp dengan menyertakan kode pembelian.'
        }
      ]
    },
    {
      category: 'Refund & Garansi',
      questions: [
        {
          q: 'Apakah ada garansi jika pesanan tidak masuk?',
          a: 'Ya, kami memberikan garansi. Jika pesanan tidak masuk setelah status "Done", Anda bisa klaim refund atau repeat order. Hubungi admin dengan bukti kode pembelian.'
        },
        {
          q: 'Bagaimana cara refund?',
          a: 'Refund hanya diberikan jika pesanan tidak dapat diproses karena kesalahan sistem atau link/username tidak valid. Hubungi admin dengan kode pembelian untuk proses refund.'
        },
        {
          q: 'Apakah bisa cancel pesanan setelah bayar?',
          a: 'Pembatalan hanya bisa dilakukan jika pesanan belum masuk tahap "Process". Setelah diproses, pesanan tidak bisa dibatalkan. Hubungi admin segera jika ingin cancel.'
        }
      ]
    },
    {
      category: 'Teknis',
      questions: [
        {
          q: 'Apakah perlu memberikan password akun?',
          a: 'TIDAK! Kami TIDAK PERNAH meminta password akun media sosial Anda. Cukup username/link saja. Waspadai penipuan yang meminta password!'
        },
        {
          q: 'Kenapa akun harus public?',
          a: 'Layanan kami memerlukan akses public untuk bisa deliver followers/likes. Akun private tidak bisa diproses. Anda bisa ubah ke public saat proses, lalu private lagi setelah selesai.'
        },
        {
          q: 'Apakah followers/likes bisa drop (berkurang)?',
          a: 'Kemungkinan drop sangat kecil karena kami menggunakan metode berkualitas. Jika terjadi drop signifikan dalam 30 hari, hubungi admin untuk refill gratis.'
        }
      ]
    }
  ];

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HelpCircle size={32} className="text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            FAQ - Pertanyaan Umum
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Temukan jawaban untuk pertanyaan yang sering diajukan seputar layanan kami
          </p>
        </motion.div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqs.map((category, catIndex) => (
            <motion.div
              key={catIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: catIndex * 0.1 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-indigo-400">#</span>
                {category.category}
              </h2>
              <div className="space-y-3">
                {category.questions.map((faq, qIndex) => {
                  const index = `${catIndex}-${qIndex}`;
                  const isOpen = openIndex === index;
                  
                  return (
                    <div
                      key={qIndex}
                      className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 overflow-hidden hover:border-indigo-500/50 transition-all"
                    >
                      <button
                        onClick={() => toggleQuestion(catIndex, qIndex)}
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

        {/* Contact Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-3">
            Tidak Menemukan Jawaban?
          </h3>
          <p className="text-slate-400 mb-6">
            Hubungi admin kami untuk bantuan lebih lanjut. Kami siap membantu Anda!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={getWhatsAppLink('Halo Admin, saya ada pertanyaan...')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-green-500/25 hover:from-green-500 hover:to-emerald-500 transition-all flex items-center justify-center gap-2 group"
            >
              <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
              Hubungi via WhatsApp
            </a>
            <Link
              to="/cara-beli"
              className="px-8 py-4 bg-slate-800 text-white rounded-xl font-bold border border-slate-700 hover:border-indigo-500/50 transition-all"
            >
              Lihat Cara Pembelian
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
