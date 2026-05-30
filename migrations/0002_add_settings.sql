CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Insert default settings
INSERT INTO settings (id, value) VALUES ('pengumuman_aktif', 'true');
INSERT INTO settings (id, value) VALUES ('waktu_pengumuman', '2026-06-01T10:00:00Z');
INSERT INTO settings (id, value) VALUES ('pesan_sekolah', 'Selamat! Kepada seluruh siswa yang dinyatakan lulus, harap bersiap untuk pengambilan ijazah.');
