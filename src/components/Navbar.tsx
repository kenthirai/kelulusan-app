import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/images/lulus.png" alt="Logo Lulus" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              KELULUSAN SMA Gresik
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Kabupaten Gresik</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleDarkMode}
              className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              <i className={`fas ${darkMode ? 'fa-sun text-amber-400' : 'fa-moon'}`}></i>
            </button>
            <Link 
              to="/admin/dashboard" 
              className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-medium text-xs sm:text-sm transition-colors shadow-md"
            >
              <i className="fas fa-lock text-xs"></i>
              {localStorage.getItem('admin_token') ? 'Dasbor' : 'Admin'}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
