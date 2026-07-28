import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { createHash, randomBytes } from 'crypto';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;

// ─── Database Setup ────────────────────────────────────────────────────────────
const DB_DIR = join(__dirname, 'data');
if (!existsSync(DB_DIR)) mkdirSync(DB_DIR, { recursive: true });

const db = new Database(join(DB_DIR, 'taskmaker.db'));
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    student_id TEXT,
    course TEXT DEFAULT 'Java Full-Stack Developer Course',
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function hashPassword(password, salt) {
  const s = salt || randomBytes(16).toString('hex');
  const hash = createHash('sha256').update(password + s).digest('hex');
  return { hash, salt: s };
}

function generateToken() {
  return randomBytes(32).toString('hex');
}

// ─── Express App ──────────────────────────────────────────────────────────────
const app = express();

app.use(cors({
  origin: ['http://localhost:4001', 'http://localhost:4002', 'http://localhost:3000', 'https://taskemaker.onrender.com'],
  credentials: true
}));
app.use(express.json());

// Serve static built React app in production
const distPath = join(__dirname, '..', 'dist');
if (existsSync(distPath)) {
  app.use(express.static(distPath));
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// REGISTER
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, studentId, course } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
  if (existing) {
    return res.status(409).json({ success: false, message: 'An account with this email already exists. Please login.' });
  }

  const { hash, salt } = hashPassword(password);

  const result = db.prepare(`
    INSERT INTO users (name, email, password_hash, student_id, course)
    VALUES (?, ?, ?, ?, ?)
  `).run(name.trim(), email.toLowerCase().trim(), `${hash}:${salt}`, studentId || '', course || 'Java Full-Stack Developer Course');

  const user = {
    id: result.lastInsertRowid,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    studentId: studentId || '',
    course: course || 'Java Full-Stack Developer Course'
  };

  return res.status(201).json({ success: true, message: 'Account created successfully!', user });
});

// LOGIN
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (!user) {
    return res.status(401).json({ success: false, message: 'No account found with this email. Please register first.' });
  }

  const [storedHash, storedSalt] = user.password_hash.split(':');
  const { hash } = hashPassword(password, storedSalt);

  if (hash !== storedHash) {
    return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    studentId: user.student_id,
    course: user.course,
    loggedInAt: new Date().toISOString()
  };

  return res.status(200).json({ success: true, message: `Welcome back, ${user.name}!`, user: safeUser });
});

// CHECK EMAIL EXISTS (for UI feedback)
app.get('/api/auth/check-email', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ exists: false });
  const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
  return res.json({ exists: !!user });
});

// HEALTH
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
});

// Catch-all: serve React app for all other routes
if (existsSync(distPath)) {
  app.get('*', (req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
}

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ TaskMaker API Server running on http://localhost:${PORT}`);
  console.log(`📦 Database ready at: ${join(DB_DIR, 'taskmaker.db')}`);
});

export default app;
