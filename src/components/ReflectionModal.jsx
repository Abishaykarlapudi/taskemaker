import React, { useState } from 'react';
import { X, Sparkles, Flame, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ReflectionModal({ isOpen, onClose, task, onSaveReflection }) {
  const [reflectionText, setReflectionText] = useState('');
  const [painRating, setPainRating] = useState(task ? task.painRating || 3 : 3);

  if (!isOpen || !task) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reflectionText.trim()) return;

    try {
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.log('Confetti effect skipped:', err);
    }

    onSaveReflection(task.id, {
      text: reflectionText.trim(),
      pain: painRating,
      date: new Date().toISOString()
    });

    setReflectionText('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#10b981" />
            Task Completion & Learning Takeaway
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', marginBottom: '16px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Completing Task:</div>
          <div className="preserve-newlines" style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '2px' }}>
            {task.title}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Key Learning Takeaway / Code Snippet / Notes (Press Enter for new line)</label>
            <textarea 
              placeholder="What did you learn? Enter code snippets, key solutions, or takeaways... (Supports multiple lines with Enter / Shift+Enter)"
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              className="form-textarea"
              rows={4}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Perceived Task Difficulty / Pain Rating</span>
              <span style={{ color: '#f59e0b', fontWeight: '700' }}>{painRating}/5</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Flame size={18} color="#f43f5e" />
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={painRating}
                onChange={(e) => setPainRating(Number(e.target.value))}
                style={{ flex: 1, accentColor: '#f43f5e' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Skip Reflection
            </button>
            <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
              <Check size={16} /> Complete & Save Takeaway
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
