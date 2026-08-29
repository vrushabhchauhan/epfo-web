import re

with open('src/pages/NewClaimPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = re.compile(r'  function handleSubmit\(e\) \{.*?\n  \}', re.DOTALL)
new_func = '''  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    
    const newClaimId = CLM
    const claimRecord = {
      claim_id: newClaimId,
      uan: member.uan,
      form_number: 'Form 31',
      claim_type: advancePurpose === 'medical' ? 'Medical Advance' : advancePurpose === 'housing' ? 'Housing Advance' : advancePurpose === 'education' ? 'Education Advance' : 'Marriage Advance',
      amount_requested: numAmount,
      filed_date: new Date().toISOString().split('T')[0],
      status: 'in_progress',
      current_stage: 1,
    }
    
    await insertCloudClaim(claimRecord)
    
    setIsSubmitting(false)
    setSubmittedClaim({
      id: newClaimId,
      amount: numAmount,
      form: 'Form 31',
      disbursementDate: 'Estimated within 3 business days',
    })
  }'''

content = pattern.sub(new_func, content)
with open('src/pages/NewClaimPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched successfully")
