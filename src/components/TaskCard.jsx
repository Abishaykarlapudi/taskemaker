import React from 'react';
import { BLOOM_LEVELS, TASK_TRACKS } from '../data/bloomTaxonomy';
import { Check, Edit3, Trash2, GraduationCap, UserCheck, Flame, ArrowUpRight, MessageSquare } from 'lucide-react';

export default function TaskCard({ task, onToggleStatus, onEdit, onDelete, onOpenReflection }) {
  const bloomObj = BLOOM_LEVELS[task.bloomLevel] || BLOOM_LEVELS[1];
  const trackObj = TASK_TRACKS[task.track] || TASK_TRACKS.INSTITUTE;
  const isCompleted = task.status === 'COMPLETED';

  return (
    <div 
      className="glass-panel task-card"
      style={{
        '--bloom-color': bloomObj.color,
        '--bloom-light': bloomObj.lightBg,
        '--bloom-border': bloomObj.border,
        opacity: isCompleted ? 0.75 : 1
      }}
    >
      <div className="task-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <button 
            className={`check-btn ${isCompleted ? 'completed' : ''}`}
            onClick={() => onToggleStatus(task)}
            title={isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
          >
            <Check size={16} />
          </button>
          
          <div>
            <h3 className={`task-title ${isCompleted ? 'completed' : ''}`}>
              {task.title}
            </h3>
            {task.description && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {task.description}
              </p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button className="btn-secondary" style={{ padding: '6px' }} onClick={() => onEdit(task)} title="Edit Task">
            <Edit3 size={15} />
          </button>
          <button className="btn-secondary" style={{ padding: '6px', color: '#f43f5e' }} onClick={() => onDelete(task.id)} title="Delete Task">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="task-card-meta">
        {/* Track Badge */}
        <span className={`badge ${task.track === 'INSTITUTE' ? 'badge-track-institute' : 'badge-track-personal'}`}>
          {task.track === 'INSTITUTE' ? <GraduationCap size={13} /> : <UserCheck size={13} />}
          {trackObj.label}
        </span>

        {/* Bloom Level Badge */}
        <span className="badge badge-bloom">
          L{bloomObj.id}: {bloomObj.name}
        </span>

        {/* Action Verb */}
        <span className="badge badge-verb">
          Verb: {task.verb || bloomObj.verbs[0]}
        </span>

        {/* Pain Rating Meter */}
        <div className="pain-meter" title={`Task Difficulty Pain Rating: ${task.painRating}/5`}>
          <Flame size={13} color={task.painRating > 3 ? '#f43f5e' : '#f59e0b'} />
          <span>Pain:</span>
          {[1, 2, 3, 4, 5].map((level) => (
            <span 
              key={level} 
              className={`pain-dot ${level <= (task.painRating || 1) ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Reflection Logged */}
      {task.reflections && task.reflections.length > 0 && (
        <div 
          style={{ 
            background: 'rgba(0, 0, 0, 0.3)', 
            padding: '10px 14px', 
            borderRadius: 'var(--radius-sm)', 
            fontSize: '0.82rem',
            borderLeft: '3px solid #10b981'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: '600', marginBottom: '2px' }}>
            <MessageSquare size={14} /> Reflection Takeaway:
          </div>
          <p style={{ color: 'var(--text-muted)' }}>
            "{task.reflections[task.reflections.length - 1].text}"
          </p>
        </div>
      )}

      {/* Action to elevate/reflect */}
      {isCompleted && (!task.reflections || task.reflections.length === 0) && (
        <button 
          className="btn-secondary" 
          style={{ alignSelf: 'flex-start', padding: '4px 10px', fontSize: '0.78rem', color: '#10b981' }}
          onClick={() => onOpenReflection(task)}
        >
          <MessageSquare size={13} /> Add Learning Reflection
        </button>
      )}
    </div>
  );
}
