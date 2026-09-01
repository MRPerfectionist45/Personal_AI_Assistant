import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Bot, User, WifiOff, Loader2 } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

interface Props {
  isOpen: boolean
  onClose: () => void
  backendStatus: 'online' | 'offline' | 'checking'
}

function FormattedMessage({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        const trimmed = line.trim()
        if (!trimmed) return <div key={i} className="h-1" />
        if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="text-accent-blue mt-0.5">•</span>
              <span>{trimmed.replace(/^[•-]\s*/, '')}</span>
            </div>
          )
        }
        if (/^\d+\./.test(trimmed)) {
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="text-accent-blue font-semibold min-w-[1.2em]">{trimmed.match(/^\d+/)?.[0]}.</span>
              <span>{trimmed.replace(/^\d+\.\s*/, '')}</span>
            </div>
          )
        }
        return <p key={i} className="leading-relaxed">{trimmed}</p>
      })}
    </div>
  )
}

export default function ChatPanel({ isOpen, onClose, backendStatus }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && topRef.current) {
      setTimeout(() => {
        topRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' })
      }, 50)
    }
  }, [isOpen])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: messages.slice(-10).map(m => ({ role: m.role, content: m.content }))
        })
      })
      const data = await res.json()
      const responseText = data.response || 'No response received.'

      setMessages(prev => [...prev, { role: 'assistant', content: '', isStreaming: true }])

      const words = responseText.split(/(\s+)/)
      let idx = 0
      const streamInterval = setInterval(() => {
        if (idx >= words.length) {
          clearInterval(streamInterval)
          setMessages(prev => {
            const last = prev[prev.length - 1]
            if (last && last.role === 'assistant') {
              return [...prev.slice(0, -1), { role: 'assistant', content: responseText, isStreaming: false }]
            }
            return prev
          })
          setIsLoading(false)
          return
        }
        const partial = words.slice(0, idx + 1).join('')
        setMessages(prev => {
          const last = prev[prev.length - 1]
          if (last && last.role === 'assistant') {
            return [...prev.slice(0, -1), { role: 'assistant', content: partial, isStreaming: true }]
          }
          return prev
        })
        idx++
      }, 25)

    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: backendStatus === 'offline'
          ? 'AI assistant is currently offline. Please check back later or browse my portfolio above.'
          : 'Connection error. Please make sure the backend is running.',
        isStreaming: false
      }])
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute inset-0 z-50 bg-white/95 dark:bg-dark-bg/95 backdrop-blur-xl flex flex-col"
        >
          <div ref={topRef} />

          <div className="flex items-center justify-between px-5 pt-10 pb-4 border-b border-light-border/50 dark:border-dark-border/50 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-blue to-purple-500 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-light-text dark:text-dark-text">Deepak's AI Assistant</h3>
                <div className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${backendStatus === 'online' ? 'bg-green-500' : backendStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-400'}`} />
                  <span className="text-[10px] text-light-muted dark:text-dark-muted capitalize">{backendStatus}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button onClick={clearChat} className="px-2.5 py-1 text-[11px] text-light-muted dark:text-dark-muted hover:text-red-500 transition-colors">
                  Clear
                </button>
              )}
              <button onClick={onClose} className="p-2 rounded-full hover:bg-light-bg dark:hover:bg-dark-surface transition-colors">
                <X size={18} className="text-light-text dark:text-dark-text" />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin min-h-0">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-light-muted/60 dark:text-dark-muted/60 space-y-3">
                <Bot size={40} className="opacity-30" />
                <p className="text-sm text-center">Ask me anything about<br />Deepak's skills, projects, or experience!</p>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {['Tell me about your RAG project', 'What are your top skills?', 'Are you open to internships?', 'What books have you read?', 'How do I contact you?'].map(q => (
                    <button
                      key={q}
                      onClick={() => { setInput(q); }}
                      className="px-3 py-1.5 bg-light-bg dark:bg-dark-surface rounded-full text-[11px] text-light-muted dark:text-dark-muted hover:bg-accent-blue/10 hover:text-accent-blue transition-colors border border-light-border/40 dark:border-dark-border/40"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-accent-blue' : 'bg-gradient-to-br from-purple-400 to-pink-400'
                }`}>
                  {msg.role === 'user' ? <User size={13} className="text-white" /> : <Bot size={13} className="text-white" />}
                </div>
                <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-accent-blue text-white rounded-br-md'
                    : 'bg-light-bg dark:bg-dark-surface text-light-text dark:text-dark-text rounded-bl-md border border-light-border/50 dark:border-dark-border/50'
                }`}>
                  {msg.role === 'user' ? (
                    <p>{msg.content}</p>
                  ) : (
                    <FormattedMessage text={msg.content} />
                  )}
                  {msg.isStreaming && (
                    <span className="inline-block w-1.5 h-3.5 bg-accent-blue ml-0.5 animate-pulse align-middle" />
                  )}
                </div>
              </motion.div>
            ))}

            {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                  <Bot size={13} className="text-white" />
                </div>
                <div className="px-4 py-3 bg-light-bg dark:bg-dark-surface rounded-2xl rounded-bl-md border border-light-border/50 dark:border-dark-border/50">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-light-muted/50 dark:bg-dark-muted/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-light-muted/50 dark:bg-dark-muted/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-light-muted/50 dark:bg-dark-muted/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {backendStatus === 'offline' && (
            <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border-t border-red-100 dark:border-red-800 flex items-center justify-center gap-1.5 shrink-0">
              <WifiOff size={12} className="text-red-500" />
              <span className="text-[11px] text-red-600 dark:text-red-400">AI assistant is offline. Browse portfolio or try again later.</span>
            </div>
          )}

          <div className="px-4 py-3 border-t border-light-border/50 dark:border-dark-border/50 bg-white/50 dark:bg-dark-bg/50 shrink-0">
            <div className="relative flex items-center bg-light-bg dark:bg-dark-surface rounded-full px-4 py-2.5">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder={backendStatus === 'offline' ? 'Assistant offline...' : 'Ask me anything...'}
                disabled={backendStatus === 'offline'}
                className="flex-1 bg-transparent outline-none text-sm text-light-text dark:text-dark-text placeholder:text-light-muted/60 dark:placeholder:text-dark-muted/60 disabled:opacity-50"
              />
              <motion.button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading || backendStatus === 'offline'}
                className="ml-2 w-8 h-8 bg-accent-blue rounded-full flex items-center justify-center text-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} className="ml-0.5" />}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
