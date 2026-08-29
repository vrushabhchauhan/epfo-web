import re

file_path = r'c:\Users\Vrushabh\Downloads\EPFO Web\ek-epfo\src\pages\death-claim\DeathClaimStep4Page.jsx'

with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Replace using regex because the file now has ****; and ********;
content = re.sub(r"if \(clean\.length <= 4\) return \*\*\*\*;?", "if (clean.length <= 4) return `****${clean}`;", content)
content = re.sub(r"return \*\*\*\*\*\*\*\*;?", "return `********${last4}`;", content)

content = re.sub(r"claim_id: CLM-DEATH-,", "claim_id: `CLM-DEATH-${Date.now()}`,", content)
content = re.sub(r"rejection_summary: Beneficiary Claim Filed: ,", "rejection_summary: `Beneficiary Claim Filed: ${wizardData.relationship || 'Spouse'}`,", content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
