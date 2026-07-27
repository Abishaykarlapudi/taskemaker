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

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setTrack(editingTask.track || 'INSTITUTE');
      setBloomLevel(editingTask.bloomLevel || 3);
      setVerb(editingTask.verb || 'Implement');
      setPainRating(editingTask.painRating || 3);
      setPriority(editingTask.priority || 'HIGH');
      setSubTasks(editingTask.subTasks || []);
      setEnrollAllLevels(false);
    } else {
      setTitle('');
      setDescription('');
      setTrack(initialTrack || 'INSTITUTE');
      setBloomLevel(3);
      setVerb('Implement');
      setPainRating(3);
      setPriority('HIGH');
      setSubTasks([]);
      setEnrollAllLevels(initialTrack === 'INSTITUTE');
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

  const handleAddSubTask = () => {
    if (!newSubTaskTitle.trim()) return;
    setSubTasks(prev => [...prev, { id: `sub-${Date.now()}`, title: newSubTaskTitle.trim(), completed: false }]);
    setNewSubTaskTitle('');
  };

  const handleRemoveSubTask = (id) => {
    setSubTasks(prev => prev.filter(s => s.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (!editingTask && track === 'INSTITUTE' && enrollAllLevels) {
      const baseTitle = title.trim();
      const baseDesc = description.trim();

      const bloomTasks = [
        {
          id: `task-${Date.now()}-1`,
          title: `[L1 Remember] Recall Syntax & Concepts: ${baseTitle}`,
          description: baseDesc ? `${baseDesc}\n\n• Task Focus: Memorize syntax, annotations, rules, and HTTP/DB codes.` : 'Task Focus: Memorize syntax, annotations, rules, and HTTP/DB codes.',
          track: 'INSTITUTE',
          bloomLevel: 1,
          verb: 'Recall',
          painRating: 2,
          priority: 'HIGH',
          status: 'TODO',
          subTasks: [
            { id: `sub-${Date.now()}-1a`, title: 'Review lecture notes & syntax rules', completed: false },
            { id: `sub-${Date.now()}-1b`, title: 'Memorize core annotations & HTTP status codes', completed: false }
          ],
          reflections: [],
          createdAt: new Date(Date.now() - 5000).toISOString()
        },
        {
          id: `task-${Date.now()}-2`,
          title: `[L2 Understand] Explain Architecture & Flow: ${baseTitle}`,
          description: baseDesc ? `${baseDesc}\n\n• Task Focus: Summarize concepts, draw memory diagrams, explain execution flow.` : 'Task Focus: Summarize concepts, draw memory diagrams, explain execution flow.',
          track: 'INSTITUTE',
          bloomLevel: 2,
          verb: 'Explain',
          painRating: 2,
          priority: 'HIGH',
          status: 'TODO',
          subTasks: [
            { id: `sub-${Date.now()}-2a`, title: 'Sketch component execution / request flow diagram', completed: false },
            { id: `sub-${Date.now()}-2b`, title: 'Summarize core OOP / JVM concepts in notes', completed: false }
          ],
          reflections: [],
          createdAt: new Date(Date.now() - 4000).toISOString()
        },
        {
          id: `task-${Date.now()}-3`,
          title: `[L3 Apply] Implement Working Code & Solution: ${baseTitle}`,
          description: baseDesc ? `${baseDesc}\n\n• Task Focus: Write working code, build REST API/UI component, execute unit tests.` : 'Task Focus: Write working code, build REST API/UI component, execute unit tests.',
          track: 'INSTITUTE',
          bloomLevel: 3,
          verb: 'Implement',
          painRating: 3,
          priority: 'HIGH',
          status: 'TODO',
          subTasks: [
            { id: `sub-${Date.now()}-3a`, title: 'Write Java / Spring Boot / React code implementation', completed: false },
            { id: `sub-${Date.now()}-3b`, title: 'Execute & test API endpoint with Postman', completed: false }
          ],
          reflections: [],
          createdAt: new Date(Date.now() - 3000).toISOString()
        },
        {
          id: `task-${Date.now()}-4`,
          title: `[L4 Analyze] Debug Exceptions & Profile Performance: ${baseTitle}`,
          description: baseDesc ? `${baseDesc}\n\n• Task Focus: Troubleshoot NullPointer/CORS errors, dissect stack trace, inspect query plans.` : 'Task Focus: Troubleshoot NullPointer/CORS errors, dissect stack trace, inspect query plans.',
          track: 'INSTITUTE',
          bloomLevel: 4,
          verb: 'Debug',
          painRating: 4,
          priority: 'HIGH',
          status: 'TODO',
          subTasks: [
            { id: `sub-${Date.now()}-4a`, title: 'Inspect stack trace & resolve edge cases / null errors', completed: false },
            { id: `sub-${Date.now()}-4b`, title: 'Profile SQL query execution & performance', completed: false }
          ],
          reflections: [],
          createdAt: new Date(Date.now() - 2000).toISOString()
        },
        {
          id: `task-${Date.now()}-5`,
          title: `[L5 Evaluate] Code Review & Benchmark Security: ${baseTitle}`,
          description: baseDesc ? `${baseDesc}\n\n• Task Focus: Audit code quality, evaluate SOLID principles, benchmark performance trade-offs.` : 'Task Focus: Audit code quality, evaluate SOLID principles, benchmark performance trade-offs.',
          track: 'INSTITUTE',
          bloomLevel: 5,
          verb: 'Critique',
          painRating: 4,
          priority: 'HIGH',
          status: 'TODO',
          subTasks: [
            { id: `sub-${Date.now()}-5a`, title: 'Review code against SOLID principles & clean code rules', completed: false },
            { id: `sub-${Date.now()}-5b`, title: 'Benchmark security & data validation', completed: false }
          ],
          reflections: [],
          createdAt: new Date(Date.now() - 1000).toISOString()
        },
        {
          id: `task-${Date.now()}-6`,
          title: `[L6 Create] Design & Architect Custom Capstone Feature: ${baseTitle}`,
          description: baseDesc ? `${baseDesc}\n\n• Task Focus: Build full-stack microservice feature, author documentation, publish code.` : 'Task Focus: Build full-stack microservice feature, author documentation, publish code.',
          track: 'INSTITUTE',
          bloomLevel: 6,
          verb: 'Design',
          painRating: 5,
          priority: 'HIGH',
          status: 'TODO',
          subTasks: [
            { id: `sub-${Date.now()}-6a`, title: 'Architect full-stack feature component & microservice API', completed: false },
            { id: `sub-${Date.now()}-6b`, title: 'Publish project repository to GitHub', completed: false }
          ],
          reflections: [],
          createdAt: new Date().toISOString()
        }
      ];

      onSaveMultiLevelTasks(bloomTasks);
    } else {
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
        subTasks: subTasks,
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
            {editingTask ? 'Edit Task & Sub-tasks' : (track === 'INSTITUTE' ? 'Add Institute Assignment' : 'Add Personal Daily Goal')}
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
              ? 'Enter the assignment topic given by your Java institute. It can automatically generate tasks with sub-tasks for all 6 Bloom levels!'
              : 'Enter your personal self-study topic, LeetCode problem, or daily habit goal.'}
          </span>
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
                  Generates 6 progressive stages (Recall $\rightarrow$ Explain $\rightarrow$ Implement $\rightarrow$ Debug $\rightarrow$ Critique $\rightarrow$ Architect) with sub-tasks
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
            <label className="form-label">Assignment / Topic Title</label>
            <input 
              type="text" 
              placeholder={track === 'INSTITUTE' ? 'e.g. Spring Boot REST API & Hibernate Entity Mapping' : 'e.g. Solve 2 LeetCode Medium Array questions'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Task Instructions / Requirements (Supports Enter for new lines)</label>
            <textarea 
              placeholder="Enter instructions, notes, or homework steps given by trainer... (Supports multiple lines)"
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
                placeholder="e.g. Write Controller code / Test endpoint"
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
                {subTasks.map((sub) => (
                  <div key={sub.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.84rem', background: 'rgba(255, 255, 255, 0.03)', padding: '6px 10px', borderRadius: '4px' }}>
                    <span className="preserve-newlines">{sub.title}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveSubTask(sub.id)}
                      style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '2px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Single Level Options (only if not enrolling all 6 levels) */}
          {(!enrollAllLevels || track !== 'INSTITUTE' || editingTask) && (
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
              {editingTask ? 'Update Task & Sub-tasks' : (enrollAllLevels && track === 'INSTITUTE' ? 'Enroll 6 Bloom Levels' : 'Save Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
