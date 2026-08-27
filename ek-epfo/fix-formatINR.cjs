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

  // Match until the first closing brace after the function declaration
  content = content.replace(/function formatINR\([^)]*\)\s*\{[^}]+\}/, newFormatINR);
  
  // also add isLoading if not added correctly, I saw setIsLoading(true) but missing state in DashboardPage!
  if (!content.includes('const [isLoading, setIsLoading] = useState')) {
      content = content.replace(/(const \[claimsList, setClaimsList\] = useState\([^)]*\)\n)/, '$1  const [isLoading, setIsLoading] = useState(false)\n');
      content = content.replace(/(const \[grievances, setGrievances\] = useState\([^)]*\)\n)/, '$1  const [isLoading, setIsLoading] = useState(false)\n');
      content = content.replace(/(const \[transfers, setTransfers\] = useState\([^)]*\)\n)/, '$1  const [isLoading, setIsLoading] = useState(false)\n');
      content = content.replace(/(const \[nominees, setNominees\] = useState\([^)]*\)\n)/, '$1  const [isLoading, setIsLoading] = useState(false)\n');
  }

  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Processed targets formatINR');
