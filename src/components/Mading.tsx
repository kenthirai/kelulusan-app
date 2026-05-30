import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export default function Mading() {
  const [messages, setMessages] = useState<any[]>([]);
  const [formData, setFormData] = useState({ nama: '', jurusan: '', pesan: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const fetchMading = async () => {
    const res = await api.getMading();
    if (!res.error && res.data) {
      setMessages(res.data);
    }
  };

  useEffect(() => {
    fetchMading();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const res = await api.postMading(formData);
    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      setFormData({ nama: '', jurusan: '', pesan: '' });
      fetchMading();
      
      // trigger confetti
      import('canvas-confetti').then((confetti) => {
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }).catch(() => {});
    }
    setLoading(false);
  };

  return (
    <section id="mading" className="py-20 bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 font-medium text-sm mb-4">
            <i className="fas fa-heart"></i>
            Tinggalkan Pesan
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Mading Ucapan Digital</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Tuliskan kesan, pesan, atau harapanmu untuk masa depan dan teman-teman seangkatan.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
          {/* Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-700 sticky top-24">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Tulis Pesanmu</h3>
              {success && (
                <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm font-medium flex items-center gap-2">
                  <i className="fas fa-check-circle"></i> Pesan berhasil diposting!
                </div>
              )}
              {error && (
                <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-medium flex items-center gap-2">
                  <i className="fas fa-exclamation-circle"></i> {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nama Lengkap</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.nama}
                    onChange={(e) => setFormData({...formData, nama: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-slate-900 dark:text-white"
                    placeholder="Contoh: Budi Santoso"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Program Keahlian</label>
                  <input 
                    type="text" 
                    value={formData.jurusan}
                    onChange={(e) => setFormData({...formData, jurusan: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-slate-900 dark:text-white"
                    placeholder="Contoh: Rekayasa Perangkat Lunak"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Pesan & Kesan</label>
                  <textarea 
                    required 
                    rows={4}
                    value={formData.pesan}
                    onChange={(e) => setFormData({...formData, pesan: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-slate-900 dark:text-white resize-none"
                    placeholder="Tulis pesan terbaikmu di sini..."
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
                  {loading ? 'Mengirim...' : 'Kirim Pesan'}
                </button>
              </form>
            </div>
          </div>
          
          {/* List Pesan */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {messages.map((msg: any) => (
                <div key={msg.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                        {msg.nama.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{msg.nama}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{msg.jurusan}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">
                      {new Date(msg.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    "{msg.pesan}"
                  </p>
                </div>
              ))}
              
              {messages.length === 0 && (
                <div className="col-span-2 text-center py-12 text-slate-500">
                  <i className="fas fa-comment-dots text-4xl mb-4 opacity-50"></i>
                  <p>Belum ada pesan. Jadilah yang pertama!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
