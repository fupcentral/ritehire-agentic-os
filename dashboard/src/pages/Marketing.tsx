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
import {
    MARKETING_DRIVE_RESOURCES,
    getDriveLinksForActivity,
    type DriveResource,
} from '../lib/driveLinks'
import {
    Megaphone,
    Image,
    Mail,
    Palette,
    CheckCircle2,
    Edit3,
    RefreshCw,
    SkipForward,
    ExternalLink,
    FolderOpen,
    FileText,
    FileSpreadsheet,
    ImageIcon,
    HardDrive,
} from 'lucide-react'

const driveIconMap: Record<DriveResource['icon'], typeof FolderOpen> = {
    folder: FolderOpen,
    doc: FileText,
    sheet: FileSpreadsheet,
    image: ImageIcon,
}

export default function Marketing() {
    const [activeTab, setActiveTab] = useState('LinkedIn')

    return (
        <div className="space-y-6 fade-in">
            <div>
                <h1 className="text-2xl font-bold text-navy">Marketing Department</h1>
                <p className="text-sm text-charcoal mt-1">LinkedIn content engine, email sequences, and brand.</p>
            </div>

            <TabNav
                tabs={['LinkedIn', 'Email Sequences', 'Brand', 'Drive Resources']}
                active={activeTab}
                onChange={setActiveTab}
            />

            {activeTab === 'LinkedIn' && <LinkedInTab />}
            {activeTab === 'Email Sequences' && <EmailSequencesTab />}
            {activeTab === 'Brand' && <BrandTab />}
            {activeTab === 'Drive Resources' && <DriveResourcesTab />}
        </div>
    )
}

/* ============================================================
   LINKEDIN TAB
   ============================================================ */
function LinkedInTab() {
    const { entries: allEntries, loading } = useActivityLog({
        agentName: ['LinkedIn Outbound', 'Brand', 'CDO', 'Chief Design Officer'],
        limit: 50,
    })
    // Show entries that mention LinkedIn or content/post related work
    const entries = allEntries.filter((e) => {
        const summary = (e.output_summary || '').toLowerCase()
        const skill = (e.skill_used || '').toLowerCase()
        const agentName = (e.agent?.name || '').toLowerCase()
        return (
            summary.includes('linkedin') ||
            summary.includes('post') ||
            summary.includes('content') ||
            skill.includes('linkedin') ||
            skill.includes('content') ||
            agentName.includes('brand') ||
            agentName.includes('linkedin')
        )
    })
    const [selectedPost, setSelectedPost] = useState<any>(null)
    const selectedDriveLinks = selectedPost
        ? getDriveLinksForActivity(selectedPost.output_summary, selectedPost.skill_used)
        : []

    const pending = entries.filter((e) => e.status === 'pending')
    const approved = entries.filter((e) => e.status === 'success')

    return (
        <div className="space-y-4">
            {/* Stats row */}
            <div className="grid grid-cols-4 gap-4">
                <StatCard label="Total Posts" value={entries.length} icon={<Megaphone size={18} />} />
                <StatCard label="Pending Review" value={pending.length} icon={<Image size={18} />} />
                <StatCard label="Approved" value={approved.length} icon={<CheckCircle2 size={18} />} />
                <StatCard label="Scheduled" value={0} icon={<Megaphone size={18} />} />
            </div>

            {/* Post list */}
            <Card className="!p-0 overflow-hidden">
                {loading ? (
                    <div className="p-6"><SkeletonLoader variant="row" count={5} /></div>
                ) : entries.length === 0 ? (
                    <EmptyState
                        icon={<Megaphone size={24} />}
                        title="No LinkedIn posts yet"
                        description="Generate your first LinkedIn post to get started."
                        action={<Button size="sm" icon={<Megaphone size={14} />}>Generate Post</Button>}
                    />
                ) : (
                    <div className="divide-y divide-light-gray/30">
                        {entries.map((entry) => {
                            const links = getDriveLinksForActivity(entry.output_summary, entry.skill_used)
                            return (
                                <div
                                    key={entry.id}
                                    onClick={() => setSelectedPost(entry)}
                                    className="flex items-start gap-3 px-5 py-3.5 hover:bg-surface cursor-pointer transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Megaphone size={14} className="text-purple-500" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-navy">
                                                {entry.agent?.name || 'Unknown'}
                                            </span>
                                            <span className="text-xs text-charcoal">
                                                {(entry.skill_used ?? 'action').replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                        <div className="text-xs text-charcoal mt-0.5 line-clamp-2">
                                            {entry.output_summary}
                                        </div>
                                        {/* Drive links inline */}
                                        {links.length > 0 && (
                                            <div className="flex items-center gap-2 mt-1.5">
                                                {links.slice(0, 2).map((link) => (
                                                    <a
                                                        key={link.label}
                                                        href={link.driveUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="inline-flex items-center gap-1 text-[10px] font-medium text-teal bg-teal/5 hover:bg-teal/10 px-2 py-0.5 rounded-full transition-colors"
                                                    >
                                                        <HardDrive size={9} />
                                                        {link.label}
                                                        <ExternalLink size={8} />
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                        <StatusBadge status={entry.status} size="sm" />
                                        <span className="text-[10px] text-charcoal">
                                            {new Date(entry.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </Card>

            {/* Post detail drawer */}
            <Drawer
                open={!!selectedPost}
                onClose={() => setSelectedPost(null)}
                title="Post Details"
                subtitle={selectedPost?.agent?.name}
                width="w-[520px]"
            >
                {selectedPost && (
                    <div className="space-y-5">
                        <div>
                            <label className="text-[11px] text-charcoal font-medium uppercase tracking-wide">Status</label>
                            <div className="mt-1"><StatusBadge status={selectedPost.status} /></div>
                        </div>
                        <div>
                            <label className="text-[11px] text-charcoal font-medium uppercase tracking-wide">Post Copy</label>
                            <div className="mt-2 bg-surface rounded-xl p-4 text-sm text-navy whitespace-pre-wrap leading-relaxed">
                                {selectedPost.output_summary}
                            </div>
                        </div>
                        <div>
                            <label className="text-[11px] text-charcoal font-medium uppercase tracking-wide">Visual Brief</label>
                            <div className="mt-2 bg-navy/5 rounded-xl p-4 text-xs text-charcoal">
                                Visual will be generated based on brand guidelines.
                            </div>
                        </div>

                        {/* Drive links in drawer */}
                        {selectedDriveLinks.length > 0 && (
                            <div>
                                <label className="text-[11px] text-charcoal font-medium uppercase tracking-wide">
                                    Google Drive Files
                                </label>
                                <div className="mt-2 space-y-1.5">
                                    {selectedDriveLinks.map((link) => {
                                        const Icon = driveIconMap[link.icon]
                                        return (
                                            <a
                                                key={link.label}
                                                href={link.driveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-3 rounded-xl bg-surface hover:bg-teal/5 border border-transparent hover:border-teal/15 transition-all group"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-teal/8 flex items-center justify-center flex-shrink-0">
                                                    <Icon size={14} className="text-teal" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-sm font-medium text-navy group-hover:text-teal transition-colors">
                                                        {link.label}
                                                    </div>
                                                    <div className="text-[11px] text-charcoal">{link.description}</div>
                                                </div>
                                                <ExternalLink size={14} className="text-charcoal/30 group-hover:text-teal transition-colors flex-shrink-0" />
                                            </a>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-2 pt-2">
                            <Button icon={<CheckCircle2 size={14} />}>Approve</Button>
                            <Button variant="secondary" icon={<Edit3 size={14} />}>Edit</Button>
                            <Button variant="secondary" icon={<RefreshCw size={14} />}>Regenerate</Button>
                            <Button variant="ghost" icon={<SkipForward size={14} />}>Skip</Button>
                        </div>
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
    const { entries, loading } = useActivityLog({
        agentName: ['Email Outbound'],
        limit: 50,
    })

    const drafts = entries.filter((e) => e.status === 'pending')
    const sent = entries.filter((e) => e.status === 'success')
    const emailDriveLinks = MARKETING_DRIVE_RESOURCES.filter(
        (r) => r.category === 'email' || r.category === 'general'
    )

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
                <StatCard label="Drafts" value={drafts.length} icon={<Mail size={18} />} />
                <StatCard label="Pending" value={drafts.length} icon={<Mail size={18} />} />
                <StatCard label="Sent" value={sent.length} icon={<Mail size={18} />} />
                <StatCard label="Meetings Booked" value={0} icon={<Mail size={18} />} />
            </div>

            <Card className="!p-0 overflow-hidden">
                {loading ? (
                    <div className="p-6"><SkeletonLoader variant="row" count={3} /></div>
                ) : entries.length === 0 ? (
                    <EmptyState
                        icon={<Mail size={24} />}
                        title="No email sequences"
                        description="Email sequences will appear once the outbound agent starts drafting."
                    />
                ) : (
                    <div className="divide-y divide-light-gray/30">
                        {entries.map((entry) => {
                            const links = getDriveLinksForActivity(entry.output_summary, entry.skill_used)
                            return (
                                <div
                                    key={entry.id}
                                    className="flex items-start gap-3 px-5 py-3.5 hover:bg-surface transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Mail size={14} className="text-blue-500" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <span className="text-sm font-medium text-navy">{entry.agent?.name || 'Unknown'}</span>
                                        <div className="text-xs text-charcoal mt-0.5 line-clamp-1">{entry.output_summary}</div>
                                        {links.length > 0 && (
                                            <div className="flex items-center gap-2 mt-1.5">
                                                {links.map((link) => (
                                                    <a
                                                        key={link.label}
                                                        href={link.driveUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-[10px] font-medium text-teal bg-teal/5 hover:bg-teal/10 px-2 py-0.5 rounded-full transition-colors"
                                                    >
                                                        <HardDrive size={9} />
                                                        {link.label}
                                                        <ExternalLink size={8} />
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <StatusBadge status={entry.status} size="sm" />
                                </div>
                            )
                        })}
                    </div>
                )}
            </Card>

            {/* Drive resources for email */}
            {emailDriveLinks.length > 0 && (
                <Card>
                    <CardHeader
                        title="Drive Resources"
                        icon={<HardDrive size={16} />}
                        subtitle="Related Google Drive files"
                    />
                    <div className="space-y-1.5">
                        {emailDriveLinks.map((link) => (
                            <DriveResourceRow key={link.label} resource={link} />
                        ))}
                    </div>
                </Card>
            )}
        </div>
    )
}

/* ============================================================
   BRAND TAB
   ============================================================ */
function BrandTab() {
    const brandDriveLinks = MARKETING_DRIVE_RESOURCES.filter((r) => r.category === 'brand')

    const colors = [
        { name: 'Dark Navy', hex: '#1a2332', usage: 'Primary background, headings' },
        { name: 'Charcoal', hex: '#4a5568', usage: 'Secondary text, UI elements' },
        { name: 'Teal', hex: '#009886', usage: 'Accent only — CTAs, highlights' },
        { name: 'Light Gray', hex: '#e5e7eb', usage: 'Borders, light surfaces' },
        { name: 'White', hex: '#ffffff', usage: 'Cards, overlays' },
    ]

    return (
        <div className="space-y-6">
            {/* Drive resources for brand */}
            {brandDriveLinks.length > 0 && (
                <Card>
                    <CardHeader
                        title="Brand Files on Drive"
                        icon={<HardDrive size={16} />}
                        subtitle="Google Drive brand assets"
                    />
                    <div className="space-y-1.5">
                        {brandDriveLinks.map((link) => (
                            <DriveResourceRow key={link.label} resource={link} />
                        ))}
                    </div>
                </Card>
            )}

            <Card>
                <CardHeader title="Brand Colors" icon={<Palette size={16} />} subtitle="RiteHire color palette" />
                <div className="grid grid-cols-5 gap-4">
                    {colors.map((c) => (
                        <div key={c.hex} className="text-center">
                            <div
                                className="w-full h-20 rounded-xl mb-2 border border-light-gray/40"
                                style={{ background: c.hex }}
                            />
                            <div className="text-xs font-semibold text-navy">{c.name}</div>
                            <div className="text-[11px] text-charcoal font-mono">{c.hex}</div>
                            <div className="text-[10px] text-charcoal mt-0.5">{c.usage}</div>
                        </div>
                    ))}
                </div>
            </Card>

            <div className="grid grid-cols-2 gap-6">
                <Card>
                    <CardHeader title="Typography" subtitle="Inter — geometric sans-serif" />
                    <div className="space-y-4">
                        <div>
                            <span className="text-2xl font-bold text-navy">Heading 24px Bold</span>
                            <p className="text-xs text-charcoal mt-1">Main headline, primary hook</p>
                        </div>
                        <div>
                            <span className="text-lg font-bold text-navy">Heading 18px Bold</span>
                            <p className="text-xs text-charcoal mt-1">Section heading, card title</p>
                        </div>
                        <div>
                            <span className="text-base font-semibold text-navy">Subheading 16px SemiBold</span>
                            <p className="text-xs text-charcoal mt-1">Subheading, callout</p>
                        </div>
                        <div>
                            <span className="text-sm text-navy">Body 14px Regular</span>
                            <p className="text-xs text-charcoal mt-1">Body copy, bullet points</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <CardHeader title="Design Rules" subtitle="Apple-grade standards" />
                    <div className="space-y-3">
                        {[
                            'Whitespace is a design element — use generously',
                            'One primary visual action per screen section',
                            'Rounded corners: 8px minimum on all cards',
                            'Shadows: soft only — never harsh',
                            'Grid: 8px base. Everything snaps to it.',
                            'Status badges: dot + label, never full-row color',
                            'No gradients unless explicitly defined',
                            'No stock photos anywhere in the UI',
                        ].map((rule, i) => (
                            <div key={i} className="flex items-start gap-2">
                                <CheckCircle2 size={14} className="text-teal flex-shrink-0 mt-0.5" />
                                <span className="text-xs text-charcoal">{rule}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}

/* ============================================================
   DRIVE RESOURCES TAB — all marketing Drive files
   ============================================================ */
function DriveResourcesTab() {
    const linkedinLinks = MARKETING_DRIVE_RESOURCES.filter((r) => r.category === 'linkedin')
    const brandLinks = MARKETING_DRIVE_RESOURCES.filter((r) => r.category === 'brand')
    const emailLinks = MARKETING_DRIVE_RESOURCES.filter((r) => r.category === 'email')
    const generalLinks = MARKETING_DRIVE_RESOURCES.filter((r) => r.category === 'general')

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-teal/5 border border-teal/10">
                <HardDrive size={16} className="text-teal flex-shrink-0" />
                <div>
                    <span className="text-sm font-medium text-teal">Google Drive Connected</span>
                    <p className="text-xs text-charcoal mt-0.5">
                        All files are stored in <span className="font-medium">RiteHire OS</span> on Google Drive.
                        Click any item to open in Drive.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LinkedIn */}
                <Card>
                    <CardHeader title="LinkedIn Content" icon={<Megaphone size={16} />} subtitle={`${linkedinLinks.length} resources`} />
                    <div className="space-y-1.5">
                        {linkedinLinks.map((link) => (
                            <DriveResourceRow key={link.label} resource={link} />
                        ))}
                    </div>
                </Card>

                {/* Brand */}
                <Card>
                    <CardHeader title="Brand Assets" icon={<Palette size={16} />} subtitle={`${brandLinks.length} resources`} />
                    <div className="space-y-1.5">
                        {brandLinks.map((link) => (
                            <DriveResourceRow key={link.label} resource={link} />
                        ))}
                    </div>
                </Card>

                {/* Email */}
                <Card>
                    <CardHeader title="Email & Outreach" icon={<Mail size={16} />} subtitle={`${emailLinks.length} resources`} />
                    <div className="space-y-1.5">
                        {emailLinks.map((link) => (
                            <DriveResourceRow key={link.label} resource={link} />
                        ))}
                    </div>
                </Card>

                {/* General */}
                <Card>
                    <CardHeader title="Compliance & SOPs" icon={<FileText size={16} />} subtitle={`${generalLinks.length} resources`} />
                    <div className="space-y-1.5">
                        {generalLinks.map((link) => (
                            <DriveResourceRow key={link.label} resource={link} />
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}

/* ============================================================
   SHARED: Drive resource row
   ============================================================ */
function DriveResourceRow({ resource }: { resource: DriveResource }) {
    const Icon = driveIconMap[resource.icon]
    return (
        <a
            href={resource.driveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl bg-surface hover:bg-teal/5 border border-transparent hover:border-teal/15 transition-all group cursor-pointer"
        >
            <div className="w-8 h-8 rounded-lg bg-teal/8 flex items-center justify-center flex-shrink-0">
                <Icon size={14} className="text-teal" />
            </div>
            <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-navy group-hover:text-teal transition-colors">
                    {resource.label}
                </div>
                <div className="text-[11px] text-charcoal">{resource.description}</div>
            </div>
            <ExternalLink size={14} className="text-charcoal/30 group-hover:text-teal transition-colors flex-shrink-0" />
        </a>
    )
}
