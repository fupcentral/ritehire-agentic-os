import { useState, useMemo } from 'react'
import { useContacts } from '../hooks/useContacts'
import StatusBadge from '../components/ui/StatusBadge'
import SkeletonLoader from '../components/ui/SkeletonLoader'
import EmptyState from '../components/ui/EmptyState'
import Modal from '../components/ui/Modal'
import Drawer from '../components/ui/Drawer'
import { Users, Plus, Search, ExternalLink } from 'lucide-react'
import type { Contact } from '../lib/types'
import { supabase } from '../lib/supabase'

const STATUS_OPTIONS = [
    'all', 'not_contacted', 'contacted', 'replied', 'meeting_booked', 'disqualified',
]

export default function Contacts() {
    const [statusFilter, setStatusFilter] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [showAddModal, setShowAddModal] = useState(false)
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

    // Debounce search
    const searchTimeout = useMemo(() => {
        return setTimeout(() => setDebouncedSearch(searchQuery), 300)
    }, [searchQuery])
    void searchTimeout

    const { contacts, loading, refetch } = useContacts({
        statusFilter,
        searchQuery: debouncedSearch,
    })

    // Add contact form state
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        title: '',
        email: '',
        linkedin_url: '',
        phone: '',
        source: '',
    })

    const handleAddContact = async () => {
        const { error } = await supabase.from('contacts').insert([formData])
        if (!error) {
            setShowAddModal(false)
            setFormData({ name: '', company: '', title: '', email: '', linkedin_url: '', phone: '', source: '' })
            refetch()
        }
    }

    return (
        <div className="max-w-[1400px] mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-navy">Contacts</h1>
                    <p className="text-sm text-charcoal mt-0.5">Your CRM — all prospects and clients in one place</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-teal text-white text-sm font-medium rounded-lg hover:bg-teal-dark transition-colors cursor-pointer"
                >
                    <Plus size={16} /> Add Contact
                </button>
            </div>

            {/* Filter Bar */}
            <div className="card-sm flex items-center gap-4">
                <div className="flex items-center gap-2 flex-1">
                    <Search size={16} className="text-charcoal" />
                    <input
                        type="text"
                        placeholder="Search by name or company..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 text-sm bg-transparent outline-none text-navy placeholder:text-charcoal/50"
                    />
                </div>
                <div className="w-px h-6 bg-light-gray" />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="text-sm text-navy bg-transparent outline-none cursor-pointer"
                >
                    {STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt === 'all' ? 'All Statuses' : opt.replace(/_/g, ' ')}
                        </option>
                    ))}
                </select>
            </div>

            {/* Contacts Table */}
            <div className="card p-0">
                {loading ? (
                    <div className="p-6">
                        <SkeletonLoader variant="row" count={6} />
                    </div>
                ) : contacts.length === 0 ? (
                    <EmptyState
                        icon={Users}
                        title="No contacts found"
                        description={searchQuery ? 'Try a different search term.' : 'Add your first contact to get started.'}
                        actionLabel={!searchQuery ? 'Add Contact' : undefined}
                        onAction={!searchQuery ? () => setShowAddModal(true) : undefined}
                    />
                ) : (
                    <div className="divide-y divide-light-gray">
                        <div className="grid grid-cols-[1fr_150px_150px_140px_120px_80px] gap-4 px-6 py-3 bg-surface/50 text-xs font-semibold text-charcoal uppercase tracking-wide">
                            <span>Name</span>
                            <span>Company</span>
                            <span>Title</span>
                            <span>Source</span>
                            <span>Status</span>
                            <span>LinkedIn</span>
                        </div>
                        {contacts.map((contact) => (
                            <div
                                key={contact.id}
                                onClick={() => setSelectedContact(contact)}
                                className="grid grid-cols-[1fr_150px_150px_140px_120px_80px] gap-4 px-6 py-4 hover:bg-surface/50
                  transition-colors cursor-pointer items-center"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 rounded-full bg-navy/5 flex items-center justify-center flex-shrink-0">
                                        <span className="text-[10px] font-bold text-navy uppercase">
                                            {contact.name.slice(0, 2)}
                                        </span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-navy truncate">{contact.name}</p>
                                        {contact.email && (
                                            <p className="text-xs text-charcoal truncate">{contact.email}</p>
                                        )}
                                    </div>
                                </div>
                                <span className="text-sm text-charcoal truncate">{contact.company || '—'}</span>
                                <span className="text-sm text-charcoal truncate">{contact.title || '—'}</span>
                                <span className="text-xs text-charcoal">{contact.source || '—'}</span>
                                <StatusBadge status={contact.outreach_status} size="sm" />
                                <div>
                                    {contact.linkedin_url && (
                                        <a
                                            href={contact.linkedin_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="text-teal hover:text-teal-dark"
                                        >
                                            <ExternalLink size={14} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Contact Modal */}
            <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add Contact">
                <div className="space-y-4">
                    {[
                        { key: 'name', label: 'Name *', placeholder: 'Full name' },
                        { key: 'company', label: 'Company', placeholder: 'Company name' },
                        { key: 'title', label: 'Title', placeholder: 'Job title' },
                        { key: 'email', label: 'Email', placeholder: 'email@company.com' },
                        { key: 'linkedin_url', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/...' },
                        { key: 'phone', label: 'Phone', placeholder: '+1 ...' },
                        { key: 'source', label: 'Source', placeholder: 'e.g. target-account-list, referral' },
                    ].map((field) => (
                        <div key={field.key}>
                            <label className="text-xs font-medium text-charcoal">{field.label}</label>
                            <input
                                type="text"
                                placeholder={field.placeholder}
                                value={formData[field.key as keyof typeof formData]}
                                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                                className="mt-1 w-full px-3 py-2 text-sm border border-light-gray rounded-lg bg-white
                  text-navy outline-none focus:border-teal focus:ring-1 focus:ring-teal/20 transition-colors"
                            />
                        </div>
                    ))}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={() => setShowAddModal(false)}
                            className="px-4 py-2 text-sm font-medium text-charcoal rounded-lg hover:bg-light-gray/50 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddContact}
                            disabled={!formData.name}
                            className="px-4 py-2 text-sm font-medium text-white bg-teal rounded-lg hover:bg-teal-dark
                transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Add Contact
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Contact Detail Drawer */}
            <Drawer
                open={!!selectedContact}
                onClose={() => setSelectedContact(null)}
                title={selectedContact?.name || ''}
            >
                {selectedContact && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-navy/5 flex items-center justify-center">
                                <span className="text-lg font-bold text-navy uppercase">
                                    {selectedContact.name.slice(0, 2)}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-navy">{selectedContact.name}</h3>
                                {selectedContact.title && (
                                    <p className="text-sm text-charcoal">{selectedContact.title}{selectedContact.company ? ` at ${selectedContact.company}` : ''}</p>
                                )}
                                <StatusBadge status={selectedContact.outreach_status} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Email', value: selectedContact.email },
                                { label: 'Phone', value: selectedContact.phone },
                                { label: 'Company', value: selectedContact.company },
                                { label: 'Source', value: selectedContact.source },
                            ].map((item) => (
                                <div key={item.label}>
                                    <span className="text-xs text-charcoal">{item.label}</span>
                                    <p className="text-sm font-medium text-navy mt-0.5">{item.value || '—'}</p>
                                </div>
                            ))}
                        </div>

                        {selectedContact.linkedin_url && (
                            <a
                                href={selectedContact.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-teal hover:text-teal-dark"
                            >
                                <ExternalLink size={14} /> View LinkedIn Profile
                            </a>
                        )}

                        {selectedContact.notes && (
                            <div>
                                <h4 className="text-sm font-semibold text-navy mb-2">Notes</h4>
                                <p className="text-sm text-charcoal bg-surface p-3 rounded-lg">{selectedContact.notes}</p>
                            </div>
                        )}
                    </div>
                )}
            </Drawer>
        </div>
    )
}
