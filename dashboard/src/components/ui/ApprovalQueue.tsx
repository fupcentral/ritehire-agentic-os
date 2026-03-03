import { useState } from 'react'
import Card, { CardHeader } from './Card'
import StatusBadge from './StatusBadge'
import Button from './Button'
import Modal from './Modal'
import { useContentQueue } from '../../hooks/useContentQueue'
import type { ContentItem } from '../../hooks/useContentQueue'
import {
    Check,
    X,
    Clock,
    Send,
    Eye,
    Linkedin,
    Sparkles,
    Calendar,
    MessageSquare,
} from 'lucide-react'

const PLATFORM_ICON: Record<string, typeof Linkedin> = {
    linkedin: Linkedin,
}

interface ApprovalQueueProps {
    /** Filter by platform */
    platform?: string
    /** Show compact view (for sidebar/widgets) */
    compact?: boolean
    /** Title override */
    title?: string
}

export default function ApprovalQueue({ platform, compact, title }: ApprovalQueueProps) {
    const { items, loading, approve, reject, publish, pendingCount } = useContentQueue({
        platform,
    })
    const [previewItem, setPreviewItem] = useState<ContentItem | null>(null)
    const [rejectingId, setRejectingId] = useState<string | null>(null)
    const [rejectNote, setRejectNote] = useState('')

    const pendingItems = items.filter((i) => i.status === 'pending_approval')
    const otherItems = items.filter((i) => i.status !== 'pending_approval')

    const handleReject = () => {
        if (rejectingId) {
            reject(rejectingId, rejectNote)
            setRejectingId(null)
            setRejectNote('')
        }
    }

    if (loading) {
        return (
            <Card>
                <div className="animate-pulse space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-surface rounded-lg" />
                    ))}
                </div>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            {/* Pending Approvals */}
            {pendingItems.length > 0 && (
                <Card>
                    <CardHeader
                        title={title || '🔔 Pending Approval'}
                        subtitle={`${pendingCount} item${pendingCount !== 1 ? 's' : ''} awaiting your review`}
                        action={
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold">
                                <Clock size={10} />
                                Action Required
                            </div>
                        }
                    />

                    <div className="space-y-3">
                        {pendingItems.map((item) => (
                            <ContentCard
                                key={item.id}
                                item={item}
                                onPreview={() => setPreviewItem(item)}
                                onApprove={() => approve(item.id)}
                                onReject={() => { setRejectingId(item.id); setRejectNote('') }}
                                compact={compact}
                            />
                        ))}
                    </div>
                </Card>
            )}

            {/* Other content (approved, scheduled, published, rejected) */}
            {!compact && otherItems.length > 0 && (
                <Card>
                    <CardHeader
                        title="Content History"
                        subtitle={`${otherItems.length} items`}
                    />
                    <div className="space-y-2">
                        {otherItems.map((item) => (
                            <ContentCard
                                key={item.id}
                                item={item}
                                onPreview={() => setPreviewItem(item)}
                                onPublish={item.status === 'approved' || item.status === 'scheduled'
                                    ? () => publish(item.id)
                                    : undefined
                                }
                                compact
                            />
                        ))}
                    </div>
                </Card>
            )}

            {items.length === 0 && (
                <Card>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mb-3">
                            <Check size={20} className="text-teal" />
                        </div>
                        <h3 className="text-sm font-semibold text-navy mb-1">All caught up!</h3>
                        <p className="text-xs text-charcoal/50">No content pending approval.</p>
                    </div>
                </Card>
            )}

            {/* Preview Modal */}
            <Modal
                open={!!previewItem}
                onClose={() => setPreviewItem(null)}
                title={previewItem?.title || ''}
            >
                {previewItem && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <StatusBadge status={previewItem.status} />
                            <span className="text-xs text-charcoal/50">via {previewItem.source}</span>
                            <span className="text-xs text-charcoal/30">•</span>
                            <span className="text-xs text-charcoal/50">
                                {new Date(previewItem.createdAt).toLocaleDateString('en-GB', {
                                    day: '2-digit', month: 'short', year: 'numeric',
                                })}
                            </span>
                        </div>

                        {/* Post preview */}
                        <div className="bg-surface rounded-xl p-4 border border-light-gray/30">
                            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-light-gray/30">
                                <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-white">RH</span>
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-navy">RiteHire</div>
                                    <div className="text-[10px] text-charcoal/40">Pakistan-based EOR</div>
                                </div>
                            </div>
                            <div className="text-sm text-navy whitespace-pre-wrap leading-relaxed">
                                {previewItem.body}
                            </div>
                        </div>

                        {/* Tags */}
                        {previewItem.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {previewItem.tags.map((tag) => (
                                    <span key={tag} className="text-[10px] bg-navy/5 text-navy px-2 py-0.5 rounded-full">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Review note */}
                        {previewItem.reviewNote && (
                            <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                                <div className="text-[10px] font-semibold text-status-blocked mb-1">Rejection Note</div>
                                <div className="text-xs text-charcoal">{previewItem.reviewNote}</div>
                            </div>
                        )}

                        {/* Actions */}
                        {previewItem.status === 'pending_approval' && (
                            <div className="flex gap-2 pt-2 border-t border-light-gray/30">
                                <Button
                                    size="sm"
                                    variant="primary"
                                    onClick={() => {
                                        approve(previewItem.id)
                                        setPreviewItem(null)
                                    }}
                                >
                                    <Check size={14} /> Approve
                                </Button>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => {
                                        approve(previewItem.id, new Date(Date.now() + 86400000).toISOString())
                                        setPreviewItem(null)
                                    }}
                                >
                                    <Calendar size={14} /> Schedule Tomorrow
                                </Button>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => {
                                        setRejectingId(previewItem.id)
                                        setRejectNote('')
                                        setPreviewItem(null)
                                    }}
                                >
                                    <X size={14} /> Reject
                                </Button>
                            </div>
                        )}

                        {(previewItem.status === 'approved' || previewItem.status === 'scheduled') && (
                            <div className="flex gap-2 pt-2 border-t border-light-gray/30">
                                <Button
                                    size="sm"
                                    variant="primary"
                                    onClick={() => {
                                        publish(previewItem.id)
                                        setPreviewItem(null)
                                    }}
                                >
                                    <Send size={14} /> Publish Now
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Reject Modal */}
            <Modal
                open={!!rejectingId}
                onClose={() => setRejectingId(null)}
                title="Reject Content"
            >
                <div className="space-y-3">
                    <p className="text-sm text-charcoal">Add a note explaining why this content was rejected (optional):</p>
                    <textarea
                        value={rejectNote}
                        onChange={(e) => setRejectNote(e.target.value)}
                        className="w-full h-24 px-3 py-2 text-sm border border-light-gray rounded-lg focus:ring-2 focus:ring-teal/30 focus:border-teal outline-none resize-none"
                        placeholder="e.g., Too generic, needs more specific value prop..."
                    />
                    <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="secondary" onClick={() => setRejectingId(null)}>
                            Cancel
                        </Button>
                        <Button size="sm" variant="primary" onClick={handleReject}>
                            <X size={14} /> Reject
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

/* ============================================================
   CONTENT CARD
   ============================================================ */
function ContentCard({
    item,
    onPreview,
    onApprove,
    onReject,
    onPublish,
    compact,
}: {
    item: ContentItem
    onPreview?: () => void
    onApprove?: () => void
    onReject?: () => void
    onPublish?: () => void
    compact?: boolean
}) {
    const PlatformIcon = PLATFORM_ICON[item.platform] || MessageSquare
    const isPending = item.status === 'pending_approval'

    return (
        <div className={`
            rounded-xl border transition-all
            ${isPending
                ? 'border-amber-200 bg-amber-50/30 hover:border-amber-300 hover:shadow-sm'
                : 'border-light-gray/30 bg-white hover:bg-surface/20'
            }
        `}>
            <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isPending ? 'bg-amber-100' : 'bg-surface'
                            }`}>
                            <PlatformIcon size={14} className={isPending ? 'text-amber-600' : 'text-charcoal/50'} />
                        </div>
                        <div className="min-w-0">
                            <div className="text-[13px] font-semibold text-navy truncate">{item.title}</div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <Sparkles size={9} className="text-charcoal/30" />
                                <span className="text-[10px] text-charcoal/40">via {item.source}</span>
                                <span className="text-[10px] text-charcoal/20">•</span>
                                <span className="text-[10px] text-charcoal/40">
                                    {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                </span>
                            </div>
                        </div>
                    </div>
                    <StatusBadge status={item.status} size="sm" />
                </div>

                {/* Body preview */}
                {!compact && (
                    <div className="text-xs text-charcoal/60 line-clamp-3 mb-3 ml-9 whitespace-pre-wrap">
                        {item.body.slice(0, 200)}{item.body.length > 200 ? '...' : ''}
                    </div>
                )}

                {/* Scheduled info */}
                {item.scheduledAt && (item.status === 'scheduled' || item.status === 'approved') && (
                    <div className="flex items-center gap-1 text-[10px] text-teal ml-9 mb-2">
                        <Calendar size={10} />
                        Scheduled: {new Date(item.scheduledAt).toLocaleDateString('en-GB', {
                            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                        })}
                    </div>
                )}

                {/* Rejection note */}
                {item.reviewNote && item.status === 'rejected' && (
                    <div className="text-[10px] text-status-blocked ml-9 mb-2 italic">
                        "{item.reviewNote}"
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 ml-9">
                    <button
                        onClick={onPreview}
                        className="flex items-center gap-1 text-[11px] text-charcoal/50 hover:text-navy transition-colors"
                    >
                        <Eye size={12} /> Preview
                    </button>

                    {isPending && onApprove && (
                        <>
                            <button
                                onClick={onApprove}
                                className="flex items-center gap-1 text-[11px] text-teal hover:text-teal/80 font-medium transition-colors"
                            >
                                <Check size={12} /> Approve
                            </button>
                            <button
                                onClick={onReject}
                                className="flex items-center gap-1 text-[11px] text-status-blocked hover:text-status-blocked/80 font-medium transition-colors"
                            >
                                <X size={12} /> Reject
                            </button>
                        </>
                    )}

                    {onPublish && (
                        <button
                            onClick={onPublish}
                            className="flex items-center gap-1 text-[11px] text-teal hover:text-teal/80 font-medium transition-colors"
                        >
                            <Send size={12} /> Publish Now
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
