import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles, Maximize2, Minimize2, AlertCircle, RefreshCw } from 'lucide-react'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    error?: boolean
}

const INITIAL_MESSAGES: Message[] = [
    {
        id: 'init-1',
        role: 'assistant',
        content: `Hey Nabeel 👋 I'm your Claude co-worker, connected to your RiteHire OS.\n\nI can help with:\n• Reviewing and approving content before publishing\n• Sales strategy, pipeline analysis, outreach copy\n• Pulling data from Supabase, GitHub, or Notion\n• Agent task coordination and escalation\n• Legal/compliance checks and contract review\n\nWhat do you need?`,
        timestamp: new Date(),
    },
]

// Build the Supabase edge function URL from env vars
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''
const CLAUDE_CHAT_URL = `${SUPABASE_URL}/functions/v1/claude-chat`

// Check if Supabase is configured
const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

interface ClaudeChatProps {
    /** If true, renders as a compact inline panel */
    inline?: boolean
}

export default function ClaudeChat({ inline }: ClaudeChatProps) {
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const [apiError, setApiError] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    // Keep conversation history in ref for API calls (no re-renders)
    const conversationRef = useRef<{ role: 'user' | 'assistant'; content: string }[]>([])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    const handleSend = async () => {
        if (!input.trim() || isTyping) return

        const userContent = input.trim()
        setInput('')
        setApiError(null)

        const userMsg: Message = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content: userContent,
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMsg])
        setIsTyping(true)

        // Add to conversation history
        conversationRef.current = [
            ...conversationRef.current,
            { role: 'user', content: userContent },
        ]

        try {
            if (!isSupabaseConfigured) {
                throw new Error(
                    'Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in dashboard/.env'
                )
            }

            const response = await fetch(CLAUDE_CHAT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'apikey': SUPABASE_ANON_KEY,
                },
                body: JSON.stringify({
                    messages: conversationRef.current,
                }),
            })

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}))
                throw new Error(
                    errData.error || `API error ${response.status}. Check ANTHROPIC_API_KEY in Supabase vault.`
                )
            }

            const data = await response.json()
            const assistantContent: string = data.content ?? "Couldn't get a response. Please try again."

            // Add assistant response to history
            conversationRef.current = [
                ...conversationRef.current,
                { role: 'assistant', content: assistantContent },
            ]

            const assistantMsg: Message = {
                id: `msg-${Date.now()}-resp`,
                role: 'assistant',
                content: assistantContent,
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, assistantMsg])
        } catch (err) {
            const errorText = err instanceof Error ? err.message : 'Unknown error'
            setApiError(errorText)

            // Remove the failed user message from history
            conversationRef.current = conversationRef.current.slice(0, -1)

            // Show error as assistant message
            const errorMsg: Message = {
                id: `msg-${Date.now()}-err`,
                role: 'assistant',
                content: `⚠️ ${errorText}`,
                timestamp: new Date(),
                error: true,
            }
            setMessages((prev) => [...prev, errorMsg])
        } finally {
            setIsTyping(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleClearChat = () => {
        setMessages(INITIAL_MESSAGES)
        conversationRef.current = []
        setApiError(null)
    }

    const containerHeight = inline
        ? expanded ? 'h-[600px]' : 'h-[400px]'
        : 'h-[calc(100vh-200px)]'

    return (
        <div className={`flex flex-col ${containerHeight} bg-white rounded-xl border border-light-gray/50 shadow-sm overflow-hidden transition-all duration-300`}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-navy to-navy/90 text-white flex-shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
                        <Bot size={16} />
                    </div>
                    <div>
                        <div className="text-sm font-semibold">Claude Co-worker</div>
                        <div className="text-[10px] text-white/60 flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured ? 'bg-teal animate-pulse' : 'bg-amber-400'}`} />
                            {isSupabaseConfigured
                                ? 'Connected to GitHub, Supabase, Notion'
                                : 'Configure VITE_SUPABASE_URL to connect'}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={handleClearChat}
                        title="Clear chat"
                        className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    >
                        <RefreshCw size={12} />
                    </button>
                    {inline && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        >
                            {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                        </button>
                    )}
                </div>
            </div>

            {/* Config warning banner */}
            {!isSupabaseConfigured && (
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border-b border-amber-200 flex-shrink-0">
                    <AlertCircle size={14} className="text-amber-600 flex-shrink-0" />
                    <p className="text-[11px] text-amber-700">
                        Add <code className="font-mono bg-amber-100 px-1 rounded">VITE_SUPABASE_URL</code> and{' '}
                        <code className="font-mono bg-amber-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> to{' '}
                        <code className="font-mono bg-amber-100 px-1 rounded">dashboard/.env</code> to enable real AI responses.
                    </p>
                </div>
            )}

            {/* Persistent API error banner */}
            {apiError && isSupabaseConfigured && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border-b border-red-200 flex-shrink-0">
                    <AlertCircle size={14} className="text-red-600 flex-shrink-0" />
                    <p className="text-[11px] text-red-700 flex-1 truncate">{apiError}</p>
                    <button
                        onClick={() => setApiError(null)}
                        className="text-[11px] text-red-500 hover:text-red-700 flex-shrink-0"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`
                            w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5
                            ${msg.role === 'user' ? 'bg-teal/10' : msg.error ? 'bg-red-50' : 'bg-navy/10'}
                        `}>
                            {msg.role === 'user'
                                ? <User size={14} className="text-teal" />
                                : <Sparkles size={14} className={msg.error ? 'text-red-400' : 'text-navy'} />
                            }
                        </div>
                        <div className={`
                            max-w-[80%] rounded-xl px-3.5 py-2.5
                            ${msg.role === 'user'
                                ? 'bg-teal text-white rounded-tr-sm'
                                : msg.error
                                    ? 'bg-red-50 text-red-700 rounded-tl-sm border border-red-200'
                                    : 'bg-surface text-navy rounded-tl-sm'
                            }
                        `}>
                            <MessageContent content={msg.content} isUser={msg.role === 'user'} />
                            <div className={`text-[9px] mt-1 ${msg.role === 'user' ? 'text-white/50' : 'text-charcoal/30'}`}>
                                {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-navy/10 flex items-center justify-center flex-shrink-0">
                            <Sparkles size={14} className="text-navy" />
                        </div>
                        <div className="bg-surface rounded-xl rounded-tl-sm px-4 py-3">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-charcoal/30 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-charcoal/30 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-charcoal/30 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-3 pb-3 flex-shrink-0">
                <div className="flex items-end gap-2 bg-surface rounded-xl border border-light-gray/30 px-3 py-2 focus-within:border-teal/40 focus-within:ring-2 focus-within:ring-teal/10 transition-all">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        className="flex-1 bg-transparent text-sm text-navy placeholder:text-charcoal/30 outline-none resize-none max-h-24"
                        placeholder="Ask Claude anything... (⏎ to send)"
                        disabled={isTyping}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className={`
                            w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all
                            ${input.trim() && !isTyping
                                ? 'bg-teal text-white hover:bg-teal/90 shadow-sm'
                                : 'bg-light-gray/50 text-charcoal/30'
                            }
                        `}
                    >
                        <Send size={14} />
                    </button>
                </div>
                <div className="text-[9px] text-charcoal/25 text-center mt-1.5">
                    Powered by Claude Sonnet · Connected to Supabase, GitHub, Notion
                </div>
            </div>
        </div>
    )
}

// ─── Message Content Renderer ─────────────────────────────────────────────────
// Renders markdown-lite: **bold**, • bullets, code blocks

function MessageContent({ content, isUser }: { content: string; isUser: boolean }) {
    // Split on newlines and render line by line
    const lines = content.split('\n')

    return (
        <div className="text-[13px] leading-relaxed space-y-0.5">
            {lines.map((line, i) => {
                // Code block delimiters — skip rendering
                if (line.startsWith('```')) return null

                // Bullet
                if (line.startsWith('• ') || line.startsWith('- ')) {
                    return (
                        <div key={i} className="flex gap-1.5">
                            <span className={isUser ? 'text-white/70' : 'text-teal'}>•</span>
                            <span>{renderInline(line.slice(2), isUser)}</span>
                        </div>
                    )
                }

                // Numbered list
                if (/^\d+\.\s/.test(line)) {
                    const num = line.match(/^(\d+)\.\s/)?.[1]
                    return (
                        <div key={i} className="flex gap-1.5">
                            <span className={`flex-shrink-0 ${isUser ? 'text-white/70' : 'text-charcoal/50'}`}>{num}.</span>
                            <span>{renderInline(line.replace(/^\d+\.\s/, ''), isUser)}</span>
                        </div>
                    )
                }

                // Empty line
                if (line.trim() === '') return <div key={i} className="h-1" />

                // Heading (##)
                if (line.startsWith('## ')) {
                    return (
                        <div key={i} className={`font-semibold mt-1 ${isUser ? '' : 'text-navy'}`}>
                            {renderInline(line.slice(3), isUser)}
                        </div>
                    )
                }

                // Regular text
                return <div key={i}>{renderInline(line, isUser)}</div>
            })}
        </div>
    )
}

function renderInline(text: string, isUser: boolean): React.ReactNode {
    // Handle **bold** and `code`
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>
        }
        if (part.startsWith('`') && part.endsWith('`')) {
            return (
                <code
                    key={i}
                    className={`text-[12px] px-1 py-0.5 rounded font-mono ${isUser ? 'bg-white/20' : 'bg-navy/10 text-navy'}`}
                >
                    {part.slice(1, -1)}
                </code>
            )
        }
        return part
    })
}
