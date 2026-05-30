import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
        <Link to="/" className="inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Link>
        
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Kebijakan Privasi (Privacy Policy)</h1>
        
        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 space-y-4">
          <p>Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
          
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">1. Informasi yang Kami Kumpulkan</h2>
          <p>
            Sistem Informasi Kelulusan mengumpulkan informasi berikut:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Data Siswa (Publik):</strong> Nomor Ujian, Nama Siswa, Kategori, Status Kelulusan, dan Nilai yang diinput oleh Administrator sekolah.</li>
            <li><strong>Data Administrator (Google Auth):</strong> Saat Anda login sebagai Admin melalui Google, kami menerima profil dasar Anda berupa Alamat Email dan Nama Lengkap dari Google. Kami tidak menyimpan atau memiliki akses ke kata sandi Google Anda.</li>
            <li><strong>Data Mading (Publik):</strong> Nama, Jurusan, dan Pesan yang Anda kirimkan ke Papan Informasi (Mading) digital secara sukarela.</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">2. Bagaimana Kami Menggunakan Informasi Anda</h2>
          <p>
            Kami menggunakan informasi yang dikumpulkan untuk tujuan berikut:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Menyediakan, memelihara, dan mengoperasikan Sistem Informasi Kelulusan.</li>
            <li>Memverifikasi identitas dan hak akses administrator melalui sistem SSO Google.</li>
            <li>Menampilkan status kelulusan secara tepat berdasarkan Nomor Ujian yang diinputkan pengguna.</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">3. Keamanan Data</h2>
          <p>
            Keamanan data Anda sangat penting bagi kami. Kami tidak pernah membagikan atau menjual data siswa kepada pihak ketiga untuk kepentingan komersial. Akses manajemen data kelulusan dilindungi dengan autentikasi enkripsi JWT secara ketat.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">4. Penggunaan Google API Data</h2>
          <p>
            Penggunaan dan transfer informasi yang diterima dari Google API oleh aplikasi ini akan mematuhi <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">Google API Services User Data Policy</a>, termasuk persyaratan Penggunaan Terbatas.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">5. Perubahan Kebijakan Privasi</h2>
          <p>
            Kami dapat memperbarui Kebijakan Privasi kami dari waktu ke waktu. Kami menyarankan Anda meninjau halaman ini secara berkala untuk melihat setiap perubahan.
          </p>
        </div>
      </div>
    </div>
  )
}
