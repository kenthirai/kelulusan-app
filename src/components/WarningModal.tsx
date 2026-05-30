import { useState, useEffect } from 'react';

export default function WarningModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // Check if the user has already read the warning in this session
    const hasRead = sessionStorage.getItem('has_read_warning');
    if (!hasRead) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem('has_read_warning', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-slate-900/70 backdrop-blur-sm" aria-hidden="true"></div>
        
        <div className="relative inline-block w-full max-w-2xl text-left align-middle transition-all transform bg-white dark:bg-slate-800 shadow-2xl rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-fade-in-up">
          
          {/* Header */}
          <div className="bg-blue-600 dark:bg-blue-700 px-5 py-3 flex justify-between items-center">
            <h3 className="text-base font-bold text-white">Informasi Penting</h3>
            <button 
              onClick={handleClose}
              className="text-white/70 hover:text-white transition-colors"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>
          
          {/* Content */}
          <div className="p-4 sm:p-5">
            <div className="text-center mb-4">
              <h4 className="font-bold text-sm sm:text-base text-slate-800 dark:text-white leading-snug">
                PENGUMUMAN KELULUSAN<br/>
                SMA NEGERI & SWASTA KAB. Gresik<br/>
                TAHUN AJARAN 2025/2026
              </h4>
              <h5 className="font-bold text-sm text-rose-600 dark:text-rose-500 mt-2">
                HIMBAUAN PASCA PENGUMUMAN<br/>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">(SE Kadisdik No.e-0008 Tahun 2026)</span>
              </h5>
            </div>
            
            <div className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm space-y-2">
              <p>Kepada seluruh peserta didik Kelas XII jenjang SMA Tahun Ajaran 2025/2026 untuk <strong>tidak melakukan</strong> hal-hal berikut :</p>
              
              <ol className="list-decimal pl-5 space-y-1">
                <li>Corat-coret pakaian/seragam dan objek lainnya;</li>
                <li>Konvoi kendaraan bermotor atau nge-geng;</li>
                <li>Kumpul atau berkerumun di tempat-tempat tertentu;</li>
                <li>Tawuran atau Pemalakan (bullying);</li>
                <li>Bentuk lain yang mengganggu ketertiban umum dan melanggar hukum.</li>
              </ol>
              
              <p className="pt-1">Bagi peserta didik yang melanggar instruksi di atas, maka kepadanya akan diberikan sanksi yang tegas oleh pihak sekolah.</p>
            </div>
            
            {/* Agreement Box */}
            <div className="mt-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 rounded-xl p-3 sm:p-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input 
                    type="checkbox" 
                    className="peer appearance-none w-5 h-5 border-2 border-rose-300 dark:border-rose-700 rounded-md checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors cursor-pointer"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                  />
                  <i className="fas fa-check absolute text-white text-xs opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"></i>
                </div>
                <span className="text-xs sm:text-sm font-bold text-rose-700 dark:text-rose-400 leading-snug group-hover:text-rose-800 dark:group-hover:text-rose-300 transition-colors">
                  Dengan ini saya menyatakan bahwa saya sudah membaca dan memahami instruksi di atas, dan selanjutnya saya siap melaksanakan.
                </span>
              </label>
            </div>
          </div>
          
          {/* Footer */}
          <div className="bg-slate-50 dark:bg-slate-900/50 px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              &copy; 2026 | SMA-GRESIK
            </div>
            <button 
              onClick={handleClose}
              disabled={!isChecked}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 dark:disabled:bg-slate-700 text-white font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
            >
              Lanjutkan
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
