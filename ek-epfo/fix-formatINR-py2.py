import os
import re

src_dir = r"C:\Users\Vrushabh\Downloads\EPFO Web\ek-epfo\src"
target_files = [
    r"pages\ClaimsPage.jsx",
    r"pages\NewClaimPage.jsx",
    r"pages\PassbookPage.jsx",
    r"pages\DashboardPage.jsx",
    r"pages\ClaimDetailPage.jsx",
    r"pages\ClaimFixPage.jsx",
    r"pages\TransfersPage.jsx",
    r"pages\GrievancePage.jsx",
    r"pages\GrievanceDetailPage.jsx",
    r"pages\ProfilePage.jsx",
    r"pages\NomineePage.jsx",
    r"pages\KycCorrectionPage.jsx",
    r"components\AppShell.jsx"
]

correct_func = r"""function formatINR(val) {
  if (val === undefined || val === null) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(val).replace(/\u20B9\s*/, '\u20B9\u00A0');
}"""

for rel in target_files:
    p = os.path.join(src_dir, rel)
    if not os.path.exists(p):
        continue
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()

    # Use a generic extraction for `function formatINR(val) { ... }` block
    # It stops at the start of `function <NextFunc>` or EOF
    match = re.search(r'(function formatINR\(val\)\s*\{)(.*?)\n(function |$)', content, flags=re.DOTALL)
    if match:
        full_block = match.group(1) + match.group(2)
        content = content.replace(full_block, correct_func)
    
    with open(p, 'w', encoding='utf-8') as f:
        f.write(content)

print("done")
