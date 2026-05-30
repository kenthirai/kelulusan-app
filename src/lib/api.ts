const API_BASE = '/api'

export const api = {
  checkKelulusan: async (nomorUjian: string): Promise<any> => {
    const res = await fetch(`${API_BASE}/check/${nomorUjian}`)
    return res.json()
  },
  
  getStats: async (): Promise<any> => {
    const res = await fetch(`${API_BASE}/stats`)
    return res.json()
  },

  getSettings: async (): Promise<any> => {
    const res = await fetch(`${API_BASE}/settings`)
    return res.json()
  },

  updateSettings: async (token: string, data: any): Promise<any> => {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    })
    return res.json()
  },

  googleAuth: async (credential: string, type: 'id_token' | 'access_token' = 'id_token'): Promise<any> => {
    const res = await fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential, type }),
    })
    return res.json()
  },

  getCandidates: async (token: string): Promise<any> => {
    const res = await fetch(`${API_BASE}/admin/candidates`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) throw new Error('Gagal mengambil data')
    return res.json()
  },

  createCandidate: async (token: string, data: any): Promise<any> => {
    const res = await fetch(`${API_BASE}/admin/candidates`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Gagal menyimpan data')
    return res.json()
  },

  updateCandidate: async (token: string, id: string, data: any): Promise<any> => {
    const res = await fetch(`${API_BASE}/admin/candidates/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Gagal mengupdate data')
    return res.json()
  },

  deleteCandidate: async (token: string, id: string): Promise<any> => {
    const res = await fetch(`${API_BASE}/admin/candidates/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) throw new Error('Gagal menghapus data')
    return res.json()
  },

  importCandidatesBatch: async (token: string, candidates: any[]): Promise<any> => {
    const res = await fetch(`${API_BASE}/admin/candidates/batch`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ candidates })
    })
    if (!res.ok) throw new Error('Gagal mengimpor data')
    return res.json()
  },

  deleteAllCandidates: async (token: string): Promise<any> => {
    const res = await fetch(`${API_BASE}/admin/candidates`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) throw new Error('Gagal menghapus semua data')
    return res.json()
  }
}
