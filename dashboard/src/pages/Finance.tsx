import { useActivityLog } from '../hooks/useActivityLog'
import StatusBadge from '../components/ui/StatusBadge'
import SkeletonLoader from '../components/ui/SkeletonLoader'
import EmptyState from '../components/ui/EmptyState'
import {
    DollarSign,
    TrendingUp,
    CreditCard,
    Activity,
    AlertCircle,
} from 'lucide-react'

export default function Finance() {
    const { entries: cfoActivity, loading } = useActivityLog({
        agentFilter: 'cfo',
        limit: 20,
    })

    return (
        <div className="max-w-[1400px] mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-navy">Finance</h1>
                <p className="text-sm text-charcoal mt-0.5">CFO Office — runway, forecast, and financial health</p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Runway Card */}
                <div className="card flex flex-col items-center justify-center py-10">
                    <div className="w-14 h-14 rounded-2xl bg-light-gray/50 flex items-center justify-center mb-4">
                        <CreditCard size={28} className="text-charcoal" />
                    </div>
                    <h3 className="text-base font-semibold text-navy mb-1">Runway</h3>
                    <p className="text-sm text-charcoal text-center mb-4 max-w-xs">
                        Connect Stripe to see your burn rate, runway, and cash position.
                    </p>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 border border-amber-200">
                        <AlertCircle size={14} className="text-amber-500" />
                        <span className="text-xs font-medium text-amber-700">Connect Stripe to activate</span>
                    </div>
                </div>

                {/* Revenue Forecast Card */}
                <div className="card flex flex-col items-center justify-center py-10">
                    <div className="w-14 h-14 rounded-2xl bg-light-gray/50 flex items-center justify-center mb-4">
                        <TrendingUp size={28} className="text-charcoal" />
                    </div>
                    <h3 className="text-base font-semibold text-navy mb-1">Revenue Forecast</h3>
                    <p className="text-sm text-charcoal text-center mb-4 max-w-xs">
                        Revenue projections based on pipeline data and historical close rates.
                    </p>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-teal text-white text-sm font-medium rounded-lg hover:bg-teal-dark transition-colors cursor-pointer">
                        <DollarSign size={16} /> Enter Forecast Manually
                    </button>
                </div>

                {/* Quick Stats */}
                <div className="card">
                    <h3 className="text-sm font-semibold text-navy uppercase tracking-wide mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                            <span className="text-sm text-charcoal">Pipeline MRR</span>
                            <span className="text-sm font-semibold text-navy">See Pipeline →</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                            <span className="text-sm text-charcoal">Active Deals</span>
                            <span className="text-sm font-semibold text-navy">See Pipeline →</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                            <span className="text-sm text-charcoal">Stripe Status</span>
                            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Not Connected</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                            <span className="text-sm text-charcoal">CFO Agent</span>
                            <StatusBadge status="active" size="sm" />
                        </div>
                    </div>
                </div>
            </div>

            {/* CFO Activity */}
            <div className="card">
                <div className="flex items-center gap-2 mb-4">
                    <Activity size={16} className="text-teal" />
                    <h2 className="text-sm font-semibold text-navy uppercase tracking-wide">Recent Financial Activity</h2>
                </div>
                {loading ? (
                    <SkeletonLoader variant="row" count={5} />
                ) : cfoActivity.length === 0 ? (
                    <EmptyState
                        icon={DollarSign}
                        title="No finance activity yet"
                        description="CFO agent activity will appear here once financial tasks are executed."
                    />
                ) : (
                    <div className="divide-y divide-light-gray">
                        {cfoActivity.map((entry) => (
                            <div key={entry.id} className="flex items-center gap-4 py-3">
                                <div className="w-8 h-8 rounded-full bg-navy/5 flex items-center justify-center flex-shrink-0">
                                    <DollarSign size={14} className="text-navy" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-navy truncate">{entry.output_summary}</p>
                                    <p className="text-xs text-charcoal mt-0.5">
                                        {(entry.skill_used ?? entry.action_type ?? 'action').replace(/_/g, ' ')} · {new Date(entry.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <StatusBadge status={entry.status} size="sm" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
