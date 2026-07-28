// API service - connects React frontend to the Express/SQLite backend
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function registerUser({ name, email, password, studentId, course }) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, studentId, course })
  });
  return res.json();
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function checkEmailExists(email) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/check-email?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    return data.exists;
  } catch {
    return false;
  }
}

export async function checkServerHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    return res.ok;
  } catch {
    return false;
  }
}
