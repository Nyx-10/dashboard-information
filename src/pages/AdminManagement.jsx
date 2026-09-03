import React, { useState, useEffect, useContext } from 'react';
import { Trash2, UserX, CheckCircle, XCircle, AlertTriangle, Search, Image as ImageIcon, ExternalLink, X, Download, FileDown } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { LanguageContext } from '../context/LanguageContext';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  const [suspendTargetUser, setSuspendTargetUser] = useState(null);
  const [suspendDaysOption, setSuspendDaysOption] = useState('7');
  const [customDaysVal, setCustomDaysVal] = useState('');
  const [flashingRowId, setFlashingRowId] = useState(null);
  const [flashType, setFlashType] = useState(null);

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
        const now = new Date();
        const processedUsers = await Promise.all(data.map(async u => {
          let status = u.status || 'Active';
          let suspendedUntil = u.suspended_until;

          // Auto-unsuspend check if suspension duration has expired
          if (status === 'Suspended' && suspendedUntil && new Date(suspendedUntil) <= now) {
            status = 'Active';
            suspendedUntil = null;
            await supabase.from('profiles').update({ status: 'Active', suspended_until: null }).eq('id', u.id);
          }

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
            status: status,
            suspendedUntil: suspendedUntil
          };
        }));

        setUsers(processedUsers);
      } else {
        setUsers(mockUsers);
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
        logAction(t('logRoleChange').replace('{email}', updatedUser.email).replace('{role}', newRole));

        if (updatedUser.email) {
          await fetch('/api/send-notification-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: updatedUser.email,
              title: t('emailRoleChangeTitle'),
              message: t('emailRoleChangeMsg').replace('{role}', newRole)
            })
          }).catch(console.error);
        }
      }
    } catch (e) {
      alert(t('alertFailedUpdateRole') + e.message);
      fetchUsers();
    }
  };

  const handleToggleSuspendClick = (user) => {
    if (user.status === 'Suspended') {
      handleUnsuspend(user);
    } else {
      setSuspendTargetUser(user);
      setSuspendDaysOption('7');
      setCustomDaysVal('');
    }
  };

  const handleUnsuspend = async (user) => {
    setFlashingRowId(user.id);
    setFlashType('green');
    setTimeout(async () => {
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: 'Active', suspendedUntil: null } : u)));
      try {
        const { error } = await supabase.from('profiles').update({ status: 'Active', suspended_until: null }).eq('id', user.id);
        if (error) throw error;
        
        logAction(t('logUnsuspend').replace('{email}', user.email));
        if (user.email) {
          await fetch('/api/send-notification-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              title: t('emailAccountActivatedTitle'),
              message: t('emailAccountActivatedMsg')
            })
          }).catch(console.error);
        }
      } catch (e) {
        alert((t('alertFailedSuspend') || 'Failed to activate user: ') + e.message);
        fetchUsers();
      }
      setFlashingRowId(null);
    }, 600);
  };

  const handleConfirmSuspend = async () => {
    if (!suspendTargetUser) return;
    
    let days = 0;
    if (suspendDaysOption === 'custom') {
      days = parseInt(customDaysVal, 10);
    } else {
      days = parseInt(suspendDaysOption, 10);
    }

    if (isNaN(days) || days < 0) days = 0;

    let suspendedUntil = null;
    let dateStr = '';
    if (days > 0) {
      const until = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
      suspendedUntil = until.toISOString();
      dateStr = until.toLocaleString('ms-MY', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    setUsers((prev) => prev.map((u) => (u.id === suspendTargetUser.id ? { ...u, status: 'Suspended', suspendedUntil } : u)));

    try {
      const { error } = await supabase.from('profiles').update({
        status: 'Suspended',
        suspended_until: suspendedUntil
      }).eq('id', suspendTargetUser.id);

      if (error) throw error;

      const logText = days > 0 
        ? t('logSuspendDays').replace('{email}', suspendTargetUser.email).replace('{days}', days).replace('{date}', dateStr)
        : t('logSuspendPermanent').replace('{email}', suspendTargetUser.email);

      logAction(logText);

      // Send email notification to the suspended user
      if (suspendTargetUser.email) {
        let msg = t('emailAccountSuspendedMsg1');
        if (days > 0) {
          msg += t('emailAccountSuspendedMsgDays').replace('{days}', days).replace('{date}', dateStr);
        } else {
          msg += t('emailAccountSuspendedMsgPermanent');
        }
        await fetch('/api/send-notification-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: suspendTargetUser.email,
            title: t('emailAccountSuspendedTitle'),
            message: msg
          })
        }).catch(console.error);
      }

      setFlashingRowId(suspendTargetUser.id);
      setFlashType('red');
      setSuspendTargetUser(null);
      setTimeout(() => setFlashingRowId(null), 600);
    } catch (e) {
      alert((t('alertFailedSuspend') || 'Failed to suspend user: ') + e.message);
      fetchUsers();
    }
  };

  const handleDeleteUser = async (userId) => {
    const userToDelete = users.find(u => u.id === userId);
    if (!window.confirm(t('confirmDeleteUser'))) return;
    setFlashingRowId(userId);
    setFlashType('red');
    setTimeout(async () => {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    try {
      const { error } = await supabase.rpc('delete_user_completely', { target_user_id: userId });
      
      if (error && error.message.includes('function delete_user_completely does not exist')) {
         const { error: profileError } = await supabase.from('profiles').delete().eq('id', userId);
         if (profileError) throw profileError;
      } else if (error) {
         throw error;
      }
      
      if (userToDelete) {
        logAction(t('logDeleteUser').replace('{email}', userToDelete.email));
      }
    } catch (e) {
      alert(t('alertFailedDelete') + e.message);
      fetchUsers();
    }
    setFlashingRowId(null);
    }, 600);
  };

  const filteredUsers = users.filter((u) => u.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const roles = ['Admin', 'User', 'Super Admin'];
  const roleCounts = roles.reduce((acc, role) => {
    acc[role] = users.filter(u => (u.role && u.role.toLowerCase() === role.toLowerCase())).length;
    return acc;
  }, { 'Admin': 0, 'User': 0, 'Super Admin': 0 });

  const canModifyUser = (targetUser) => {
    if (!currentUser) return false;
    if (currentUser.id === targetUser.id) return false;
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder={t('searchByName') || 'Search by name...'} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.75rem', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={() => {
              const doc = new jsPDF();
              doc.text("User List Report", 14, 15);
              autoTable(doc, {
                head: [['Name', 'Email', 'Role', 'Status']],
                body: filteredUsers.map(u => [u.name, u.email, u.role, u.status]),
                startY: 20
              });
              doc.save(`Users_Report_${new Date().toISOString().split('T')[0]}.pdf`);
            }}
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface)', color: 'var(--text-main)', border: '1px solid var(--border)', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
          >
            <FileDown size={16} /> Export (PDF)
          </button>
          <button 
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8," 
                + "Name,Email,Role,Status\n"
                + filteredUsers.map(u => `${u.name},${u.email},${u.role},${u.status}`).join('\n');
              
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `Users_Report_${new Date().toISOString().split('T')[0]}.csv`);
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
      
      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
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
              <tr 
                key={user.id} 
                className={flashingRowId === user.id ? (flashType === 'red' ? 'row-flash-red' : 'row-flash-green') : ''}
                style={{ 
                  borderBottom: index === users.length - 1 ? 'none' : '1px solid var(--border)',
                  animationDelay: `${index * 0.05}s`
                }}
              >
                <td style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-main)' }}>{user.name} {currentUser?.id === user.id && '(You)'}</td>
                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{user.email}</td>
                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-main)' }}>{user.role}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span style={badgeStyle(user.status)}>{user.status}</span>
                    {user.status === 'Suspended' && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {user.suspendedUntil ? (
                          `⏰ ${t('suspendedUntilDate') || 'Sehingga'} ${new Date(user.suspendedUntil).toLocaleDateString('ms-MY')}`
                        ) : (
                          `🔒 ${t('indefinite') || 'Kekal'}`
                        )}
                      </span>
                    )}
                  </div>
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
                  <button onClick={() => handleToggleSuspendClick(user)} disabled={!canEdit} style={{ background: 'none', border: 'none', color: user.status === 'Suspended' ? '#10B981' : '#F59E0B', cursor: canEdit ? 'pointer' : 'not-allowed' }} title={user.status === 'Suspended' ? (t('activate') || 'Activate') : (t('suspend') || 'Suspend')}>
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

      {/* Suspend Duration Modal */}
      {suspendTargetUser && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '450px',
            background: 'var(--surface)',
            borderRadius: '1rem',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserX size={20} color="#F59E0B" />
                {t('suspendModalTitle') || 'Gantung Akaun Pengguna'}
              </h3>
              <button onClick={() => setSuspendTargetUser(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Pengguna:</p>
                <p style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '1rem' }}>{suspendTargetUser.name} ({suspendTargetUser.email})</p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                  {t('suspendDurationLabel') || 'Pilih Tempoh Penggantungan'}
                </label>
                <select
                  value={suspendDaysOption}
                  onChange={(e) => setSuspendDaysOption(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem' }}
                >
                  <option value="1">{t('dayCount1') || '1 Hari'}</option>
                  <option value="3">{t('dayCount3') || '3 Hari'}</option>
                  <option value="7">{t('dayCount7') || '7 Hari'}</option>
                  <option value="14">{t('dayCount14') || '14 Hari'}</option>
                  <option value="30">{t('dayCount30') || '30 Hari'}</option>
                  <option value="custom">{t('customDays') || 'Hari Tersuai'}</option>
                  <option value="0">{t('indefinite') || 'Kekal (Tanpa Had)'}</option>
                </select>
              </div>

              {suspendDaysOption === 'custom' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                    {t('customDays') || 'Bilangan Hari'}:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    className="input-field"
                    placeholder="Contoh: 5"
                    value={customDaysVal}
                    onChange={(e) => setCustomDaysVal(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem' }}
                  />
                </div>
              )}

              {/* Date Preview Box */}
              <div style={{
                padding: '0.75rem 1rem',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '0.5rem',
                fontSize: '0.85rem',
                color: '#D97706',
                fontWeight: 500
              }}>
                {(() => {
                  let days = suspendDaysOption === 'custom' ? parseInt(customDaysVal, 10) : parseInt(suspendDaysOption, 10);
                  if (isNaN(days) || days <= 0) {
                    return t('suspendPreviewPermanent');
                  }
                  const until = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
                  const str = until.toLocaleString('ms-MY', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                  return t('suspendPreviewDays').replace('{date}', str);
                })()}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setSuspendTargetUser(null)}
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border)',
                    background: 'transparent',
                    color: 'var(--text-main)',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  {t('cancel') || 'Batal'}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSuspend}
                  className="btn-primary"
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: '0.5rem',
                    background: '#F59E0B',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {t('confirmSuspendBtn') || 'Gantung Akaun'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminReportsView = ({ currentUser }) => {
  const { t } = useContext(LanguageContext);
  const [reports, setReports] = useState([]);
  const [selectedProofImage, setSelectedProofImage] = useState(null);
  const [flashingRowId, setFlashingRowId] = useState(null);
  const [flashType, setFlashType] = useState(null);
  
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('user_reports')
        .select(`
          id, report_type, reason_text, image_url, status, created_at,
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
          type: r.report_type === 'Others' ? `Others (${r.reason_text})` : (r.reason_text ? `${r.report_type} (${r.reason_text})` : r.report_type),
          imageUrl: r.image_url,
          status: r.status || 'Pending'
        })));
      }
    } catch (e) {
      console.error('Error fetching reports:', e);
    }
  };

  const updateReportStatus = async (id, newStatus) => {
    setFlashingRowId(id);
    setFlashType(newStatus === 'Rejected' ? 'red' : 'green');
    setTimeout(async () => {
      try {
        const { error } = await supabase
          .from('user_reports')
          .update({ status: newStatus })
          .eq('id', id);
        if (error) throw error;
        
        const report = reports.find(r => r.id === id);
        if (report && currentUser?.email) {
          await supabase.from('audit_logs').insert({
            action: t('logReportStatus').replace('{email}', report.reportedEmail || id).replace('{status}', newStatus),
            user_email: currentUser.email
          });

          // Insert smart notification for the reporter
          if (report.reporter_id) {
            await supabase.from('notifications').insert({
              user_id: report.reporter_id,
              title: t('notifReportStatusTitle'),
              message: t('notifReportStatusMsg').replace('{name}', report.reportedName || report.itemName).replace('{status}', newStatus),
              type: 'report'
            });

            // Fetch reporter email
            const { data: reporterProfile } = await supabase.from('profiles').select('email').eq('id', report.reporter_id).single();
            if (reporterProfile?.email) {
              await fetch('/api/send-notification-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: reporterProfile.email,
                  title: t('emailReportStatusTitle'),
                  message: t('emailReportStatusMsg').replace('{name}', report.reportedName || report.itemName).replace('{status}', newStatus)
                })
              }).catch(console.error);
            }
          }
        }
        
        fetchReports();
      } catch (e) {
        alert(t('alertFailedUpdateStatus') + e.message);
      }
      setFlashingRowId(null);
    }, 600);
  };

  return (
    <div className="page-bg-common bg-admin-reports">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>{t('reportManagementTitle') || 'Report Management'}</h2>
        <p style={{ color: 'var(--text-muted)' }}>{t('reportManagementDesc') || 'Approve, reject, or resolve user reports.'}</p>
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.02)' }}>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('reportDetails') || 'Report Details'}</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('reportType') || 'Report Type'}</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('photo') || 'Proof / Screenshot'}</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('status') || 'Status'}</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'right' }}>{t('actions') || 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
               <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>{t('noReportsFound') || 'No reports found.'}</td></tr>
            ) : reports.map((report, index) => (
              <tr 
                key={report.id} 
                className={flashingRowId === report.id ? (flashType === 'red' ? 'row-flash-red' : 'row-flash-green') : ''}
                style={{ 
                  borderBottom: index === reports.length - 1 ? 'none' : '1px solid var(--border)',
                  animationDelay: `${index * 0.05}s`
                }}
              >
                <td style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-main)' }}>{report.itemName}</td>
                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{report.type}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  {report.imageUrl ? (
                    <button 
                      onClick={() => setSelectedProofImage(report.imageUrl)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.35rem 0.65rem',
                        borderRadius: '0.375rem',
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: 'var(--primary)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <ImageIcon size={14} /> {t('viewProof') || 'Lihat Bukti'}
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      {t('noProofProvided') || 'Tiada tangkapan skrin'}
                    </span>
                  )}
                </td>
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

      {/* Proof Lightbox Modal */}
      {selectedProofImage && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(5px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }} onClick={() => setSelectedProofImage(null)}>
          <div className="glass-panel" style={{
            position: 'relative',
            maxWidth: '800px',
            maxHeight: '90vh',
            width: '100%',
            background: 'var(--surface)',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ImageIcon size={18} color="var(--primary)" />
                {t('proofModalTitle') || 'Bukti Tangkapan Skrin Laporan'}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <a 
                  href={selectedProofImage} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}
                >
                  <ExternalLink size={14} /> Open full size
                </a>
                <button 
                  onClick={() => setSelectedProofImage(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000', borderRadius: '0.5rem', padding: '0.5rem' }}>
              <img 
                src={selectedProofImage} 
                alt="Proof screenshot" 
                style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
