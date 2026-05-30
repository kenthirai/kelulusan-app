-- Create Users Table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Candidates Table
CREATE TABLE candidates (
    id TEXT PRIMARY KEY,
    nomor_ujian TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    kategori TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Tidak Lulus',
    nilai TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast lookup by registration number
CREATE INDEX idx_candidates_nomor_ujian ON candidates(nomor_ujian);
