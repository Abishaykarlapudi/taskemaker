import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { createHash, randomBytes } from 'crypto';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://rocksun:Test12345@job-portal.r8efxop.mongodb.net/edugig?retryWrites=true&w=majority&appName=job-portal';

// ─── MongoDB User Schema ───────────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  email:         { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash:  { type: String, required: true },
  passwordSalt:  { type: String, required: true },
  studentId:     { type: String, default: '' },
  course:        { type: String, default: 'Java Full-Stack Developer Course' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function hashPassword(password, salt) {
  const s = salt || randomBytes(16).toString('hex');
  const hash = createHash('sha256').update(password + s).digest('hex');
  return { hash, salt: s };
}

// ─── Express App ──────────────────────────────────────────────────────────────
const app = express();

app.use(cors({
  origin: [
    'http://localhost:4001',
    'http://localhost:4002',
    'http://localhost:3000',
    'https://taskemaker.onrender.com'
  ],
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
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, studentId, course } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists. Please login.' });
    }

    const { hash, salt } = hashPassword(password);

    const user = await User.create({
      name,
      email,
      passwordHash: hash,
      passwordSalt: salt,
      studentId: studentId || '',
      course: course || 'Java Full-Stack Developer Course'
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        course: user.course,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'No account found with this email. Please register first.' });
    }

    const { hash } = hashPassword(password, user.passwordSalt);
    if (hash !== user.passwordHash) {
      return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
    }

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        course: user.course,
        loggedInAt: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// CHECK EMAIL EXISTS
app.get('/api/auth/check-email', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ exists: false });
    const user = await User.findOne({ email: email.toLowerCase() });
    return res.json({ exists: !!user });
  } catch {
    return res.json({ exists: false });
  }
});

// HEALTH CHECK
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({
    status: 'ok',
    database: states[dbState] || 'unknown',
    timestamp: new Date().toISOString()
  });
});

// Catch-all: serve React SPA for all other routes in production
if (existsSync(distPath)) {
  app.get('*', (req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
}

// ─── Connect to MongoDB & Start Server ────────────────────────────────────────
async function start() {
  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Atlas connected!');

    app.listen(PORT, () => {
      console.log(`🚀 TaskMaker API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

start();

export default app;
