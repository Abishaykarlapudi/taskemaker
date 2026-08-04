import React, { useState, useEffect } from 'react';
import { BLOOM_LEVELS, JAVA_FULLSTACK_SUGGESTIONS } from '../data/bloomTaxonomy';
import { X, Sparkles, Flame, GraduationCap, UserCheck, Info, Layers, Plus, Trash2, CheckSquare } from 'lucide-react';

export default function TaskModal({ isOpen, onClose, onSaveTask, onSaveMultiLevelTasks, editingTask, initialTrack = 'INSTITUTE' }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [track, setTrack] = useState(initialTrack);
  const [bloomLevel, setBloomLevel] = useState(3);
  const [verb, setVerb] = useState('Implement');
  const [painRating, setPainRating] = useState(3);
  const [priority, setPriority] = useState('HIGH');
  const [enrollAllLevels, setEnrollAllLevels] = useState(true);

  // Sub-tasks state
  const [subTasks, setSubTasks] = useState([]);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
  const [editingSubTaskId, setEditingSubTaskId] = useState(null);
  const [editingSubTaskTitle, setEditingSubTaskTitle] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setTrack(editingTask.track || 'INSTITUTE');
      setBloomLevel(editingTask.bloomLevel || (editingTask.track === 'PERSONAL' ? 0 : 3));
      setVerb(editingTask.verb || '');
      setPainRating(editingTask.painRating || 3);
      setPriority(editingTask.priority || 'HIGH');
      setSubTasks(editingTask.subTasks || []);
      setEnrollAllLevels(false);
    } else {
      setTitle('');
      setDescription('');
      setTrack(initialTrack || 'INSTITUTE');
      setBloomLevel(initialTrack === 'PERSONAL' ? 0 : 3);
      setVerb(initialTrack === 'PERSONAL' ? '' : 'Implement');
      setPainRating(3);
      setPriority('HIGH');
      setSubTasks([]);
      setEnrollAllLevels(initialTrack === 'INSTITUTE');
    }
  }, [editingTask, isOpen, initialTrack]);

  // When track switches to PERSONAL, reset bloomLevel to 0
  const handleTrackSwitch = (newTrack) => {
    setTrack(newTrack);
    if (newTrack === 'PERSONAL') {
      setBloomLevel(0);
      setVerb('');
      setEnrollAllLevels(false);
    } else {
      setBloomLevel(3);
      setVerb('Implement');
      setEnrollAllLevels(true);
    }
  };

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

  const handleAddSubTask = () => {
    if (!newSubTaskTitle.trim()) return;
    setSubTasks(prev => [...prev, { id: `sub-${Date.now()}`, title: newSubTaskTitle.trim(), completed: false }]);
    setNewSubTaskTitle('');
  };

  const handleRemoveSubTask = (id) => {
    setSubTasks(prev => prev.filter(s => s.id !== id));
  };

  const handleStartEditSubTask = (sub) => {
    setEditingSubTaskId(sub.id);
    setEditingSubTaskTitle(sub.title);
  };

  const handleSaveSubTaskEdit = (id) => {
    if (!editingSubTaskTitle.trim()) return;
    setSubTasks(prev => prev.map(s =>
      s.id === id ? { ...s, title: editingSubTaskTitle.trim() } : s
    ));
    setEditingSubTaskId(null);
    setEditingSubTaskTitle('');
  };

  const handleCancelSubTaskEdit = () => {
    setEditingSubTaskId(null);
    setEditingSubTaskTitle('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Auto-commit any text still in the sub-task input
    let finalSubTasks = subTasks;
    if (newSubTaskTitle.trim()) {
      finalSubTasks = [...subTasks, { id: `sub-${Date.now()}`, title: newSubTaskTitle.trim(), completed: false }];
      setNewSubTaskTitle('');
    }

    if (!editingTask && track === 'INSTITUTE' && enrollAllLevels) {
      const now = Date.now();
      const baseTitle = title.trim();
      const baseDesc = description.trim();

      // Build the 6 Bloom levels as sub-tasks of ONE single task
      const bloomSubTasks = [
        { id: `sub-bloom-${now}-1`, title: '🧠 L1 Remember — Recall syntax, annotations, HTTP codes & rules', completed: false },
        { id: `sub-bloom-${now}-2`, title: '💡 L2 Understand — Explain architecture, execution flow & OOP concepts', completed: false },
        { id: `sub-bloom-${now}-3`, title: '⚡ L3 Apply — Implement working code, REST API / UI component & unit tests', completed: false },
        { id: `sub-bloom-${now}-4`, title: '🔍 L4 Analyze — Debug exceptions, profile SQL & inspect stack trace', completed: false },
        { id: `sub-bloom-${now}-5`, title: '⚖️ L5 Evaluate — Code review, SOLID audit & benchmark security', completed: false },
        { id: `sub-bloom-${now}-6`, title: '🎨 L6 Create — Architect full-stack feature & publish to GitHub', completed: false },
        // Append any custom sub-tasks the user typed
        ...finalSubTasks.map((s, i) => ({ ...s, id: `sub-custom-${now}-${i}`, completed: false }))
      ];

      onSaveTask({
        id: `task-${now}`,
        title: baseTitle,
        description: baseDesc,
        track: 'INSTITUTE',
        bloomLevel: 3,
        verb: 'Implement',
        painRating: Number(painRating),
        priority,
        status: 'TODO',
        subTasks: bloomSubTasks,
        reflections: [],
        createdAt: new Date().toISOString()
      });
    } else {
      onSaveTask({
        id: editingTask ? editingTask.id : `task-${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        track,
        bloomLevel: track === 'PERSONAL' ? 0 : Number(bloomLevel),
        verb: track === 'PERSONAL' ? '' : verb,
        painRating: Number(painRating),
        priority,
        status: editingTask ? editingTask.status : 'TODO',
        subTasks: finalSubTasks,
        reflections: editingTask ? editingTask.reflections || [] : [],
        createdAt: editingTask ? editingTask.createdAt : new Date().toISOString()
      });
    }

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
            {editingTask ? 'Edit Task' : (track === 'INSTITUTE' ? 'Add Institute Assignment (Bloom Taxonomy)' : 'Add Personal Daily Goal')}
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
              ? 'Institute assignments use Bloom\'s Taxonomy (6 levels of cognitive mastery).'
              : 'Personal daily goals do not require Bloom\'s Taxonomy. Add your task, notes & sub-tasks checklist.'}
          </span>
        </div>

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
              onClick={() => handleTrackSwitch('INSTITUTE')}
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
              onClick={() => handleTrackSwitch('PERSONAL')}
            >
              <UserCheck size={16} /> Personal Daily Goal
            </button>
          </div>
        </div>

        {/* Multi-Level Bloom Enrollment Checkbox for Institute Tasks */}
        {!editingTask && track === 'INSTITUTE' && (
          <div 
            style={{ 
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)', 
              border: '1px solid rgba(99, 102, 241, 0.4)', 
              padding: '12px 14px', 
              borderRadius: 'var(--radius-sm)', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layers size={20} color="#a5b4fc" />
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#ffffff' }}>
                  Enroll across ALL 6 Bloom's Taxonomy Levels
                </div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                  Generates 6 progressive stages (Recall $\rightarrow$ Explain $\rightarrow$ Implement $\rightarrow$ Debug $\rightarrow$ Critique $\rightarrow$ Architect)
                </div>
              </div>
            </div>
            <input 
              type="checkbox"
              checked={enrollAllLevels}
              onChange={(e) => setEnrollAllLevels(e.target.checked)}
              style={{ width: '20px', height: '20px', accentColor: '#6366f1', cursor: 'pointer' }}
            />
          </div>
        )}

        {/* Quick Presets for Institute Tasks */}
        {!editingTask && track === 'INSTITUTE' && (
          <div style={{ marginBottom: '16px', background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
            <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} /> Quick Java Full-Stack Topic Ideas:
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
          {/* Title */}
          <div className="form-group">
            <label className="form-label">
              {track === 'INSTITUTE' ? 'Institute Assignment / Topic Title' : 'Personal Goal Title'}
            </label>
            <input 
              type="text" 
              placeholder={track === 'INSTITUTE' ? 'e.g. Spring Boot REST API & Hibernate Entity Mapping' : 'e.g. Solve 2 LeetCode Array questions & go for a 30-min run'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Task Instructions / Notes (Supports Enter for new lines)</label>
            <textarea 
              placeholder="Enter instructions, notes, or details... (Supports multiple lines with Enter / Shift+Enter)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              rows={3}
            />
          </div>

          {/* Sub-tasks Section */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckSquare size={16} color="#10b981" />
              Sub-tasks Checklist ({subTasks.length})
            </label>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input 
                type="text"
                placeholder="e.g. Practice Array hashmap problem / Drink 2L water"
                value={newSubTaskTitle}
                onChange={(e) => setNewSubTaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubTask();
                  }
                }}
                className="form-input"
                style={{ flex: 1 }}
              />
              <button 
                type="button"
                className="btn-secondary"
                onClick={handleAddSubTask}
                style={{ flexShrink: 0 }}
              >
                <Plus size={16} /> Add Sub-task
              </button>
            </div>

            {subTasks.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(0, 0, 0, 0.2)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
                {subTasks.map((sub, idx) => (
                  <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', background: 'rgba(255, 255, 255, 0.03)', padding: '6px 10px', borderRadius: '4px' }}>
                    <span style={{ color: 'var(--text-subtle)', minWidth: '18px', fontSize: '0.75rem', fontWeight: '700' }}>{idx + 1}.</span>

                    {editingSubTaskId === sub.id ? (
                      // ── Inline edit mode ──
                      <>
                        <input
                          type="text"
                          value={editingSubTaskTitle}
                          onChange={e => setEditingSubTaskTitle(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') { e.preventDefault(); handleSaveSubTaskEdit(sub.id); }
                            if (e.key === 'Escape') handleCancelSubTaskEdit();
                          }}
                          autoFocus
                          className="form-input"
                          style={{ flex: 1, padding: '3px 8px', fontSize: '0.82rem' }}
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveSubTaskEdit(sub.id)}
                          style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#6ee7b7', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '600' }}
                        >✓ Save</button>
                        <button
                          type="button"
                          onClick={handleCancelSubTaskEdit}
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', padding: '2px 4px', fontSize: '0.78rem' }}
                        >✕</button>
                      </>
                    ) : (
                      // ── Display mode ──
                      <>
                        <span className="preserve-newlines" style={{ flex: 1 }}>{sub.title}</span>
                        <button
                          type="button"
                          onClick={() => handleStartEditSubTask(sub)}
                          title="Edit sub-task"
                          style={{ background: 'transparent', border: 'none', color: '#60a5fa', cursor: 'pointer', padding: '2px 4px' }}
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubTask(sub.id)}
                          title="Delete sub-task"
                          style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '2px' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bloom's Level & Verbs ONLY for Institute Tasks */}
          {track === 'INSTITUTE' && (!enrollAllLevels || editingTask) && (
            <>
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
            </>
          )}

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
              {editingTask ? 'Update Task' : (track === 'INSTITUTE' && enrollAllLevels ? '🎓 Save Task with 6 Bloom Sub-tasks' : track === 'INSTITUTE' ? 'Save Institute Task' : 'Save Personal Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
