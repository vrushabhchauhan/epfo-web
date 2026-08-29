import re

with open('src/context/SessionContext.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(
    r'  function login\(identifier, customProfile = \{\}\) \{[\s\S]*?name: customProfile\.name \|\| \(isEmail \? identifier\.split\(\'@\'\)\[0\] : \'Member\'\),\n      \}\)\n    \}',
    """  async function login(identifier, customProfile = {}) {
    const existing = findMemberByIdentifier(identifier)
    let memberData
    if (existing) {
      memberData = { ...existing, ...customProfile, loginTime: new Date().toLocaleTimeString() }
    } else {
      const isEmail = identifier && identifier.includes('@')
      let finalUan = identifier
      if (isEmail) {
        finalUan = customProfile.uan || await generateUniqueUan()
      }
      memberData = registerMemberAccount({
        ...customProfile,
        uan: finalUan,
        email: isEmail ? identifier : (customProfile.email || `${identifier}@member.epfo.gov.in`),
        name: customProfile.name || (isEmail ? identifier.split('@')[0] : 'Member'),
      })
    }""",
    content
)

with open('src/context/SessionContext.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
