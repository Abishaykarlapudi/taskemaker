import React from 'react';
import { BLOOM_LEVELS, calculateCognitiveScore } from '../data/bloomTaxonomy';
import { Award, Brain, BarChart3, GraduationCap, UserCheck, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

export default function AnalyticsView({ tasks }) {
  const cdiScore = calculateCognitiveScore(tasks);
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED');
  const instituteTasks = tasks.filter(t => t.track === 'INSTITUTE');
  const personalTasks = tasks.filter(t => t.track === 'PERSONAL');

  const instituteCompleted = instituteTasks.filter(t => t.status === 'COMPLETED');
  const personalCompleted = personalTasks.filter(t => t.status === 'COMPLETED');

  // Higher Order Cognitive Ratio (Levels 4, 5, 6 vs 1, 2, 3)
  const higherOrderTasks = tasks.filter(t => t.bloomLevel >= 4);
  const higherOrderCompleted = higherOrderTasks.filter(t => t.status === 'COMPLETED');
  const higherOrderPct = totalTasks > 0 ? Math.round((higherOrderTasks.length / totalTasks) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={22} color="#6366f1" />
          Cognitive Mastery Matrix & Track Analytics
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
          Detailed performance breakdown comparing Institute Course Assignments against Personal Goals based on Bloom's Taxonomy.
        </p>

        {/* Top Metric Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={16} color="#f472b6" /> Total Cognitive Depth Score
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f472b6', marginTop: '6px' }}>
              {cdiScore} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>pts</span>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <GraduationCap size={16} color="#60a5fa" /> Institute Course Velocity
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#60a5fa', marginTop: '6px' }}>
              {instituteCompleted.length}/{instituteTasks.length} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Done</span>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <UserCheck size={16} color="#c084fc" /> Personal Goals Velocity
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#c084fc', marginTop: '6px' }}>
              {personalCompleted.length}/{personalTasks.length} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Done</span>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={16} color="#10b981" /> High-Order Rigor Ratio
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#10b981', marginTop: '6px' }}>
              {higherOrderPct}% <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(Analyze/Create)</span>
            </div>
          </div>
        </div>

        {/* Bloom Levels Breakdown */}
        <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '14px' }}>
          Bloom's 6 Cognitive Levels Distribution
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3, 4, 5, 6].map((id) => {
            const lvl = BLOOM_LEVELS[id];
            const levelTasks = tasks.filter(t => t.bloomLevel === id);
            const levelDone = levelTasks.filter(t => t.status === 'COMPLETED');
            const pct = totalTasks > 0 ? (levelTasks.length / totalTasks) * 100 : 0;

            return (
              <div key={id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: '600', color: lvl.color }}>
                    Level {lvl.id}: {lvl.name} ({lvl.subtitle})
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {levelDone.length}/{levelTasks.length} Completed ({Math.round(pct)}%)
                  </span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${pct}%`, 
                      background: lvl.color,
                      borderRadius: '4px',
                      transition: 'width 0.4s ease'
                    }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
