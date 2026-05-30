import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import SearchResult from '../components/SearchResult';
import Statistics from '../components/Statistics';
import Gallery from '../components/Gallery';
import WarningModal from '../components/WarningModal';
import { api } from '../lib/api';

export default function PublicSearch() {
  const [result, setResult] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMessageVisible, setIsMessageVisible] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.getSettings();
        if (res.success) {
          setSettings(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const isSearchActive = () => {
    if (!settings) return false;
    if (settings.pengumuman_aktif === 'false') return false;
    
    if (settings.waktu_pengumuman) {
      const now = new Date();
      const openTime = new Date(settings.waktu_pengumuman);
      if (now < openTime) return false;
    }
    
    return true;
  };

  return (
    <>
      <WarningModal />
      
      {/* Hide Navbar and Footer when printing */}
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="flex-grow pt-24">
        {!result ? (
          <>
            {!loading && settings?.pesan_sekolah && isMessageVisible && (
              <div className="max-w-4xl mx-auto px-4 relative animate-fade-in-up">
                <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-2xl p-6 text-center relative pr-10">
                  <button 
                    onClick={() => setIsMessageVisible(false)}
                    className="absolute top-4 right-4 text-indigo-400 hover:text-indigo-600 dark:text-indigo-500 dark:hover:text-indigo-300 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-800/50"
                    title="Tutup pesan"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                  <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-100 mb-2">Pesan Resmi Sekolah</h3>
                  <p className="text-indigo-800 dark:text-indigo-200">{settings.pesan_sekolah}</p>
                </div>
              </div>
            )}
            
            {loading ? (
              <div className="py-20 text-center"><i className="fas fa-spinner fa-spin text-3xl text-indigo-500"></i></div>
            ) : isSearchActive() ? (
              <Hero onResult={setResult} />
            ) : (
              <div className="py-20 max-w-2xl mx-auto text-center px-4">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700">
                  <i className="fas fa-lock text-5xl text-slate-400 mb-6"></i>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Pengumuman Belum Dibuka</h2>
                  <p className="text-slate-600 dark:text-slate-300">
                    Akses pencarian data kelulusan saat ini sedang ditutup atau belum waktunya. 
                    {settings?.waktu_pengumuman && ` Pengumuman akan dibuka pada: ${new Date(settings.waktu_pengumuman).toLocaleString('id-ID')}`}
                  </p>
                </div>
              </div>
            )}
            
            <Statistics />
            <Gallery />
          </>
        ) : (
          <div className="pt-20 pb-10 min-h-[70vh] flex flex-col justify-center bg-slate-50 dark:bg-slate-900 print:bg-white print:p-0 print:m-0 print:min-h-0">
            <SearchResult result={result} onReset={() => setResult(null)} />
          </div>
        )}
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </>
  );
}
