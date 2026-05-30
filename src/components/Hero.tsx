import { useState } from 'react';
import { api } from '../lib/api';

export default function Hero({ onResult }: { onResult: (data: any) => void }) {
  const [nomorUjian, setNomorUjian] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomorUjian.trim()) return;
    
    setLoading(true);
    setError('');
    
    const res = await api.checkKelulusan(nomorUjian);
    if (res.error) {
      setError(res.error);
    } else {
      onResult(res.data);
    }
    setLoading(false);
  };

  return (
    <div className="relative pt-6 pb-12 lg:pt-8 lg:pb-16 overflow-hidden">
      {/* Background Ornamen (Dihapus untuk gaya monokrom) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30 dark:opacity-10"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium text-sm mb-4 border border-slate-200 dark:border-slate-700 shadow-sm animate-fade-in-up">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          Pengumuman Kelulusan Angkatan 2026
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4 leading-tight animate-fade-in-up" style={{animationDelay: '100ms'}}>
          Portal <span className="text-blue-600">Kelulusan</span> Siswa
        </h1>
        
        <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '200ms'}}>
          Akses pengumuman kelulusan dan unduh Surat Keterangan Lulus (SKL) resmi dengan memasukkan NISN Anda.
        </p>

        {/* Form Cari */}
        <div className="max-w-xl mx-auto relative z-10 animate-fade-in-up" style={{animationDelay: '300ms'}}>
          <form onSubmit={handleSearch} className="relative group">
            <div className="relative flex items-center bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-2 transition-transform duration-300 focus-within:scale-[1.02]">
              <div className="pl-4 pr-2 text-black dark:text-white">
                <i className="fas fa-id-card text-xl"></i>
              </div>
              <input 
                type="text" 
                value={nomorUjian}
                onChange={(e) => setNomorUjian(e.target.value)}
                placeholder="Masukkan 10 digit NISN..." 
                className="w-full py-4 px-2 bg-transparent border-none text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-0 focus:outline-none text-lg font-medium"
                required
              />
              <button 
                type="submit" 
                disabled={loading}
                className="bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-md active:scale-95 flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
              >
                {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-search"></i>}
                <span className="hidden sm:inline">{loading ? 'Mencari...' : 'Cek Kelulusan'}</span>
              </button>
            </div>
          </form>
          {error && <p className="text-red-500 mt-3 text-sm font-medium">{error}</p>}
        </div>
      </div>
    </div>
  );
}
