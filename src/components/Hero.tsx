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
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-b from-indigo-100/50 to-purple-100/50 blur-3xl dark:from-indigo-900/20 dark:to-purple-900/20"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-t from-blue-100/50 to-cyan-100/50 blur-3xl dark:from-blue-900/20 dark:to-cyan-900/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50 dark:opacity-20"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-8 border border-indigo-100 dark:border-indigo-800/50 shadow-sm animate-fade-in-up">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
          </span>
          Pengumuman Kelulusan Angkatan 2024
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight animate-fade-in-up" style={{animationDelay: '100ms'}}>
          Momen <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Puncak</span><br/>
          Perjalanan Panjangmu
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '200ms'}}>
          Masukkan Nomor Induk Siswa Nasional (NISN) Anda untuk melihat hasil kelulusan dan mengunduh Surat Keterangan Lulus (SKL) secara digital.
        </p>

        {/* Form Cari */}
        <div className="max-w-xl mx-auto relative z-10 animate-fade-in-up" style={{animationDelay: '300ms'}}>
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-2 transition-transform duration-300 focus-within:scale-[1.02]">
              <div className="pl-4 pr-2 text-slate-400">
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
                className="bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-md active:scale-95 flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
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
