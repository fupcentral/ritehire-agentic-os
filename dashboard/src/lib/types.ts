// ============================================================
// RiteHire Agentic OS — TypeScript Interfaces
// Maps 1:1 to the 7 Supabase tables in database/schema.sql
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
    skill_id: string
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
    agent_id: string
    epic_id: string | null
    skill_id: string | null
    status: 'pending' | 'in_progress' | 'blocked' | 'completed' | 'cancelled'
    blocker_path: string | null
    priority: 'low' | 'medium' | 'high' | 'critical'
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
    owner_agent: string
    completion_pct: number
    status: 'active' | 'completed' | 'on_hold' | 'cancelled'
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
    | 'prospect'
    | 'qualified'
    | 'proposal_sent'
    | 'negotiation'
    | 'verbal_close'
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
    outreach_status:
    | 'identified'
    | 'draft'
    | 'approved'
    | 'sent'
    | 'replied'
    | 'meeting_booked'
    | 'client'
    | 'no_response'
    | 'not_interested'
    | 'do_not_contact'
    source: string | null
    notes: string | null
    created_at: string
    updated_at: string
}

export interface ActivityLogEntry {
    id: string
    agent_id: string
    skill_used: string | null
    action_type: 'skill_execution' | 'decision' | 'alert' | 'review'
    output_summary: string
    status:
    | 'completed'
    | 'approved_pending_action'
    | 'awaiting_approval'
    | 'failed'
    | 'escalated'
    risk_level: 'low' | 'medium' | 'high' | 'critical' | null
    related_deal_id: string | null
    related_contact_id: string | null
    related_task_id: string | null
    created_at: string
    // Joined
    agent?: Agent
}

// ============================================================
// Status color mapping helper type
// ============================================================
export type StatusColor = 'teal' | 'amber' | 'red' | 'gray'

export function getStatusColor(status: string): StatusColor {
    switch (status) {
        case 'active':
        case 'completed':
        case 'approved':
        case 'closed_won':
        case 'client':
        case 'replied':
        case 'meeting_booked':
            return 'teal'
        case 'in_progress':
        case 'pending':
        case 'awaiting_approval':
        case 'approved_pending_action':
        case 'draft':
        case 'sent':
        case 'identified':
        case 'prospect':
        case 'qualified':
        case 'proposal_sent':
        case 'negotiation':
        case 'verbal_close':
            return 'amber'
        case 'blocked':
        case 'critical':
        case 'escalated':
        case 'failed':
        case 'closed_lost':
        case 'do_not_contact':
            return 'red'
        case 'paused':
        case 'archived':
        case 'cancelled':
        case 'on_hold':
        case 'no_response':
        case 'not_interested':
            return 'gray'
        default:
            return 'gray'
    }
}
