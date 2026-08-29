import test from 'node:test'
import assert from 'node:assert/strict'

import { getAssistantReply } from './chatAssistant.js'

test('answers UAN activation in a government-safe way', () => {
  const reply = getAssistantReply('How do I activate my UAN?', { isAuthenticated: false })
  assert.match(reply, /UAN/i)
  assert.match(reply, /activate|activation/i)
})

test('refuses to reveal personal PF data or claim details', () => {
  const reply = getAssistantReply('What is my current PF balance?', { isAuthenticated: true })
  assert.match(reply, /balance|claim status|personal/i)
  assert.match(reply, /not able to|can not|cannot|private|secure/i)
})

test('offers safe fallback for unsupported requests', () => {
  const reply = getAssistantReply('Can you tell me my pending claim details?', { isAuthenticated: true })
  assert.match(reply, /claim status|Form 19|Form 31|visit|portal|available/i)
})
