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
    getTotalSpend,
    getDepartmentSpend,
    DEPARTMENT_LABELS,
    TOTAL_BUDGET,
} from '../lib/department-tools'
import type { DepartmentId } from '../lib/department-tools'
import {
    DollarSign,
    TrendingUp,
    Activity,
    Calculator,
    BarChart3,
} from 'lucide-react'

/* ============================================================
   P&L LINE ITEM TYPES
   ============================================================ */
interface PnlLineItem {
    label: string
    monthly: number
    note?: string
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
    { label: 'Dept Tools & SaaS (Budget: $' + TOTAL_BUDGET + ')', monthly: Math.round(getTotalSpend() * 100) / 100, note: 'From department tool allocations' },
    ...(['sales', 'marketing', 'infra'] as DepartmentId[]).map((dept) => ({
        label: `  └ ${DEPARTMENT_LABELS[dept]} Tools`, monthly: Math.round(getDepartmentSpend(dept) * 100) / 100, note: `${dept} allocated share`,
    })),
    { label: 'Legal & Advisory', monthly: 300, note: 'Employment law counsel, contract review' },
    { label: 'Banking & Payment Fees', monthly: 150, note: 'Wire transfers, FX conversion' },
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
   P&L STATEMENT — 12-MONTH VIEW
   ============================================================ */

// Generate 12 months ending at current month
function getMonthColumns(): { key: string; label: string; shortLabel: string }[] {
    const now = new Date()
    const months: { key: string; label: string; shortLabel: string }[] = []
    for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        const label = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        const shortLabel = d.toLocaleDateString('en-US', { month: 'short' })
        months.push({ key, label, shortLabel })
    }
    return months
}

interface RowData {
    label: string
    values: number[]           // 12 monthly values
    total: number
    type: 'item' | 'header' | 'subtotal' | 'net'
    highlight?: 'green' | 'red'
    indent?: boolean
    note?: string
}

function ProfitAndLoss({ activeMRR, dealsLoading }: { activeMRR: number; dealsLoading: boolean }) {
    const months = getMonthColumns()

    // For demo purposes, simulate revenue ramp-up over 12 months
    // Current month gets real MRR, prior months show a growth trajectory
    const revenueByMonth = months.map((_, i) => {
        // Simple ramp: month 0 (oldest) = 0, month 11 (current) = activeMRR
        // Later months gradually approach current MRR
        const ramp = i <= 2 ? 0 : Math.round(activeMRR * ((i - 2) / 9))
        // Current month always uses actual MRR
        return i === 11 ? activeMRR : ramp
    })

    const totalCOGSMonthly = COGS.reduce((s, c) => s + c.monthly, 0)
    const totalOpExMonthly = OPERATING_EXPENSES.reduce((s, c) => s + c.monthly, 0)

    // Build row data for the table
    const rows: RowData[] = []

    // ─── REVENUE ───
    rows.push({
        label: 'Revenue',
        values: revenueByMonth,
        total: revenueByMonth.reduce((s, v) => s + v, 0),
        type: 'header',
        highlight: 'green',
    })
    rows.push({
        label: 'EOR Service Revenue (MRR)',
        values: revenueByMonth,
        total: revenueByMonth.reduce((s, v) => s + v, 0),
        type: 'item',
        indent: true,
        note: 'Closed-won deal MRR',
    })

    // ─── COGS ───
    const cogsMonthlyValues = months.map(() => totalCOGSMonthly)
    rows.push({
        label: 'Cost of Revenue (COGS)',
        values: cogsMonthlyValues,
        total: totalCOGSMonthly * 12,
        type: 'header',
        highlight: 'red',
    })
    for (const item of COGS) {
        rows.push({
            label: item.label,
            values: months.map(() => item.monthly),
            total: item.monthly * 12,
            type: 'item',
            indent: true,
            note: item.note,
        })
    }

    // ─── GROSS PROFIT ───
    const grossByMonth = revenueByMonth.map((r) => r - totalCOGSMonthly)
    const grossTotal = grossByMonth.reduce((s, v) => s + v, 0)
    const revenueTotal = revenueByMonth.reduce((s, v) => s + v, 0)
    const grossMargin = revenueTotal > 0 ? (grossTotal / revenueTotal) * 100 : 0
    rows.push({
        label: `Gross Profit (${grossMargin.toFixed(0)}%)`,
        values: grossByMonth,
        total: grossTotal,
        type: 'subtotal',
        highlight: grossTotal >= 0 ? 'green' : 'red',
    })

    // ─── OPERATING EXPENSES ───
    const opexMonthlyValues = months.map(() => totalOpExMonthly)
    rows.push({
        label: 'Operating Expenses',
        values: opexMonthlyValues,
        total: totalOpExMonthly * 12,
        type: 'header',
        highlight: 'red',
    })
    for (const item of OPERATING_EXPENSES) {
        rows.push({
            label: item.label,
            values: months.map(() => item.monthly),
            total: item.monthly * 12,
            type: 'item',
            indent: true,
            note: item.note,
        })
    }

    // ─── NET INCOME ───
    const netByMonth = grossByMonth.map((g) => g - totalOpExMonthly)
    const netTotal = netByMonth.reduce((s, v) => s + v, 0)
    const netMargin = revenueTotal > 0 ? (netTotal / revenueTotal) * 100 : 0
    rows.push({
        label: 'Net Income / (Loss)',
        values: netByMonth,
        total: netTotal,
        type: 'net',
        highlight: netTotal >= 0 ? 'green' : 'red',
    })

    const burnRate = totalCOGSMonthly + totalOpExMonthly

    if (dealsLoading) {
        return <Card><SkeletonLoader variant="row" count={12} /></Card>
    }

    const fmt = (n: number) => {
        if (n === 0) return '$0'
        const abs = Math.abs(n)
        const str = abs >= 1000 ? `$${(abs / 1000).toFixed(1)}k` : `$${abs.toLocaleString()}`
        return n < 0 ? `(${str})` : str
    }
    const fmtFull = (n: number) => {
        if (n === 0) return '$0'
        const abs = Math.abs(n)
        const str = `$${abs.toLocaleString()}`
        return n < 0 ? `(${str})` : str
    }

    return (
        <div className="space-y-4">
            <Card padding={false}>
                <div className="px-5 pt-5 pb-3">
                    <CardHeader
                        title="Profit & Loss Statement"
                        subtitle="12-month trailing view — FY 2025-26"
                        action={
                            <div className="flex items-center gap-1 text-[11px] text-charcoal/50">
                                <BarChart3 size={12} />
                                <span>{months[0].label} — {months[11].label}</span>
                            </div>
                        }
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1100px]" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                        <thead>
                            <tr className="border-b-2 border-navy/10">
                                <th className="sticky left-0 z-10 bg-white text-left text-[10px] font-semibold text-charcoal/40 uppercase tracking-wider px-5 py-2.5 w-[220px] min-w-[220px]">
                                    Line Item
                                </th>
                                {months.map((m) => (
                                    <th key={m.key} className="text-right text-[10px] font-semibold text-charcoal/40 uppercase tracking-wider px-2 py-2.5 min-w-[72px]">
                                        {m.shortLabel}
                                    </th>
                                ))}
                                <th className="text-right text-[10px] font-bold text-navy uppercase tracking-wider px-4 py-2.5 min-w-[90px] bg-surface/40">
                                    FY Total
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, idx) => {
                                const isHeader = row.type === 'header'
                                const isSubtotal = row.type === 'subtotal'
                                const isNet = row.type === 'net'
                                const isBold = isHeader || isSubtotal || isNet

                                const textColor = row.highlight === 'green'
                                    ? 'text-teal'
                                    : row.highlight === 'red'
                                        ? 'text-status-blocked'
                                        : 'text-navy'

                                return (
                                    <tr
                                        key={idx}
                                        className={`
                                            border-b transition-colors
                                            ${isNet
                                                ? row.highlight === 'green'
                                                    ? 'bg-teal/5 border-teal/15'
                                                    : 'bg-red-50/50 border-red-100'
                                                : isHeader || isSubtotal
                                                    ? 'bg-surface/40 border-navy/8'
                                                    : 'border-light-gray/20 hover:bg-surface/20'
                                            }
                                        `}
                                    >
                                        {/* Label */}
                                        <td className={`
                                            sticky left-0 z-10 px-5 py-2
                                            ${isNet
                                                ? row.highlight === 'green' ? 'bg-teal/5' : 'bg-red-50/50'
                                                : isHeader || isSubtotal ? 'bg-surface/40' : 'bg-white'
                                            }
                                        `}>
                                            <div className={`
                                                text-[12px] truncate
                                                ${isBold ? 'font-bold' : 'font-medium'}
                                                ${isBold ? textColor : 'text-charcoal'}
                                                ${row.indent ? 'pl-4' : ''}
                                            `}>
                                                {row.indent && <span className="text-charcoal/20 mr-1.5">·</span>}
                                                {row.label}
                                            </div>
                                        </td>

                                        {/* Monthly values */}
                                        {row.values.map((val, mi) => (
                                            <td
                                                key={mi}
                                                className={`
                                                    text-right px-2 py-2 text-[11px] tabular-nums
                                                    ${isBold ? 'font-bold' : 'font-medium'}
                                                    ${isNet || isSubtotal
                                                        ? val >= 0 ? 'text-teal' : 'text-status-blocked'
                                                        : isBold ? textColor : val === 0 ? 'text-charcoal/25' : 'text-charcoal/70'
                                                    }
                                                `}
                                            >
                                                {val === 0 ? '—' : fmt(isHeader && row.highlight === 'red' ? -val : val)}
                                            </td>
                                        ))}

                                        {/* FY Total */}
                                        <td className={`
                                            text-right px-4 py-2 text-[12px] font-bold tabular-nums bg-surface/40
                                            ${isNet || isSubtotal
                                                ? row.total >= 0 ? 'text-teal' : 'text-status-blocked'
                                                : isBold ? textColor : 'text-navy'
                                            }
                                        `}>
                                            {fmtFull(isHeader && row.highlight === 'red' ? -row.total : row.total)}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white border border-light-gray/50 shadow-sm">
                    <div className="text-[10px] font-semibold text-charcoal/40 uppercase tracking-wider mb-1">Monthly Burn Rate</div>
                    <div className="text-lg font-bold text-navy">{fmtFull(burnRate)}<span className="text-xs font-normal text-charcoal/40">/mo</span></div>
                    <div className="text-[10px] text-charcoal/50 mt-1">COGS + OpEx combined</div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-light-gray/50 shadow-sm">
                    <div className="text-[10px] font-semibold text-charcoal/40 uppercase tracking-wider mb-1">Gross Margin</div>
                    <div className={`text-lg font-bold ${grossMargin >= 50 ? 'text-teal' : grossMargin >= 0 ? 'text-navy' : 'text-status-blocked'}`}>
                        {grossMargin.toFixed(1)}%
                    </div>
                    <div className="text-[10px] text-charcoal/50 mt-1">FY average after COGS</div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-light-gray/50 shadow-sm">
                    <div className="text-[10px] font-semibold text-charcoal/40 uppercase tracking-wider mb-1">Net Margin</div>
                    <div className={`text-lg font-bold ${netMargin >= 0 ? 'text-teal' : 'text-status-blocked'}`}>
                        {netMargin.toFixed(1)}%
                    </div>
                    <div className="text-[10px] text-charcoal/50 mt-1">FY bottom line</div>
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
