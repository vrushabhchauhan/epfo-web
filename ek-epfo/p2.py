import io
with io.open(r'src/pages/TransfersPage.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    '?{t.estimatedAmount?.toLocaleString("en-IN") || "0"}',
    '\u20b9{t.estimatedAmount?.toLocaleString("en-IN") || "0"}'
)

text = text.replace(
    '<span className="badge-cleared">? Completed</span>',
    '<span className="badge-cleared">\u2713 Completed</span>'
)

with io.open(r'src/pages/TransfersPage.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('Fixed unicode!')
