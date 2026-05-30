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

app.get('/api/settings', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT id, value FROM settings').all()
    const settings = results.reduce((acc: any, row: any) => {
      acc[row.id] = row.value
      return acc
    }, {})
    return c.json({ success: true, data: settings })
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
    
    await c.env.DB.prepare(`
      INSERT INTO candidates (id, nomor_ujian, nama, kategori, status, nilai) 
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(nomor_ujian) DO UPDATE SET 
        nama=excluded.nama, 
        kategori=excluded.kategori, 
        status=excluded.status, 
        nilai=excluded.nilai, 
        updated_at=CURRENT_TIMESTAMP
    `).bind(id, nomor_ujian, nama, kategori, status, nilai || '').run()
      
    return c.json({ success: true, id })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

app.post('/api/admin/candidates/batch', adminAuth, async (c) => {
  try {
    const body = await c.req.json()
    const candidates = body.candidates
    if (!Array.isArray(candidates) || candidates.length === 0) {
      return c.json({ error: 'Data tidak valid' }, 400)
    }

    const stmts = candidates.map(cand => {
      const id = crypto.randomUUID()
      return c.env.DB.prepare(`
        INSERT INTO candidates (id, nomor_ujian, nama, kategori, status, nilai) 
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(nomor_ujian) DO UPDATE SET 
          nama=excluded.nama, 
          kategori=excluded.kategori, 
          status=excluded.status, 
          nilai=excluded.nilai, 
          updated_at=CURRENT_TIMESTAMP
      `).bind(id, cand.nomor_ujian, cand.nama, cand.kategori || '-', cand.status || 'LULUS', cand.nilai || '')
    })

    // Cloudflare D1 batching supports up to 100 statements at a time
    // For simplicity, we chunk them if needed. But usually batch() is good.
    const chunkSize = 100
    for (let i = 0; i < stmts.length; i += chunkSize) {
      const chunk = stmts.slice(i, i + chunkSize)
      await c.env.DB.batch(chunk)
    }

    return c.json({ success: true, count: candidates.length })
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

app.delete('/api/admin/candidates', adminAuth, async (c) => {
  try {
    await c.env.DB.prepare('DELETE FROM candidates').run()
    return c.json({ success: true })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

app.put('/api/admin/settings', adminAuth, async (c) => {
  try {
    const body = await c.req.json()
    const stmts = Object.entries(body).map(([key, value]) => {
      return c.env.DB.prepare('UPDATE settings SET value = ? WHERE id = ?').bind(String(value), key)
    })
    
    if (stmts.length > 0) {
      await c.env.DB.batch(stmts)
    }
    
    return c.json({ success: true })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// --- GOOGLE OAUTH ---

app.post('/api/auth/google', async (c) => {
  try {
    const { credential, type } = await c.req.json()
    
    let payload: any;
    
    if (type === 'access_token') {
      // Verify access token
      const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
        headers: { Authorization: `Bearer ${credential}` }
      })
      if (!response.ok) {
        return c.json({ error: 'Invalid Google access token' }, 401)
      }
      payload = await response.json()
    } else {
      // Verify id_token
      const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`)
      if (!response.ok) {
        return c.json({ error: 'Invalid Google id_token' }, 401)
      }
      payload = await response.json()
    }
    
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
