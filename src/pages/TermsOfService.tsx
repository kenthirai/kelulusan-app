import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
        <Link to="/" className="inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Link>
        
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Syarat dan Ketentuan Layanan (Terms of Service)</h1>
        
        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 space-y-4">
          <p>Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
          
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">1. Penerimaan Syarat</h2>
          <p>
            Dengan mengakses dan menggunakan <strong>Kelulusan App</strong> ("Layanan"), Anda setuju untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari syarat ini, Anda tidak diperkenankan untuk mengakses Layanan.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">2. Penggunaan Layanan</h2>
          <p>
            Layanan ini ditujukan untuk memfasilitasi pencarian dan pengecekan status kelulusan siswa, serta pengelolaan data kelulusan oleh administrator sekolah. Anda setuju untuk menggunakan Layanan ini hanya untuk tujuan yang sah dan tidak melanggar hak orang lain.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">3. Akun dan Keamanan (Google Auth)</h2>
          <p>
            Untuk fitur administrator, Layanan menggunakan autentikasi melalui Google Login. Anda bertanggung jawab untuk menjaga kerahasiaan kredensial Google Anda. Akses yang diberikan melalui Google Login hanya diperuntukkan bagi panitia dan staf sekolah yang berwenang.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">4. Kebijakan Data dan Privasi</h2>
          <p>
            Penggunaan data pribadi Anda juga diatur oleh Kebijakan Privasi kami. Dengan menggunakan Layanan ini, Anda menyetujui pengumpulan dan penggunaan informasi sesuai dengan Kebijakan Privasi tersebut.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">5. Penyangkalan (Disclaimer)</h2>
          <p>
            Data kelulusan yang disajikan dalam sistem ini adalah hasil pengolahan data sekolah. Kami tidak menjamin bahwa Layanan akan selalu tidak terganggu, tepat waktu, aman, atau bebas dari kesalahan teknis sewaktu-waktu.
          </p>
          
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">6. Perubahan Syarat</h2>
          <p>
            Kami berhak untuk mengubah atau mengganti Syarat ini kapan saja. Perubahan akan berlaku segera setelah dipublikasikan di halaman ini.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">7. Hubungi Kami</h2>
          <p>
            Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini, silakan hubungi administrasi sekolah Anda.
          </p>
        </div>
      </div>
    </div>
  )
}
