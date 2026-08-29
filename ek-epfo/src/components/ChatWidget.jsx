import React, { useMemo, useState } from 'react'
import { useSession } from '../context/useSession.js'
import { getAssistantReply } from '../lib/chatAssistant.js'
import { createSupportTicket } from '../lib/supabaseClient.js'
import './ChatWidget.css'

const starterMessages = [
  {
    role: 'assistant',
    text: 'I can explain EPFO services and guide you to the right form or page. Ask about UAN activation, claim steps, grievances, transfers, or pension basics.',
  },
]

function ChatWidget() {
  const { isAuthenticated, member } = useSession()
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
    const replyText = typeof reply === 'object' ? reply.text : reply
    const replyOptions = typeof reply === 'object' ? reply.options : undefined
    const assistantMessage = { role: 'assistant', text: replyText, options: replyOptions }

    setMessages((current) => [...current, userMessage, assistantMessage])
    setInput('')
  }

  const handleOptionClick = async (option) => {
    const userMessage = { role: 'user', text: option }
    
    if (option === 'Escalate Issue') {
      const assistantMessage = { role: 'assistant', text: 'Escalating to field office...' }
      setMessages((current) => [...current, userMessage, assistantMessage])
      try {
        await createSupportTicket(member?.uan || null, 'grievance_escalation')
      } catch (err) {
        console.error('Failed to escalate grievance:', err)
      }
    } else {
      const reply = getAssistantReply(option, { isAuthenticated })
      const replyText = typeof reply === 'object' ? reply.text : reply
      const replyOptions = typeof reply === 'object' ? reply.options : undefined
      const assistantMessage = { role: 'assistant', text: replyText, options: replyOptions }
      setMessages((current) => [...current, userMessage, assistantMessage])
    }
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
              <React.Fragment key={`${message.role}-${index}`}>
                <div className={`chat-bubble chat-bubble--${message.role}`}>
                  {message.text}
                </div>
                {message.options && message.options.length > 0 && (
                  <div className="chat-options">
                    {message.options.map((opt, i) => (
                      <button 
                        key={i} 
                        type="button"
                        className="chat-option-btn" 
                        onClick={() => handleOptionClick(opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </React.Fragment>
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
