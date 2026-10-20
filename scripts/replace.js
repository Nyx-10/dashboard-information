import fs from 'fs';

let content = fs.readFileSync('src/pages/AdminManagement.jsx', 'utf8');

const regex = /(<button\s+onClick=\{\(\) => \{\s+const doc = new jsPDF\(\);[\s\S]*?<Download size=\{16\} \/> Export \(CSV\)\s+<\/button>)/;

if (regex.test(content)) {
  content = content.replace(regex, "{isSuperAdmin && (\n              <>\n$1\n              </>\n            )}");
  fs.writeFileSync('src/pages/AdminManagement.jsx', content, 'utf8');
  console.log('Successfully restricted Export buttons in AdminManagement.jsx');
} else {
  console.log('Regex did not match.');
}
