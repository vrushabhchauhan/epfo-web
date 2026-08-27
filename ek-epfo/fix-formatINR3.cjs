const fs = require('fs');
const path = require('path');

const srcDir = 'C:/Users/Vrushabh/Downloads/EPFO Web/ek-epfo/src';
const targetFiles = [
  'pages/ClaimsPage.jsx',
  'pages/NewClaimPage.jsx',
  'pages/PassbookPage.jsx'
];

for (const relPath of targetFiles) {
  const filePath = path.join(srcDir, relPath);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');

  let brokenFormat1 = `function formatINR(val) {
  if (val === undefined || val === null) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(val).replace(/\\u20B9\\s*/, '\\u20B9\\u00A0');
}).format(val)
}`;
  let brokenFormat2 = brokenFormat1.replace(/\\u20B9/g, '\u20B9');

  const newFormatINR = `function formatINR(val) {
  if (val === undefined || val === null) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(val).replace(/\\u20B9\\s*/, '\\u20B9\\u00A0');
}`;
  
  let brokenFormat3 = `}).format(val).replace(/\\u20B9\\s*/, '\\u20B9\\u00A0');
}).format(val)
}`;

  content = content.replace(brokenFormat1, newFormatINR);
  content = content.replace(brokenFormat2, newFormatINR);
  content = content.replace(brokenFormat3, `}).format(val).replace(/\\u20B9\\s*/, '\\u20B9\\u00A0');\n}`);

  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Fixed syntax error in other files');
