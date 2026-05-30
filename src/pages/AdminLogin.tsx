import { GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useState } from 'react'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const handleSuccess = async (credentialResponse: any) => {
    try {
      if (!credentialResponse.credential) return
      const res = await api.googleAuth(credentialResponse.credential)
      if (res.error) {
        setError(res.error)
        return
      }
      localStorage.setItem('admin_token', res.token)
      navigate('/admin/dashboard')
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors duration-300 p-4">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 w-full max-w-sm text-center relative overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 text-white text-2xl">
            <i className="fas fa-shield-alt"></i>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Admin Akses</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">Gunakan akun Google yang terdaftar sebagai admin untuk masuk ke sistem.</p>
          
          {error && (
            <div className="bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 p-3 rounded-xl mb-6 text-sm font-medium flex items-center justify-center gap-2 border border-rose-100 dark:border-rose-800">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}
          
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => {
                setError('Autentikasi gagal, silakan coba lagi.')
              }}
            />
          </div>
          
          <div className="mt-8 text-sm text-slate-400 dark:text-slate-500">
            <a href="/" className="hover:text-indigo-500 transition-colors flex items-center justify-center gap-2">
              <i className="fas fa-arrow-left"></i> Kembali ke Beranda
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
