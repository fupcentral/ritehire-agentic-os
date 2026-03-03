import { useState } from 'react'
import { useActivityLog } from '../hooks/useActivityLog'
import StatusBadge from '../components/ui/StatusBadge'
import SkeletonLoader from '../components/ui/SkeletonLoader'
import EmptyState from '../components/ui/EmptyState'
import Drawer from '../components/ui/Drawer'
import {
    Linkedin,
    Image,
    FileText,
    Type,
    Sparkles,
    ImagePlus,
    Filter,
    Check,
    Edit3,
    RefreshCw,
    SkipForward,
} from 'lucide-react'
import type { ActivityLogEntry } from '../lib/types'

const FORMAT_FILTERS = [
    { label: 'All', value: 'all', icon: Filter },
    { label: 'Image', value: 'image', icon: Image },
    { label: 'Carousel', value: 'carousel', icon: FileText },
    { label: 'Text', value: 'text', icon: Type },
]

export default function LinkedInEngine() {
    const { entries, loading } = useActivityLog({
        agentFilter: 'linkedin-outbound',
        limit: 50,
    })
    const [activeFilter, setActiveFilter] = useState('all')
    const [selectedPost, setSelectedPost] = useState<ActivityLogEntry | null>(null)

    // Stats
    const totalPosts = entries.length
    const pendingReview = entries.filter((e) => e.status === 'pending').length
    const approved = entries.filter((e) => e.status === 'success').length
    const needsRevision = entries.filter((e) => e.status === 'failed').length

    const stats = [
        { label: 'Total Posts', value: totalPosts, color: 'text-navy' },
        { label: 'Pending Review', value: pendingReview, color: 'text-amber-500' },
        { label: 'Approved', value: approved, color: 'text-teal' },
        { label: 'Needs Revision', value: needsRevision, color: 'text-red-500' },
    ]

    return (
        <div className="max-w-[1400px] mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-navy">LinkedIn Content Engine</h1>
                    <p className="text-sm text-charcoal mt-0.5">Manage and approve LinkedIn posts before publishing</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-teal text-white text-sm font-medium rounded-lg hover:bg-teal-dark transition-colors cursor-pointer">
                        <Sparkles size={16} />
                        Generate Post
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-navy text-white text-sm font-medium rounded-lg hover:bg-navy-lighter transition-colors cursor-pointer">
                        <ImagePlus size={16} />
                        Generate Images
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="card-sm text-center">
                        <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                        <div className="text-xs text-charcoal mt-1">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
                {FORMAT_FILTERS.map((filter) => (
                    <button
                        key={filter.value}
                        onClick={() => setActiveFilter(filter.value)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
              ${activeFilter === filter.value
                                ? 'bg-navy text-white'
                                : 'bg-white text-charcoal hover:bg-light-gray/50 border border-light-gray'
                            }`}
                    >
                        <filter.icon size={14} />
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Post List */}
            <div className="card p-0">
                {loading ? (
                    <div className="p-6">
                        <SkeletonLoader variant="row" count={5} />
                    </div>
                ) : entries.length === 0 ? (
                    <EmptyState
                        icon={Linkedin}
                        title="No LinkedIn posts yet"
                        description="Generate your first post to get started with the content engine."
                        actionLabel="Generate Post"
                        onAction={() => { }}
                    />
                ) : (
                    <div className="divide-y divide-light-gray">
                        {/* Table Header */}
                        <div className="grid grid-cols-[100px_1fr_120px_120px_120px] gap-4 px-6 py-3 bg-surface/50 text-xs font-semibold text-charcoal uppercase tracking-wide">
                            <span>Date</span>
                            <span>Post</span>
                            <span>Action Type</span>
                            <span>Risk</span>
                            <span>Status</span>
                        </div>
                        {entries.map((entry) => (
                            <div
                                key={entry.id}
                                onClick={() => setSelectedPost(entry)}
                                className="grid grid-cols-[100px_1fr_120px_120px_120px] gap-4 px-6 py-4 hover:bg-surface/50
                  transition-colors cursor-pointer items-center"
                            >
                                <span className="text-xs text-charcoal">
                                    {new Date(entry.created_at).toLocaleDateString()}
                                </span>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-navy truncate">{entry.output_summary}</p>
                                    <p className="text-xs text-charcoal mt-0.5">{entry.skill_used || 'manual'}</p>
                                </div>
                                <span className="text-xs text-charcoal capitalize">{(entry.skill_used ?? entry.action_type ?? 'action').replace(/_/g, ' ')}</span>
                                <StatusBadge status={entry.risk_level || 'low'} size="sm" />
                                <StatusBadge status={entry.status} size="sm" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Post Detail Drawer */}
            <Drawer
                open={!!selectedPost}
                onClose={() => setSelectedPost(null)}
                title="Post Details"
            >
                {selectedPost && (
                    <div className="space-y-6">
                        {/* Status */}
                        <div className="flex items-center gap-3">
                            <StatusBadge status={selectedPost.status} />
                            {selectedPost.risk_level && (
                                <StatusBadge status={selectedPost.risk_level} label={`${selectedPost.risk_level} risk`} />
                            )}
                        </div>

                        {/* Post Copy */}
                        <div>
                            <h3 className="text-sm font-semibold text-navy mb-2">Post Copy</h3>
                            <div className="p-4 bg-surface rounded-lg border border-light-gray">
                                <p className="text-sm text-navy whitespace-pre-wrap leading-relaxed">
                                    {selectedPost.output_summary}
                                </p>
                            </div>
                        </div>

                        {/* Meta */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-xs text-charcoal">Agent</span>
                                <p className="text-sm font-medium text-navy mt-0.5">{selectedPost.agent_id}</p>
                            </div>
                            <div>
                                <span className="text-xs text-charcoal">Skill</span>
                                <p className="text-sm font-medium text-navy mt-0.5">{selectedPost.skill_used || '—'}</p>
                            </div>
                            <div>
                                <span className="text-xs text-charcoal">Skill / Action</span>
                                <p className="text-sm font-medium text-navy mt-0.5 capitalize">{(selectedPost.skill_used ?? selectedPost.action_type ?? 'action').replace(/_/g, ' ')}</p>
                            </div>
                            <div>
                                <span className="text-xs text-charcoal">Created</span>
                                <p className="text-sm font-medium text-navy mt-0.5">
                                    {new Date(selectedPost.created_at).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 pt-4 border-t border-light-gray">
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-teal text-white text-sm font-medium rounded-lg hover:bg-teal-dark transition-colors cursor-pointer">
                                <Check size={16} /> Approve
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-white text-navy text-sm font-medium rounded-lg border border-light-gray hover:bg-surface transition-colors cursor-pointer">
                                <Edit3 size={16} /> Edit
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-white text-navy text-sm font-medium rounded-lg border border-light-gray hover:bg-surface transition-colors cursor-pointer">
                                <RefreshCw size={16} /> Regenerate
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-white text-charcoal text-sm font-medium rounded-lg border border-light-gray hover:bg-surface transition-colors cursor-pointer">
                                <SkipForward size={16} /> Skip
                            </button>
                        </div>
                    </div>
                )}
            </Drawer>
        </div>
    )
}
