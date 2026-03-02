-- ============================================================
-- RiteHire Agentic OS — Supabase Schema
-- Version: 1.0
-- Date: 2026-03-02
-- ============================================================
-- 7 tables, all co-primary with Notion.
-- Supabase = programmatic/API layer.
-- Notion = human operating layer.
-- Both are authoritative. Bidirectional sync required.
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLE 1: agents
-- Represents each agent in the RiteHire Agentic OS.
-- ============================================================
create table agents (
  id             text primary key,                -- e.g. 'ceo', 'cro', 'linkedin-outbound'
  name           text not null,                  -- e.g. 'CEO', 'LinkedIn Outbound Specialist'
  role           text not null,
  reporting_to   text references agents(id),     -- null for CEO (top of hierarchy)
  status         text not null default 'active'
                   check (status in ('active', 'paused', 'archived')),
  current_task   text,                           -- brief description of what agent is working on
  github_path    text,                           -- path to agent YAML in repo
  prompt_path    text,                           -- path to system prompt in repo
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

comment on table agents is 'All 9 agents in the RiteHire Agentic OS. Co-primary with Notion agents database.';

-- ============================================================
-- TABLE 2: skills
-- Represents each SKILL.md execution playbook.
-- ============================================================
create table skills (
  skill_id       text primary key,               -- e.g. 'linkedin-draft-post'
  name           text not null,                  -- human-readable name
  agent_id       text not null references agents(id),
  github_path    text not null,                  -- e.g. /skills/gtm/linkedin-draft-post/SKILL.md
  category       text not null
                   check (category in ('gtm', 'finance', 'legal', 'brand', 'ops')),
  last_run       timestamptz,
  status         text not null default 'active'
                   check (status in ('active', 'paused', 'archived')),
  run_count      integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

comment on table skills is 'All 8 SKILL.md execution playbooks. Co-primary with Notion skills database.';

-- ============================================================
-- TABLE 3: tasks
-- Individual tasks assigned to agents or created during skill execution.
-- ============================================================
create table tasks (
  id             uuid primary key default uuid_generate_v4(),
  title          text not null,
  description    text,
  agent_id       text not null references agents(id),
  epic_id        uuid references epics(id),      -- will be added after epics table
  skill_id       text references skills(skill_id),
  status         text not null default 'pending'
                   check (status in ('pending', 'in_progress', 'blocked', 'completed', 'cancelled')),
  blocker_path   text,                           -- description of what is blocking this task
  priority       text not null default 'medium'
                   check (priority in ('low', 'medium', 'high', 'critical')),
  due_date       date,
  completed_at   timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

comment on table tasks is 'All tasks in the OS. Co-primary with Notion tasks database.';

-- ============================================================
-- TABLE 4: epics
-- Higher-level groupings of tasks. Tracks company-level initiatives.
-- ============================================================
create table epics (
  id              uuid primary key default uuid_generate_v4(),
  title           text not null,
  description     text,
  owner_agent     text not null references agents(id),
  completion_pct  integer not null default 0
                    check (completion_pct between 0 and 100),
  status          text not null default 'active'
                    check (status in ('active', 'completed', 'on_hold', 'cancelled')),
  target_date     date,
  completed_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table epics is 'Company-level initiatives. Co-primary with Notion epics database.';

-- Add foreign key for tasks.epic_id now that epics exists
alter table tasks
  add constraint tasks_epic_id_fkey
  foreign key (epic_id) references epics(id);

-- ============================================================
-- TABLE 5: deals
-- Sales pipeline. All active opportunities.
-- No HubSpot. CRM is Notion + Supabase only.
-- ============================================================
create table deals (
  id              uuid primary key default uuid_generate_v4(),
  company         text not null,
  contact_id      uuid references contacts(id),  -- will be added after contacts table
  stage           text not null default 'prospect'
                    check (stage in (
                      'prospect',
                      'qualified',
                      'proposal_sent',
                      'negotiation',
                      'verbal_close',
                      'closed_won',
                      'closed_lost'
                    )),
  mrr             numeric(10,2),                  -- monthly recurring revenue (USD)
  expected_close_date  date,
  source          text,                           -- e.g. 'linkedin_outbound', 'referral', 'inbound'
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table deals is 'Sales pipeline. Co-primary with Notion deals database. No HubSpot.';

-- ============================================================
-- TABLE 6: contacts
-- All people in the outreach universe — prospects and clients.
-- ============================================================
create table contacts (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  company         text,
  title           text,
  linkedin_url    text,
  email           text,
  phone           text,
  outreach_status text not null default 'identified'
                    check (outreach_status in (
                      'identified',
                      'draft',
                      'approved',
                      'sent',
                      'replied',
                      'meeting_booked',
                      'client',
                      'no_response',
                      'not_interested',
                      'do_not_contact'
                    )),
  source          text,                           -- e.g. 'target-account-list', 'referral'
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table contacts is 'All prospects and clients. Co-primary with Notion contacts database.';

-- Add foreign key for deals.contact_id now that contacts exists
alter table deals
  add constraint deals_contact_id_fkey
  foreign key (contact_id) references contacts(id);

-- ============================================================
-- TABLE 7: activity_log
-- Every agent action logged here. The audit trail of the OS.
-- ============================================================
create table activity_log (
  id              uuid primary key default uuid_generate_v4(),
  agent_id        text not null references agents(id),
  skill_used      text references skills(skill_id),
  action_type     text not null,                  -- e.g. 'skill_execution', 'decision', 'alert', 'review'
  output_summary  text not null,
  status          text not null
                    check (status in (
                      'completed',
                      'approved_pending_action',
                      'awaiting_approval',
                      'failed',
                      'escalated'
                    )),
  risk_level      text
                    check (risk_level in ('low', 'medium', 'high', 'critical')),
  related_deal_id   uuid references deals(id),
  related_contact_id uuid references contacts(id),
  related_task_id   uuid references tasks(id),
  created_at      timestamptz not null default now()
);

comment on table activity_log is 'Audit trail for all agent actions. Co-primary with Notion activity_log database.';

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_tasks_agent_id on tasks(agent_id);
create index idx_tasks_status on tasks(status);
create index idx_tasks_epic_id on tasks(epic_id);
create index idx_deals_stage on deals(stage);
create index idx_deals_contact_id on deals(contact_id);
create index idx_contacts_outreach_status on contacts(outreach_status);
create index idx_contacts_company on contacts(company);
create index idx_activity_log_agent_id on activity_log(agent_id);
create index idx_activity_log_created_at on activity_log(created_at desc);
create index idx_skills_agent_id on skills(agent_id);
create index idx_skills_category on skills(category);

-- ============================================================
-- SEED DATA: Agents
-- ============================================================
insert into agents (id, name, role, reporting_to, status, github_path, prompt_path) values
  ('ceo',               'CEO',                         'Chief Executive Officer',       null,         'active', '/agents/ceo.yaml',               '/prompts/ceo.md'),
  ('cdo',               'CDO',                         'Chief Design Officer',          'ceo',        'active', '/agents/cdo.yaml',               '/prompts/cdo.md'),
  ('cro',               'CRO',                         'Chief Revenue Officer',         'ceo',        'active', '/agents/cro.yaml',               '/prompts/cro.md'),
  ('cfo',               'CFO',                         'Chief Financial Officer',       'ceo',        'active', '/agents/cfo.yaml',               '/prompts/cfo.md'),
  ('linkedin-outbound', 'LinkedIn Outbound Specialist', 'LinkedIn Outbound Specialist', 'cro',        'active', '/agents/linkedin-outbound.yaml', '/prompts/linkedin-outbound.md'),
  ('email-outbound',    'Email Outbound Specialist',   'Email Outbound Specialist',     'cro',        'active', '/agents/email-outbound.yaml',    '/prompts/email-outbound.md'),
  ('brand',             'Brand',                       'Brand Manager',                 'cro',        'active', '/agents/brand.yaml',             '/prompts/brand.md'),
  ('legal-compliance',  'Legal & Compliance',          'Legal & Compliance Manager',    'cfo',        'active', '/agents/legal-compliance.yaml',  '/prompts/legal-compliance.md'),
  ('admin-ops',         'Admin & Ops',                 'Admin & Operations Manager',    'cfo',        'active', '/agents/admin-ops.yaml',         '/prompts/admin-ops.md');

-- ============================================================
-- SEED DATA: Skills
-- ============================================================
insert into skills (skill_id, name, agent_id, github_path, category) values
  ('linkedin-draft-post',  'LinkedIn Draft Post',    'linkedin-outbound', '/skills/gtm/linkedin-draft-post/SKILL.md',  'gtm'),
  ('linkedin-image-brief', 'LinkedIn Image Brief',   'linkedin-outbound', '/skills/gtm/linkedin-image-brief/SKILL.md', 'gtm'),
  ('email-cold-outreach',  'Email Cold Outreach',    'email-outbound',    '/skills/gtm/email-cold-outreach/SKILL.md',  'gtm'),
  ('target-account-list',  'Target Account List',    'linkedin-outbound', '/skills/gtm/target-account-list/SKILL.md',  'gtm'),
  ('update-forecast',      'Update Forecast',        'cfo',               '/skills/finance/update-forecast/SKILL.md',  'finance'),
  ('runway-report',        'Runway Report',          'cfo',               '/skills/finance/runway-report/SKILL.md',    'finance'),
  ('contract-review',      'Contract Review',        'legal-compliance',  '/skills/legal/contract-review/SKILL.md',    'legal'),
  ('content-calendar',     'Content Calendar',       'brand',             '/skills/brand/content-calendar/SKILL.md',   'brand');
