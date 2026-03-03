import Card, { CardHeader } from './Card'
import {
    getToolsForDepartment,
    getToolCostForDepartment,
    getDepartmentSpend,
    DEPARTMENT_BUDGETS,
    DEPARTMENT_LABELS,
} from '../../lib/department-tools'
import type { DepartmentId, Tool } from '../../lib/department-tools'
import {
    ExternalLink,
    Users,
    DollarSign,
} from 'lucide-react'

const CATEGORY_LABELS: Record<string, string> = {
    crm: 'CRM',
    outreach: 'Outreach',
    design: 'Design',
    social: 'Social Media',
    dev: 'Development',
    hosting: 'Hosting',
    analytics: 'Analytics',
    productivity: 'Productivity',
    ai: 'AI / LLM',
    communication: 'Communication',
    email: 'Email',
}

interface DepartmentToolsProps {
    department: DepartmentId
}

export default function DepartmentTools({ department }: DepartmentToolsProps) {
    const tools = getToolsForDepartment(department)
    const totalSpend = getDepartmentSpend(department)
    const budget = DEPARTMENT_BUDGETS[department]
    const utilization = budget > 0 ? (totalSpend / budget) * 100 : 0
    const remaining = budget - totalSpend
    const deptLabel = DEPARTMENT_LABELS[department]

    return (
        <div className="space-y-4">
            {/* Budget Meter */}
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-bold text-navy">{deptLabel} Tool Budget</h3>
                        <p className="text-[11px] text-charcoal/50 mt-0.5">
                            Monthly allocation from $200 company SaaS budget
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-bold text-navy">
                            ${totalSpend.toFixed(2)}
                            <span className="text-xs font-normal text-charcoal/40"> / ${budget}</span>
                        </div>
                        <div className={`text-[10px] font-semibold ${remaining >= 0 ? 'text-teal' : 'text-status-blocked'}`}>
                            {remaining >= 0 ? `$${remaining.toFixed(2)} remaining` : `$${Math.abs(remaining).toFixed(2)} over budget`}
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-3 rounded-full bg-light-gray/50 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${utilization > 100
                                ? 'bg-gradient-to-r from-status-blocked to-red-400'
                                : utilization > 80
                                    ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                                    : 'bg-gradient-to-r from-teal to-teal/80'
                            }`}
                        style={{ width: `${Math.min(utilization, 100)}%` }}
                    />
                </div>
                <div className="flex justify-between mt-1.5 text-[10px] text-charcoal/40">
                    <span>0%</span>
                    <span>{utilization.toFixed(0)}% utilized</span>
                    <span>100%</span>
                </div>
            </Card>

            {/* Tools Table */}
            <Card>
                <CardHeader
                    title={`${deptLabel} Tools`}
                    subtitle={`${tools.length} active tools`}
                    action={
                        <div className="flex items-center gap-1 text-[11px] text-charcoal/50">
                            <DollarSign size={12} />
                            <span>${totalSpend.toFixed(2)}/mo</span>
                        </div>
                    }
                />

                {/* Table header */}
                <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-surface/50 rounded-lg mb-1 text-[10px] font-semibold text-charcoal/40 uppercase tracking-wider">
                    <div className="col-span-3">Tool</div>
                    <div className="col-span-2">Category</div>
                    <div className="col-span-3">Description</div>
                    <div className="col-span-1 text-center">Shared</div>
                    <div className="col-span-1 text-right">Full Cost</div>
                    <div className="col-span-1 text-right">Dept Cost</div>
                    <div className="col-span-1" />
                </div>

                {/* Tool rows */}
                <div className="space-y-0.5">
                    {tools.map((tool: Tool) => {
                        const deptCost = getToolCostForDepartment(tool, department)
                        const isShared = tool.departments.length > 1
                        const otherDepts = tool.departments
                            .filter((d) => d !== department)
                            .map((d) => DEPARTMENT_LABELS[d])

                        return (
                            <div
                                key={tool.id}
                                className="grid grid-cols-12 gap-2 px-4 py-2.5 rounded-lg items-center hover:bg-surface/40 transition-colors"
                            >
                                {/* Tool name */}
                                <div className="col-span-3 min-w-0">
                                    <div className="text-[13px] font-medium text-navy truncate">
                                        {tool.name}
                                    </div>
                                </div>

                                {/* Category */}
                                <div className="col-span-2">
                                    <span className="text-[10px] font-medium text-charcoal/50 bg-surface px-2 py-0.5 rounded-full">
                                        {CATEGORY_LABELS[tool.category] || tool.category}
                                    </span>
                                </div>

                                {/* Description */}
                                <div className="col-span-3 min-w-0">
                                    <span className="text-xs text-charcoal/60 line-clamp-1">
                                        {tool.description}
                                    </span>
                                </div>

                                {/* Shared indicator */}
                                <div className="col-span-1 flex justify-center">
                                    {isShared ? (
                                        <div className="group relative">
                                            <div className="flex items-center gap-0.5 text-[10px] text-charcoal/50">
                                                <Users size={10} />
                                                <span>{tool.departments.length}</span>
                                            </div>
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-navy text-white text-[9px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                                Shared with {otherDepts.join(', ')}
                                                <br />
                                                Cost split {tool.departments.length}-way
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] text-charcoal/25">—</span>
                                    )}
                                </div>

                                {/* Full cost */}
                                <div className="col-span-1 text-right">
                                    <span className={`text-xs font-medium ${tool.monthlyCost === 0 ? 'text-teal' : 'text-charcoal/60'}`}>
                                        {tool.monthlyCost === 0 ? 'Free' : `$${tool.monthlyCost}`}
                                    </span>
                                </div>

                                {/* Dept allocated cost */}
                                <div className="col-span-1 text-right">
                                    <span className={`text-xs font-bold ${deptCost === 0 ? 'text-teal' : 'text-navy'}`}>
                                        {deptCost === 0 ? 'Free' : `$${deptCost.toFixed(2)}`}
                                    </span>
                                </div>

                                {/* Link */}
                                <div className="col-span-1 flex justify-end">
                                    {tool.url && (
                                        <a
                                            href={tool.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-charcoal/30 hover:text-teal transition-colors"
                                        >
                                            <ExternalLink size={12} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        )
                    })}

                    {/* Total row */}
                    <div className="grid grid-cols-12 gap-2 px-4 py-3 rounded-lg items-center border-t-2 border-navy/8 mt-2">
                        <div className="col-span-3 text-sm font-bold text-navy">Total</div>
                        <div className="col-span-2" />
                        <div className="col-span-3" />
                        <div className="col-span-1" />
                        <div className="col-span-1 text-right text-xs text-charcoal/50">
                            ${tools.reduce((s, t) => s + t.monthlyCost, 0).toFixed(2)}
                        </div>
                        <div className="col-span-1 text-right text-sm font-bold text-navy">
                            ${totalSpend.toFixed(2)}
                        </div>
                        <div className="col-span-1" />
                    </div>
                </div>
            </Card>
        </div>
    )
}
