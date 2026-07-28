import React, { useState, useEffect } from 'react';
import { GraduationCap, LogIn, UserPlus, Eye, EyeOff, Loader, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { loginUser, registerUser, checkEmailExists } from '../services/authApi';

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [course, setCourse] = useState('Java Full-Stack Developer Course');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Reset form when modal opens
    if (isOpen) {
      setError('');
      setSuccess('');
      setName('');
      setEmail('');
      setPassword('');
      setStudentId('');
    }
  }, [isOpen, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      let result;
      if (mode === 'login') {
        result = await loginUser({ email, password });
      } else {
        if (!name.trim()) {
          setError('Please enter your full name.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }
        result = await registerUser({ name, email, password, studentId, course });
      }

      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          onLogin(result.user);
          onClose();
        }, 800);
      } else {
        setError(result.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Cannot connect to server. Using offline mode instead.');
      // Fallback: offline guest login if server is unreachable
      setTimeout(() => {
        onLogin({
          name: name || email.split('@')[0] || 'Student',
          email: email,
          studentId: studentId || 'OFFLINE',
          course: course,
          loggedInAt: new Date().toISOString()
        });
        onClose();
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccess = () => {
    onLogin({
      name: 'Guest Student',
      email: '',
      studentId: 'GUEST',
      course: 'Java Full-Stack Developer Course',
      loggedInAt: new Date().toISOString()
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card" style={{ maxWidth: '460px', padding: '32px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '60px', height: '60px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', marginBottom: '12px',
            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)'
          }}>🎓</div>

          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', marginBottom: '4px' }}>
            {mode === 'login' ? 'Student Login' : 'Create Account'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {mode === 'login'
              ? "Sign in to access your Bloom's Taxonomy workspace"
              : 'Register to track your institute assignments & mastery'}
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="track-tabs" style={{ marginBottom: '20px' }}>
          <button
            className={`track-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <LogIn size={16} /> Login
          </button>
          <button
            className={`track-tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <UserPlus size={16} /> Register
          </button>
        </div>

        {/* Status Messages */}
        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            color: '#fda4af'
          }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {success && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            color: '#6ee7b7'
          }}>
            <CheckCircle2 size={16} /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name (Register only) */}
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Abishay Karlapudi"
                value={name}
                onChange={e => setName(e.target.value)}
                className="form-input"
                required
                autoFocus
              />
            </div>
          )}

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              placeholder="e.g. abishay@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="form-input"
              required
              autoFocus={mode === 'login'}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password {mode === 'register' && '(min. 6 characters)'}</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={mode === 'register' ? 'Create a strong password' : 'Enter your password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingRight: '42px', width: '100%' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent', border: 'none',
                  color: 'var(--text-muted)', cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Additional fields for Register */}
          {mode === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">Institute Course Program</label>
                <input
                  type="text"
                  placeholder="e.g. Java Full-Stack Developer Course"
                  value={course}
                  onChange={e => setCourse(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Student Roll No. / ID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. JFS-2026-042"
                  value={studentId}
                  onChange={e => setStudentId(e.target.value)}
                  className="form-input"
                />
              </div>
            </>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%', justifyContent: 'center', padding: '12px',
              marginTop: '8px', fontSize: '0.95rem',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading
              ? <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> {mode === 'login' ? 'Signing in...' : 'Creating account...'}</>
              : mode === 'login'
                ? <><LogIn size={18} /> Sign In</>
                : <><UserPlus size={18} /> Create Account</>
            }
          </button>
        </form>

        {/* Guest Access */}
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <div style={{ color: 'var(--text-subtle)', fontSize: '0.8rem', marginBottom: '10px' }}>— or —</div>
          <button
            type="button"
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
            onClick={handleGuestAccess}
          >
            Continue as Guest (No Login Required)
          </button>
        </div>

        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  );
}
