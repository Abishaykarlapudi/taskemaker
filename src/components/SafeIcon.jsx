import React from 'react';
import * as Icons from 'lucide-react';

// Safe icon renderer that falls back to a default star/circle if the named icon is missing
export default function SafeIcon({ name, size = 18, color = 'currentColor', style, className }) {
  const IconComponent = Icons[name] || Icons.Sparkles || Icons.Circle;

  if (!IconComponent) {
    return <span style={{ display: 'inline-block', width: size, height: size, background: color, borderRadius: '50%' }} />;
  }

  return <IconComponent size={size} color={color} style={style} className={className} />;
}
