import { useState } from 'react'
import { useDeals } from '../hooks/useDeals'
import SkeletonLoader from '../components/ui/SkeletonLoader'
import EmptyState from '../components/ui/EmptyState'
import Modal from '../components/ui/Modal'
import { Kanban, Plus, DollarSign, TrendingUp, BarChart3 } from 'lucide-react'
import { supabase } from '../lib/supabase'

const STAGES = [
    { key: 'prospect', label: 'Prospect', color: 'bg-charcoal' },
    { key: 'qualified', label: 'Qualified', color: 'bg-blue-500' },
    { key: 'proposal_sent', label: 'Proposal Sent', color: 'bg-amber-500' },
    { key: 'negotiation', label: 'Negotiation', color: 'bg-orange-500' },
    { key: 'verbal_close', label: 'Verbal Close', color: 'bg-purple-500' },
    { key: 'closed_won', label: 'Closed Won', color: 'bg-teal' },
    { key: 'closed_lost', label: 'Closed Lost', color: 'bg-red-500' },
]

export default function Pipeline() {
    const { deals, loading, refetch } = useDeals()
    const [showAddModal, setShowAddModal] = useState(false)
    const [formData, setFormData] = useState({
        company: '',
        stage: 'prospect',
        mrr: '',
        expected_close_date: '',
        source: '',
        notes: '',
    })

    const openDeals = deals.filter((d) => d.stage !== 'closed_won' && d.stage !== 'closed_lost')
    const totalMrr = openDeals.reduce((sum, d) => sum + Number(d.mrr || 0), 0)
    const avgDeal = openDeals.length > 0 ? totalMrr / openDeals.length : 0

    const handleAddDeal = async () => {
        const { error } = await supabase.from('deals').insert([{
            ...formData,
            mrr: formData.mrr ? parseFloat(formData.mrr) : null,
            expected_close_date: formData.expected_close_date || null,
        }])
        if (!error) {
            setShowAddModal(false)
            setFormData({ company: '', stage: 'prospect', mrr: '', expected_close_date: '', source: '', notes: '' })
            refetch()
        }
    }

    return (
        <div className="max-w-[1400px] mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-navy">Pipeline</h1>
                    <p className="text-sm text-charcoal mt-0.5">Sales pipeline — all active opportunities</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-teal text-white text-sm font-medium rounded-lg hover:bg-teal-dark transition-colors cursor-pointer"
                >
                    <Plus size={16} /> Add Deal
                </button>
            </div>

            {/* Pipeline Summary */}
            <div className="grid grid-cols-3 gap-4">
                <div className="card-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center">
                        <Kanban size={20} className="text-teal" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-navy">{openDeals.length}</div>
                        <div className="text-xs text-charcoal">Open Deals</div>
                    </div>
                </div>
                <div className="card-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center">
                        <TrendingUp size={20} className="text-teal" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-navy">${totalMrr.toLocaleString()}</div>
                        <div className="text-xs text-charcoal">Pipeline MRR</div>
                    </div>
                </div>
                <div className="card-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center">
                        <BarChart3 size={20} className="text-teal" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-navy">${avgDeal.toFixed(0)}</div>
                        <div className="text-xs text-charcoal">Avg Deal Size</div>
                    </div>
                </div>
            </div>

            {/* Kanban Board */}
            {loading ? (
                <div className="grid grid-cols-7 gap-4">
                    {STAGES.map((stage) => (
                        <div key={stage.key} className="space-y-3">
                            <SkeletonLoader variant="text" count={1} />
                            <SkeletonLoader variant="card" count={2} />
                        </div>
                    ))}
                </div>
            ) : deals.length === 0 ? (
                <div className="card">
                    <EmptyState
                        icon={Kanban}
                        title="No deals in pipeline"
                        description="Add your first deal to start tracking your sales pipeline."
                        actionLabel="Add Deal"
                        onAction={() => setShowAddModal(true)}
                    />
                </div>
            ) : (
                <div className="grid grid-cols-7 gap-3 overflow-x-auto">
                    {STAGES.map((stage) => {
                        const stageDeals = deals.filter((d) => d.stage === stage.key)
                        const stageMrr = stageDeals.reduce((s, d) => s + Number(d.mrr || 0), 0)
                        return (
                            <div key={stage.key} className="min-w-[180px]">
                                {/* Column Header */}
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${stage.color}`} />
                                        <span className="text-xs font-semibold text-navy">{stage.label}</span>
                                    </div>
                                    <span className="text-xs font-semibold text-charcoal bg-light-gray px-1.5 py-0.5 rounded">
                                        {stageDeals.length}
                                    </span>
                                </div>
                                {stageMrr > 0 && (
                                    <div className="text-xs text-teal font-medium px-1 mb-2">
                                        ${stageMrr.toLocaleString()} MRR
                                    </div>
                                )}
                                {/* Cards */}
                                <div className="space-y-2">
                                    {stageDeals.map((deal) => (
                                        <div key={deal.id} className="card-sm !p-3 space-y-2">
                                            <p className="text-sm font-semibold text-navy leading-tight">{deal.company}</p>
                                            {deal.contact && (
                                                <p className="text-xs text-charcoal">{deal.contact.name}</p>
                                            )}
                                            {deal.mrr && (
                                                <div className="flex items-center gap-1 text-xs font-semibold text-teal">
                                                    <DollarSign size={12} />
                                                    {Number(deal.mrr).toLocaleString()} /mo
                                                </div>
                                            )}
                                            {deal.expected_close_date && (
                                                <p className="text-[10px] text-charcoal">
                                                    Close: {new Date(deal.expected_close_date).toLocaleDateString()}
                                                </p>
                                            )}
                                            {deal.source && (
                                                <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-surface text-charcoal border border-light-gray">
                                                    {deal.source}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Add Deal Modal */}
            <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add Deal">
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-medium text-charcoal">Company *</label>
                        <input
                            type="text"
                            placeholder="Company name"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="mt-1 w-full px-3 py-2 text-sm border border-light-gray rounded-lg bg-white
                text-navy outline-none focus:border-teal focus:ring-1 focus:ring-teal/20"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-charcoal">Stage</label>
                            <select
                                value={formData.stage}
                                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                                className="mt-1 w-full px-3 py-2 text-sm border border-light-gray rounded-lg bg-white text-navy outline-none cursor-pointer"
                            >
                                {STAGES.map((s) => (
                                    <option key={s.key} value={s.key}>{s.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-charcoal">MRR ($)</label>
                            <input
                                type="number"
                                placeholder="0"
                                value={formData.mrr}
                                onChange={(e) => setFormData({ ...formData, mrr: e.target.value })}
                                className="mt-1 w-full px-3 py-2 text-sm border border-light-gray rounded-lg bg-white text-navy outline-none"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-charcoal">Expected Close Date</label>
                            <input
                                type="date"
                                value={formData.expected_close_date}
                                onChange={(e) => setFormData({ ...formData, expected_close_date: e.target.value })}
                                className="mt-1 w-full px-3 py-2 text-sm border border-light-gray rounded-lg bg-white text-navy outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-charcoal">Source</label>
                            <input
                                type="text"
                                placeholder="e.g. linkedin_outbound"
                                value={formData.source}
                                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                className="mt-1 w-full px-3 py-2 text-sm border border-light-gray rounded-lg bg-white text-navy outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-charcoal">Notes</label>
                        <textarea
                            placeholder="Additional notes..."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={3}
                            className="mt-1 w-full px-3 py-2 text-sm border border-light-gray rounded-lg bg-white text-navy outline-none resize-none"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={() => setShowAddModal(false)}
                            className="px-4 py-2 text-sm font-medium text-charcoal rounded-lg hover:bg-light-gray/50 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddDeal}
                            disabled={!formData.company}
                            className="px-4 py-2 text-sm font-medium text-white bg-teal rounded-lg hover:bg-teal-dark
                transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Add Deal
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
