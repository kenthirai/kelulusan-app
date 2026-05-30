export default function SearchResult({ result, onReset }: { result: any, onReset: () => void }) {
  if (!result) return null;

  const isLulus = result.status === 'LULUS';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-20 relative z-20">
      <div className={`rounded-3xl shadow-2xl overflow-hidden border ${isLulus ? 'bg-white dark:bg-slate-800 border-emerald-100 dark:border-emerald-900/50' : 'bg-white dark:bg-slate-800 border-rose-100 dark:border-rose-900/50'}`}>
        
        {/* Header */}
        <div className={`px-8 py-6 text-center ${isLulus ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-rose-50 dark:bg-rose-900/20'}`}>
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-inner ${isLulus ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-800 dark:text-emerald-300' : 'bg-rose-100 text-rose-600 dark:bg-rose-800 dark:text-rose-300'}`}>
            <i className={`fas ${isLulus ? 'fa-check-double' : 'fa-times'} text-3xl`}></i>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Hasil Pengumuman</h2>
          <p className="text-slate-600 dark:text-slate-300">Tahun Ajaran 2025/2026</p>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          <div className="space-y-6 max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 sm:mb-0">Nama Siswa</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white sm:text-right">{result.nama}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 sm:mb-0">Program Keahlian</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white sm:text-right">{result.kategori || '-'}</span>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">Dinyatakan</p>
              <div className={`inline-block px-8 py-3 rounded-2xl border-2 font-black text-2xl tracking-wider ${isLulus ? 'text-emerald-600 border-emerald-200 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-800/50 dark:bg-emerald-900/30' : 'text-rose-600 border-rose-200 bg-rose-50 dark:text-rose-400 dark:border-rose-800/50 dark:bg-rose-900/30'}`}>
                {result.status}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-center gap-4">
          <button onClick={onReset} className="px-6 py-3 rounded-xl font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm">
            <i className="fas fa-arrow-left mr-2"></i> Kembali
          </button>
          {isLulus && (
            <button onClick={handlePrint} className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 active:scale-95">
              <i className="fas fa-print mr-2"></i> Cetak SKL
            </button>
          )}
        </div>
      </div>
      
      {/* Hidden Print Layout */}
      {isLulus && (
        <div id="cetak-skl-area" className="hidden print:block absolute top-0 left-0 w-full bg-white p-8">
          <div className="text-center border-b-2 border-black pb-4 mb-8">
            <h1 className="text-2xl font-bold uppercase tracking-wider">Surat Keterangan Lulus</h1>
            <p>SMA Kabupaten Gresik Tahun Ajaran 2025/2026</p>
          </div>
          <p className="mb-4">Yang bertanda tangan di bawah ini Kepala Sekolah menerangkan bahwa:</p>
          <table className="w-full mb-8">
            <tbody>
              <tr><td className="w-48 py-2">Nama</td><td className="py-2">: {result.nama}</td></tr>
              <tr><td className="py-2">Program Keahlian</td><td className="py-2">: {result.kategori || '-'}</td></tr>
              <tr><td className="py-2">Nomor Ujian/NISN</td><td className="py-2">: {result.nomor_ujian || '-'}</td></tr>
            </tbody>
          </table>
          <p className="mb-8">Berdasarkan hasil rapat Dewan Guru, siswa tersebut dinyatakan:</p>
          <div className="text-center mb-16">
            <span className="text-2xl font-bold px-8 py-2 border-2 border-black">LULUS</span>
          </div>
          <div className="flex justify-end text-center">
            <div>
              <p>Gresik, 31 Mei 2026</p>
              <p className="mb-20">Kepala Sekolah,</p>
              <p className="font-bold underline">Dr. Budi Santoso, M.Pd</p>
              <p>NIP. 19800101 200501 1 001</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
