import io
with io.open(r'src/pages/TransfersPage.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    'const [transferList, setTransferList] = useState(() => (isFresh ? [] : defaultTransfers))',
    'const [transferList, setTransferList] = useState(() => (isFresh ? [] : defaultTransfers.map(t => ({ ...t, fromEstablishment: t.fromEstablishment || t.fromEmployer, toEstablishment: t.toEstablishment || t.toEmployer, estimatedAmount: t.estimatedAmount || t.amountEstimated }))))'
)

text = text.replace(
    'const currentTransfer = transferList[0] || (isFresh ? null : defaultTransfers[0])',
    'const currentTransfer = transferList[0] || null'
)

text = text.replace(
    '<section className="transfer-pipeline-card" aria-labelledby="active-transfer-title">',
    '{currentTransfer && (<section className="transfer-pipeline-card" aria-labelledby="active-transfer-title">'
)

text = text.replace(
    '        </div>\n      </section>\n\n      {/* Historical Transfer Records */}',
    '        </div>\n      </section>\n      )}\n\n      {/* Historical Transfer Records */}'
)

text = text.replace(
    '{currentTransfer.fromEmployer}',
    '{currentTransfer.fromEstablishment}'
)

text = text.replace(
    '{currentTransfer.toEmployer}',
    '{currentTransfer.toEstablishment}'
)

text = text.replace(
    '''            <tbody>\n              <tr>\n                <td className="number font-semibold">TRF-4821</td>''',
    '''            <tbody>\n              {transferList.map(t => (\n                <tr key={t.id}>\n                  <td className="number font-semibold">{t.id}</td>\n                  <td>{t.fromEstablishment}</td>\n                  <td>{t.toEstablishment}</td>\n                  <td className="number">?{t.estimatedAmount?.toLocaleString("en-IN") || "0"}</td>\n                  <td>\n                    {t.status === "completed" ? (\n                      <span className="badge-cleared">? Completed</span>\n                    ) : (\n                      <span style={{ color: "#d97706", fontWeight: 500, textTransform: "capitalize" }}>{t.status?.replace("_", " ")}</span>\n                    )}\n                  </td>\n                </tr>\n              ))}\n              <tr>\n                <td className="number font-semibold">TRF-4821</td>'''
)

with io.open(r'src/pages/TransfersPage.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('Done!')
