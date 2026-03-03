import { useState } from 'react'
import TabNav from '../components/ui/TabNav'
import Card, { CardHeader } from '../components/ui/Card'
import StatusBadge from '../components/ui/StatusBadge'
import StatCard from '../components/ui/StatCard'
import SkeletonLoader from '../components/ui/SkeletonLoader'
import EmptyState from '../components/ui/EmptyState'
import Drawer from '../components/ui/Drawer'
import Button from '../components/ui/Button'
import { useActivityLog } from '../hooks/useActivityLog'
import type { ActivityLogEntry } from '../lib/types'
import {
    Linkedin,
    Mail,
    Palette,
    Eye,
    BarChart3,
    FileText,
} from 'lucide-react'

export default function Marketing() {
    const [activeTab, setActiveTab] = useState('linkedin')

    return (
        <div className="space-y-6 fade-in">
            <div>
                <h1 className="text-2xl font-bold text-navy">Marketing Department</h1>
                <p className="text-sm text-charcoal mt-1">LinkedIn, email sequences, and brand management.</p>
            </div>

            <TabNav
                tabs={[
                    { key: 'linkedin', label: 'LinkedIn' },
                    { key: 'email-sequences', label: 'Email Sequences' },
                    { key: 'brand', label: 'Brand' },
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
            />

            <div className="mt-4">
                {activeTab === 'linkedin' && <LinkedInTab />}
                {activeTab === 'email-sequences' && <EmailSequencesTab />}
                {activeTab === 'brand' && <BrandTab />}
            </div>
        </div>
    )
}

/* ============================================================
   LINKEDIN TAB
   ============================================================ */
function LinkedInTab() {
    const { entries, loading } = useActivityLog({ agentName: 'LinkedIn', limit: 50 })
    const [selectedPost, setSelectedPost] = useState<ActivityLogEntry | null>(null)

    const pending = entries.filter((e) => e.status === 'pending')
    const approved = entries.filter((e) => e.status === 'success')
    const inProg = entries.filter((e) => e.status === 'in_progress')

    return (
        <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                <StatCard label="Total Posts" value={entries.length} icon={<Linkedin size={18} />} />
                <StatCard label="Pending Review" value={pending.length} icon={<Eye size={18} />} />
                <StatCard label="Approved" value={approved.length} icon={<Linkedin size={18} />} />
                <StatCard label="In Progress" value={inProg.length} icon={<BarChart3 size={18} />} />
            </div>

            {/* Post list */}
            <Card padding={false}>
                {loading ? (
                    <div className="p-4"><SkeletonLoader variant="row" count={5} /></div>
                ) : entries.length === 0 ? (
                    <EmptyState
                        icon={<Linkedin size={24} />}
                        title="No LinkedIn posts yet"
                        description="Posts will appear once the LinkedIn Outbound agent creates content."
                    />
                ) : (
                    <div className="divide-y divide-light-gray/50">
                        {entries.map((entry) => (
                            <div
                                key={entry.id}
                                onClick={() => setSelectedPost(entry)}
                                className="flex items-start gap-3 px-4 py-3 hover:bg-surface cursor-pointer transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Linkedin size={14} className="text-teal" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-navy">
                                            {(entry.skill_used ?? 'action').replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                    <div className="text-xs text-charcoal mt-0.5 line-clamp-2">
                                        {entry.output_summary}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                    <StatusBadge status={entry.status} size="sm" />
                                    <span className="text-[10px] text-charcoal">
                                        {new Date(entry.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Post drawer */}
            <Drawer
                open={!!selectedPost}
                onClose={() => setSelectedPost(null)}
                title="LinkedIn Post"
                subtitle={selectedPost?.agent?.name || undefined}
                actions={
                    selectedPost?.status === 'pending' ? (
                        <>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedPost(null)}>Skip</Button>
                            <Button variant="secondary" size="sm" onClick={() => setSelectedPost(null)}>Regenerate</Button>
                            <Button variant="secondary" size="sm" onClick={() => setSelectedPost(null)}>Edit</Button>
                            <Button size="sm" onClick={() => setSelectedPost(null)}>Approve</Button>
                        </>
                    ) : undefined
                }
            >
                {selectedPost && (
                    <div className="space-y-4">
                        <div>
                            <label className="text-[11px] text-charcoal font-medium">Skill Used</label>
                            <p className="text-sm text-navy mt-0.5">
                                {(selectedPost.skill_used ?? 'action').replace(/_/g, ' ')}
                            </p>
                        </div>
                        <div>
                            <label className="text-[11px] text-charcoal font-medium">Status</label>
                            <div className="mt-0.5"><StatusBadge status={selectedPost.status} /></div>
                        </div>
                        <div>
                            <label className="text-[11px] text-charcoal font-medium">Post Copy</label>
                            <div className="mt-1 p-3 bg-surface rounded-lg">
                                <p className="text-sm text-navy whitespace-pre-wrap">
                                    {selectedPost.output_summary}
                                </p>
                            </div>
                        </div>
                        {selectedPost.risk_level && (
                            <div>
                                <label className="text-[11px] text-charcoal font-medium">Risk Level</label>
                                <p className="text-sm text-navy mt-0.5 capitalize">{selectedPost.risk_level}</p>
                            </div>
                        )}
                    </div>
                )}
            </Drawer>
        </div>
    )
}

/* ============================================================
   EMAIL SEQUENCES TAB
   ============================================================ */
function EmailSequencesTab() {
    const { entries, loading } = useActivityLog({ agentName: 'Email', limit: 50 })

    const drafts = entries.filter((e) => e.status === 'pending')
    const sent = entries.filter((e) => e.status === 'success')
    const replied = entries.filter((e) => e.status === 'in_progress')

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
                <StatCard label="Total Sequences" value={entries.length} icon={<Mail size={18} />} />
                <StatCard label="Drafts" value={drafts.length} icon={<FileText size={18} />} />
                <StatCard label="Sent" value={sent.length} icon={<Mail size={18} />} />
                <StatCard label="In Progress" value={replied.length} icon={<Mail size={18} />} />
            </div>

            <Card padding={false}>
                {loading ? (
                    <div className="p-4"><SkeletonLoader variant="row" count={5} /></div>
                ) : entries.length === 0 ? (
                    <EmptyState
                        icon={<Mail size={24} />}
                        title="No email sequences yet"
                        description="Cold outreach sequences will appear once the Email Outbound agent creates them."
                    />
                ) : (
                    <div className="divide-y divide-light-gray/50">
                        {entries.map((entry) => (
                            <div
                                key={entry.id}
                                className="flex items-start gap-3 px-4 py-3 hover:bg-surface transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Mail size={14} className="text-navy" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-navy">
                                            {entry.agent?.name || 'Email Outbound'}
                                        </span>
                                        <span className="text-xs text-charcoal">
                                            {(entry.skill_used ?? 'action').replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                    <div className="text-xs text-charcoal mt-0.5 line-clamp-1">
                                        {entry.output_summary}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                    <StatusBadge status={entry.status} size="sm" />
                                    <span className="text-[10px] text-charcoal">
                                        {new Date(entry.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    )
}

/* ============================================================
   BRAND TAB
   ============================================================ */
function BrandTab() {
    const brandColors = [
        { name: 'Dark Navy', hex: '#1a2332', usage: 'Primary background, headings, text' },
        { name: 'Charcoal', hex: '#4a5568', usage: 'Secondary text, UI elements' },
        { name: 'Teal', hex: '#009886', usage: 'Accent — CTAs, active states, highlights' },
        { name: 'Light Gray', hex: '#e5e7eb', usage: 'Borders, light surfaces' },
        { name: 'White', hex: '#ffffff', usage: 'Clean cards, overlays' },
    ]

    return (
        <div className="space-y-6">
            {/* Color Palette */}
            <Card>
                <CardHeader title="Brand Color Palette" subtitle="Primary colors — source of truth from BRAND_KIT.md" />
                <div className="grid grid-cols-5 gap-4">
                    {brandColors.map((color) => (
                        <div key={color.hex} className="text-center">
                            <div
                                className="w-full h-20 rounded-lg mb-2 border border-light-gray"
                                style={{ backgroundColor: color.hex }}
                            />
                            <div className="text-xs font-semibold text-navy">{color.name}</div>
                            <div className="text-[11px] text-charcoal font-mono">{color.hex}</div>
                            <div className="text-[10px] text-charcoal mt-0.5">{color.usage}</div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Typography */}
            <Card>
                <CardHeader title="Typography" subtitle="Clean, geometric sans-serif (Inter)" />
                <div className="space-y-3">
                    <div className="flex items-baseline gap-4 pb-3 border-b border-light-gray/50">
                        <span className="text-2xl font-bold text-navy">Heading 1</span>
                        <span className="text-xs text-charcoal">24px · Bold · Main headline</span>
                    </div>
                    <div className="flex items-baseline gap-4 pb-3 border-b border-light-gray/50">
                        <span className="text-lg font-bold text-navy">Heading 2</span>
                        <span className="text-xs text-charcoal">18px · Bold · Section heading</span>
                    </div>
                    <div className="flex items-baseline gap-4 pb-3 border-b border-light-gray/50">
                        <span className="text-base font-semibold text-navy">Heading 3</span>
                        <span className="text-xs text-charcoal">16px · SemiBold · Subheading</span>
                    </div>
                    <div className="flex items-baseline gap-4 pb-3 border-b border-light-gray/50">
                        <span className="text-sm text-navy">Body Text</span>
                        <span className="text-xs text-charcoal">14px · Regular · Body copy</span>
                    </div>
                    <div className="flex items-baseline gap-4">
                        <span className="text-xs text-charcoal">Caption / Small</span>
                        <span className="text-xs text-charcoal">12px · Regular · Footnotes</span>
                    </div>
                </div>
            </Card>

            {/* Status System */}
            <Card>
                <CardHeader title="Status Dot System" subtitle="Dot + label pattern — never full-row color" />
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { label: 'Active / Success / Done', status: 'active' },
                        { label: 'In Progress / Pending / Todo', status: 'pending' },
                        { label: 'Blocked / Failed / Critical', status: 'blocked' },
                        { label: 'Paused / Archived / Cancelled', status: 'paused' },
                    ].map((item) => (
                        <div key={item.status} className="flex items-center gap-3 p-3 rounded-lg bg-surface">
                            <StatusBadge status={item.status} />
                            <span className="text-xs text-charcoal">{item.label}</span>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Design Rules */}
            <Card>
                <CardHeader title="Design Rules" subtitle="Apple-grade standard — non-negotiable" />
                <div className="space-y-2">
                    {[
                        'Rounded corners: 8px minimum on all cards and inputs',
                        'Shadows: soft only — 0 4px 24px rgba(0,0,0,0.12)',
                        'Dark sidebar (#1a2332), light main content (#f9fafb)',
                        'Whitespace is a design element — use generously',
                        'One primary visual action per screen section',
                        'Status badges: colored dots + label text (not full-row color)',
                        'Grid: 8px base. Everything snaps to it.',
                        'No gradients unless explicitly defined',
                        'No stock photos anywhere in the UI',
                    ].map((rule, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-charcoal">
                            <Palette size={14} className="text-teal flex-shrink-0 mt-0.5" />
                            <span>{rule}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}
