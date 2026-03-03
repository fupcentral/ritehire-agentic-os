// ============================================================
// RiteHire Agentic OS — TypeScript Interfaces
// Corrected to match LIVE Supabase DB (not schema.sql)
// ============================================================

export interface Agent {
    id: string
    name: string
    role: string
    reporting_to: string | null
    status: 'active' | 'paused' | 'archived'
    current_task: string | null
    github_path: string | null
    prompt_path: string | null
    created_at: string
    updated_at: string
    skills?: Skill[]
}

export interface Skill {
    id: string // PK is 'id' (UUID), NOT 'skill_id'
    name: string
    agent_id: string
    github_path: string
    category: 'gtm' | 'finance' | 'legal' | 'brand' | 'ops'
    last_run: string | null
    status: 'active' | 'paused' | 'archived'
    run_count: number
    created_at: string
    updated_at: string
    agent?: Agent
}

export interface Task {
    id: string
    title: string
    description: string | null
    agent_id: string | null
    epic_id: string | null
    skill_id: string | null
    status: 'todo' | 'in_progress' | 'blocked' | 'done' | 'cancelled'
    blocker_path: string | null // maps to blocker_notes in UI
    priority: 'P0 - Critical' | 'P1 - High' | 'P2 - Medium' | 'P3 - Low'
    due_date: string | null
    completed_at: string | null
    created_at: string
    updated_at: string
    agent?: Agent
}

export interface Epic {
    id: string
    title: string
    description: string | null
    owner_agent: string | null
    completion_pct: number
    status: 'active' | 'completed' | 'blocked' | 'backlog'
    target_date: string | null
    completed_at: string | null
    created_at: string
    updated_at: string
}

export interface Deal {
    id: string
    company: string
    contact_id: string | null
    stage:
    | 'prospecting'
    | 'contacted'
    | 'discovery'
    | 'proposal'
    | 'negotiation'
    | 'closed_won'
    | 'closed_lost'
    mrr: number | null
    expected_close_date: string | null
    source: string | null
    notes: string | null
    created_at: string
    updated_at: string
    contact?: Contact
}

export const DEAL_STAGES: Deal['stage'][] = [
    'prospecting',
    'contacted',
    'discovery',
    'proposal',
    'negotiation',
    'closed_won',
    'closed_lost',
]

export const DEAL_STAGE_LABELS: Record<Deal['stage'], string> = {
    prospecting: 'Prospecting',
    contacted: 'Contacted',
    discovery: 'Discovery',
    proposal: 'Proposal',
    negotiation: 'Negotiation',
    closed_won: 'Closed Won',
    closed_lost: 'Closed Lost',
}

export interface Contact {
    id: string
    name: string
    company: string | null
    title: string | null
    linkedin_url: string | null
    email: string | null
    phone: string | null
    outreach_status:
    | 'not_contacted'
    | 'contacted'
    | 'replied'
    | 'meeting_booked'
    | 'disqualified'
    source: string | null
    notes: string | null
    created_at: string
    updated_at: string
}

export const OUTREACH_STATUSES: Contact['outreach_status'][] = [
    'not_contacted',
    'contacted',
    'replied',
    'meeting_booked',
    'disqualified',
]

export interface ActivityLogEntry {
    id: string
    agent_id: string | null
    skill_used: string | null // use this, NOT action_type
    output_summary: string
    status: 'success' | 'failed' | 'in_progress' | 'pending'
    risk_level: 'low' | 'medium' | 'high' | 'critical' | null
    related_deal_id: string | null
    related_contact_id: string | null
    related_task_id: string | null
    created_at: string
    agent?: Agent // from select('*, agent:agents(*)')
}

// ============================================================
// Status color mapping
// ============================================================
export type StatusColor = 'teal' | 'amber' | 'red' | 'gray'

export function getStatusColor(status: string): StatusColor {
    switch (status) {
        case 'active':
        case 'completed':
        case 'done':
        case 'success':
        case 'closed_won':
        case 'replied':
        case 'meeting_booked':
        case 'approved':
            return 'teal'

        case 'in_progress':
        case 'pending':
        case 'todo':
        case 'prospecting':
        case 'contacted':
        case 'discovery':
        case 'proposal':
        case 'negotiation':
        case 'not_contacted':
        case 'backlog':
            return 'amber'

        case 'blocked':
        case 'failed':
        case 'closed_lost':
        case 'disqualified':
        case 'P0 - Critical':
            return 'red'

        case 'paused':
        case 'archived':
        case 'cancelled':
            return 'gray'

        default:
            return 'gray'
    }
}

export function formatStatus(status: string): string {
    return status
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function formatPriority(priority: string): string {
    return priority // Already formatted like 'P0 - Critical'
}
