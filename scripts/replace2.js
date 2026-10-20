import fs from 'fs';

let content = fs.readFileSync('src/pages/AdminAnalyticsLogs.jsx', 'utf8');

// 1. Restrict Export buttons in AdminAnalyticsView
const regexAnalytics = /(<button\s+onClick=\{\(\) => \{\s+const doc = new jsPDF\(\);[\s\S]*?<Download size=\{16\} \/> Export \(CSV\)\s+<\/button>)/;
if (regexAnalytics.test(content)) {
  content = content.replace(regexAnalytics, "{isSuperAdmin && (\n              <>\n$1\n              </>\n            )}");
  console.log('Successfully restricted Export buttons in AdminAnalyticsView');
} else {
  console.log('Regex Analytics did not match.');
}

// 2. Change signature of AdminAuditLogsView to accept currentUser and compute isSuperAdmin
content = content.replace("export const AdminAuditLogsView = () => {", 
`export const AdminAuditLogsView = ({ currentUser }) => {
  const normalizedRole = currentUser?.role ? currentUser.role.toLowerCase().replace(/\\s+/g, '') : '';
  const isSuperAdmin = Boolean(
    normalizedRole === 'superadmin' ||
    (currentUser?.email && currentUser.email.toLowerCase().includes('adam.darwish.it'))
  );
`);

// 3. Restrict Export Logs button in AdminAuditLogsView and Add Purge button
const exportLogsRegex = /(<button className="btn-primary" onClick=\{\(\) => \{[\s\S]*?\}\}>\{t\('exportLogs'\)\}<\/button>)/;
if (exportLogsRegex.test(content)) {
  const replacement = `{isSuperAdmin && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            $1
            <button className="btn-primary" style={{ background: '#EF4444', borderColor: '#EF4444' }} onClick={async () => {
              if (window.confirm(t('confirmPurgeLogs') || 'Are you sure you want to permanently delete logs older than 30 days?')) {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                const { error } = await supabase.from('audit_logs').delete().lt('created_at', thirtyDaysAgo.toISOString());
                if (error) alert('Error purging logs: ' + error.message);
                else {
                  alert(t('purgeSuccess') || 'Old logs deleted successfully.');
                  fetchLogs();
                }
              }
            }}>{t('purgeOldLogs') || 'Purge Old Logs'}</button>
          </div>
        )}`;
  content = content.replace(exportLogsRegex, replacement);
  console.log('Successfully restricted Export Logs and added Purge button in AdminAuditLogsView');
} else {
  console.log('Export Logs Regex did not match.');
}

fs.writeFileSync('src/pages/AdminAnalyticsLogs.jsx', content, 'utf8');
