import { useState } from 'react'
import TabNav from '../components/ui/TabNav'
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
    TrendingDown,
    Activity,
    Calculator,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    Minus,
} from 'lucide-react'

/* ============================================================
   P&L LINE ITEM TYPES
   ============================================================ */
interface PnlLineItem {
    label: string
    monthly: number
    note?: string
}

interface PnlSection {
    title: string
    items: PnlLineItem[]
    type: 'revenue' | 'cost'
}

/* ============================================================
   COST CONFIGURATION
   These are editable monthly costs for RiteHire (Pakistan-based EOR).
   In a production app, these would come from a DB table.
   ============================================================ */
const COGS: PnlLineItem[] = [
    { label: 'Payroll Processing & Disbursement', monthly: 2800, note: 'Employee salaries, contractor payouts' },
    { label: 'Employer Contributions (EOBI / SS)', monthly: 1200, note: 'EOBI, provincial social security' },
    { label: 'Health & Group Insurance', monthly: 600, note: 'Group medical cover for EOR employees' },
    { label: 'Compliance & Regulatory Filing', monthly: 350, note: 'Tax filings, labor law compliance' },
    { label: 'Background Checks & Onboarding', monthly: 200, note: 'Verification, document processing' },
]

const OPERATING_EXPENSES: PnlLineItem[] = [
    { label: 'Office / Coworking Space', monthly: 450, note: 'Lahore / Karachi' },
    { label: 'SaaS & Tooling', monthly: 280, note: 'Supabase, GitHub, Notion, Google Workspace' },
    { label: 'AI Operations Platform', monthly: 510, note: 'LLM API costs for 9 AI agents' },
    { label: 'Legal & Advisory', monthly: 300, note: 'Employment law counsel, contract review' },
    { label: 'Sales & Marketing', monthly: 200, note: 'LinkedIn, outbound campaigns' },
    { label: 'Banking & Payment Fees', monthly: 150, note: 'Wire transfers, FX conversion' },
    { label: 'Domains, DNS & Hosting', monthly: 55, note: 'ritehire.io, dashboard hosting' },
    { label: 'Travel & Client Meetings', monthly: 100, note: 'Domestic travel' },
    { label: 'Miscellaneous / Admin', monthly: 75, note: 'Office supplies, courier, etc.' },
]

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function Finance() {
    const [activeTab, setActiveTab] = useState('pnl')
    const { deals, loading: dealsLoading } = useDeals()
    const { entries: cfoActivity, loading: activityLoading } = useActivityLog({
        agentName: ['CFO', 'Admin'],
        limit: 20,
    })

    // Revenue from deals
    const closedWonDeals = deals.filter((d) => d.stage === 'closed_won')
    const activeMRR = closedWonDeals.reduce((s, d) => s + (d.mrr || 0), 0)

    const activeDeals = deals.filter((d) => !['closed_won', 'closed_lost'].includes(d.stage))
    const pipelineMRR = activeDeals.reduce((s, d) => s + (d.mrr || 0), 0)

    // Weighted pipeline
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
                <h1 className="text-2xl font-bold text-navy tracking-tight">Finance Department</h1>
                <p className="text-sm text-charcoal/60 mt-1">Revenue tracking, P&L, pipeline forecast, and financial operations.</p>
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

            <TabNav
                tabs={[
                    { key: 'pnl', label: 'P&L Statement' },
                    { key: 'pipeline', label: 'Pipeline Revenue' },
                    { key: 'activity', label: 'CFO Activity' },
                    { key: 'tasks', label: 'Tasks' },
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
            />

            <div className="mt-4">
                {activeTab === 'pnl' && (
                    <ProfitAndLoss activeMRR={activeMRR} dealsLoading={dealsLoading} />
                )}
                {activeTab === 'pipeline' && (
                    <PipelineRevenue
                        activeDeals={activeDeals}
                        closedWonDeals={closedWonDeals}
                        activeMRR={activeMRR}
                        stageWeights={stageWeights}
                        weightedMRR={weightedMRR}
                        dealsLoading={dealsLoading}
                    />
                )}
                {activeTab === 'activity' && (
                    <CfoActivity cfoActivity={cfoActivity} activityLoading={activityLoading} />
                )}
                {activeTab === 'tasks' && (
                    <DepartmentTasks agentNames={['CFO', 'Admin']} title="Finance & Admin Tasks" />
                )}
            </div>
        </div>
    )
}

/* ============================================================
   P&L STATEMENT TAB
   ============================================================ */
function PnlRow({
    label,
    monthly,
    annual,
    note,
    bold,
    highlight,
    isNegative,
}: {
    label: string
    monthly: number
    annual: number
    note?: string
    bold?: boolean
    highlight?: 'green' | 'red' | 'blue' | 'navy'
    isNegative?: boolean
}) {
    const fmt = (n: number) => {
        const abs = Math.abs(n)
        const str = `$${abs.toLocaleString()}`
        return n < 0 ? `(${str})` : str
    }

    const textColor = highlight === 'green'
        ? 'text-teal'
        : highlight === 'red'
            ? 'text-status-blocked'
            : highlight === 'blue'
                ? 'text-blue-600'
                : highlight === 'navy'
                    ? 'text-navy'
                    : 'text-charcoal'

    return (
        <div className={`
            grid grid-cols-12 gap-2 px-5 py-2.5 items-center
            ${bold ? 'bg-surface/60 rounded-lg' : 'border-b border-light-gray/15'}
        `}>
            <div className="col-span-5 min-w-0">
                <div className={`text-[13px] ${bold ? 'font-bold' : 'font-medium'} ${highlight ? textColor : 'text-navy'} truncate`}>
                    {!bold && <span className="text-charcoal/30 mr-2">·</span>}
                    {label}
                </div>
                {note && (
                    <div className="text-[10px] text-charcoal/40 ml-4 truncate">{note}</div>
                )}
            </div>
            <div className={`col-span-3 text-right text-[13px] ${bold ? 'font-bold' : 'font-medium'} ${textColor}`}>
                {isNegative && monthly !== 0 && <span className="text-charcoal/30 mr-0.5">−</span>}
                {fmt(monthly)}
            </div>
            <div className={`col-span-3 text-right text-[13px] ${bold ? 'font-bold' : 'font-medium'} ${textColor}`}>
                {isNegative && annual !== 0 && <span className="text-charcoal/30 mr-0.5">−</span>}
                {fmt(annual)}
            </div>
            <div className="col-span-1 flex justify-end">
                {highlight === 'green' && <ArrowUpRight size={14} className="text-teal" />}
                {highlight === 'red' && monthly !== 0 && <ArrowDownRight size={14} className="text-status-blocked" />}
                {highlight === 'navy' && <Minus size={14} className="text-navy/30" />}
            </div>
        </div>
    )
}

function SectionDivider() {
    return <div className="border-t-2 border-navy/8 my-1" />
}

function ProfitAndLoss({ activeMRR, dealsLoading }: { activeMRR: number; dealsLoading: boolean }) {
    // Calculate totals
    const totalCOGS = COGS.reduce((s, c) => s + c.monthly, 0)
    const totalOpEx = OPERATING_EXPENSES.reduce((s, c) => s + c.monthly, 0)
    const grossProfit = activeMRR - totalCOGS
    const grossMargin = activeMRR > 0 ? (grossProfit / activeMRR) * 100 : 0
    const netProfit = grossProfit - totalOpEx
    const netMargin = activeMRR > 0 ? (netProfit / activeMRR) * 100 : 0

    if (dealsLoading) {
        return <Card><SkeletonLoader variant="row" count={12} /></Card>
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader
                    title="Profit & Loss Statement"
                    subtitle="Monthly operating financials"
                    action={
                        <div className="flex items-center gap-1 text-[11px] text-charcoal/50">
                            <BarChart3 size={12} />
                            <span>March 2026</span>
                        </div>
                    }
                />

                {/* Column headers */}
                <div className="grid grid-cols-12 gap-2 px-5 py-2 text-[10px] font-semibold text-charcoal/40 uppercase tracking-wider">
                    <div className="col-span-5">Line Item</div>
                    <div className="col-span-3 text-right">Monthly</div>
                    <div className="col-span-3 text-right">Annualized</div>
                    <div className="col-span-1" />
                </div>

                {/* ─── REVENUE ─── */}
                <PnlRow label="Revenue (MRR)" monthly={activeMRR} annual={activeMRR * 12} bold highlight="green" />
                <PnlRow label="Recurring Revenue (Closed-Won)" monthly={activeMRR} annual={activeMRR * 12} note="From closed deals" />

                <SectionDivider />

                {/* ─── COGS ─── */}
                <PnlRow label="Cost of Goods Sold (COGS)" monthly={totalCOGS} annual={totalCOGS * 12} bold highlight="red" isNegative />
                {COGS.map((item) => (
                    <PnlRow key={item.label} label={item.label} monthly={item.monthly} annual={item.monthly * 12} note={item.note} />
                ))}

                <SectionDivider />

                {/* ─── GROSS PROFIT ─── */}
                <PnlRow
                    label={`Gross Profit (${grossMargin.toFixed(0)}% margin)`}
                    monthly={grossProfit}
                    annual={grossProfit * 12}
                    bold
                    highlight={grossProfit >= 0 ? 'green' : 'red'}
                />

                <SectionDivider />

                {/* ─── OPERATING EXPENSES ─── */}
                <PnlRow label="Operating Expenses (OpEx)" monthly={totalOpEx} annual={totalOpEx * 12} bold highlight="red" isNegative />
                {OPERATING_EXPENSES.map((item) => (
                    <PnlRow key={item.label} label={item.label} monthly={item.monthly} annual={item.monthly * 12} note={item.note} />
                ))}

                <SectionDivider />

                {/* ─── NET PROFIT ─── */}
                <div className={`
                    mx-4 my-3 p-4 rounded-xl
                    ${netProfit >= 0
                        ? 'bg-gradient-to-r from-teal/5 to-teal/10 border border-teal/15'
                        : 'bg-gradient-to-r from-red-50 to-red-50/50 border border-red-100'
                    }
                `}>
                    <div className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-5">
                            <div className={`text-sm font-bold ${netProfit >= 0 ? 'text-teal' : 'text-status-blocked'}`}>
                                Net Profit / (Loss)
                            </div>
                            <div className="text-[10px] text-charcoal/50 mt-0.5">
                                {netMargin.toFixed(1)}% net margin
                            </div>
                        </div>
                        <div className={`col-span-3 text-right text-base font-bold ${netProfit >= 0 ? 'text-teal' : 'text-status-blocked'}`}>
                            {netProfit < 0 ? '(' : ''}${Math.abs(netProfit).toLocaleString()}{netProfit < 0 ? ')' : ''}
                            <span className="text-[10px] font-normal text-charcoal/40">/mo</span>
                        </div>
                        <div className={`col-span-3 text-right text-base font-bold ${netProfit >= 0 ? 'text-teal' : 'text-status-blocked'}`}>
                            {netProfit < 0 ? '(' : ''}${Math.abs(netProfit * 12).toLocaleString()}{netProfit < 0 ? ')' : ''}
                            <span className="text-[10px] font-normal text-charcoal/40">/yr</span>
                        </div>
                        <div className="col-span-1 flex justify-end">
                            {netProfit >= 0
                                ? <ArrowUpRight size={18} className="text-teal" />
                                : <ArrowDownRight size={18} className="text-status-blocked" />
                            }
                        </div>
                    </div>
                </div>
            </Card>

            {/* P&L Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white border border-light-gray/50 shadow-sm">
                    <div className="text-[10px] font-semibold text-charcoal/40 uppercase tracking-wider mb-1">Burn Rate</div>
                    <div className="text-lg font-bold text-navy">${(totalCOGS + totalOpEx).toLocaleString()}<span className="text-xs font-normal text-charcoal/40">/mo</span></div>
                    <div className="text-[10px] text-charcoal/50 mt-1">COGS + OpEx combined</div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-light-gray/50 shadow-sm">
                    <div className="text-[10px] font-semibold text-charcoal/40 uppercase tracking-wider mb-1">Gross Margin</div>
                    <div className={`text-lg font-bold ${grossMargin >= 50 ? 'text-teal' : grossMargin >= 0 ? 'text-navy' : 'text-status-blocked'}`}>
                        {grossMargin.toFixed(1)}%
                    </div>
                    <div className="text-[10px] text-charcoal/50 mt-1">After COGS</div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-light-gray/50 shadow-sm">
                    <div className="text-[10px] font-semibold text-charcoal/40 uppercase tracking-wider mb-1">Net Margin</div>
                    <div className={`text-lg font-bold ${netMargin >= 0 ? 'text-teal' : 'text-status-blocked'}`}>
                        {netMargin.toFixed(1)}%
                    </div>
                    <div className="text-[10px] text-charcoal/50 mt-1">Bottom line</div>
                </div>
            </div>
        </div>
    )
}

/* ============================================================
   PIPELINE REVENUE TAB
   ============================================================ */
function PipelineRevenue({
    activeDeals,
    closedWonDeals,
    activeMRR,
    stageWeights,
    weightedMRR,
    dealsLoading,
}: {
    activeDeals: any[]
    closedWonDeals: any[]
    activeMRR: number
    stageWeights: Record<string, number>
    weightedMRR: number
    dealsLoading: boolean
}) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* MRR Tracker */}
                <Card>
                    <CardHeader title="MRR Tracker" subtitle="Revenue from closed-won deals" />
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
                            {closedWonDeals.map((deal: any) => (
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

                {/* Pipeline by Stage */}
                <Card>
                    <CardHeader title="Pipeline Revenue by Stage" subtitle="Active deals weighted by probability" />
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
                                const stageDeals = activeDeals.filter((d: any) => d.stage === stage)
                                const raw = stageDeals.reduce((s: number, d: any) => s + (d.mrr || 0), 0)
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
            </div>
        </div>
    )
}

/* ============================================================
   CFO ACTIVITY TAB
   ============================================================ */
function CfoActivity({
    cfoActivity,
    activityLoading,
}: {
    cfoActivity: any[]
    activityLoading: boolean
}) {
    return (
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
                    {cfoActivity.map((entry: any) => (
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
    )
}
