import React, { useState, useEffect } from 'react';
import { BLOOM_LEVELS, TASK_TRACKS, JAVA_FULLSTACK_SUGGESTIONS } from '../data/bloomTaxonomy';
import { X, Sparkles, Flame, GraduationCap, UserCheck, Info } from 'lucide-react';

export default function TaskModal({ isOpen, onClose, onSaveTask, editingTask, initialTrack = 'INSTITUTE' }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [track, setTrack] = useState(initialTrack);
  const [bloomLevel, setBloomLevel] = useState(3); // Default to L3 Apply
  const [verb, setVerb] = useState('Implement');
  const [painRating, setPainRating] = useState(3);
  const [priority, setPriority] = useState('HIGH');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setTrack(editingTask.track || 'INSTITUTE');
      setBloomLevel(editingTask.bloomLevel || 3);
      setVerb(editingTask.verb || 'Implement');
      setPainRating(editingTask.painRating || 3);
      setPriority(editingTask.priority || 'HIGH');
    } else {
      // Reset defaults with initialTrack
      setTitle('');
      setDescription('');
      setTrack(initialTrack || 'INSTITUTE');
      setBloomLevel(3);
      setVerb('Implement');
      setPainRating(3);
      setPriority('HIGH');
    }
  }, [editingTask, isOpen, initialTrack]);

  const handleLevelChange = (levelId) => {
    setBloomLevel(levelId);
    const verbs = BLOOM_LEVELS[levelId].verbs;
    if (verbs && verbs.length > 0) {
      setVerb(verbs[0]);
    }
  };

  const handleSelectPreset = (preset) => {
    setTitle(preset.title);
    setBloomLevel(preset.levelId);
    const verbs = BLOOM_LEVELS[preset.levelId].verbs;
    setVerb(verbs[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSaveTask({
      id: editingTask ? editingTask.id : `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      track,
      bloomLevel: Number(bloomLevel),
      verb,
      painRating: Number(painRating),
      priority,
      status: editingTask ? editingTask.status : 'TODO',
      reflections: editingTask ? editingTask.reflections || [] : [],
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString()
    });

    onClose();
  };

  if (!isOpen) return null;

  const currentLevelObj = BLOOM_LEVELS[bloomLevel] || BLOOM_LEVELS[3];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {track === 'INSTITUTE' ? <GraduationCap color="#60a5fa" size={22} /> : <UserCheck color="#c084fc" size={22} />}
            {editingTask ? 'Edit Task' : (track === 'INSTITUTE' ? 'Add Institute Assignment' : 'Add Personal Daily Goal')}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Guidance Alert Banner */}
        <div 
          style={{ 
            background: track === 'INSTITUTE' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(168, 85, 247, 0.1)',
            border: `1px solid ${track === 'INSTITUTE' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(168, 85, 247, 0.3)'}`,
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '16px',
            fontSize: '0.82rem',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Info size={16} color={track === 'INSTITUTE' ? '#60a5fa' : '#c084fc'} />
          <span>
            {track === 'INSTITUTE' 
              ? 'Enter the task, homework, or practice problem assigned to you by your Java institute trainer today.'
              : 'Enter your personal self-study topic, LeetCode practice, or daily habit goal.'}
          </span>
        </div>

        {/* Quick Presets */}
        {!editingTask && (
          <div style={{ marginBottom: '16px', background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
            <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} /> Quick Java Full-Stack Ideas:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {JAVA_FULLSTACK_SUGGESTIONS.slice(0, 5).map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectPreset(sug)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text-muted)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '3px 10px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>L{sug.levelId}:</span> {sug.title.slice(0, 30)}...
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Category Track Switcher */}
          <div className="form-group">
            <label className="form-label">Category Track</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                className={`btn-secondary ${track === 'INSTITUTE' ? 'active' : ''}`}
                style={{
                  borderColor: track === 'INSTITUTE' ? '#3b82f6' : 'var(--glass-border)',
                  background: track === 'INSTITUTE' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                  color: track === 'INSTITUTE' ? '#60a5fa' : 'var(--text-muted)'
                }}
                onClick={() => setTrack('INSTITUTE')}
              >
                <GraduationCap size={16} /> Institute Assignment
              </button>

              <button
                type="button"
                className={`btn-secondary ${track === 'PERSONAL' ? 'active' : ''}`}
                style={{
                  borderColor: track === 'PERSONAL' ? '#a855f7' : 'var(--glass-border)',
                  background: track === 'PERSONAL' ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
                  color: track === 'PERSONAL' ? '#c084fc' : 'var(--text-muted)'
                }}
                onClick={() => setTrack('PERSONAL')}
              >
                <UserCheck size={16} /> Personal Goal
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="form-label">Task Title</label>
            <input 
              type="text" 
              placeholder={track === 'INSTITUTE' ? 'e.g. Implement Spring Boot REST API for Enrollment (Assigned by trainer)' : 'e.g. Solve 2 LeetCode Medium Array questions'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Task Instructions / Details</label>
            <textarea 
              placeholder="Notes or requirements given by trainer / self-study plan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              rows={2}
            />
          </div>

          {/* Bloom Level Picker */}
          <div className="form-group">
            <label className="form-label">Bloom's Taxonomy Cognitive Level</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {[1, 2, 3, 4, 5, 6].map(id => {
                const lvl = BLOOM_LEVELS[id];
                const isSel = bloomLevel === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleLevelChange(id)}
                    style={{
                      background: isSel ? lvl.lightBg : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${isSel ? lvl.color : 'var(--glass-border)'}`,
                      color: isSel ? lvl.color : 'var(--text-muted)',
                      padding: '8px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      textAlign: 'center'
                    }}
                  >
                    L{lvl.id}: {lvl.name}
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: '8px', padding: '10px', borderRadius: 'var(--radius-sm)', background: currentLevelObj.lightBg, border: `1px solid ${currentLevelObj.border}`, fontSize: '0.8rem' }}>
              <span style={{ color: currentLevelObj.color, fontWeight: '700' }}>
                L{currentLevelObj.id} {currentLevelObj.name}:
              </span>{' '}
              <span style={{ color: 'var(--text-muted)' }}>{currentLevelObj.description}</span>
            </div>
          </div>

          {/* Action Verb Selection */}
          <div className="form-group">
            <label className="form-label">Cognitive Action Verb</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {currentLevelObj.verbs.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVerb(v)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer',
                    background: verb === v ? currentLevelObj.color : 'rgba(255, 255, 255, 0.05)',
                    color: verb === v ? '#fff' : 'var(--text-muted)',
                    border: '1px solid var(--glass-border)'
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Pain Rating Meter */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between' }}>
              <span>Task Difficulty / Effort Rating (1-5)</span>
              <span style={{ color: '#f59e0b', fontWeight: '700' }}>Rating: {painRating}/5</span>
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingTask ? 'Update Task' : 'Save Task to My Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
