import { useState, useRef, useEffect } from 'react'
import Card, { CardHeader } from '../components/ui/Card'
import StatusBadge from '../components/ui/StatusBadge'
import SkeletonLoader from '../components/ui/SkeletonLoader'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import { useTasks } from '../hooks/useTasks'
import {
    Bot,
    Send,
    RefreshCw,
    Wifi,
    Zap,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react'

interface Message {
    role: 'user' | 'assistant'
    content: string
}

export default function ClaudeChatPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const { tasks } = useTasks()
    const pendingApprovals = tasks.filter(
        (t) => t.status === 'todo' && (t.priority === 'P0 - Critical' || t.priority === 'P1 - High')
    )

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    async function sendMessage() {
        if (!input.trim() || loading) return

        const userMessage: Message = { role: 'user', content: input.trim() }
        const allMessages = [...messages, userMessage]
        setMessages(allMessages)
        setInput('')
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`${supabaseUrl}/functions/v1/claude-chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${supabaseKey}`,
                },
                body: JSON.stringify({
                    messages: allMessages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            })

            if (!response.ok) {
                const err = await response.text()
                throw new Error(err || `HTTP ${response.status}`)
            }

            const data = await response.json()
            const assistantContent = data.content?.[0]?.text || data.message || 'No response received.'

            setMessages([...allMessages, { role: 'assistant', content: assistantContent }])
        } catch (e: any) {
            setError(e.message || 'Failed to send message')
            // Don't remove user message on error
        } finally {
            setLoading(false)
        }
    }

    function clearChat() {
        setMessages([])
        setError(null)
    }

    function renderMarkdown(text: string) {
        // Simple inline markdown: bold, code, bullets
        let html = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/`(.*?)`/g, '<code class="text-[12px] bg-navy/5 px-1 py-0.5 rounded">$1</code>')
            .replace(/^- (.*)/gm, '<li class="ml-4 list-disc">$1</li>')
            .replace(/\n/g, '<br/>')

        return <span dangerouslySetInnerHTML={{ __html: html }} />
    }

    return (
        <div className="fade-in h-[calc(100vh-120px)] flex gap-6">
            {/* Chat Panel — 2/3 */}
            <div className="flex-[2] flex flex-col min-w-0">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold text-navy">Claude Co-worker</h1>
                    <p className="text-sm text-charcoal mt-1">
                        Chat with Claude — connected to GitHub, Supabase, Notion, and all your services.
                    </p>
                </div>

                {/* Connection banner */}
                {supabaseUrl && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-teal/5 border border-teal/10 mb-3">
                        <Wifi size={14} className="text-teal" />
                        <span className="text-[11px] font-medium text-teal">
                            Connected to GitHub, Supabase, Notion
                        </span>
                    </div>
                )}

                {/* Error banner */}
                {error && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 border border-red-100 mb-3">
                        <AlertCircle size={14} className="text-red-500" />
                        <span className="text-[11px] font-medium text-red-600">{error}</span>
                    </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto rounded-2xl bg-white border border-light-gray/60 p-4 space-y-4 shadow-sm">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-14 h-14 rounded-2xl bg-teal/8 flex items-center justify-center mb-4">
                                <Bot size={24} className="text-teal" />
                            </div>
                            <h3 className="text-sm font-semibold text-navy mb-1">Ready to assist</h3>
                            <p className="text-xs text-charcoal max-w-[300px]">
                                Ask Claude about your pipeline, agents, tasks, or anything else.
                            </p>
                        </div>
                    )}

                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`max-w-[75%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                                    ? 'bg-navy text-white rounded-br-md'
                                    : 'bg-surface text-navy rounded-bl-md'
                                    }`}
                            >
                                <div className="text-sm leading-relaxed">
                                    {msg.role === 'assistant' ? renderMarkdown(msg.content) : msg.content}
                                </div>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-surface rounded-2xl rounded-bl-md px-4 py-3">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 rounded-full bg-charcoal/30 animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 rounded-full bg-charcoal/30 animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 rounded-full bg-charcoal/30 animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="flex items-center gap-2 mt-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Ask Claude anything..."
                        className="input flex-1"
                        disabled={loading}
                    />
                    <Button onClick={sendMessage} disabled={loading || !input.trim()}>
                        <Send size={14} />
                    </Button>
                    <Button variant="ghost" onClick={clearChat} disabled={loading}>
                        <RefreshCw size={14} />
                    </Button>
                </div>
            </div>

            {/* Pending Approvals Sidebar — 1/3 */}
            <div className="flex-[1] min-w-[280px] max-w-[400px]">
                <Card className="h-full overflow-y-auto">
                    <CardHeader
                        title="Pending Approvals"
                        icon={<Zap size={16} />}
                        subtitle={`${pendingApprovals.length} items`}
                    />

                    {pendingApprovals.length === 0 ? (
                        <EmptyState
                            icon={<CheckCircle2 size={20} />}
                            title="All clear"
                            description="No pending approvals right now."
                        />
                    ) : (
                        <div className="space-y-2">
                            {pendingApprovals.map((task) => (
                                <div key={task.id} className="p-3 rounded-xl bg-surface">
                                    <div className="text-sm font-medium text-navy truncate">{task.title}</div>
                                    {task.description && (
                                        <div className="text-xs text-charcoal mt-0.5 line-clamp-2">{task.description}</div>
                                    )}
                                    <div className="flex items-center gap-2 mt-2">
                                        <StatusBadge status={task.priority} size="sm" />
                                        {task.agent && (
                                            <span className="text-[10px] text-charcoal">{task.agent.name}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}
