import React from 'react';

export function StatCard({ title, value, color }) {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{title}</span>
      <span style={{ fontSize: '2.5rem', fontWeight: 700, color }}>{value}</span>
    </div>
  );
}
