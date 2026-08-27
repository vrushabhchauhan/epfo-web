import io
with io.open('src/pages/LoginVerifyPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('<span className="timer-text">', '<span className="timer-text" aria-live="polite">')
content = content.replace('autoFocus={idx === 0}', 'autoFocus={idx === 0}\n                aria-label={`Digit ${idx + 1} of 6`}\n                onPaste={handleOtpPaste}')

with io.open('src/pages/LoginVerifyPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
