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

  if (content.includes('function formatINR')) {
    content = content.replace(/function formatINR\([^)]*\)\s*\{[\s\S]*?\}\n/, newFormatINR + '\n');
  }

  const rupee = '\u20B9';
  const re1 = new RegExp(rupee + '\\{([^}]+)\\.toLocaleString\\(\\\'en-IN\\\'\\)\\}', 'g');
  const re2 = new RegExp(rupee + '\\{([^}]+)\\.toLocaleString\\(\\)\\}', 'g');
  
  content = content.replace(re1, '{formatINR($1)}');
  content = content.replace(re2, '{formatINR($1)}');

  if (relPath === 'pages/PassbookPage.jsx' || relPath === 'pages/ClaimDetailPage.jsx') {
    if (!content.includes('@media print')) {
      const style = '\n      <style>{`@media print { .app-sidebar, header, .no-print, button, a.action-link, .passbook-export-btn { display: none !important; } .app-main { margin: 0 !important; padding: 0 !important; width: 100% !important; } .page-passbook, .page-claim-detail { background: white !important; } }`}</style>\n';
      content = content.replace(/(return \(\s*<div[^>]*>)/, '$1' + style);
    }
  }

  content = content.replace(/<button([^>]*)title="([^"]+)"([^>]*)>/g, (match, p1, p2, p3) => {
    if (match.includes('aria-label')) return match;
    return `<button aria-label="${p2}"${p1}title="${p2}"${p3}>`;
  });
  if (relPath === 'pages/PassbookPage.jsx') {
    content = content.replace(/<button type="button" className="passbook-export-btn"/, '<button type="button" aria-label="Download Statement PDF" className="passbook-export-btn"');
  }
  if (relPath === 'pages/ClaimDetailPage.jsx') {
    content = content.replace(/<button type="button" className="claim-export-btn"/, '<button type="button" aria-label="Download Claim PDF" className="claim-export-btn"');
  }

  if (['pages/DashboardPage.jsx', 'pages/ClaimsPage.jsx', 'pages/GrievancePage.jsx', 'pages/NomineePage.jsx', 'pages/TransfersPage.jsx'].includes(relPath)) {
    if (!content.includes('const [isLoading, setIsLoading] = useState')) {
      content = content.replace(/(const \[([^\]]+)\] = useState\([^)]*\)\n)/, '$1  const [isLoading, setIsLoading] = useState(true)\n');
      
      content = content.replace(/async function load[A-Za-z]+\(\) \{/, '$&\n      setIsLoading(true)');
      content = content.replace(/const cloudData = await [^\n]+\n/, '$&\n        setIsLoading(false)\n');
      content = content.replace(/const cloudList = await [^\n]+\n/, '$&\n        setIsLoading(false)\n');
      content = content.replace(/const list = await [^\n]+\n/, '$&\n        setIsLoading(false)\n');
      
      const skeleton = `
        {isLoading && (
          <div className="skeleton-shimmer" style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', marginBottom: '1rem' }}>
            <div style={{ height: '20px', background: '#e2e8f0', borderRadius: '4px', width: '30%', marginBottom: '1rem', animation: 'pulse 1.5s infinite' }}></div>
            <div style={{ height: '40px', background: '#e2e8f0', borderRadius: '4px', width: '100%', marginBottom: '0.5rem', animation: 'pulse 1.5s infinite' }}></div>
            <div style={{ height: '40px', background: '#e2e8f0', borderRadius: '4px', width: '100%', animation: 'pulse 1.5s infinite' }}></div>
            <style>{'\\\\@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }'}</style>
          </div>
        )}
      `;
      content = content.replace(/<div className="([a-zA-Z0-9-]+-list|claims-feed|grievance-feed)">/, '$&\n' + skeleton);
      if (relPath === 'pages/DashboardPage.jsx') {
        content = content.replace(/<div className="claims-feed">/, '$&\n' + skeleton);
      }
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Processed targets');
