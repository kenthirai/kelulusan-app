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

  getMading: async (): Promise<any> => {
    const res = await fetch(`${API_BASE}/mading`)
    return res.json()
  },

  postMading: async (data: any): Promise<any> => {
    const res = await fetch(`${API_BASE}/mading`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return res.json()
  },

  googleAuth: async (credential: string): Promise<any> => {
    const res = await fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
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
  }
}
