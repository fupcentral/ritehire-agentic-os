// ============================================================
// RiteHire Agentic OS — TypeScript Interfaces
// Updated to match ACTUAL Supabase table schemas
// (differs from schema.sql — Antigravity created tables with different constraints)
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
    // Joined
    skills?: Skill[]
}

export interface Skill {
    // Actual DB uses 'id' (UUID), not 'skill_id'
    id: string
    name: string
    agent_id: string
    github_path: string
    category: 'gtm' | 'finance' | 'legal' | 'brand' | 'ops'
    last_run: string | null
    status: 'active' | 'paused' | 'archived'
    run_count: number
    created_at: string
    updated_at: string
}

export interface Task {
    id: string
    title: string
    description: string | null
    agent_id: string | null
    epic_id: string | null
    skill_id: string | null
    // Actual DB constraint: 'todo' | 'in_progress' | 'blocked' | 'done' | 'cancelled'
    status: 'todo' | 'in_progress' | 'blocked' | 'done' | 'cancelled'
    blocker_path: string | null
    // Actual DB constraint: 'P0 - Critical' | 'P1 - High' | 'P2 - Medium' | 'P3 - Low'
    priority: 'P0 - Critical' | 'P1 - High' | 'P2 - Medium' | 'P3 - Low'
    due_date: string | null
    completed_at: string | null
    created_at: string
    updated_at: string
    // Joined
    agent?: Agent
}

export interface Epic {
    id: string
    title: string
    description: string | null
    owner_agent: string | null
    completion_pct: number
    // Actual DB constraint: 'active' | 'completed' | 'blocked' | 'backlog'
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
    // Actual DB constraint values
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
    // Joined
    contact?: Contact
}

export interface Contact {
    id: string
    name: string
    company: string | null
    title: string | null
    linkedin_url: string | null
    email: string | null
    phone: string | null
    // Actual DB constraint values
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

export interface ActivityLogEntry {
    id: string
    agent_id: string | null
    skill_used: string | null
    // action_type may not exist in actual DB — kept optional for safety
    action_type?: string | null
    output_summary: string
    // Actual DB constraint: 'success' | 'failed' | 'in_progress' | 'pending'
    status: 'success' | 'failed' | 'in_progress' | 'pending'
    risk_level: 'low' | 'medium' | 'high' | 'critical' | null
    related_deal_id: string | null
    related_contact_id: string | null
    related_task_id: string | null
    created_at: string
    // Joined via agent_id FK (from useActivityLog select '*, agent:agents(*)')
    agent?: Agent
}

// ============================================================
// Status color mapping helper type
// ============================================================
export type StatusColor = 'teal' | 'amber' | 'red' | 'gray'

export function getStatusColor(status: string): StatusColor {
    switch (status) {
        // Green / success states
        case 'active':
        case 'completed':
        case 'done':
        case 'success':
        case 'closed_won':
        case 'replied':
        case 'meeting_booked':
            return 'teal'

        // Amber / in-progress states
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

        // Red / blocked / failed states
        case 'blocked':
        case 'failed':
        case 'closed_lost':
        case 'disqualified':
        case 'P0 - Critical':
            return 'red'

        // Gray / neutral / archived states
        case 'paused':
        case 'archived':
        case 'cancelled':
        case 'P1 - High':
        case 'P2 - Medium':
        case 'P3 - Low':
            return 'gray'

        default:
            return 'gray'
    }
}
