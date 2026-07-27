import React, { useState } from 'react';
import { GraduationCap, User, BookOpen, LogIn, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [name, setName] = useState('');
  const [course, setCourse] = useState('Java Full-Stack Developer Course');
  const [studentId, setStudentId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onLogin({
      name: name.trim(),
      course: course.trim() || 'Java Full-Stack Developer Course',
      studentId: studentId.trim() || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      loggedInAt: new Date().toISOString()
    });

    onClose();
  };

  const handleGuest = () => {
    onLogin({
      name: 'Student Guest',
      course: 'Java Full-Stack Developer Course',
      studentId: 'STU-GUEST',
      loggedInAt: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '480px', textAlign: 'center', padding: '32px' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', marginBottom: '16px', boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)' }}>
          🎓
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '6px' }}>
          Student Learning Portal Login
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
          Sign in to track your Institute Assignments & Bloom's Taxonomy Mastery
        </p>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div className="form-group">
            <label className="form-label">Full Name / Student Name</label>
            <input 
              type="text"
              placeholder="e.g. Abishay Karlapudi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Institute Course Program</label>
            <input 
              type="text"
              placeholder="e.g. Java Full-Stack Developer Course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Student Roll No. / ID (Optional)</label>
            <input 
              type="text"
              placeholder="e.g. JFS-2026-042"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="form-input"
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '12px', fontSize: '0.95rem' }}
          >
            <LogIn size={18} /> Continue to My Workspace
          </button>

          <button 
            type="button" 
            className="btn-secondary" 
            style={{ width: '100%', justifyContent: 'center', padding: '10px', marginTop: '10px', fontSize: '0.85rem' }}
            onClick={handleGuest}
          >
            Quick Guest Access
          </button>
        </form>
      </div>
    </div>
  );
}
