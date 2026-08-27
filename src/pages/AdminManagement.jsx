import React, { useState, useEffect, useContext } from 'react';
import { Trash2, UserX, CheckCircle, XCircle, AlertTriangle, Search } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { LanguageContext } from '../context/LanguageContext';
const mockUsers = [
  { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Bob Jones', email: 'bob@example.com', role: 'User', status: 'Active' },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'User', status: 'Active' },
];

const mockReports = [
  { id: 1, itemName: 'Inappropriate Comment', type: 'Harassment', status: 'Pending' },
  { id: 2, itemName: 'Spam Post', type: 'Spam', status: 'Resolved' },
];

const badgeStyle = (status) => {
  let bgColor = 'rgba(107, 114, 128, 0.1)';
  let color = 'var(--text-muted)';
  
  if (status === 'Active' || status === 'Resolved') {
    bgColor = 'rgba(16, 185, 129, 0.1)';
    color = '#10B981';
  } else if (status === 'Suspended' || status === 'Pending') {
    bgColor = 'rgba(245, 158, 11, 0.1)';
    color = '#F59E0B';
  }
  
  return {
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: 600,
    backgroundColor: bgColor,
    color: color,
    display: 'inline-block'
  };
};

export const AdminUsersView = ({ currentUser }) => {
  const { t } = useContext(LanguageContext);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('username', { ascending: true });
        
      if (error) {
        console.error('Error fetching profiles:', error);
        setUsers(mockUsers);
        return;
      }
      
      if (data && data.length > 0) {
        setUsers(data.map(u => {
          let normalizedRole = 'User';
          if (u.role) {
            const r = u.role.toLowerCase();
            if (r === 'superadmin' || r === 'super admin') normalizedRole = 'Super Admin';
            else if (r === 'admin') normalizedRole = 'Admin';
          }
          
          return {
            id: u.id,
            name: u.username || 'Unknown',
            email: u.email || 'No Email',
            role: normalizedRole,
            status: u.status || 'Active'
          };
        }));
      } else {
        setUsers(mockUsers); // Fallback to mock data if empty
      }
    } catch (e) {
      console.error('Exception fetching profiles:', e);
      setUsers(mockUsers);
    }
  };

  const logAction = async (actionText) => {
    if (!currentUser?.email) return;
    try {
      await supabase.from('audit_logs').insert({
        action: actionText,
        user_email: currentUser.email
      });
    } catch (e) {
      console.error('Failed to log action:', e);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    try {
      let dbRole = newRole.toLowerCase();
      if (dbRole === 'super admin') dbRole = 'superadmin';
      
      const { error } = await supabase.from('profiles').update({ role: dbRole }).eq('id', userId);
      if (error) throw error;
      
      const updatedUser = users.find(u => u.id === userId);
      if (updatedUser) {
        logAction(`Menukar pangkat pengguna (${updatedUser.email}) kepada ${newRole}`);
      }
    } catch (e) {
      alert(t('alertFailedUpdateRole') + e.message);
      fetchUsers(); // revert
    }
  };

  const handleToggleSuspend = async (user) => {
    const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)));
    try {
      const { error } = await supabase.from('profiles').update({ status: newStatus }).eq('id', user.id);
      if (error) throw error;
      
      logAction(`Menukar status pengguna (${user.email}) kepada ${newStatus}`);
    } catch (e) {
      alert(t('alertFailedSuspend') + e.message);
      fetchUsers(); // revert
    }
  };

  const handleDeleteUser = async (userId) => {
    const userToDelete = users.find(u => u.id === userId);
    if (!window.confirm(t('confirmDeleteUser'))) return;
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    try {
      // Panggil fungsi RPC untuk padam pengguna dari auth.users sepenuhnya
      const { error } = await supabase.rpc('delete_user_completely', { target_user_id: userId });
      
      // Fallback jika RPC tidak dijumpai (contoh: belum setup SQL)
      if (error && error.message.includes('function delete_user_completely does not exist')) {
         const { error: profileError } = await supabase.from('profiles').delete().eq('id', userId);
         if (profileError) throw profileError;
      } else if (error) {
         throw error;
      }
      
      if (userToDelete) {
        logAction(`Memadam pengguna sepenuhnya (${userToDelete.email})`);
      }
    } catch (e) {
      alert(t('alertFailedDelete') + e.message);
      fetchUsers(); // revert
    }
  };

  const filteredUsers = users.filter((u) => u.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const roles = ['Admin', 'User', 'Super Admin'];
  const roleCounts = roles.reduce((acc, role) => {
    acc[role] = users.filter(u => (u.role && u.role.toLowerCase() === role.toLowerCase())).length;
    return acc;
  }, { 'Admin': 0, 'User': 0, 'Super Admin': 0 });

  const canModifyUser = (targetUser) => {
    if (!currentUser) return false;
    if (currentUser.id === targetUser.id) return false; // Cannot modify self from here
    if (currentUser.role === 'superadmin') return true;
    if (currentUser.role === 'admin' && (targetUser.role === 'Admin' || targetUser.role === 'Super Admin')) return false;
    return true;
  };

  return (
    <div className="page-bg-common bg-admin-users">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>{t('userManagementTitle') || 'User Management'}</h2>
        <p style={{ color: 'var(--text-muted)' }}>{t('userManagementDesc') || 'Manage registered users and their roles.'}</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {roles.map(role => (
          <div key={role} className="glass-panel" style={{ flex: '1 1 200px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderRadius: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{t('total') || 'Total'} {role}s</span>
            <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>{roleCounts[role]}</span>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '1.5rem', position: 'relative', maxWidth: '400px' }}>
        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          placeholder={t('searchByName') || 'Search by name...'} 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.75rem', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', outline: 'none' }}
        />
      </div>
      
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.02)' }}>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('nameLabel') || 'Name'}</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('email') || 'Email'}</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('roleLabel') || 'Role'}</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('status') || 'Status'}</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'right' }}>{t('actions') || 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
               <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>{t('noUsersFound') || 'No users found.'}</td></tr>
            ) : filteredUsers.map((user, index) => {
              const canEdit = canModifyUser(user);
              return (
              <tr key={user.id} style={{ borderBottom: index === users.length - 1 ? 'none' : '1px solid var(--border)' }}>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-main)' }}>{user.name} {currentUser?.id === user.id && '(You)'}</td>
                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{user.email}</td>
                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-main)' }}>{user.role}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={badgeStyle(user.status)}>{user.status}</span>
                </td>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', opacity: canEdit ? 1 : 0.5 }}>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={!canEdit}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-main)',
                      padding: '0.35rem 0.6rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.8rem',
                      cursor: canEdit ? 'pointer' : 'not-allowed',
                      outline: 'none',
                    }}
                    title={t('changeRole') || 'Change Role'}
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                    {currentUser?.role === 'superadmin' && <option value="Super Admin">Super Admin</option>}
                  </select>
                  <button onClick={() => handleToggleSuspend(user)} disabled={!canEdit} style={{ background: 'none', border: 'none', color: user.status === 'Suspended' ? '#10B981' : '#F59E0B', cursor: canEdit ? 'pointer' : 'not-allowed' }} title={user.status === 'Suspended' ? (t('activate') || 'Activate') : (t('suspend') || 'Suspend')}>
                    {user.status === 'Suspended' ? <CheckCircle size={18} /> : <UserX size={18} />}
                  </button>
                  <button onClick={() => handleDeleteUser(user.id)} disabled={!canEdit} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: canEdit ? 'pointer' : 'not-allowed' }} title={t('deleteBtn') || 'Delete'}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AdminReportsView = ({ currentUser }) => {
  const { t } = useContext(LanguageContext);
  const [reports, setReports] = useState([]);
  
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('user_reports')
        .select(`
          id, report_type, reason_text, status, created_at,
          reporter:profiles!user_reports_reporter_id_fkey(username),
          reported:profiles!user_reports_reported_id_fkey(username, email)
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) {
        setReports(data.map(r => ({
          id: r.id,
          itemName: `Report on ${r.reported?.username || 'Unknown'} by ${r.reporter?.username || 'Unknown'}`,
          reportedEmail: r.reported?.email,
          type: r.report_type === 'Others' ? `Others (${r.reason_text})` : r.report_type,
          status: r.status || 'Pending'
        })));
      }
    } catch (e) {
      console.error('Error fetching reports:', e);
    }
  };

  const updateReportStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('user_reports')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) throw error;
      
      const report = reports.find(r => r.id === id);
      if (report && currentUser?.email) {
        await supabase.from('audit_logs').insert({
          action: `Menukar status laporan (${report.reportedEmail || id}) kepada ${newStatus}`,
          user_email: currentUser.email
        });
      }
      
      fetchReports();
    } catch (e) {
      alert(t('alertFailedUpdateStatus') + e.message);
    }
  };

  return (
    <div className="page-bg-common bg-admin-reports">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>{t('reportManagementTitle') || 'Report Management'}</h2>
        <p style={{ color: 'var(--text-muted)' }}>{t('reportManagementDesc') || 'Approve, reject, or resolve user reports.'}</p>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.02)' }}>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('reportDetails') || 'Report Details'}</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('reportType') || 'Report Type'}</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('status') || 'Status'}</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'right' }}>{t('actions') || 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
               <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>{t('noReportsFound') || 'No reports found.'}</td></tr>
            ) : reports.map((report, index) => (
              <tr key={report.id} style={{ borderBottom: index === reports.length - 1 ? 'none' : '1px solid var(--border)' }}>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-main)' }}>{report.itemName}</td>
                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{report.type}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={badgeStyle(report.status)}>{report.status}</span>
                </td>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                  <button onClick={() => updateReportStatus(report.id, 'Resolved')} style={{ background: 'none', border: 'none', color: '#10B981', cursor: 'pointer', marginRight: '1rem' }} title={t('resolve') || 'Resolve'}>
                    <CheckCircle size={18} />
                  </button>
                  <button onClick={() => updateReportStatus(report.id, 'Rejected')} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }} title={t('reject') || 'Reject'}>
                    <XCircle size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
