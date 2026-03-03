import ClaudeChat from '../components/ui/ClaudeChat'
import ApprovalQueue from '../components/ui/ApprovalQueue'

export default function ClaudeChatPage() {
    return (
        <div className="space-y-6 fade-in">
            <div>
                <h1 className="text-2xl font-bold text-navy tracking-tight">Claude Co-worker</h1>
                <p className="text-sm text-charcoal/60 mt-1">
                    Chat with Claude — connected to GitHub, Supabase, Notion, and all your services.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chat panel — takes 2/3 width */}
                <div className="lg:col-span-2">
                    <ClaudeChat />
                </div>

                {/* Side panel — pending actions */}
                <div className="space-y-4">
                    <ApprovalQueue compact title="🔔 Pending Actions" />
                </div>
            </div>
        </div>
    )
}
