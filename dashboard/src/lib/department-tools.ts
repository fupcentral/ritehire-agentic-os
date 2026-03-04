/* ============================================================
   DEPARTMENT TOOLS & BUDGET CONFIGURATION
   ============================================================
   Central source of truth for all department tool allocations.
   
   Budget: $200/mo total across Sales, Marketing, Infrastructure
   Shared tools: Cost split evenly between departments that share them.
   
   This config drives:
   - Tools tab in each department page
   - Finance P&L "SaaS & Tooling" line item
   - Budget utilization meters
   ============================================================ */

export type DepartmentId = 'sales' | 'marketing' | 'infra'

export interface Tool {
    id: string
    name: string
    /** Monthly cost in USD */
    monthlyCost: number
    /** Departments that use this tool */
    departments: DepartmentId[]
    /** URL for the tool */
    url?: string
    /** Brief description */
    description: string
    /** Category for grouping */
    category: 'crm' | 'outreach' | 'design' | 'social' | 'dev' | 'hosting' | 'analytics' | 'productivity' | 'ai' | 'communication' | 'email'
    /** Whether this is currently active */
    active: boolean
}

/* ============================================================
   DEPARTMENT BUDGET ALLOCATION
   Total: $200/mo
   ============================================================ */
export const DEPARTMENT_BUDGETS: Record<DepartmentId, number> = {
    sales: 80,
    marketing: 60,
    infra: 60,
}

export const TOTAL_BUDGET = 200

/* ============================================================
   TOOL REGISTRY
   ============================================================ */
export const TOOLS: Tool[] = [
    // ─── SALES ───
    {
        id: 'linkedin-sales-nav',
        name: 'LinkedIn Sales Navigator',
        monthlyCost: 49.99,
        departments: ['sales'],
        url: 'https://business.linkedin.com/sales-solutions',
        description: 'Lead discovery, InMail outreach, saved lead lists',
        category: 'outreach',
        active: true,
    },
    {
        id: 'apollo',
        name: 'Apollo.io',
        monthlyCost: 0,
        departments: ['sales'],
        url: 'https://apollo.io',
        description: 'Contact database, email sequences, prospecting — Free tier',
        category: 'outreach',
        active: true,
    },
    {
        id: 'clay',
        name: 'Clay',
        monthlyCost: 0,
        departments: ['sales', 'marketing'],
        url: 'https://clay.com',
        description: 'Data enrichment, lead scoring, waterfall enrichment — Free tier',
        category: 'outreach',
        active: true,
    },

    // ─── MARKETING ───
    {
        id: 'nanobanana',
        name: 'NanoBanana',
        monthlyCost: 0,
        departments: ['marketing'],
        url: 'https://nanobanana.com',
        description: 'AI-powered brand design, content generation',
        category: 'design',
        active: true,
    },
    {
        id: 'lemwarm',
        name: 'Lemwarm',
        monthlyCost: 29,
        departments: ['sales', 'marketing'],
        url: 'https://lemwarm.com',
        description: 'Email warmup, deliverability optimization',
        category: 'email',
        active: true,
    },
    {
        id: 'canva',
        name: 'Canva Pro',
        monthlyCost: 13,
        departments: ['marketing'],
        url: 'https://canva.com',
        description: 'Social graphics, brand assets, presentations',
        category: 'design',
        active: true,
    },

    // ─── INFRASTRUCTURE ───
    {
        id: 'hostinger',
        name: 'Hostinger',
        monthlyCost: 12,
        departments: ['infra'],
        url: 'https://hostinger.com',
        description: 'Web hosting, domain, email hosting',
        category: 'hosting',
        active: true,
    },
    {
        id: 'supabase',
        name: 'Supabase',
        monthlyCost: 25,
        departments: ['infra'],
        url: 'https://supabase.com',
        description: 'Database, auth, real-time — Pro plan',
        category: 'hosting',
        active: true,
    },
    {
        id: 'github',
        name: 'GitHub Team',
        monthlyCost: 8,
        departments: ['infra'],
        url: 'https://github.com',
        description: 'Repositories, CI/CD, code review',
        category: 'dev',
        active: true,
    },

    // ─── SHARED: ALL ───
    {
        id: 'notion',
        name: 'Notion',
        monthlyCost: 10,
        departments: ['sales', 'marketing', 'infra'],
        url: 'https://notion.so',
        description: 'Wiki, task management, docs — Plus plan',
        category: 'productivity',
        active: true,
    },
    {
        id: 'google-workspace',
        name: 'Google Workspace',
        monthlyCost: 14,
        departments: ['sales', 'marketing', 'infra'],
        url: 'https://workspace.google.com',
        description: 'Email, Drive, Docs — 2 users',
        category: 'communication',
        active: true,
    },

    // ─── SHARED: SALES + INFRA ───
    {
        id: 'anthropic-api',
        name: 'Anthropic (Claude)',
        monthlyCost: 30,
        departments: ['sales', 'infra'],
        url: 'https://console.anthropic.com',
        description: 'Claude Sonnet — AI agent LLM calls, Claude Co-worker chat, outreach automation',
        category: 'ai',
        active: true,
    },
    {
        id: 'gemini-api',
        name: 'Nano Banana Pro (Gemini API)',
        monthlyCost: 0,
        departments: ['marketing'],
        url: 'https://aistudio.google.com',
        description: 'Nano Banana Pro (Gemini 3 Pro Image) — LinkedIn visual generation, marketing assets. Free tier via AI Studio.',
        category: 'ai',
        active: true,
    },
]

/* ============================================================
   HELPER FUNCTIONS
   ============================================================ */

/** Get the allocated cost of a tool for a specific department (split evenly for shared tools) */
export function getToolCostForDepartment(tool: Tool, dept: DepartmentId): number {
    if (!tool.departments.includes(dept)) return 0
    return tool.monthlyCost / tool.departments.length
}

/** Get all tools for a department */
export function getToolsForDepartment(dept: DepartmentId): Tool[] {
    return TOOLS.filter((t) => t.active && t.departments.includes(dept))
}

/** Get total monthly spend for a department */
export function getDepartmentSpend(dept: DepartmentId): number {
    return getToolsForDepartment(dept).reduce(
        (total, tool) => total + getToolCostForDepartment(tool, dept),
        0
    )
}

/** Get budget utilization percentage for a department */
export function getBudgetUtilization(dept: DepartmentId): number {
    const spend = getDepartmentSpend(dept)
    const budget = DEPARTMENT_BUDGETS[dept]
    return budget > 0 ? (spend / budget) * 100 : 0
}

/** Get total spend across all departments */
export function getTotalSpend(): number {
    return (['sales', 'marketing', 'infra'] as DepartmentId[]).reduce(
        (total, dept) => total + getDepartmentSpend(dept),
        0
    )
}

/** Department display names */
export const DEPARTMENT_LABELS: Record<DepartmentId, string> = {
    sales: 'Sales',
    marketing: 'Marketing',
    infra: 'Infrastructure',
}
