import re

with open('src/pages/NewClaimPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_func = '''  function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(async () => {
      setIsSubmitting(false)
      const newClaimId = CLM\
      setSubmittedClaim({
        id: newClaimId,
        amount: numAmount,
        form: 'Form 31',
        disbursementDate: 'Estimated within 3 business days',
      })
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
    }, 800)
  }'''

new_func = '''  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    
    const newClaimId = CLM\
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

if old_func in content:
    content = content.replace(old_func, new_func)
    with open('src/pages/NewClaimPage.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched successfully")
else:
    print("Could not find the function to replace. Let me try regex.")
    
