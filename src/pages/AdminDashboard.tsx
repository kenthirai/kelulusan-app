import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { api } from '../lib/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, lulus: 0, cumlaude: 0, persentase: 0 });
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({ id: '', nomor_ujian: '', nama: '', kategori: '', status: 'LULUS', nilai: '' });
  const [userFormData, setUserFormData] = useState({ id: '', email: '', name: '', role: 'admin' });
  const [settingsData, setSettingsData] = useState({ pengumuman_aktif: 'true', waktu_pengumuman: '', pesan_sekolah: '' });
  
  // Custom Confirmation Modal states
  const [confirmDialog, setConfirmDialog] = useState<{isOpen: boolean, type: 'single' | 'all', targetId?: string, targetType?: 'candidate' | 'user'}>({ isOpen: false, type: 'single' });
  const [confirmInput, setConfirmInput] = useState('');

  // UI states
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'siswa' | 'admin'>('siswa');
  
  // Filter & Pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterKategori, setFilterKategori] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [res, statsRes, settingsRes, usersRes] = await Promise.all([
        api.getCandidates(token!),
        api.getStats(),
        api.getSettings(),
        api.getUsers(token!)
      ]);
      
      if (res.data) {
        setCandidates(res.data);
      } else if (res.error === 'Unauthorized') {
        navigate('/admin/login');
      }
      
      if (statsRes.success) {
        setStats(statsRes.data);
      }
      
      if (usersRes.success) {
        setUsers(usersRes.data);
      }
      
      if (settingsRes.success && settingsRes.data) {
        setSettingsData({
          pengumuman_aktif: settingsRes.data.pengumuman_aktif || 'true',
          waktu_pengumuman: settingsRes.data.waktu_pengumuman || '',
          pesan_sekolah: settingsRes.data.pesan_sekolah || ''
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.updateCandidate(token!, formData.id, formData);
        toast.success('Data siswa berhasil diubah!');
      } else {
        await api.createCandidate(token!, formData);
        toast.success('Siswa baru berhasil ditambahkan!');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error('Gagal menyimpan data.');
    }
  };

  const confirmDelete = (id: string) => {
    setConfirmDialog({ isOpen: true, type: 'single', targetId: id, targetType: 'candidate' });
  };

  const confirmDeleteAll = () => {
    setConfirmInput('');
    setConfirmDialog({ isOpen: true, type: 'all' });
  };

  const executeDelete = async () => {
    if (confirmDialog.type === 'single' && confirmDialog.targetId) {
      if (confirmDialog.targetType === 'user') {
        try {
          await api.deleteUser(token!, confirmDialog.targetId);
          toast.success('Admin berhasil dihapus');
          fetchData();
        } catch (err) {
          toast.error('Gagal menghapus admin');
        }
      } else {
        try {
          await api.deleteCandidate(token!, confirmDialog.targetId);
          toast.success('Data berhasil dihapus');
          fetchData();
        } catch (err) {
          toast.error('Gagal menghapus data');
        }
      }
    } else if (confirmDialog.type === 'all') {
      if (confirmInput !== 'HAPUS SEMUA') {
        toast.error('Teks konfirmasi tidak cocok!');
        return;
      }
      try {
        setLoading(true);
        await api.deleteAllCandidates(token!);
        toast.success('Seluruh data berhasil dihapus!');
        fetchData();
      } catch (err) {
        toast.error('Gagal menghapus semua data');
        setLoading(false);
      }
    }
    setConfirmDialog({ isOpen: false, type: 'single' });
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (userFormData.id) {
        await api.updateUser(token!, userFormData.id, userFormData);
        toast.success('Data admin berhasil diubah!');
      } else {
        await api.createUser(token!, userFormData);
        toast.success('Admin baru berhasil ditambahkan!');
      }
      setIsUserModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error('Gagal menyimpan data admin.');
    }
  };

  const confirmDeleteUser = (id: string) => {
    setConfirmDialog({ isOpen: true, type: 'single', targetId: id, targetType: 'user' });
  };

  const openUserModal = (data: any = { id: '', email: '', name: '', role: 'admin' }) => {
    setUserFormData(data);
    setIsUserModalOpen(true);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.updateSettings(token!, settingsData);
      setIsSettingsModalOpen(false);
      toast.success('Pengaturan berhasil disimpan!');
      fetchData();
    } catch (err) {
      toast.error('Gagal menyimpan pengaturan');
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (candidates.length === 0) {
      toast.error('Tidak ada data untuk diekspor');
      return;
    }
    
    const headers = ['nomor_ujian', 'nama', 'kategori', 'status', 'nilai'];
    const csvContent = [
      headers.join(','),
      ...candidates.map(c => 
        [c.nomor_ujian, c.nama, c.kategori, c.status, c.nilai]
          .map(val => `"${String(val).replace(/"/g, '""')}"`)
          .join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Data_Kelulusan_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split('\n').filter(line => line.trim());
      if (lines.length < 2) {
        toast.error('File CSV kosong atau tidak sesuai format.');
        return;
      }
      
      const candidates = [];
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',').map(s => s.replace(/(^"|"$)/g, '').trim());
        if (row.length >= 2) {
          candidates.push({
            nomor_ujian: row[0],
            nama: row[1],
            kategori: row[2] || '-',
            status: (row[3] || '').toUpperCase() === 'LULUS' ? 'LULUS' : 'TIDAK LULUS',
            nilai: row[4] || ''
          });
        }
      }

      if (candidates.length === 0) {
        toast.error('Tidak ada data yang valid ditemukan dalam file CSV.');
        return;
      }

      const toastId = toast.loading('Sedang mengimpor data...');
      try {
        setLoading(true);
        const res = await api.importCandidatesBatch(token!, candidates);
        if (!res.success) throw new Error(res.error || 'Server error');
        toast.success(`Berhasil mengimpor ${candidates.length} data siswa!`, { id: toastId });
        fetchData();
      } catch (err: any) {
        toast.error('Gagal mengimpor data CSV: ' + (err.message || 'Pastikan koneksi dan format benar.'), { id: toastId });
        setLoading(false);
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  const openModal = (data: any = { id: '', nomor_ujian: '', nama: '', kategori: '', status: 'LULUS', nilai: '' }) => {
    setFormData(data);
    setIsModalOpen(true);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Filter and Pagination Logic
  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      const matchSearch = c.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.nomor_ujian.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = filterStatus === 'ALL' || c.status === filterStatus;
      const matchKategori = filterKategori === 'ALL' || c.kategori === filterKategori;
      return matchSearch && matchStatus && matchKategori;
    });
  }, [candidates, searchQuery, filterStatus, filterKategori]);

  const uniqueKategori = useMemo(() => {
    const set = new Set(candidates.map(c => c.kategori));
    return Array.from(set).filter(k => k && k !== '-');
  }, [candidates]);

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const currentCandidates = filteredCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus, filterKategori]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Toaster position="top-right" toastOptions={{ 
        className: 'dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl'
      }} />
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                A
              </div>
              <h1 className="font-bold text-slate-900 dark:text-white">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-4">
              <a href="/" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-sm flex items-center gap-2">
                <i className="fas fa-home"></i> Ke Beranda
              </a>
              <div className="w-px h-5 bg-slate-300 dark:bg-slate-600"></div>
              <button onClick={() => setIsSettingsModalOpen(true)} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200" title="Pengaturan">
                <i className="fas fa-cog"></i>
              </button>
              <button onClick={toggleDarkMode} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
              </button>
              <button onClick={handleLogout} className="text-rose-600 hover:text-rose-700 font-medium text-sm flex items-center gap-2 ml-2">
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Ringkasan Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center text-xl">
              <i className="fas fa-users"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Siswa</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</h3>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center text-xl">
              <i className="fas fa-check-circle"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Lulus</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.lulus}</h3>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center text-xl">
              <i className="fas fa-star"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Cumlaude (&#8805;90)</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.cumlaude}</h3>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center text-xl">
              <i className="fas fa-chart-pie"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Persentase Lulus</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.persentase}%</h3>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
          <button 
            onClick={() => setActiveTab('siswa')}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'siswa' ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
          >
            <i className="fas fa-user-graduate mr-2"></i> Data Siswa
          </button>
          <button 
            onClick={() => setActiveTab('admin')}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'admin' ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
          >
            <i className="fas fa-users-cog mr-2"></i> Manajemen Admin
          </button>
        </div>

        {activeTab === 'siswa' && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Manajemen Data Siswa</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Kelola data kelulusan siswa, tambah, edit, atau hapus data.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={handleExportCSV} className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 px-4 py-2 rounded-xl font-medium shadow-sm flex items-center gap-2 transition-colors">
              <i className="fas fa-download"></i> Export CSV
            </button>
            <label className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-medium shadow-sm flex items-center gap-2 transition-colors">
              <i className="fas fa-upload"></i> Import CSV
              <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
            </label>
            <button onClick={() => openModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium shadow-sm flex items-center gap-2 transition-colors">
              <i className="fas fa-plus"></i> Tambah Data
            </button>
            <button onClick={confirmDeleteAll} className="bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 dark:text-rose-400 px-4 py-2 rounded-xl font-medium shadow-sm flex items-center gap-2 transition-colors">
              <i className="fas fa-trash"></i> Hapus Semua
            </button>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-t-2xl border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text" 
              placeholder="Cari nama atau NISN..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex w-full md:w-auto gap-3">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="ALL">Semua Status</option>
              <option value="LULUS">LULUS</option>
              <option value="TIDAK LULUS">TIDAK LULUS</option>
            </select>
            <select 
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="ALL">Semua Program</option>
              {uniqueKategori.map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabel Data */}
        <div className="bg-white dark:bg-slate-800 rounded-b-2xl shadow-sm border border-slate-200 dark:border-slate-700 border-t-0 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">NISN</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nama Lengkap</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Program</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nilai</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-8 text-slate-500 dark:text-slate-400"><i className="fas fa-spinner fa-spin mr-2"></i> Memuat data...</td></tr>
                ) : currentCandidates.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-slate-500 dark:text-slate-400">Data tidak ditemukan.</td></tr>
                ) : (
                  currentCandidates.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{c.nomor_ujian}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{c.nama}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{c.kategori || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          c.status === 'LULUS' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' 
                          : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{c.nilai || '-'}</td>
                      <td className="px-6 py-4 text-sm font-medium text-right space-x-3">
                        <button onClick={() => openModal(c)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300" title="Edit">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button onClick={() => confirmDelete(c.id)} className="text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300" title="Hapus">
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Menampilkan {(currentPage - 1) * itemsPerPage + 1} hingga {Math.min(currentPage * itemsPerPage, filteredCandidates.length)} dari {filteredCandidates.length} data
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg disabled:opacity-50"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg disabled:opacity-50"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          )}
        </div>
        </>
        )}

        {activeTab === 'admin' && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Manajemen Admin</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Kelola akun administrator untuk dashboard ini.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => openUserModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium shadow-sm flex items-center gap-2 transition-colors">
                  <i className="fas fa-user-plus"></i> Tambah Admin
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nama Lengkap</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {loading ? (
                      <tr><td colSpan={4} className="text-center py-8 text-slate-500 dark:text-slate-400"><i className="fas fa-spinner fa-spin mr-2"></i> Memuat data...</td></tr>
                    ) : users.length === 0 ? (
                      <tr><td colSpan={4} className="text-center py-12 text-slate-500 dark:text-slate-400">Belum ada data admin.</td></tr>
                    ) : (
                      users.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{u.name}</td>
                          <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{u.email}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800">
                              {u.role.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-right space-x-3">
                            <button onClick={() => openUserModal(u)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300" title="Edit">
                              <i className="fas fa-edit"></i>
                            </button>
                            <button onClick={() => confirmDeleteUser(u.id)} className="text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300" title="Hapus">
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Modal Form Tambah/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-slate-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative inline-block w-full max-w-md overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-slate-800 shadow-2xl rounded-3xl border border-slate-200 dark:border-slate-700 ring-1 ring-slate-900/5 dark:ring-white/10">
              
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-indigo-50 to-white dark:from-slate-800 dark:to-slate-800 px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <i className={`fas ${formData.id ? 'fa-user-edit' : 'fa-user-plus'}`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {formData.id ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
                  </h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                  <i className="fas fa-times"></i>
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-6">
                <form onSubmit={handleSave} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">NISN / Nomor Ujian</label>
                    <div className="relative">
                      <i className="fas fa-id-card absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                      <input required type="text" value={formData.nomor_ujian} onChange={e => setFormData({...formData, nomor_ujian: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 dark:text-white transition-all" placeholder="Masukkan NISN..." />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nama Lengkap</label>
                    <div className="relative">
                      <i className="fas fa-font absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                      <input required type="text" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 dark:text-white transition-all" placeholder="Nama lengkap siswa..." />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Program Keahlian</label>
                      <input required type="text" value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 dark:text-white transition-all" placeholder="Contoh: IPA" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nilai Rata-rata</label>
                      <input type="text" value={formData.nilai} onChange={e => setFormData({...formData, nilai: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 dark:text-white transition-all" placeholder="Misal: 85.5" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Status Kelulusan</label>
                    <div className="relative">
                      <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 dark:text-white transition-all appearance-none cursor-pointer">
                        <option value="LULUS">🎉 LULUS</option>
                        <option value="TIDAK LULUS">❌ TIDAK LULUS</option>
                      </select>
                      <i className="fas fa-chevron-down absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-700">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold transition-colors">Batal</button>
                    <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl hover:from-indigo-700 hover:to-violet-700 font-semibold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 transform hover:-translate-y-0.5">
                      <i className="fas fa-save"></i> Simpan Data
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form Tambah/Edit Admin */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-slate-900/60 backdrop-blur-md" onClick={() => setIsUserModalOpen(false)}></div>
            <div className="relative inline-block w-full max-w-md overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-slate-800 shadow-2xl rounded-3xl border border-slate-200 dark:border-slate-700 ring-1 ring-slate-900/5 dark:ring-white/10">
              
              <div className="bg-gradient-to-r from-indigo-50 to-white dark:from-slate-800 dark:to-slate-800 px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <i className={`fas ${userFormData.id ? 'fa-user-edit' : 'fa-user-plus'}`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {userFormData.id ? 'Edit Admin' : 'Tambah Admin Baru'}
                  </h3>
                </div>
                <button onClick={() => setIsUserModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="px-6 py-6">
                <form onSubmit={handleSaveUser} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nama Lengkap</label>
                    <div className="relative">
                      <i className="fas fa-font absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                      <input required type="text" value={userFormData.name} onChange={e => setUserFormData({...userFormData, name: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 dark:text-white transition-all" placeholder="Nama admin..." />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email (Login dengan Google)</label>
                    <div className="relative">
                      <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                      <input required type="email" value={userFormData.email} onChange={e => setUserFormData({...userFormData, email: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 dark:text-white transition-all" placeholder="email@gmail.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Role</label>
                    <div className="relative">
                      <select value={userFormData.role} onChange={e => setUserFormData({...userFormData, role: e.target.value})} className="w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 dark:text-white transition-all appearance-none cursor-pointer">
                        <option value="admin">Admin</option>
                      </select>
                      <i className="fas fa-chevron-down absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-700">
                    <button type="button" onClick={() => setIsUserModalOpen(false)} className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold transition-colors">Batal</button>
                    <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl hover:from-indigo-700 hover:to-violet-700 font-semibold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 transform hover:-translate-y-0.5">
                      <i className="fas fa-save"></i> Simpan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Pengaturan Sistem */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-slate-900/60 backdrop-blur-md" onClick={() => setIsSettingsModalOpen(false)}></div>
            <div className="relative inline-block w-full max-w-md overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-slate-800 shadow-2xl rounded-3xl border border-slate-200 dark:border-slate-700 ring-1 ring-slate-900/5 dark:ring-white/10">
              
              {/* Header Modal Pengaturan */}
              <div className="bg-gradient-to-r from-emerald-50 to-white dark:from-slate-800 dark:to-slate-800 px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <i className="fas fa-cog"></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Pengaturan Pengumuman
                  </h3>
                </div>
                <button onClick={() => setIsSettingsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                  <i className="fas fa-times"></i>
                </button>
              </div>

              {/* Body Modal Pengaturan */}
              <div className="px-6 py-6">
                <form onSubmit={handleSaveSettings} className="space-y-5">
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Status Akses Pencarian</label>
                    <div className="relative">
                      <select value={settingsData.pengumuman_aktif} onChange={e => setSettingsData({...settingsData, pengumuman_aktif: e.target.value})} className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white transition-all appearance-none cursor-pointer">
                        <option value="true">🟢 Aktif (Siswa bisa mencari)</option>
                        <option value="false">🔴 Ditutup (Akses dikunci)</option>
                      </select>
                      <i className="fas fa-chevron-down absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Jadwal Buka Pengumuman</label>
                    <div className="relative">
                      <i className="fas fa-calendar-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                      <input type="datetime-local" value={settingsData.waktu_pengumuman} onChange={e => setSettingsData({...settingsData, waktu_pengumuman: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white transition-all" />
                    </div>
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1"><i className="fas fa-info-circle"></i> Jika diisi waktu mendatang, sistem akan otomatis menampilkan Hitung Mundur.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Pesan Resmi Sekolah</label>
                    <textarea rows={4} value={settingsData.pesan_sekolah} onChange={e => setSettingsData({...settingsData, pesan_sekolah: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white transition-all resize-none" placeholder="Masukkan pesan resmi yang akan tampil di halaman depan..."></textarea>
                  </div>

                  <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-700">
                    <button type="button" onClick={() => setIsSettingsModalOpen(false)} className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold transition-colors">Batal</button>
                    <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 font-semibold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 transform hover:-translate-y-0.5">
                      <i className="fas fa-check-circle"></i> Simpan Pengaturan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-slate-900/60 backdrop-blur-md" onClick={() => setConfirmDialog({isOpen: false, type: 'single'})}></div>
            <div className="relative inline-block w-full max-w-sm overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-slate-800 shadow-2xl rounded-3xl border border-slate-200 dark:border-slate-700 ring-1 ring-slate-900/5 dark:ring-white/10 p-6">
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center text-3xl mb-4">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {confirmDialog.type === 'all' ? 'Hapus Seluruh Data?' : 'Hapus Data Ini?'}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                  {confirmDialog.type === 'all' 
                    ? 'Tindakan ini akan menghapus semua data siswa secara permanen dan tidak dapat dibatalkan.' 
                    : 'Tindakan ini akan menghapus data siswa ini secara permanen.'}
                </p>

                {confirmDialog.type === 'all' && (
                  <div className="w-full text-left mb-6">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Ketik <span className="text-rose-600 font-bold select-all">HAPUS SEMUA</span> untuk konfirmasi:</label>
                    <input 
                      type="text" 
                      value={confirmInput} 
                      onChange={e => setConfirmInput(e.target.value)} 
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-slate-900 dark:text-white font-mono text-center" 
                      placeholder="HAPUS SEMUA"
                    />
                  </div>
                )}

                <div className="flex gap-3 w-full">
                  <button onClick={() => setConfirmDialog({isOpen: false, type: 'single'})} className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-semibold transition-colors">
                    Batal
                  </button>
                  <button 
                    onClick={executeDelete} 
                    disabled={confirmDialog.type === 'all' && confirmInput !== 'HAPUS SEMUA'}
                    className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold shadow-md shadow-rose-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Ya, Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
