import { useState } from 'react'
import TabNav from '../components/ui/TabNav'
import Card from '../components/ui/Card'
import StatusBadge from '../components/ui/StatusBadge'
import StatCard from '../components/ui/StatCard'
import SkeletonLoader from '../components/ui/SkeletonLoader'
import EmptyState from '../components/ui/EmptyState'
import Drawer from '../components/ui/Drawer'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import { useDeals } from '../hooks/useDeals'
import { useContacts } from '../hooks/useContacts'
import { useActivityLog } from '../hooks/useActivityLog'
import DepartmentTasks from '../components/ui/DepartmentTasks'
import { DEAL_STAGES, DEAL_STAGE_LABELS, OUTREACH_STATUSES, formatStatus } from '../lib/types'
import type { Deal, Contact } from '../lib/types'
import {
    TrendingUp,
    Users,
    Mail,
    DollarSign,
    Plus,
    Search,
    ExternalLink,
} from 'lucide-react'

export default function Sales() {
    const [activeTab, setActiveTab] = useState('pipeline')

    return (
        <div className="space-y-6 fade-in">
            <div>
                <h1 className="text-2xl font-bold text-navy">Sales Department</h1>
                <p className="text-sm text-charcoal mt-1">Pipeline, contacts, and outreach in one place.</p>
            </div>

            <TabNav
                tabs={[
                    { key: 'pipeline', label: 'Pipeline' },
                    { key: 'contacts', label: 'Contacts' },
                    { key: 'outreach', label: 'Outreach' },
                    { key: 'tasks', label: 'Tasks' },
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
            />

            <div className="mt-4">
                {activeTab === 'pipeline' && <PipelineTab />}
                {activeTab === 'contacts' && <ContactsTab />}
                {activeTab === 'outreach' && <OutreachTab />}
                {activeTab === 'tasks' && <DepartmentTasks agentNames={['CRO']} title="Sales Tasks" />}
            </div>
        </div>
    )
}

/* ============================================================
   PIPELINE TAB
   ============================================================ */
function PipelineTab() {
    const { deals, loading } = useDeals()
    const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)

    const totalMRR = deals
        .filter((d) => !['closed_lost'].includes(d.stage))
        .reduce((s, d) => s + (d.mrr || 0), 0)

    const avgDealSize =
        deals.length > 0
            ? deals.reduce((s, d) => s + (d.mrr || 0), 0) / deals.length
            : 0

    const kanbanStages = DEAL_STAGES.filter((s) => s !== 'closed_lost')

    if (loading) return <SkeletonLoader variant="card" count={4} />

    return (
        <div className="space-y-6">
            {/* Summary bar */}
            <div className="grid grid-cols-3 gap-4">
                <StatCard
                    label="Total Pipeline MRR"
                    value={`$${totalMRR.toLocaleString()}`}
                    icon={<DollarSign size={20} />}
                />
                <StatCard
                    label="Deal Count"
                    value={deals.length}
                    icon={<TrendingUp size={20} />}
                />
                <StatCard
                    label="Avg Deal Size"
                    value={`$${Math.round(avgDealSize).toLocaleString()}`}
                    icon={<DollarSign size={20} />}
                />
            </div>

            {/* Kanban board */}
            {deals.length === 0 ? (
                <EmptyState
                    icon={<TrendingUp size={24} />}
                    title="No deals in pipeline"
                    description="Start by adding your first deal to track your sales pipeline."
                />
            ) : (
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {kanbanStages.map((stage) => {
                        const stageDeals = deals.filter((d) => d.stage === stage)
                        const stageMRR = stageDeals.reduce((s, d) => s + (d.mrr || 0), 0)

                        return (
                            <div
                                key={stage}
                                className="flex-shrink-0 w-[260px]"
                            >
                                {/* Column header */}
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <div>
                                        <h3 className="text-xs font-semibold text-navy uppercase tracking-wide">
                                            {DEAL_STAGE_LABELS[stage]}
                                        </h3>
                                        <p className="text-[10px] text-charcoal mt-0.5">
                                            {stageDeals.length} · ${stageMRR.toLocaleString()}
                                        </p>
                                    </div>
                                    <span className="text-[11px] font-medium text-charcoal bg-light-gray/60 px-2 py-0.5 rounded-full">
                                        {stageDeals.length}
                                    </span>
                                </div>

                                {/* Cards */}
                                <div className="space-y-2 min-h-[100px] bg-surface/50 rounded-lg p-2">
                                    {stageDeals.length === 0 ? (
                                        <div className="text-[11px] text-charcoal text-center py-8">
                                            No deals
                                        </div>
                                    ) : (
                                        stageDeals.map((deal) => (
                                            <div
                                                key={deal.id}
                                                onClick={() => setSelectedDeal(deal)}
                                                className="card-sm cursor-pointer hover:shadow-card transition-shadow"
                                            >
                                                <div className="text-sm font-medium text-navy truncate">
                                                    {deal.company}
                                                </div>
                                                {deal.contact && (
                                                    <div className="text-xs text-charcoal mt-0.5 truncate">
                                                        {deal.contact.name}
                                                    </div>
                                                )}
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-xs font-semibold text-teal">
                                                        ${(deal.mrr || 0).toLocaleString()}/mo
                                                    </span>
                                                    {deal.source && (
                                                        <span className="text-[10px] text-charcoal bg-light-gray/60 px-1.5 py-0.5 rounded">
                                                            {deal.source.replace(/_/g, ' ')}
                                                        </span>
                                                    )}
                                                </div>
                                                {deal.expected_close_date && (
                                                    <div className="text-[10px] text-charcoal mt-1">
                                                        Close: {new Date(deal.expected_close_date).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Deal drawer */}
            <Drawer
                open={!!selectedDeal}
                onClose={() => setSelectedDeal(null)}
                title={selectedDeal?.company || 'Deal Details'}
                subtitle={selectedDeal?.contact?.name || undefined}
            >
                {selectedDeal && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[11px] text-charcoal font-medium">Stage</label>
                                <p className="text-sm text-navy mt-0.5">
                                    <StatusBadge status={selectedDeal.stage} />
                                </p>
                            </div>
                            <div>
                                <label className="text-[11px] text-charcoal font-medium">MRR</label>
                                <p className="text-sm font-semibold text-teal mt-0.5">
                                    ${(selectedDeal.mrr || 0).toLocaleString()}/mo
                                </p>
                            </div>
                            <div>
                                <label className="text-[11px] text-charcoal font-medium">Source</label>
                                <p className="text-sm text-navy mt-0.5">
                                    {(selectedDeal.source || 'Unknown').replace(/_/g, ' ')}
                                </p>
                            </div>
                            <div>
                                <label className="text-[11px] text-charcoal font-medium">Expected Close</label>
                                <p className="text-sm text-navy mt-0.5">
                                    {selectedDeal.expected_close_date
                                        ? new Date(selectedDeal.expected_close_date).toLocaleDateString()
                                        : '—'}
                                </p>
                            </div>
                        </div>
                        {selectedDeal.notes && (
                            <div>
                                <label className="text-[11px] text-charcoal font-medium">Notes</label>
                                <p className="text-sm text-charcoal mt-0.5">{selectedDeal.notes}</p>
                            </div>
                        )}
                    </div>
                )}
            </Drawer>
        </div>
    )
}

/* ============================================================
   CONTACTS TAB
   ============================================================ */
function ContactsTab() {
    const [statusFilter, setStatusFilter] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [showAddModal, setShowAddModal] = useState(false)
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
    const { contacts, loading, addContact } = useContacts({
        outreachStatus: statusFilter || undefined,
        search: searchTerm || undefined,
    })

    const [newContact, setNewContact] = useState({
        name: '',
        company: '',
        title: '',
        email: '',
        linkedin_url: '',
        phone: '',
    })

    async function handleAddContact() {
        if (!newContact.name) return
        try {
            await addContact({
                ...newContact,
                outreach_status: 'not_contacted',
            } as any)
            setShowAddModal(false)
            setNewContact({ name: '', company: '', title: '', email: '', linkedin_url: '', phone: '' })
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className="space-y-4">
            {/* Filter bar */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal" />
                    <input
                        type="text"
                        placeholder="Search by name, company, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-light-gray rounded-lg bg-white focus:outline-none focus:border-teal transition-colors"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 text-sm border border-light-gray rounded-lg bg-white focus:outline-none focus:border-teal cursor-pointer"
                >
                    <option value="">All Statuses</option>
                    {OUTREACH_STATUSES.map((s) => (
                        <option key={s} value={s}>{formatStatus(s)}</option>
                    ))}
                </select>
                <Button onClick={() => setShowAddModal(true)} size="sm">
                    <Plus size={14} /> Add Contact
                </Button>
            </div>

            {/* Table */}
            <Card padding={false}>
                {loading ? (
                    <div className="p-4">
                        <SkeletonLoader variant="row" count={5} />
                    </div>
                ) : contacts.length === 0 ? (
                    <EmptyState
                        icon={<Users size={24} />}
                        title="No contacts found"
                        description="Add your first contact or adjust filters."
                        action={
                            <Button onClick={() => setShowAddModal(true)} size="sm">
                                <Plus size={14} /> Add Contact
                            </Button>
                        }
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-light-gray">
                                    <th className="text-left text-[11px] font-semibold text-charcoal uppercase tracking-wide px-4 py-3">Name</th>
                                    <th className="text-left text-[11px] font-semibold text-charcoal uppercase tracking-wide px-4 py-3">Company</th>
                                    <th className="text-left text-[11px] font-semibold text-charcoal uppercase tracking-wide px-4 py-3">Title</th>
                                    <th className="text-left text-[11px] font-semibold text-charcoal uppercase tracking-wide px-4 py-3">Status</th>
                                    <th className="text-left text-[11px] font-semibold text-charcoal uppercase tracking-wide px-4 py-3">Email</th>
                                    <th className="text-left text-[11px] font-semibold text-charcoal uppercase tracking-wide px-4 py-3">LinkedIn</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.map((contact) => (
                                    <tr
                                        key={contact.id}
                                        onClick={() => setSelectedContact(contact)}
                                        className="border-b border-light-gray/50 hover:bg-surface cursor-pointer transition-colors"
                                    >
                                        <td className="px-4 py-3 text-sm font-medium text-navy">{contact.name}</td>
                                        <td className="px-4 py-3 text-sm text-charcoal">{contact.company || '—'}</td>
                                        <td className="px-4 py-3 text-sm text-charcoal">{contact.title || '—'}</td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={contact.outreach_status} size="sm" />
                                        </td>
                                        <td className="px-4 py-3 text-sm text-charcoal">{contact.email || '—'}</td>
                                        <td className="px-4 py-3">
                                            {contact.linkedin_url ? (
                                                <a
                                                    href={contact.linkedin_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="text-teal hover:text-teal-dark"
                                                >
                                                    <ExternalLink size={14} />
                                                </a>
                                            ) : (
                                                <span className="text-xs text-charcoal">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Contact detail drawer */}
            <Drawer
                open={!!selectedContact}
                onClose={() => setSelectedContact(null)}
                title={selectedContact?.name || 'Contact Details'}
                subtitle={selectedContact?.company || undefined}
            >
                {selectedContact && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[11px] text-charcoal font-medium">Title</label>
                                <p className="text-sm text-navy mt-0.5">{selectedContact.title || '—'}</p>
                            </div>
                            <div>
                                <label className="text-[11px] text-charcoal font-medium">Outreach Status</label>
                                <div className="mt-0.5"><StatusBadge status={selectedContact.outreach_status} /></div>
                            </div>
                            <div>
                                <label className="text-[11px] text-charcoal font-medium">Email</label>
                                <p className="text-sm text-navy mt-0.5">{selectedContact.email || '—'}</p>
                            </div>
                            <div>
                                <label className="text-[11px] text-charcoal font-medium">Phone</label>
                                <p className="text-sm text-navy mt-0.5">{selectedContact.phone || '—'}</p>
                            </div>
                            <div>
                                <label className="text-[11px] text-charcoal font-medium">Source</label>
                                <p className="text-sm text-navy mt-0.5">{(selectedContact.source || '—').replace(/_/g, ' ')}</p>
                            </div>
                            <div>
                                <label className="text-[11px] text-charcoal font-medium">LinkedIn</label>
                                {selectedContact.linkedin_url ? (
                                    <a href={selectedContact.linkedin_url} target="_blank" rel="noopener noreferrer"
                                        className="text-sm text-teal hover:underline mt-0.5 block truncate">
                                        View Profile
                                    </a>
                                ) : (
                                    <p className="text-sm text-navy mt-0.5">—</p>
                                )}
                            </div>
                        </div>
                        {selectedContact.notes && (
                            <div>
                                <label className="text-[11px] text-charcoal font-medium">Notes</label>
                                <p className="text-sm text-charcoal mt-0.5">{selectedContact.notes}</p>
                            </div>
                        )}
                    </div>
                )}
            </Drawer>

            {/* Add Contact Modal */}
            <Modal
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Add Contact"
                actions={
                    <>
                        <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
                        <Button onClick={handleAddContact}>Add Contact</Button>
                    </>
                }
            >
                <div className="space-y-3">
                    {(['name', 'company', 'title', 'email', 'linkedin_url', 'phone'] as const).map((field) => (
                        <div key={field}>
                            <label className="text-xs font-medium text-charcoal capitalize block mb-1">
                                {field.replace(/_/g, ' ')}
                                {field === 'name' && <span className="text-status-blocked ml-0.5">*</span>}
                            </label>
                            <input
                                type={field === 'email' ? 'email' : 'text'}
                                value={newContact[field]}
                                onChange={(e) => setNewContact({ ...newContact, [field]: e.target.value })}
                                className="w-full px-3 py-2 text-sm border border-light-gray rounded-lg focus:outline-none focus:border-teal transition-colors"
                                placeholder={`Enter ${field.replace(/_/g, ' ')}`}
                            />
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    )
}

/* ============================================================
   OUTREACH TAB
   ============================================================ */
function OutreachTab() {
    const { entries, loading } = useActivityLog({
        agentName: ['Email Outbound', 'LinkedIn Outbound'],
        limit: 50,
    })
    const [selectedEntry, setSelectedEntry] = useState<any>(null)

    const drafts = entries.filter((e) => e.status === 'pending')
    const sent = entries.filter((e) => e.status === 'success')
    const failed = entries.filter((e) => e.status === 'failed')

    return (
        <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                <StatCard label="Total Emails" value={entries.length} icon={<Mail size={18} />} />
                <StatCard label="Drafts / Pending" value={drafts.length} icon={<Mail size={18} />} />
                <StatCard label="Sent / Success" value={sent.length} icon={<Mail size={18} />} />
                <StatCard label="Failed" value={failed.length} icon={<Mail size={18} />} />
            </div>

            {/* Email list */}
            <Card padding={false}>
                {loading ? (
                    <div className="p-4"><SkeletonLoader variant="row" count={5} /></div>
                ) : entries.length === 0 ? (
                    <EmptyState
                        icon={<Mail size={24} />}
                        title="No outreach activity"
                        description="Email and LinkedIn outreach activity will appear here."
                    />
                ) : (
                    <div className="divide-y divide-light-gray/50">
                        {entries.map((entry) => (
                            <div
                                key={entry.id}
                                onClick={() => setSelectedEntry(entry)}
                                className="flex items-start gap-3 px-4 py-3 hover:bg-surface cursor-pointer transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Mail size={14} className="text-navy" />
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

            {/* Approval drawer */}
            <Drawer
                open={!!selectedEntry}
                onClose={() => setSelectedEntry(null)}
                title="Outreach Details"
                subtitle={selectedEntry?.agent?.name || undefined}
                actions={
                    selectedEntry?.status === 'pending' ? (
                        <>
                            <Button variant="danger" size="sm" onClick={() => setSelectedEntry(null)}>Reject</Button>
                            <Button variant="secondary" size="sm" onClick={() => setSelectedEntry(null)}>Edit</Button>
                            <Button size="sm" onClick={() => setSelectedEntry(null)}>Approve</Button>
                        </>
                    ) : undefined
                }
            >
                {selectedEntry && (
                    <div className="space-y-4">
                        <div>
                            <label className="text-[11px] text-charcoal font-medium">Agent</label>
                            <p className="text-sm text-navy mt-0.5">{selectedEntry.agent?.name || 'Unknown'}</p>
                        </div>
                        <div>
                            <label className="text-[11px] text-charcoal font-medium">Skill Used</label>
                            <p className="text-sm text-navy mt-0.5">
                                {(selectedEntry.skill_used ?? 'action').replace(/_/g, ' ')}
                            </p>
                        </div>
                        <div>
                            <label className="text-[11px] text-charcoal font-medium">Status</label>
                            <div className="mt-0.5"><StatusBadge status={selectedEntry.status} /></div>
                        </div>
                        <div>
                            <label className="text-[11px] text-charcoal font-medium">Output</label>
                            <p className="text-sm text-charcoal mt-0.5 whitespace-pre-wrap">
                                {selectedEntry.output_summary}
                            </p>
                        </div>
                    </div>
                )}
            </Drawer>
        </div>
    )
}
