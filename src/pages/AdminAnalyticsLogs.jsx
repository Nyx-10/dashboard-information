import React from 'react';
import { Users, FileText, CheckCircle, Activity, Clock, User, Shield } from 'lucide-react';

export const AdminAnalyticsView = () => {
  const stats = [
    { label: 'Total Users', value: '1,245', icon: <Users size={24} color="#3B82F6" /> },
    { label: 'Total Reports', value: '842', icon: <FileText size={24} color="#8B5CF6" /> },
    { label: 'Resolution Rate', value: '94.2%', icon: <CheckCircle size={24} color="#10B981" /> },
    { label: 'Active Sessions', value: '124', icon: <Activity size={24} color="#F59E0B" /> },
  ];

  return (
    <div className="page-bg-common bg-admin-analytics">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Analytics Overview</h2>
        <p style={{ color: 'var(--text-muted)' }}>Monitor your platform's key performance metrics.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {stats.map((stat, index) => (
          <div key={index} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--surface)', borderRadius: '0.75rem', boxShadow: 'var(--shadow-sm)' }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{stat.label}</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Activity Summary</h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)', flexShrink: 0 }}></span>
            Number of Active Users: <span style={{ fontWeight: 700, color: 'var(--primary)' }}>124</span>
          </p>
        </div>
        <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          {[40, 70, 45, 90, 65, 85, 100].map((height, i) => (
            <div key={i} style={{ flex: 1, backgroundColor: 'var(--primary)', height: `${height}%`, borderRadius: '4px 4px 0 0', opacity: 0.8, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '0.5rem', color: 'white', fontSize: '0.75rem', fontWeight: 600 }}>
              {height}%
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
        </div>
      </div>
    </div>
  );
};

export const AdminAuditLogsView = () => {
  const logs = [
    { id: 1, action: 'User role updated to Admin', user: 'sarah.j@adtec.edu.my', timestamp: '2 mins ago', icon: <Shield size={16} /> },
    { id: 2, action: 'System settings modified', user: 'admin@adtec.edu.my', timestamp: '1 hour ago', icon: <Activity size={16} /> },
    { id: 3, action: 'Bulk report export downloaded', user: 'admin2@adtec.edu.my', timestamp: '3 hours ago', icon: <FileText size={16} /> },
    { id: 4, action: 'New user account created', user: 'jane.doe@adtec.edu.my', timestamp: '5 hours ago', icon: <User size={16} /> },
    { id: 5, action: 'Failed login attempt detected', user: 'unknown IP', timestamp: '1 day ago', icon: <Shield size={16} /> },
  ];

  return (
    <div className="page-bg-common bg-admin-logs">
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>System Audit Logs</h2>
          <p style={{ color: 'var(--text-muted)' }}>Track and monitor all administrative actions and system events.</p>
        </div>
        <button className="btn-primary" onClick={() => {
          const csvHeader = 'Action Performed,User / Source,Timestamp\n';
          const csvRows = logs.map(log => `"${log.action}","${log.user}","${log.timestamp}"`).join('\n');
          const csvContent = csvHeader + csvRows;
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `audit_logs_${new Date().toISOString().slice(0,10)}.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }}>Export Logs</button>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.02)' }}>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem' }}>Action Performed</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem' }}>User / Source</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'right' }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={log.id} style={{ borderBottom: index === logs.length - 1 ? 'none' : '1px solid var(--border)' }}>
                <td style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)' }}>
                  <div style={{ padding: '0.5rem', background: 'var(--surface)', borderRadius: '0.5rem', color: 'var(--text-muted)' }}>
                    {log.icon}
                  </div>
                  {log.action}
                </td>
                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-main)' }}>{log.user}</td>
                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', textAlign: 'right' }}>{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
