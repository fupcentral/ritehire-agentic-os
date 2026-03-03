import { useState } from 'react'
import { useActivityLog } from '../hooks/useActivityLog'
import StatusBadge from '../components/ui/StatusBadge'
import SkeletonLoader from '../components/ui/SkeletonLoader'
import EmptyState from '../components/ui/EmptyState'
import Drawer from '../components/ui/Drawer'
import { Mail, Check, Edit3, X } from 'lucide-react'
import type { ActivityLogEntry } from '../lib/types'

export default function EmailOutreach() {
    const { entries, loading } = useActivityLog({
        agentFilter: 'email-outbound',
        limit: 50,
    })
    const [selectedEmail, setSelectedEmail] = useState<ActivityLogEntry | null>(null)

    const drafts = entries.filter((e) => e.status === 'approved_pending_action').length
    const pendingApproval = entries.filter((e) => e.status === 'awaiting_approval').length
    const sent = entries.filter((e) => e.status === 'completed').length
    const replied = 0 // Would come from contacts outreach_status
    const meetings = 0

    const stats = [
        { label: 'Drafts', value: drafts, color: 'text-charcoal' },
        { label: 'Pending Approval', value: pendingApproval, color: 'text-amber-500' },
        { label: 'Sent', value: sent, color: 'text-teal' },
        { label: 'Replied', value: replied, color: 'text-teal' },
        { label: 'Meetings Booked', value: meetings, color: 'text-teal' },
    ]

    return (
        <div className="max-w-[1400px] mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-navy">Email Outreach</h1>
                <p className="text-sm text-charcoal mt-0.5">Cold email queue and approval workflow</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-5 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="card-sm text-center">
                        <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                        <div className="text-xs text-charcoal mt-1">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Email List */}
            <div className="card p-0">
                {loading ? (
                    <div className="p-6">
                        <SkeletonLoader variant="row" count={5} />
                    </div>
                ) : entries.length === 0 ? (
                    <EmptyState
                        icon={Mail}
                        title="No emails in queue"
                        description="Cold outreach emails will appear here when the Email Outbound agent generates them."
                        actionLabel="Generate Outreach"
                        onAction={() => { }}
                    />
                ) : (
                    <div className="divide-y divide-light-gray">
                        {/* Header */}
                        <div className="grid grid-cols-[1fr_150px_120px_100px] gap-4 px-6 py-3 bg-surface/50 text-xs font-semibold text-charcoal uppercase tracking-wide">
                            <span>Email</span>
                            <span>Agent / Skill</span>
                            <span>Status</span>
                            <span>Date</span>
                        </div>
                        {entries.map((entry) => (
                            <div
                                key={entry.id}
                                onClick={() => setSelectedEmail(entry)}
                                className="grid grid-cols-[1fr_150px_120px_100px] gap-4 px-6 py-4 hover:bg-surface/50
                  transition-colors cursor-pointer items-center"
                            >
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-navy truncate">{entry.output_summary}</p>
                                    <p className="text-xs text-charcoal mt-0.5">{entry.action_type.replace(/_/g, ' ')}</p>
                                </div>
                                <span className="text-xs text-charcoal">{entry.skill_used || entry.agent_id}</span>
                                <StatusBadge status={entry.status} size="sm" />
                                <span className="text-xs text-charcoal">
                                    {new Date(entry.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Email Detail Drawer */}
            <Drawer
                open={!!selectedEmail}
                onClose={() => setSelectedEmail(null)}
                title="Email Details"
            >
                {selectedEmail && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <StatusBadge status={selectedEmail.status} />
                            {selectedEmail.risk_level && (
                                <StatusBadge status={selectedEmail.risk_level} label={`${selectedEmail.risk_level} risk`} />
                            )}
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-navy mb-2">Email Content</h3>
                            <div className="p-4 bg-surface rounded-lg border border-light-gray">
                                <p className="text-sm text-navy whitespace-pre-wrap leading-relaxed">
                                    {selectedEmail.output_summary}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-xs text-charcoal">Agent</span>
                                <p className="text-sm font-medium text-navy mt-0.5">{selectedEmail.agent_id}</p>
                            </div>
                            <div>
                                <span className="text-xs text-charcoal">Skill Used</span>
                                <p className="text-sm font-medium text-navy mt-0.5">{selectedEmail.skill_used || '—'}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-4 border-t border-light-gray">
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-teal text-white text-sm font-medium rounded-lg hover:bg-teal-dark transition-colors cursor-pointer">
                                <Check size={16} /> Approve
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-white text-navy text-sm font-medium rounded-lg border border-light-gray hover:bg-surface transition-colors cursor-pointer">
                                <Edit3 size={16} /> Edit
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-200 hover:bg-red-100 transition-colors cursor-pointer">
                                <X size={16} /> Reject
                            </button>
                        </div>
                    </div>
                )}
            </Drawer>
        </div>
    )
}
