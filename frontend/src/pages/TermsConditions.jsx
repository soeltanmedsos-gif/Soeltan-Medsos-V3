import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, FileText, Clock } from 'lucide-react';

export default function TermsConditions() {
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
            <FileText size={32} className="text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Syarat & Ketentuan
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Harap baca dengan seksama sebelum menggunakan layanan kami
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Terakhir diperbarui: 22 Januari 2026
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-8 space-y-8"
        >
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-indigo-400">1.</span>
              Pendahuluan
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Dengan menggunakan layanan Soeltan Medsos, Anda menyetujui untuk terikat dengan syarat dan ketentuan yang dijelaskan di bawah ini. 
              Jika Anda tidak menyetujui salah satu ketentuan ini, harap tidak menggunakan layanan kami.
            </p>
          </section>

          {/* Service Description */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-indigo-400">2.</span>
              Deskripsi Layanan
            </h2>
            <div className="text-slate-300 leading-relaxed space-y-3">
              <p>
                Soeltan Medsos menyediakan layanan Social Media Marketing (SMM) yang meliputi:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Penambahan followers, likes, views, dan engagement lainnya untuk berbagai platform media sosial</li>
                <li>Layanan dilakukan dengan metode yang aman dan sesuai standar platform</li>
                <li>Waktu pengerjaan bervariasi tergantung jenis layanan dan jumlah pesanan (1-24 jam)</li>
              </ul>
            </div>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-indigo-400">3.</span>
              Tanggung Jawab Pengguna
            </h2>
            <div className="text-slate-300 leading-relaxed space-y-3">
              <p>Sebagai pengguna layanan, Anda bertanggung jawab untuk:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Memastikan informasi yang diberikan (username/link target) adalah benar dan valid</li>
                <li>Memastikan akun target bersifat <strong>PUBLIC</strong> selama proses berlangsung</li>
                <li>Tidak memberikan informasi password atau data sensitif kepada siapapun</li>
                <li>Menggunakan layanan sesuai dengan hukum yang berlaku</li>
                <li>Tidak menggunakan layanan untuk tujuan ilegal, menipu, atau merugikan pihak lain</li>
                <li>Menyimpan kode pembelian untuk tracking dan klaim garansi</li>
              </ul>
            </div>
          </section>

          {/* Payment Terms */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-indigo-400">4.</span>
              Ketentuan Pembayaran
            </h2>
            <div className="text-slate-300 leading-relaxed space-y-3">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Pembayaran dilakukan melalui payment gateway Midtrans yang aman dan terpercaya</li>
                <li>Pesanan akan diproses setelah pembayaran dikonfirmasi oleh sistem</li>
                <li>Harga yang tertera sudah final dan tidak termasuk biaya transaksi (jika ada)</li>
                <li>Kami tidak bertanggung jawab atas biaya tambahan dari penyedia pembayaran</li>
                <li>Bukti pembayaran dan kode pembelian harus disimpan untuk keperluan tracking</li>
              </ul>
            </div>
          </section>

          {/* Refund & Cancellation */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-indigo-400">5.</span>
              Kebijakan Refund & Pembatalan
            </h2>
            <div className="text-slate-300 leading-relaxed space-y-3">
              <p>
                <strong>Refund dapat diberikan dalam kondisi berikut:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Pesanan tidak dapat diproses karena kesalahan sistem kami</li>
                <li>Link/username yang diberikan tidak valid dan kami tidak dapat memproses</li>
                <li>Terjadi kesalahan teknis yang membuat pesanan tidak dapat diselesaikan</li>
              </ul>
              <p className="mt-4">
                <strong>Refund TIDAK diberikan jika:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Pesanan sudah dalam tahap proses atau selesai</li>
                <li>Kesalahan input link/username dari pihak pembeli</li>
                <li>Akun target di-private atau dihapus setelah pesanan dibuat</li>
                <li>Pembeli berubah pikiran setelah pembayaran</li>
              </ul>
              <p className="mt-4">
                <strong>Pembatalan pesanan:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Hanya dapat dilakukan sebelum pesanan masuk tahap "Process"</li>
                <li>Hubungi admin via WhatsApp segera untuk pembatalan</li>
                <li>Refund akan diproses dalam 3-7 hari kerja</li>
              </ul>
            </div>
          </section>

          {/* Guarantee */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-indigo-400">6.</span>
              Garansi Layanan
            </h2>
            <div className="text-slate-300 leading-relaxed space-y-3">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Kami memberikan garansi 30 hari untuk kualitas layanan</li>
                <li>Jika terjadi drop (pengurangan) signifikan dalam 30 hari, hubungi admin untuk refill gratis</li>
                <li>Drop yang wajar (di bawah 10%) tidak termasuk dalam garansi</li>
                <li>Garansi tidak berlaku jika akun target melanggar ToS platform atau dihapus/suspend</li>
                <li>Untuk klaim garansi, wajib menyertakan kode pembelian dan bukti screenshot</li>
              </ul>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-indigo-400">7.</span>
              Batasan Tanggung Jawab
            </h2>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertTriangle size={24} className="text-yellow-400 shrink-0 mt-0.5" />
                <div className="text-slate-300 text-sm space-y-2">
                  <p className="font-semibold text-white">Penting untuk Diketahui:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Kami tidak bertanggung jawab atas sanksi dari platform media sosial (suspend, ban, dll) akibat penggunaan layanan SMM</li>
                    <li>Penggunaan layanan sepenuhnya merupakan risiko dan tanggung jawab pengguna</li>
                    <li>Kami tidak menjamin bahwa layanan akan selalu tersedia tanpa gangguan</li>
                    <li>Kami berhak menolak atau membatalkan pesanan yang mencurigakan</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Privacy & Security */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-indigo-400">8.</span>
              Privasi & Keamanan
            </h2>
            <div className="text-slate-300 leading-relaxed space-y-3">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Kami TIDAK PERNAH meminta password akun media sosial Anda</li>
                <li>Data pribadi (nama, nomor WhatsApp) hanya digunakan untuk keperluan processing pesanan</li>
                <li>Kami menggunakan enkripsi SSL untuk melindungi data transaksi</li>
                <li>Data pembayaran diproses oleh Midtrans dan tidak disimpan di server kami</li>
                <li>Kami tidak akan membagikan informasi pribadi Anda kepada pihak ketiga tanpa izin</li>
              </ul>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-indigo-400">9.</span>
              Perubahan Syarat & Ketentuan
            </h2>
            <div className="text-slate-300 leading-relaxed space-y-3">
              <p>
                Kami berhak untuk mengubah atau memperbarui Syarat & Ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya. 
                Perubahan akan efektif segera setelah dipublikasikan di halaman ini. 
                Penggunaan layanan setelah perubahan berarti Anda menyetujui ketentuan yang telah diperbarui.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-indigo-400">10.</span>
              Kontak
            </h2>
            <div className="text-slate-300 leading-relaxed space-y-3">
              <p>Jika Anda memiliki pertanyaan tentang Syarat & Ketentuan ini, silakan hubungi kami:</p>
              <ul className="space-y-2 ml-4">
                <li>📞 WhatsApp: +62 823-5283-5382</li>
                <li>📧 Email: support@soeltanmedsos.com</li>
                <li>🌐 Website: www.soeltanmedsos.com</li>
              </ul>
            </div>
          </section>

          {/* Acceptance */}
          <section className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Shield size={24} className="text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-slate-300">
                <p className="font-semibold text-white mb-2">Persetujuan</p>
                <p className="text-sm">
                  Dengan melakukan pemesanan atau menggunakan layanan Soeltan Medsos, Anda menyatakan telah membaca, 
                  memahami, dan menyetujui seluruh Syarat & Ketentuan yang berlaku.
                </p>
              </div>
            </div>
          </section>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/cara-beli"
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-purple-500 transition-all"
          >
            Lihat Cara Pembelian
          </Link>
          <Link
            to="/faq"
            className="px-8 py-4 bg-slate-800 text-white rounded-xl font-bold border border-slate-700 hover:border-indigo-500/50 transition-all"
          >
            Baca FAQ
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
