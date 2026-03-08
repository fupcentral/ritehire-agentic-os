import Card, { CardHeader } from '../components/ui/Card'
import StatCard from '../components/ui/StatCard'
import SkeletonLoader from '../components/ui/SkeletonLoader'
import EmptyState from '../components/ui/EmptyState'
import StatusBadge from '../components/ui/StatusBadge'
import { useDeals } from '../hooks/useDeals'
import { useActivityLog } from '../hooks/useActivityLog'
import {
    DollarSign,
    TrendingUp,
    PiggyBank,
    CreditCard,
    Activity,
    BarChart3,
} from 'lucide-react'

export default function Finance() {
    const { deals, loading: dealsLoading } = useDeals()
    const { entries, loading: activityLoading } = useActivityLog({
        agentName: ['CFO', 'Admin'],
        limit: 20,
    })

    const closedWonMRR = deals
        .filter((d) => d.stage === 'closed_won')
        .reduce((sum, d) => sum + (d.mrr || 0), 0)

    const pipelineMRR = deals
        .filter((d) => !['closed_won', 'closed_lost'].includes(d.stage))
        .reduce((sum, d) => sum + (d.mrr || 0), 0)

    // Weighted pipeline (discovery=20%, proposal=40%, negotiation=60%)
    const weightedPipeline = deals
        .filter((d) => !['closed_won', 'closed_lost'].includes(d.stage))
        .reduce((sum, d) => {
            const weights: Record<string, number> = {
                prospecting: 0.05,
                contacted: 0.1,
                discovery: 0.2,
                proposal: 0.4,
                negotiation: 0.6,
            }
            return sum + (d.mrr || 0) * (weights[d.stage] || 0.1)
        }, 0)

    const totalDeals = deals.length
    const openDeals = deals.filter((d) => !['closed_won', 'closed_lost'].includes(d.stage)).length

    return (
        <div className="space-y-6 fade-in">
            <div>
                <h1 className="text-2xl font-bold text-navy">Finance Department</h1>
                <p className="text-sm text-charcoal mt-1">Revenue, runway, and financial health.</p>
            </div>

            {/* Key metrics */}
            {dealsLoading ? (
                <SkeletonLoader variant="stat" count={4} />
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        label="Active MRR"
                        value={`£${closedWonMRR.toLocaleString()}`}
                        icon={<DollarSign size={20} />}
                    />
                    <StatCard
                        label="Pipeline MRR"
                        value={`£${pipelineMRR.toLocaleString()}`}
                        icon={<TrendingUp size={20} />}
                    />
                    <StatCard
                        label="Weighted Pipeline"
                        value={`£${Math.round(weightedPipeline).toLocaleString()}`}
                        icon={<BarChart3 size={20} />}
                    />
                    <StatCard
                        label="Open / Total Deals"
                        value={`${openDeals} / ${totalDeals}`}
                        icon={<PiggyBank size={20} />}
                    />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue by deal */}
                <Card>
                    <CardHeader title="Revenue Breakdown" icon={<DollarSign size={16} />} subtitle="MRR by deal" />
                    {dealsLoading ? (
                        <SkeletonLoader variant="row" count={3} />
                    ) : deals.length === 0 ? (
                        <EmptyState
                            icon={<DollarSign size={20} />}
                            title="No deals"
                            description="Revenue data will appear once deals are in the pipeline."
                        />
                    ) : (
                        <div className="space-y-2">
                            {deals
                                .filter((d) => d.mrr && d.mrr > 0)
                                .sort((a, b) => (b.mrr || 0) - (a.mrr || 0))
                                .map((deal) => (
                                    <div key={deal.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface">
                                        <div className="min-w-0 flex-1">
                                            <div className="text-sm font-medium text-navy">{deal.company}</div>
                                            <div className="text-xs text-charcoal mt-0.5">
                                                <StatusBadge status={deal.stage} size="sm" />
                                            </div>
                                        </div>
                                        <span className="text-sm font-semibold text-teal">
                                            £{(deal.mrr || 0).toLocaleString()}/mo
                                        </span>
                                    </div>
                                ))}
                        </div>
                    )}
                </Card>

                {/* Runway placeholder */}
                <Card>
                    <CardHeader title="Runway" icon={<PiggyBank size={16} />} subtitle="Cash flow projection" />
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
                            <CreditCard size={24} className="text-amber-400" />
                        </div>
                        <h4 className="text-sm font-semibold text-navy mb-1">Connect Stripe to activate</h4>
                        <p className="text-xs text-charcoal text-center max-w-[240px]">
                            Runway calculations require live payment data from Stripe.
                        </p>
                        <span className="mt-3 text-[11px] font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                            Setup required
                        </span>
                    </div>
                </Card>
            </div>

            {/* CFO Activity */}
            <Card>
                <CardHeader
                    title="CFO & Admin Activity"
                    icon={<Activity size={16} />}
                    subtitle="Recent financial operations"
                />
                {activityLoading ? (
                    <SkeletonLoader variant="row" count={5} />
                ) : entries.length === 0 ? (
                    <EmptyState
                        icon={<Activity size={20} />}
                        title="No CFO activity"
                        description="Financial agent activity will appear here."
                    />
                ) : (
                    <div className="space-y-1">
                        {entries.map((entry) => (
                            <div
                                key={entry.id}
                                className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-surface transition-colors"
                            >
                                <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-[10px] font-semibold text-amber-600">
                                        {(entry.agent?.name || 'CF').slice(0, 2).toUpperCase()}
                                    </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-navy">{entry.agent?.name || 'Unknown'}</span>
                                        <span className="text-xs text-charcoal">
                                            {(entry.skill_used ?? 'action').replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                    <div className="text-xs text-charcoal mt-0.5 line-clamp-1">{entry.output_summary}</div>
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
