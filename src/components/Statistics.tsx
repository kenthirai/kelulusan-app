import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export default function Statistics() {
  const [stats, setStats] = useState({ total: 0, lulus: 0, cumlaude: 0, persentase: 0 });

  useEffect(() => {
    api.getStats().then(res => {
      if (!res.error && res.data) {
        setStats(res.data);
      }
    });
  }, []);

  return (
    <section id="statistik" className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Statistik Kelulusan</h2>
          <div className="w-24 h-1 bg-indigo-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl">
              <i className="fas fa-users"></i>
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white mb-1" id="stat-total">{stats.total}</div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Siswa</div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl">
              <i className="fas fa-user-graduate"></i>
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white mb-1" id="stat-lulus">{stats.lulus}</div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Siswa Lulus</div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl">
              <i className="fas fa-percentage"></i>
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white mb-1" id="stat-persen">{stats.persentase}%</div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Persentase Lulus</div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl">
              <i className="fas fa-medal"></i>
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white mb-1" id="stat-cumlaude">{stats.cumlaude}</div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Cum Laude</div>
          </div>
        </div>
      </div>
    </section>
  );
}
