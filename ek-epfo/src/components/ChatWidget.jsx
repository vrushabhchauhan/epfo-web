import React, { useMemo, useState } from 'react'
import { useSession } from '../context/useSession.js'
import { getAssistantReply } from '../lib/chatAssistant.js'
import './ChatWidget.css'

const starterMessages = [
  {
    role: 'assistant',
    text: 'I can explain EPFO services and guide you to the right form or page. Ask about UAN activation, claim steps, grievances, transfers, or pension basics.',
  },
]

function ChatWidget() {
  const { isAuthenticated } = useSession()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(starterMessages)

  const headerLabel = useMemo(
    () => (isAuthenticated ? 'Member Help Desk' : 'Public Service Help'),
    [isAuthenticated],
  )

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return

    const userMessage = { role: 'user', text: trimmed }
    const reply = getAssistantReply(trimmed, { isAuthenticated })
    const assistantMessage = { role: 'assistant', text: reply }

    setMessages((current) => [...current, userMessage, assistantMessage])
    setInput('')
  }

  return (
    <div className="chat-widget">
      <button
        type="button"
        className="chat-widget__toggle"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? 'Close EPFO assistant' : 'Open EPFO assistant'}
      >
        <span className="chat-widget__icon" aria-hidden="true">💬</span>
        <span>{open ? 'Close Help' : 'EPFO Help'}</span>
      </button>

      {open && (
        <div className="chat-widget__panel" role="dialog" aria-label="EPFO assistant">
          <div className="chat-widget__header">
            <div>
              <strong>{headerLabel}</strong>
              <small>Official guidance only</small>
            </div>
            <button type="button" className="chat-widget__close" onClick={() => setOpen(false)} aria-label="Close chat">
              ×
            </button>
          </div>

          <div className="chat-widget__messages" aria-live="polite">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`chat-bubble chat-bubble--${message.role}`}>
                {message.text}
              </div>
            ))}
          </div>

          <form className="chat-widget__form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="epfo-chat-input">Ask a question</label>
            <input
              id="epfo-chat-input"
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about UAN, claims, pension, or grievance steps"
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  )
}

export default ChatWidget
