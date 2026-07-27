import React from 'react';
import { Brain, Flame, Award, BarChart3, GraduationCap, UserCheck, Trash2, User, LogOut, LogIn } from 'lucide-react';
import { calculateCognitiveScore } from '../data/bloomTaxonomy';

export default function Navbar({ 
  tasks, 
  user,
  onOpenLogin,
  onLogout,
  activeTrack, 
  setActiveTrack, 
  onOpenNewTask, 
  showAnalytics, 
  setShowAnalytics, 
  onClearAllData 
}) {
  const cdiScore = calculateCognitiveScore(tasks);
  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;
  const streak = completedCount > 0 ? 1 : 0;

  return (
    <header className="app-header">
      <div className="navbar-content">
        <div className="logo-group">
          <div className="logo-badge">🧠</div>
          <div>
            <h1 className="logo-title">TaskMaker</h1>
            <p className="logo-sub">Java Full-Stack Bloom Engine</p>
          </div>
        </div>

        {/* Stats Pills */}
        <div className="stats-bar">
          {/* User Badge */}
          {user ? (
            <div className="user-pill" title={`Logged in as ${user.name} (${user.course})`}>
              <User size={14} color="#a5b4fc" />
              <span>{user.name}</span>
              <button 
                onClick={onLogout} 
                style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', marginLeft: '4px' }}
                title="Logout / Switch Account"
              >
                <LogOut size={12} />
              </button>
            </div>
          ) : (
            <button 
              className="btn-secondary" 
              style={{ padding: '5px 12px', fontSize: '0.8rem' }}
              onClick={onOpenLogin}
            >
              <LogIn size={14} /> Login Student
            </button>
          )}

          <div className="stat-pill" title="Cognitive Depth Index - Rewards higher-order Bloom tasks">
            <Award size={16} color="#f472b6" />
            <span>CDI: <strong className="stat-pill-score">{cdiScore} pts</strong></span>
          </div>

          <div className="stat-pill" title="Completed tasks counter">
            <Brain size={16} color="#38bdf8" />
            <span>Done: <strong className="stat-pill-val">{completedCount}/{tasks.length}</strong></span>
          </div>

          <div className="stat-pill" title="Daily streak counter">
            <Flame size={16} color="#f97316" />
            <span>Streak: <strong>{streak} Days 🔥</strong></span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button 
            className={`btn-secondary ${showAnalytics ? 'active' : ''}`}
            onClick={() => setShowAnalytics(!showAnalytics)}
            title="Toggle Analytics View"
          >
            <BarChart3 size={16} />
            <span>{showAnalytics ? 'Tasks' : 'Matrix'}</span>
          </button>

          <button 
            className="btn-primary" 
            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)' }}
            onClick={() => onOpenNewTask('INSTITUTE')}
          >
            <GraduationCap size={16} />
            <span>+ Add Institute Task</span>
          </button>

          <button 
            className="btn-primary" 
            style={{ background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)', boxShadow: '0 4px 14px rgba(168, 85, 247, 0.4)' }}
            onClick={() => onOpenNewTask('PERSONAL')}
          >
            <UserCheck size={16} />
            <span>+ Add Personal Goal</span>
          </button>

          {tasks.length > 0 && (
            <button 
              className="btn-secondary"
              style={{ color: '#f43f5e', borderColor: 'rgba(244, 63, 94, 0.3)' }}
              onClick={onClearAllData}
              title="Clear all stored tasks and start blank"
            >
              <Trash2 size={15} />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
