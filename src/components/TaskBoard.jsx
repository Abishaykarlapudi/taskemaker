import React, { useState } from 'react';
import TaskCard from './TaskCard';
import { Search, GraduationCap, UserCheck, Plus, Sparkles, BookOpen, Brain, Zap } from 'lucide-react';

export default function TaskBoard({ 
  tasks, 
  user,
  onOpenLogin,
  activeTrack, 
  setActiveTrack, 
  selectedLevelFilter, 
  onToggleStatus,
  onToggleSubTask, 
  onEdit, 
  onDelete, 
  onOpenReflection,
  onOpenNewTask
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Filter tasks logic
  const filteredTasks = tasks.filter(task => {
    if (activeTrack !== 'ALL' && task.track !== activeTrack) return false;
    if (selectedLevelFilter !== null && task.bloomLevel !== selectedLevelFilter) return false;
    if (statusFilter === 'TODO' && task.status === 'COMPLETED') return false;
    if (statusFilter === 'COMPLETED' && task.status !== 'COMPLETED') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = (task.description || '').toLowerCase().includes(q);
      const matchVerb = (task.verb || '').toLowerCase().includes(q);
      return matchTitle || matchDesc || matchVerb;
    }

    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Track & Search Action Bar */}
      <div className="controls-bar">
        {/* Track Selector */}
        <div className="track-tabs">
          <button 
            className={`track-tab-btn ${activeTrack === 'ALL' ? 'active' : ''}`}
            onClick={() => setActiveTrack('ALL')}
          >
            All Tracks ({tasks.length})
          </button>

          <button 
            className={`track-tab-btn institute ${activeTrack === 'INSTITUTE' ? 'active institute' : ''}`}
            onClick={() => setActiveTrack('INSTITUTE')}
          >
            <GraduationCap size={16} />
            Institute Course ({tasks.filter(t => t.track === 'INSTITUTE').length})
          </button>

          <button 
            className={`track-tab-btn personal ${activeTrack === 'PERSONAL' ? 'active personal' : ''}`}
            onClick={() => setActiveTrack('PERSONAL')}
          >
            <UserCheck size={16} />
            Personal Goals ({tasks.filter(t => t.track === 'PERSONAL').length})
          </button>
        </div>

        {/* Search & Status Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '36px', width: '200px' }}
            />
          </div>

          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
          >
            <option value="ALL">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Task List or Welcome Hero */}
      {filteredTasks.length > 0 ? (
        <div className="task-grid">
          {filteredTasks.map(task => (
            <TaskCard 
              key={task.id}
              task={task}
              onToggleStatus={onToggleStatus}
              onToggleSubTask={onToggleSubTask}
              onEdit={onEdit}
              onDelete={onDelete}
              onOpenReflection={onOpenReflection}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '36px 28px', textAlign: 'center', background: 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.15) 0%, rgba(18, 24, 38, 0.8) 100%)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', display: 'inline-flex', alignItems: 'center', justifyCenter: 'center', fontSize: '32px', marginBottom: '16px', boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)' }}>
            🧠
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px' }}>
            {user ? `Welcome ${user.name} to TaskMaker!` : 'Welcome to Your Blank TaskMaker Canvas!'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '540px', margin: '0 auto 24px auto', lineHeight: '1.6' }}>
            Your task list is completely empty and ready. Start adding your daily <strong>Java Full-Stack Institute Assignments</strong> or <strong>Personal Daily Goals</strong> below.
          </p>

          {/* Large Action Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center', marginBottom: '32px' }}>
            <button 
              className="btn-primary" 
              style={{ padding: '14px 24px', fontSize: '0.98rem', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)' }}
              onClick={() => onOpenNewTask('INSTITUTE')}
            >
              <GraduationCap size={20} />
              <span>+ Add Today's Institute Assignment</span>
            </button>

            <button 
              className="btn-primary" 
              style={{ padding: '14px 24px', fontSize: '0.98rem', background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)', boxShadow: '0 6px 20px rgba(168, 85, 247, 0.4)' }}
              onClick={() => onOpenNewTask('PERSONAL')}
            >
              <UserCheck size={20} />
              <span>+ Add Personal Daily Goal</span>
            </button>
          </div>

          {/* How Bloom's Taxonomy Works Guide */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', textAlign: 'left', background: 'rgba(0, 0, 0, 0.3)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
            <div>
              <div style={{ color: '#6366f1', fontWeight: '700', fontSize: '0.85rem' }}>🧠 L1 Remember</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '2px' }}>Recall Java syntax, rules, HTTP codes</div>
            </div>
            <div>
              <div style={{ color: '#06b6d4', fontWeight: '700', fontSize: '0.85rem' }}>💡 L2 Understand</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '2px' }}>Explain JVM memory & OOP concepts</div>
            </div>
            <div>
              <div style={{ color: '#10b981', fontWeight: '700', fontSize: '0.85rem' }}>⚡ L3 Apply</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '2px' }}>Implement Spring REST APIs & SQL</div>
            </div>
            <div>
              <div style={{ color: '#f59e0b', fontWeight: '700', fontSize: '0.85rem' }}>🔍 L4 Analyze</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '2px' }}>Debug NullPointerExceptions</div>
            </div>
            <div>
              <div style={{ color: '#f97316', fontWeight: '700', fontSize: '0.85rem' }}>⚖️ L5 Evaluate</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '2px' }}>Review code & benchmark JPA</div>
            </div>
            <div>
              <div style={{ color: '#ec4899', fontWeight: '700', fontSize: '0.85rem' }}>🎨 L6 Create</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '2px' }}>Architect Full-Stack Capstone</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
