import React, { useState, useEffect, useContext } from 'react';
import { Users, FileText, CheckCircle, Activity, Clock, User, Shield, Download } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { LanguageContext } from '../context/LanguageContext';
export const AdminAnalyticsView = ({ currentUser }) => {
  const { t } = useContext(LanguageContext);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReports: 0,
    resolutionRate: '0%',
    activeUsers: 0
  });
  const [isMaintenanceActive, setIsMaintenanceActive] = useState(false);

  const normalizedRole = currentUser?.role ? currentUser.role.toLowerCase().replace(/\s+/g, '') : '';
  const isSuperAdmin = Boolean(
    normalizedRole === 'superadmin' ||
    (currentUser?.email && currentUser.email.toLowerCase().includes('adam.darwish.it'))
  );

  useEffect(() => {
    fetchAnalytics();
    fetchMaintenanceStatus();
  }, []);

  const fetchMaintenanceStatus = async () => {
    try {
      const { data } = await supabase.from('system_settings').select('is_maintenance_mode').eq('id', 1).single();
      if (data) {
        setIsMaintenanceActive(data.is_maintenance_mode);
      }
    } catch (err) {
      console.error('Failed to fetch maintenance status:', err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      // Fetch Total Users
      const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      
      // Fetch Active Users (Not suspended)
      const { count: activeUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'Active');
      
      // Fetch Total Reports
      const { count: totalReports } = await supabase.from('user_reports').select('*', { count: 'exact', head: true });
      
      // Fetch Resolved Reports
      const { count: resolvedReports } = await supabase.from('user_reports').select('*', { count: 'exact', head: true }).eq('status', 'Resolved');

      let resolutionRate = '0%';
      if (totalReports > 0 && resolvedReports > 0) {
        resolutionRate = Math.round((resolvedReports / totalReports) * 100) + '%';
      }

      setStats({
        totalUsers: totalUsers || 0,
        totalReports: totalReports || 0,
        resolutionRate,
        activeUsers: activeUsers || 0
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const statCards = [
    { label: t('totalUsers'), value: stats.totalUsers, icon: <Users size={24} color="#3B82F6" /> },
    { label: t('totalReports'), value: stats.totalReports, icon: <FileText size={24} color="#8B5CF6" /> },
    { label: t('resolutionRate'), value: stats.resolutionRate, icon: <CheckCircle size={24} color="#10B981" /> },
    { label: t('activeAccounts'), value: stats.activeUsers, icon: <Activity size={24} color="#F59E0B" /> },
  ];

  return (
    <div className="page-bg-common bg-admin-analytics">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>{t('analyticsOverview')}</h2>
          <p style={{ color: 'var(--text-muted)' }}>{t('monitorStats')}</p>
        </div>
        <button 
          onClick={() => {
            const csvContent = "data:text/csv;charset=utf-8," 
              + "Metric,Value\n"
              + `Total Users,${stats.totalUsers}\n`
              + `Active Users,${stats.activeUsers}\n`
              + `Total Reports,${stats.totalReports}\n`
              + `Resolution Rate,${stats.resolutionRate}`;
            
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `Analytics_Report_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface)', color: 'var(--text-main)', border: '1px solid var(--border)', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
        >
          <Download size={16} /> {t('exportCsv') || 'Export (CSV)'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {[
          { label: t('totalUsers'), value: stats.totalUsers, icon: Users, color: '#3B82F6' },
          { label: t('totalReports'), value: stats.totalReports, icon: FileText, color: '#8B5CF6' },
          { label: t('resolutionRate'), value: stats.resolutionRate, icon: CheckCircle, color: '#10B981' },
          { label: t('activeAccounts'), value: stats.activeUsers, icon: Activity, color: '#F59E0B' }
        ].map((stat, index) => (
          <div key={index} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: `${stat.color}15`, padding: '1rem', borderRadius: '1rem' }}>
              <stat.icon size={24} color={stat.color} />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>{stat.label}</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Maintenance Mode Toggle Section - Only for Super Admin */}
      {isSuperAdmin && (
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderLeft: `4px solid ${isMaintenanceActive ? '#EF4444' : '#10B981'}`, background: isMaintenanceActive ? 'rgba(239, 68, 68, 0.05)' : 'var(--surface)' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={20} color={isMaintenanceActive ? '#EF4444' : '#10B981'} /> {t('maintenanceMode') || 'Maintenance Mode'} 
              <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '1rem', background: isMaintenanceActive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: isMaintenanceActive ? '#EF4444' : '#10B981', marginLeft: '0.5rem' }}>
                {isMaintenanceActive ? (t('maintenanceActive') || 'AKTIF') : (t('maintenanceInactive') || 'TIDAK AKTIF')}
              </span>
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              {t('maintenanceDesc') || 'Jika diaktifkan, pengguna biasa tidak boleh log masuk ke dalam sistem sehingga ia dimatikan.'}
            </p>
          </div>
          <button 
            onClick={async () => {
              const confirmed = window.confirm(t('confirmMaintenanceToggle') || `Adakah anda pasti untuk menukar status Maintenance Mode?`);
              if (confirmed) {
                try {
                  const { data } = await supabase.from('system_settings').select('is_maintenance_mode').eq('id', 1).single();
                  let currentStatus = false;
                  if (data) currentStatus = data.is_maintenance_mode;

                  const newStatus = !currentStatus;
                  const { error: updateError } = await supabase.from('system_settings').update({ is_maintenance_mode: newStatus }).eq('id', 1);
                  if (updateError) throw updateError;
                  
                  setIsMaintenanceActive(newStatus);
                } catch (err) {
                  if (err.code === '42P01') {
                     alert("Table 'system_settings' not found. Please run the SQL script.");
                  } else {
                     alert("Failed to change status: " + err.message);
                  }
                }
              }
            }}
            className="btn-primary" 
            style={{ background: isMaintenanceActive ? '#EF4444' : '#10B981', padding: '0.75rem 1.5rem', fontWeight: 600, border: 'none', color: '#fff', cursor: 'pointer', borderRadius: '0.5rem' }}
          >
             {isMaintenanceActive ? (t('maintenanceTurnOff') || 'Matikan (Off)') : (t('maintenanceTurnOn') || 'Aktifkan (On)')}
          </button>
        </div>
      )}

    </div>
  );
};

export const AdminAuditLogsView = () => {
  const { t } = useContext(LanguageContext);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (error) {
        if (error.code !== '42P01') { // Abaikan ralat table tak wujud
          console.error(error);
        }
        return;
      }
      
      if (data) {
        setLogs(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="page-bg-common bg-admin-logs">
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>{t('systemAuditLogs')}</h2>
          <p style={{ color: 'var(--text-muted)' }}>{t('adminActionRecords')}</p>
        </div>
        <button className="btn-primary" onClick={() => {
          const csvHeader = 'Action Performed,User / Source,Timestamp\n';
          const csvRows = logs.map(log => `"${log.action}","${log.user_email}","${new Date(log.created_at).toLocaleString()}"`).join('\n');
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
        }}>{t('exportLogs')}</button>
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.02)' }}>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('action')}</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('userEmail')}</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'right' }}>{t('time')}</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
               <tr><td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>{t('noLogRecords')}</td></tr>
            ) : logs.map((log, index) => (
              <tr key={log.id} style={{ borderBottom: index === logs.length - 1 ? 'none' : '1px solid var(--border)' }}>
                <td style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)' }}>
                  <Shield size={16} color="var(--primary)" />
                  {log.action}
                </td>
                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{log.user_email}</td>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  {new Date(log.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
