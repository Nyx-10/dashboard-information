const fs = require('fs');

let content = fs.readFileSync('src/pages/AdminManagement.jsx', 'utf8');

const replacements = [
  { from: />User Management<\/h2>/g, to: ">{t('userManagementTitle') || 'User Management'}</h2>" },
  { from: />Manage registered users and their roles\.<\/p>/g, to: ">{t('userManagementDesc') || 'Manage registered users and their roles.'}</p>" },
  { from: />Total /g, to: ">{t('total') || 'Total'} " },
  { from: /placeholder=\"Search by name\.\.\.\"/g, to: "placeholder={t('searchByName') || 'Search by name...'}" },
  { from: />Name<\/th>/g, to: ">{t('nameLabel') || 'Name'}</th>" },
  { from: />Email<\/th>/g, to: ">{t('email') || 'Email'}</th>" },
  { from: />Role<\/th>/g, to: ">{t('roleLabel') || 'Role'}</th>" },
  { from: />Status<\/th>/g, to: ">{t('status') || 'Status'}</th>" },
  { from: />Actions<\/th>/g, to: ">{t('actions') || 'Actions'}</th>" },
  { from: />No users found\.<\/td>/g, to: ">{t('noUsersFound') || 'No users found.'}</td>" },
  { from: /title=\"Change Role\"/g, to: "title={t('changeRole') || 'Change Role'}" },
  { from: /title=\{user\.status === 'Suspended' \? 'Activate' : 'Suspend'\}/g, to: "title={user.status === 'Suspended' ? (t('activate') || 'Activate') : (t('suspend') || 'Suspend')}" },
  { from: /title=\"Delete\"/g, to: "title={t('deleteBtn') || 'Delete'}" },
  { from: />Report Management<\/h2>/g, to: ">{t('reportManagementTitle') || 'Report Management'}</h2>" },
  { from: />Approve, reject, or resolve user reports\.<\/p>/g, to: ">{t('reportManagementDesc') || 'Approve, reject, or resolve user reports.'}</p>" },
  { from: />Report Details<\/th>/g, to: ">{t('reportDetails') || 'Report Details'}</th>" },
  { from: />Report Type<\/th>/g, to: ">{t('reportType') || 'Report Type'}</th>" },
  { from: />No reports found\.<\/td>/g, to: ">{t('noReportsFound') || 'No reports found.'}</td>" },
  { from: /title=\"Approve\"/g, to: "title={t('approve') || 'Approve'}" },
  { from: /title=\"Reject\"/g, to: "title={t('reject') || 'Reject'}" },
  { from: /title=\"Resolve\"/g, to: "title={t('resolve') || 'Resolve'}" },
  { from: />View Image<\/a>/g, to: ">{t('viewImage') || 'View Image'}</a>" },
  { from: />Pending<\/span>/g, to: ">{t('pending') || 'Pending'}</span>" },
  { from: />Approved<\/span>/g, to: ">{t('approved') || 'Approved'}</span>" },
  { from: />Rejected<\/span>/g, to: ">{t('rejected') || 'Rejected'}</span>" },
  { from: />Resolved<\/span>/g, to: ">{t('resolved') || 'Resolved'}</span>" },
];

replacements.forEach(({from, to}) => {
  content = content.replace(from, to);
});

fs.writeFileSync('src/pages/AdminManagement.jsx', content);
