export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                S
              </div>
              <h2 className="text-lg font-bold">SKL Online</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Sistem Informasi Kelulusan resmi untuk melihat pengumuman kelulusan dan mencetak Surat Keterangan Lulus secara digital.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Beranda</a></li>
              <li><a href="#statistik" className="hover:text-indigo-400 transition-colors">Statistik</a></li>
              <li><a href="#galeri" className="hover:text-indigo-400 transition-colors">Galeri Angkatan</a></li>
              <li><a href="#mading" className="hover:text-indigo-400 transition-colors">Mading Digital</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Kontak Bantuan</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <i className="fas fa-headset mt-1 text-indigo-400"></i>
                <span>Helpdesk Tata Usaha<br/>0812-3456-7890</span>
              </li>
              <li className="flex items-start gap-3">
                <i className="fas fa-envelope mt-1 text-indigo-400"></i>
                <span>info@sekolah-unggul.sch.id</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} SMK & SMA Unggul. Hak Cipta Dilindungi.</p>
          <p className="mt-1">Dibuat dengan <i className="fas fa-heart text-red-500 mx-1"></i> untuk Generasi Penerus</p>
        </div>
      </div>
    </footer>
  );
}
