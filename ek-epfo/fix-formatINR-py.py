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

correct_func = """function formatINR(val) {
  if (val === undefined || val === null) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(val).replace(/\\u20B9\\s*/, '\\u20B9\\u00A0');
}"""

for rel in target_files:
    p = os.path.join(src_dir, rel)
    if not os.path.exists(p):
        continue
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()

    # Match `function formatINR(val) { ... }` where it got corrupted
    # The corruption is extra lines like `}).format(val)` etc.
    # We will search for `function formatINR` and find its end by just looking for the next `function ` or end of imports.
    # Actually, we can use a simpler regex:
    content = re.sub(r'function formatINR\(val\) \{.*?\n\}\)?\.format\(val\).*?\n\}', correct_func, content, flags=re.DOTALL)
    
    # Another corruption type:
    content = re.sub(r'function formatINR\(val\) \{.*?\n\}\n', correct_func + '\n', content, count=1, flags=re.DOTALL)
    
    with open(p, 'w', encoding='utf-8') as f:
        f.write(content)

print("done")
