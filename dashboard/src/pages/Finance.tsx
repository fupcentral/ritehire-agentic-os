import Card, { CardHeader } from '../components/ui/Card'
import StatCard from '../components/ui/StatCard'
import StatusBadge from '../components/ui/StatusBadge'
import SkeletonLoader from '../components/ui/SkeletonLoader'
import EmptyState from '../components/ui/EmptyState'
import { useDeals } from '../hooks/useDeals'
import { useActivityLog } from '../hooks/useActivityLog'
import DepartmentTasks from '../components/ui/DepartmentTasks'
import {
    DollarSign,
    TrendingUp,
    CreditCard,
    AlertCircle,
    Activity,
    Calculator,
} from 'lucide-react'

export default function Finance() {
    const { deals, loading: dealsLoading } = useDeals()
    const { entries: cfoActivity, loading: activityLoading } = useActivityLog({
        agentName: ['CFO', 'Admin'],
        limit: 20,
    })

    const closedWonDeals = deals.filter((d) => d.stage === 'closed_won')
    const activeMRR = closedWonDeals.reduce((s, d) => s + (d.mrr || 0), 0)

    const activeDeals = deals.filter((d) => !['closed_won', 'closed_lost'].includes(d.stage))
    const pipelineMRR = activeDeals.reduce((s, d) => s + (d.mrr || 0), 0)

    // Weighted pipeline: weight by stage
    const stageWeights: Record<string, number> = {
        prospecting: 0.1,
        contacted: 0.2,
        discovery: 0.35,
        proposal: 0.5,
        negotiation: 0.75,
    }
    const weightedMRR = activeDeals.reduce((s, d) => {
        const weight = stageWeights[d.stage] || 0.25
        return s + (d.mrr || 0) * weight
    }, 0)

    return (
        <div className="space-y-6 fade-in">
            <div>
                <h1 className="text-2xl font-bold text-navy">Finance Department</h1>
                <p className="text-sm text-charcoal mt-1">Revenue tracking, pipeline forecast, and financial operations.</p>
            </div>

            {/* Key metrics */}
            {dealsLoading ? (
                <SkeletonLoader variant="stat" count={4} className="grid grid-cols-4 gap-4" />
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        label="Active MRR"
                        value={`$${activeMRR.toLocaleString()}`}
                        icon={<DollarSign size={20} />}
                        trend={`${closedWonDeals.length} closed deals`}
                    />
                    <StatCard
                        label="Pipeline MRR"
                        value={`$${pipelineMRR.toLocaleString()}`}
                        icon={<TrendingUp size={20} />}
                        trend={`${activeDeals.length} active deals`}
                    />
                    <StatCard
                        label="Weighted Pipeline"
                        value={`$${Math.round(weightedMRR).toLocaleString()}`}
                        icon={<Calculator size={20} />}
                        trend="Stage-weighted forecast"
                    />
                    <StatCard
                        label="Avg Deal MRR"
                        value={deals.length > 0 ? `$${Math.round(deals.reduce((s, d) => s + (d.mrr || 0), 0) / deals.length).toLocaleString()}` : '$0'}
                        icon={<DollarSign size={20} />}
                    />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* MRR Breakdown */}
                <Card>
                    <CardHeader title="MRR Tracker" subtitle="Revenue from closed_won deals" />
                    {dealsLoading ? (
                        <SkeletonLoader variant="row" count={3} />
                    ) : closedWonDeals.length === 0 ? (
                        <EmptyState
                            icon={<DollarSign size={20} />}
                            title="No closed deals yet"
                            description="MRR will be tracked as deals close."
                        />
                    ) : (
                        <div className="space-y-2">
                            {closedWonDeals.map((deal) => (
                                <div key={deal.id} className="flex items-center justify-between p-3 rounded-lg bg-surface">
                                    <div className="min-w-0">
                                        <div className="text-sm font-medium text-navy truncate">{deal.company}</div>
                                        {deal.contact && (
                                            <div className="text-xs text-charcoal">{deal.contact.name}</div>
                                        )}
                                    </div>
                                    <div className="text-sm font-semibold text-teal flex-shrink-0">
                                        ${(deal.mrr || 0).toLocaleString()}/mo
                                    </div>
                                </div>
                            ))}
                            <div className="flex items-center justify-between pt-3 border-t border-light-gray">
                                <span className="text-sm font-semibold text-navy">Total MRR</span>
                                <span className="text-base font-bold text-teal">${activeMRR.toLocaleString()}/mo</span>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Runway Card */}
                <Card>
                    <CardHeader title="Runway" subtitle="Financial runway tracking" />
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-14 h-14 rounded-xl bg-light-gray/60 flex items-center justify-center mb-4">
                            <CreditCard size={24} className="text-charcoal" />
                        </div>
                        <h3 className="text-sm font-semibold text-navy mb-1">Connect Stripe to Activate</h3>
                        <p className="text-xs text-charcoal max-w-[260px] mb-4">
                            Runway tracking requires Stripe integration. Add your Stripe API key to enable automatic financial data.
                        </p>
                        <div className="flex items-center gap-2 text-xs text-charcoal bg-light-gray/40 px-3 py-1.5 rounded-lg">
                            <AlertCircle size={14} />
                            <span>Setup required</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Pipeline Revenue Breakdown */}
            <Card>
                <CardHeader title="Pipeline Revenue by Stage" subtitle="Active deals weighted by stage probability" />
                {dealsLoading ? (
                    <SkeletonLoader variant="row" count={5} />
                ) : activeDeals.length === 0 ? (
                    <EmptyState
                        icon={<TrendingUp size={20} />}
                        title="No active pipeline"
                        description="Pipeline revenue will show once deals are in progress."
                    />
                ) : (
                    <div className="space-y-2">
                        {Object.entries(stageWeights).map(([stage, weight]) => {
                            const stageDeals = activeDeals.filter((d) => d.stage === stage)
                            const raw = stageDeals.reduce((s, d) => s + (d.mrr || 0), 0)
                            const weighted = raw * weight

                            return (
                                <div key={stage} className="flex items-center gap-4 p-3 rounded-lg bg-surface">
                                    <div className="w-28">
                                        <StatusBadge status={stage} size="sm" />
                                    </div>
                                    <div className="flex-1 text-xs text-charcoal">
                                        {stageDeals.length} deal{stageDeals.length !== 1 ? 's' : ''}
                                    </div>
                                    <div className="text-xs text-charcoal w-20 text-right">
                                        ${raw.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-charcoal w-12 text-center">
                                        ×{(weight * 100).toFixed(0)}%
                                    </div>
                                    <div className="text-sm font-semibold text-navy w-24 text-right">
                                        ${Math.round(weighted).toLocaleString()}
                                    </div>
                                </div>
                            )
                        })}
                        <div className="flex items-center justify-between pt-3 border-t border-light-gray">
                            <span className="text-sm font-semibold text-navy">Weighted Total</span>
                            <span className="text-base font-bold text-teal">${Math.round(weightedMRR).toLocaleString()}/mo</span>
                        </div>
                    </div>
                )}
            </Card>

            {/* CFO Agent Activity */}
            <Card>
                <CardHeader
                    title="CFO & Admin Activity"
                    subtitle="Recent activity from CFO and Admin & Ops agents"
                    action={
                        <div className="flex items-center gap-1 text-charcoal">
                            <Activity size={14} />
                            <span className="text-xs">{cfoActivity.length}</span>
                        </div>
                    }
                />
                {activityLoading ? (
                    <SkeletonLoader variant="row" count={4} />
                ) : cfoActivity.length === 0 ? (
                    <EmptyState
                        icon={<Activity size={20} />}
                        title="No CFO activity yet"
                        description="Financial agent activity will appear here."
                    />
                ) : (
                    <div className="space-y-1">
                        {cfoActivity.map((entry) => (
                            <div key={entry.id} className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-surface transition-colors">
                                <div className="w-7 h-7 rounded-full bg-navy/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-[10px] font-semibold text-navy">
                                        {(entry.agent?.name || 'AG').slice(0, 2).toUpperCase()}
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

            {/* Sprint Financial Overview */}
            <Card>
                <CardHeader title="Sprint Financial Overview" subtitle="Cost tracking by sprint (manual entry)" />
                <EmptyState
                    icon={<Calculator size={24} />}
                    title="Sprint cost tracking coming soon"
                    description="Manual cost entry per sprint will be available in a future update."
                />
            </Card>

            {/* Department Tasks */}
            <DepartmentTasks agentNames={['CFO', 'Admin']} title="Finance & Admin Tasks" />
        </div>
    )
}
