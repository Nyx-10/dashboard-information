import React, { useState, useEffect, useContext } from 'react';
import { Users, FileText, CheckCircle, Activity, Shield, Download, FileDown, Loader } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { LanguageContext } from '../context/LanguageContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

function AnimatedNumber({ value }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Parse numeric part and suffix
    const strVal = String(value);
    const numMatch = strVal.match(/[\d.]+/);
    if (!numMatch) {
      setCount(value);
      return;
    }
    
    const target = parseFloat(numMatch[0]);
    if (isNaN(target)) {
      setCount(value);
      return;
    }

    let start = 0;
    const duration = 1000; // 1 second
    const step = target / (duration / 16);
    
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  const strVal = String(value);
  const suffix = strVal.replace(/[\d.]+/, '');
  return <span>{count}{suffix}</span>;
}
export const AdminAnalyticsView = ({ currentUser }) => {
  const { t } = useContext(LanguageContext);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReports: 0,
    resolutionRate: '0%',
    activeUsers: 0
  });
  const [chartData, setChartData] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [chartFilter, setChartFilter] = useState('month'); // 'day', 'week', 'month', 'year'
  const [isMaintenanceActive, setIsMaintenanceActive] = useState(false);
  const [togglingMaintenance, setTogglingMaintenance] = useState(false);

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
      const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: activeUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'Active');
      const { count: totalReports } = await supabase.from('user_reports').select('*', { count: 'exact', head: true });
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

      // Chart Data: fetch and store
      const { data: items } = await supabase.from('items').select('created_at, type');
      if (items) {
        setAllItems(items);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  useEffect(() => {
    if (!allItems || allItems.length === 0) {
      setChartData([]);
      return;
    }

    const now = new Date();
    let aggregatedData = [];

    if (chartFilter === 'day') {
      // Last 7 days
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        aggregatedData.push({
          name: days[d.getDay()],
          dateString: d.toDateString(),
          Lost: 0,
          Found: 0
        });
      }

      allItems.forEach(item => {
        const itemDate = new Date(item.created_at);
        const idx = aggregatedData.findIndex(d => d.dateString === itemDate.toDateString());
        if (idx !== -1) {
          if (item.type === 'lost') aggregatedData[idx].Lost += 1;
          if (item.type === 'found') aggregatedData[idx].Found += 1;
        }
      });
    } else if (chartFilter === 'week') {
      // Last 4 weeks
      for (let i = 3; i >= 0; i--) {
        aggregatedData.push({
          name: `Week ${4 - i}`,
          weekIndex: i, // 0 is current week, 1 is 1 week ago
          Lost: 0,
          Found: 0
        });
      }
      
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      allItems.forEach(item => {
        const itemDate = new Date(item.created_at);
        const diffTime = now.getTime() - itemDate.getTime();
        const diffWeeks = Math.floor(diffTime / oneWeek);
        
        if (diffWeeks >= 0 && diffWeeks <= 3) {
          const idx = aggregatedData.findIndex(d => d.weekIndex === diffWeeks);
          if (idx !== -1) {
            if (item.type === 'lost') aggregatedData[idx].Lost += 1;
            if (item.type === 'found') aggregatedData[idx].Found += 1;
          }
        }
      });
    } else if (chartFilter === 'month') {
      // Last 6 months
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let i = 5; i >= 0; i--) {
        let d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        aggregatedData.push({
          name: monthNames[d.getMonth()],
          year: d.getFullYear(),
          monthIndex: d.getMonth(),
          Lost: 0,
          Found: 0
        });
      }

      allItems.forEach(item => {
        const itemDate = new Date(item.created_at);
        const idx = aggregatedData.findIndex(d => d.monthIndex === itemDate.getMonth() && d.year === itemDate.getFullYear());
        if (idx !== -1) {
          if (item.type === 'lost') aggregatedData[idx].Lost += 1;
          if (item.type === 'found') aggregatedData[idx].Found += 1;
        }
      });
    } else if (chartFilter === 'year') {
      // Last 5 years
      for (let i = 4; i >= 0; i--) {
        let y = now.getFullYear() - i;
        aggregatedData.push({
          name: y.toString(),
          year: y,
          Lost: 0,
          Found: 0
        });
      }

      allItems.forEach(item => {
        const itemDate = new Date(item.created_at);
        const idx = aggregatedData.findIndex(d => d.year === itemDate.getFullYear());
        if (idx !== -1) {
          if (item.type === 'lost') aggregatedData[idx].Lost += 1;
          if (item.type === 'found') aggregatedData[idx].Found += 1;
        }
      });
    }

    setChartData(aggregatedData);
  }, [chartFilter, allItems]);

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
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>{t('analyticsOverview') || 'Analytics Overview'}</h2>
          <p style={{ color: 'var(--text-muted)' }}>{t('monitorStats') || 'Monitor system statistics and download reports'}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={() => {
              const doc = new jsPDF();
              doc.text("Analytics Report", 14, 15);
              autoTable(doc, {
                head: [['Metric', 'Value']],
                body: [
                  ['Total Users', stats.totalUsers],
                  ['Active Users', stats.activeUsers],
                  ['Total Reports', stats.totalReports],
                  ['Resolution Rate', stats.resolutionRate],
                ],
                startY: 20
              });
              doc.save(`Analytics_Report_${new Date().toISOString().split('T')[0]}.pdf`);
            }}
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface)', color: 'var(--text-main)', border: '1px solid var(--border)', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
          >
            <FileDown size={16} /> Export (PDF)
          </button>
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
            <Download size={16} /> Export (CSV)
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {[
          { label: t('totalUsers') || 'Total Users', value: stats.totalUsers, icon: Users, color: '#3B82F6' },
          { label: t('totalReports') || 'Total Reports', value: stats.totalReports, icon: FileText, color: '#8B5CF6' },
          { label: t('resolutionRate') || 'Resolution Rate', value: stats.resolutionRate, icon: CheckCircle, color: '#10B981' },
          { label: t('activeAccounts') || 'Active Accounts', value: stats.activeUsers, icon: Activity, color: '#F59E0B' }
        ].map((stat, index) => (
          <div key={index} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: `${stat.color}15`, padding: '1rem', borderRadius: '1rem' }}>
              <stat.icon size={24} color={stat.color} />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>{stat.label}</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
                <AnimatedNumber value={stat.value} />
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Chart */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', height: '400px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
            {t('itemsReported') || 'Items Reported'} 
            <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
              ({chartFilter === 'day' ? 'Last 7 Days' : chartFilter === 'week' ? 'Last 4 Weeks' : chartFilter === 'month' ? 'Last 6 Months' : 'Last 5 Years'})
            </span>
          </h3>
          <select 
            value={chartFilter} 
            onChange={(e) => setChartFilter(e.target.value)}
            style={{ 
              padding: '0.4rem 0.75rem', 
              borderRadius: '0.5rem', 
              border: '1px solid var(--border)', 
              background: 'var(--surface)', 
              color: 'var(--text-main)',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            <option value="day">Day (Last 7 Days)</option>
            <option value="week">Week (Last 4 Weeks)</option>
            <option value="month">Month (Last 6 Months)</option>
            <option value="year">Year (Last 5 Years)</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--text-muted)" />
            <YAxis stroke="var(--text-muted)" allowDecimals={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-main)', borderRadius: '0.5rem' }} 
              itemStyle={{ color: 'var(--text-main)' }}
            />
            <Bar dataKey="Lost" name="Lost Items" fill="#EF4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Found" name="Found Items" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
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
                setTogglingMaintenance(true);
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
                setTogglingMaintenance(false);
              }
            }}
            disabled={togglingMaintenance}
            className={`btn-primary maintenance-btn ${isMaintenanceActive ? 'maintenance-btn-active' : ''}`}
            style={{ 
              background: isMaintenanceActive ? '#EF4444' : '#10B981', 
              padding: '0.75rem 1.5rem', 
              fontWeight: 600, 
              border: 'none', 
              color: '#fff', 
              cursor: togglingMaintenance ? 'not-allowed' : 'pointer', 
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
             {togglingMaintenance ? <Loader size={18} className="spin-animation" /> : <Shield size={18} />}
             {togglingMaintenance ? (t('processing') || 'Memproses...') : (isMaintenanceActive ? (t('maintenanceTurnOff') || 'Matikan (Off)') : (t('maintenanceTurnOn') || 'Aktifkan (On)'))}
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
        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
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
              <tr 
                key={log.id} 
                style={{ 
                  borderBottom: index === logs.length - 1 ? 'none' : '1px solid var(--border)',
                  animationDelay: `${index * 0.05}s`
                }}
              >
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
