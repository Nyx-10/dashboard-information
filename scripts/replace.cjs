const fs = require('fs');

let content = fs.readFileSync('src/pages/AdminManagement.jsx', 'utf8');

const startStr = `            <button \n              onClick={() => {\n                const doc = new jsPDF();`;
const endStr = `<Download size={16} /> Export (CSV)\n            </button>`;

if (content.includes(startStr) && content.includes(endStr)) {
  const startIdx = content.indexOf(startStr);
  const endIdx = content.indexOf(endStr) + endStr.length;
  
  const before = content.substring(0, startIdx);
  const target = content.substring(startIdx, endIdx);
  const after = content.substring(endIdx);
  
  const newTarget = `            {isSuperAdmin && (\n              <>\n` + target + `\n              </>\n            )}`;
  
  fs.writeFileSync('src/pages/AdminManagement.jsx', before + newTarget + after, 'utf8');
  console.log('Successfully restricted Export buttons in AdminManagement.jsx');
} else {
  console.log('Failed to find start or end strings in AdminManagement.jsx');
}
