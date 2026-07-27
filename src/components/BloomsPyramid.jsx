import React from 'react';
import { BLOOM_LEVELS } from '../data/bloomTaxonomy';
import { Brain, Lightbulb, Zap, Search, Scale, Sparkles, FilterX } from 'lucide-react';

export default function BloomsPyramid({ tasks, selectedLevelFilter, setSelectedLevelFilter }) {
  const levelIds = [6, 5, 4, 3, 2, 1];

  const getIcon = (id) => {
    switch (id) {
      case 6: return <Sparkles size={16} color={BLOOM_LEVELS[6].color} />;
      case 5: return <Scale size={16} color={BLOOM_LEVELS[5].color} />;
      case 4: return <Search size={16} color={BLOOM_LEVELS[4].color} />;
      case 3: return <Zap size={16} color={BLOOM_LEVELS[3].color} />;
      case 2: return <Lightbulb size={16} color={BLOOM_LEVELS[2].color} />;
      default: return <Brain size={16} color={BLOOM_LEVELS[1].color} />;
    }
  };

  return (
    <div className="glass-panel pyramid-container">
      <div className="pyramid-title">
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="#ec4899" />
          <span>Cognitive Pyramid</span>
        </span>
        {selectedLevelFilter && (
          <button 
            className="btn-secondary" 
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            onClick={() => setSelectedLevelFilter(null)}
          >
            <FilterX size={14} /> Clear Filter
          </button>
        )}
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
        Click any level to filter daily tasks by cognitive depth.
      </p>

      <div className="pyramid-levels">
        {levelIds.map((id) => {
          const lvl = BLOOM_LEVELS[id];
          const levelTasks = tasks.filter(t => t.bloomLevel === id);
          const completedLevelTasks = levelTasks.filter(t => t.status === 'COMPLETED');
          const isSelected = selectedLevelFilter === id;
          const pct = tasks.length > 0 ? (levelTasks.length / tasks.length) * 100 : 0;

          return (
            <div
              key={id}
              className={`pyramid-level-bar ${isSelected ? 'active' : ''}`}
              style={{
                '--level-color': lvl.color,
                borderColor: isSelected ? lvl.color : 'transparent',
                background: isSelected ? lvl.lightBg : 'rgba(255, 255, 255, 0.03)'
              }}
              onClick={() => setSelectedLevelFilter(isSelected ? null : id)}
            >
              <div 
                className="pyramid-level-bg"
                style={{ 
                  width: `${pct}%`, 
                  background: lvl.color 
                }} 
              />

              <div className="pyramid-level-info">
                <span className="pyramid-level-num" style={{ color: lvl.color }}>L{lvl.id}</span>
                {getIcon(id)}
                <span className="pyramid-level-name">{lvl.name}</span>
              </div>

              <div className="pyramid-level-badge">
                {completedLevelTasks.length}/{levelTasks.length} Done
              </div>
            </div>
          );
        })}
      </div>

      {selectedLevelFilter && (
        <div 
          style={{ 
            marginTop: '12px', 
            padding: '12px', 
            borderRadius: 'var(--radius-sm)', 
            background: BLOOM_LEVELS[selectedLevelFilter].lightBg, 
            border: `1px solid ${BLOOM_LEVELS[selectedLevelFilter].border}`,
            fontSize: '0.82rem'
          }}
        >
          <strong style={{ color: BLOOM_LEVELS[selectedLevelFilter].color }}>
            Level {selectedLevelFilter}: {BLOOM_LEVELS[selectedLevelFilter].name}
          </strong>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            {BLOOM_LEVELS[selectedLevelFilter].description}
          </p>
        </div>
      )}
    </div>
  );
}
