import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/images/lulus.png" alt="Logo Lulus" className="w-8 h-8 object-contain" />
              <h2 className="text-lg font-bold text-white">KELULUSAN SMA Gresik</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Sistem Informasi Kelulusan resmi untuk melihat pengumuman kelulusan dan mencetak Surat Keterangan Lulus secara digital.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Beranda</a></li>
              <li><a href="#statistik" className="hover:text-blue-400 transition-colors">Statistik</a></li>
              <li><a href="#galeri" className="hover:text-blue-400 transition-colors">Galeri Angkatan</a></li>
              <li><a href="#mading" className="hover:text-blue-400 transition-colors">Mading Digital</a></li>
              <li><Link to="/privacy-policy" className="hover:text-blue-400 transition-colors">Kebijakan Privasi</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-blue-400 transition-colors">Syarat Ketentuan</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Kontak Bantuan</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <i className="fas fa-headset mt-1 text-blue-400"></i>
                <span>Helpdesk Tata Usaha<br/>0812-3456-7890</span>
              </li>
              <li className="flex items-start gap-3">
                <i className="fas fa-envelope mt-1 text-blue-400"></i>
                <span>info@smagresik.sch.id</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-800 mt-8 pt-8 text-center text-slate-500 dark:text-slate-400">
          <p>&copy; {new Date().getFullYear()} SMA Gresik. Hak Cipta Dilindungi.</p>
          <p className="mt-1">Dibuat dengan <i className="fas fa-heart text-red-500 mx-1"></i> untuk Generasi Penerus</p>
        </div>
      </div>
    </footer>
  );
}
