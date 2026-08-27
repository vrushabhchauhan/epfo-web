const fs = require('fs');
const path = require('path');

const srcDir = 'C:/Users/Vrushabh/Downloads/EPFO Web/ek-epfo/src';
const targetFiles = [
  'components/AppShell.jsx',
  'pages/DashboardPage.jsx',
  'pages/PassbookPage.jsx',
  'pages/ClaimsPage.jsx',
  'pages/ClaimDetailPage.jsx',
  'pages/ClaimFixPage.jsx',
  'pages/NewClaimPage.jsx',
  'pages/TransfersPage.jsx',
  'pages/GrievancePage.jsx',
  'pages/GrievanceDetailPage.jsx',
  'pages/ProfilePage.jsx',
  'pages/NomineePage.jsx',
  'pages/KycCorrectionPage.jsx'
];

const newFormatINR = `function formatINR(val) {
  if (val === undefined || val === null) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(val).replace(/\\u20B9\\s*/, '\\u20B9\\u00A0');
}`;

for (const relPath of targetFiles) {
  const filePath = path.join(srcDir, relPath);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // Find the start of function formatINR(val) {
  const idx = content.indexOf('function formatINR(val) {');
  if (idx !== -1) {
    // find the end of the function. We know it ends with "\n}\n" or "\n}\n\n"
    // Let's just do a string replace since we know the exact corrupted string
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
    
    // Also the original format was:
    let origFormat = `function formatINR(val) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val)
}`;
    
    let origFormat2 = `function formatINR(val) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(val)
}`;

    let origFormat3 = `function formatINR(val) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)
}`;

    // fallback regex replacement that handles matching open/close braces
    if (content.includes(brokenFormat1)) {
        content = content.replace(brokenFormat1, newFormatINR);
    } else if (content.includes(brokenFormat2)) {
        content = content.replace(brokenFormat2, newFormatINR);
    } else {
        // generic replace using regex
        content = content.replace(/function formatINR\([^)]*\)\s*\{[\s\S]*?\}\)\.format\(val\)\s*\n\}/, newFormatINR);
        content = content.replace(/function formatINR\([^)]*\)\s*\{[\s\S]*?\}\)\.format\(val\)\s*\n\}\s*\n/, newFormatINR + '\n\n');
        
        content = content.replace(origFormat, newFormatINR);
        content = content.replace(origFormat2, newFormatINR);
        content = content.replace(origFormat3, newFormatINR);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Fixed syntax error');
