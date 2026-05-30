import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { sign, verify } from 'hono/jwt'

type Bindings = {
  DB: D1Database
  JWT_SECRET: string
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  FRONTEND_URL: string
  ADMIN_EMAILS: string
}

type Variables = {
  user: {
    id: string
    email: string
    name: string
    role: string
  }
}

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

app.use('*', cors({
  origin: '*', // In production, replace with FRONTEND_URL
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Auth Middleware for Admin
const adminAuth = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  const token = authHeader.split(' ')[1]
  try {
    const payload = await verify(token, c.env.JWT_SECRET || 'fallback-secret-for-dev', 'HS256')
    if (payload.role !== 'admin') {
      return c.json({ error: 'Forbidden' }, 403)
    }
    c.set('user', payload)
    await next()
  } catch (err) {
    return c.json({ error: 'Invalid token' }, 401)
  }
}

// --- PUBLIC API ---

app.get('/api/check/:nomor_ujian', async (c) => {
  const nomorUjian = c.req.param('nomor_ujian')
  try {
    const candidate = await c.env.DB.prepare('SELECT nama, kategori, status, nilai FROM candidates WHERE nomor_ujian = ?')
      .bind(nomorUjian)
      .first()
    
    if (!candidate) {
      return c.json({ error: 'Data tidak ditemukan' }, 404)
    }
    
    return c.json({ success: true, data: candidate })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

app.get('/api/stats', async (c) => {
  try {
    const total = await c.env.DB.prepare('SELECT COUNT(*) as count FROM candidates').first('count') || 0
    const lulus = await c.env.DB.prepare("SELECT COUNT(*) as count FROM candidates WHERE status = 'LULUS'").first('count') || 0
    // Asumsikan cumlaude jika nilai ada kata 'cumlaude' atau nilai rata2 tinggi (di DB kita simpan string, tapi tidak apa2 kita pakai COUNT biasa)
    const cumlaude = await c.env.DB.prepare("SELECT COUNT(*) as count FROM candidates WHERE status = 'LULUS' AND CAST(nilai as REAL) >= 90").first('count') || 0
    
    return c.json({
      success: true,
      data: {
        total,
        lulus,
        cumlaude,
        persentase: (total as number) > 0 ? Math.round(((lulus as number) / (total as number)) * 100) : 0
      }
    })
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

app.get('/api/mading', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT * FROM mading ORDER BY created_at DESC LIMIT 50').all()
    return c.json({ success: true, data: results })
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

app.post('/api/mading', async (c) => {
  try {
    const body = await c.req.json()
    const { nama, jurusan, pesan } = body
    if (!nama || !pesan) return c.json({ error: 'Nama dan pesan wajib diisi' }, 400)
    
    const id = crypto.randomUUID()
    await c.env.DB.prepare('INSERT INTO mading (id, nama, jurusan, pesan) VALUES (?, ?, ?, ?)')
      .bind(id, nama, jurusan || '-', pesan)
      .run()
      
    return c.json({ success: true, id })
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

// --- ADMIN API (Protected) ---

app.get('/api/admin/candidates', adminAuth, async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT * FROM candidates ORDER BY updated_at DESC').all()
    return c.json({ success: true, data: results })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

app.post('/api/admin/candidates', adminAuth, async (c) => {
  try {
    const body = await c.req.json()
    const id = crypto.randomUUID()
    const { nomor_ujian, nama, kategori, status, nilai } = body
    
    await c.env.DB.prepare('INSERT INTO candidates (id, nomor_ujian, nama, kategori, status, nilai) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(id, nomor_ujian, nama, kategori, status, nilai || '')
      .run()
      
    return c.json({ success: true, id })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

app.put('/api/admin/candidates/:id', adminAuth, async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const { nomor_ujian, nama, kategori, status, nilai } = body
    
    await c.env.DB.prepare('UPDATE candidates SET nomor_ujian = ?, nama = ?, kategori = ?, status = ?, nilai = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(nomor_ujian, nama, kategori, status, nilai || '', id)
      .run()
      
    return c.json({ success: true })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

app.delete('/api/admin/candidates/:id', adminAuth, async (c) => {
  try {
    const id = c.req.param('id')
    await c.env.DB.prepare('DELETE FROM candidates WHERE id = ?').bind(id).run()
    return c.json({ success: true })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// --- GOOGLE OAUTH ---

app.post('/api/auth/google', async (c) => {
  try {
    const { credential } = await c.req.json()
    
    // Verify credential with Google
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`)
    if (!response.ok) {
      return c.json({ error: 'Invalid Google token' }, 401)
    }
    const payload = await response.json() as any
    
    if (!payload.email) {
      return c.json({ error: 'Email not found in token' }, 400)
    }

    // Authorization: Check if email is in allowed ADMIN_EMAILS list
    const allowedEmails = (c.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase())
    if (!allowedEmails.includes(payload.email.toLowerCase())) {
      return c.json({ error: 'Email Anda tidak memiliki akses Administrator.' }, 403)
    }

    let user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(payload.email).first()
    
    if (!user) {
      const id = crypto.randomUUID()
      await c.env.DB.prepare('INSERT INTO users (id, email, name, role) VALUES (?, ?, ?, ?)')
        .bind(id, payload.email, payload.name, 'admin')
        .run()
      user = { id, email: payload.email, name: payload.name, role: 'admin' }
    }

    const token = await sign(
      { id: user.id, email: user.email, name: user.name, role: user.role, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }, // 1 day
      c.env.JWT_SECRET || 'fallback-secret-for-dev',
      'HS256'
    )

    return c.json({ success: true, token, user })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

export default app
