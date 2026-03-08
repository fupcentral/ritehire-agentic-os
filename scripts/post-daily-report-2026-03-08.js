#!/usr/bin/env node
/**
 * Post 2026-03-08 daily report to Notion
 * Run: NOTION_TOKEN=secret_xxx node scripts/post-daily-report-2026-03-08.js
 */

const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

const NOTION_TOKEN = process.env.NOTION_TOKEN || process.env.NOTION_API_KEY;
const PARENT_PAGE_ID = '31714d73-bdee-8189-b0a2-fdc3cc7315db';

if (!NOTION_TOKEN) {
  console.error('❌ NOTION_TOKEN not set!');
  console.error('Run: NOTION_TOKEN=secret_xxx node scripts/post-daily-report-2026-03-08.js');
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });

const REPORT_TITLE = '2026-03-08 15:00 — RiteHire OS Status Report';

const blocks = [
  {
    object: 'block', type: 'callout',
    callout: {
      rich_text: [{ type: 'text', text: { content: 'Generated: 2026-03-08 16:11 PKT | Schedule: 3× daily (02:00 · 10:00 · 15:00) | Phase: Foundation → Build' } }],
      icon: { emoji: '⚡' }, color: 'gray_background'
    }
  },
  { object: 'block', type: 'divider', divider: {} },
  {
    object: 'block', type: 'heading_1',
    heading_1: { rich_text: [{ type: 'text', text: { content: 'Section 1: System Status Snapshot' } }] }
  },
  {
    object: 'block', type: 'callout',
    callout: {
      rich_text: [{ type: 'text', text: { content: 'Build Phase: Foundation ✅ → Build 🔄 (transitioning)' } }],
      icon: { emoji: '🏗️' }, color: 'blue_background'
    }
  },
  {
    object: 'block', type: 'paragraph',
    paragraph: { rich_text: [{ type: 'text', text: { content: '| Layer | Tool | Status | Notes |\n|-------|------|--------|-------|\n| Layer 1 — Source of Truth | GitHub | ✅ Complete | 9 agent YAMLs, 8 SKILL.md files, all docs committed |\n| Layer 2 — Supabase | vledjjqhycdkzgwwwlvu | ✅ Live | 7 tables with RLS; test data seeded |\n| Layer 2 — Notion | Architecture Blueprint | 🔄 In Progress | Blueprint live; 7 databases not yet built |\n| Layer 3 — Google Drive | /RiteHire OS/ | ⚠️ Incomplete | Workspace active; Service Account not set up |\n| Layer 4 — Lovable | New project | ⏳ Not Started | New project not scaffolded |\n| Layer 5 — Claude Cowork | Execution runtime | ✅ Active | Running this report |' } }] }
  },
  {
    object: 'block', type: 'heading_3',
    heading_3: { rich_text: [{ type: 'text', text: { content: 'Active Blockers' } }] }
  },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: '⚠️ ANTHROPIC_API_KEY missing from Supabase vault — Claude Co-worker chat non-functional' } }] } },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: '⚠️ GEMINI_API_KEY missing from Supabase vault — LinkedIn visual generation blocked' } }] } },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: '⚠️ Lemwarm not started — email domain warmup clock not running (target: March 25 readiness)' } }] } },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: '⚠️ Google Drive Service Account not configured — generated visuals don\'t persist to Drive' } }] } },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: '⚠️ Lovable new project not started — no live operating dashboard yet' } }] } },
  { object: 'block', type: 'divider', divider: {} },
  {
    object: 'block', type: 'heading_1',
    heading_1: { rich_text: [{ type: 'text', text: { content: 'Section 2: Previous 3 Days — What Was Addressed' } }] }
  },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: '2026-03-04 ✅ Supabase + RLS — 7 tables secured; 3 contacts, 3 deals, 4 epics, 15 tasks seeded' } }] } },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: '2026-03-04 ✅ RH8 Dashboard — 8-screen Antigravity dashboard committed to GitHub main' } }] } },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: '2026-03-04 ✅ Edge Functions — claude-chat.ts + generate-linkedin-visual.ts rewritten (Anthropic + Gemini)' } }] } },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: '2026-03-04 ✅ CRO Sales Strategy + CDO Visual Brief + 300 LinkedIn Prospects + Services Manifest' } }] } },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: '2026-03-05 ✅ Omni-Update CLI — 5-repo batch updater, production-ready, published to GitHub' } }] } },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: '2026-03-06–07 ⚠️ No Cowork session detected — gap in continuity' } }] } },
  { object: 'block', type: 'divider', divider: {} },
  {
    object: 'block', type: 'heading_1',
    heading_1: { rich_text: [{ type: 'text', text: { content: 'Section 3: Next 3 Days — What Needs to Be Addressed' } }] }
  },
  {
    object: 'block', type: 'heading_2',
    heading_2: { rich_text: [{ type: 'text', text: { content: 'Priority 1 — Must happen today / tomorrow' } }] }
  },
  { object: 'block', type: 'numbered_list_item', numbered_list_item: { rich_text: [{ type: 'text', text: { content: '[Founder · 5 min] Get Gemini API key → supabase secrets set GEMINI_API_KEY=AIza... — Unblocks LinkedIn visual generation' } }] } },
  { object: 'block', type: 'numbered_list_item', numbered_list_item: { rich_text: [{ type: 'text', text: { content: '[Founder · 5 min] Get Anthropic API key → supabase secrets set ANTHROPIC_API_KEY=sk-ant-... — Unblocks Claude Co-worker chat' } }] } },
  { object: 'block', type: 'numbered_list_item', numbered_list_item: { rich_text: [{ type: 'text', text: { content: '[Cowork · 10 min] Deploy both edge functions: claude-chat + generate-linkedin-visual (requires API keys first)' } }] } },
  { object: 'block', type: 'numbered_list_item', numbered_list_item: { rich_text: [{ type: 'text', text: { content: '[Founder · 30 min] START LEMWARM — lemwarm.com → connect email → DNS records in Hostinger. Do this TODAY.' } }] } },
  {
    object: 'block', type: 'heading_2',
    heading_2: { rich_text: [{ type: 'text', text: { content: 'Priority 2 — This week (Mar 9–10)' } }] }
  },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: '[Founder · 20 min] Import docs/linkedin-prospects-300.csv into LinkedIn Sales Navigator as Lead List' } }] } },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: '[Founder · 15 min/day] Begin LinkedIn outreach: 15 connection requests/day, Tier 1 only (ICP-A + ICP-E)' } }] } },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: '[CDO agent · 30 min] Generate first 2 LinkedIn visuals using CDO briefs (requires Gemini API key)' } }] } },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: '[Cowork + Founder · 2 hrs] Scaffold new Lovable project — connect to Supabase, start with 2 core views' } }] } },
  { object: 'block', type: 'divider', divider: {} },
  {
    object: 'block', type: 'heading_1',
    heading_1: { rich_text: [{ type: 'text', text: { content: 'Section 4: Business Objectives Check-In' } }] }
  },
  {
    object: 'block', type: 'heading_2',
    heading_2: { rich_text: [{ type: 'text', text: { content: '1. GTM — LinkedIn Outbound + Email' } }] }
  },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: 'LinkedIn Sales Navigator ✅ Active ($49.99/mo)' } }] } },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: 'Prospect list (300) ✅ Ready — NOT YET imported to Sales Navigator' } }] } },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: 'Outreach ❌ Not started — blocked on Founder completing 3 setup tasks' } }] } },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: 'Email domain warmup ❌ Lemwarm not started — domain warmup clock must start TODAY' } }] } },
  {
    object: 'block', type: 'heading_2',
    heading_2: { rich_text: [{ type: 'text', text: { content: '2. Revenue — Deal Pipeline' } }] }
  },
  {
    object: 'block', type: 'callout',
    callout: {
      rich_text: [{ type: 'text', text: { content: '⚠️ URGENT: Hive Analytics closes March 14 — 6 days away. Confirm whether final commercial proposal was sent. If not, send TODAY using CRO strategy email template.' } }],
      icon: { emoji: '🚨' }, color: 'red_background'
    }
  },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: 'Hive Analytics — Negotiation — £8,500/mo — Close: March 14 🔴 URGENT' } }] } },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: 'Meridian Consulting — Proposal — £6,000/mo — Close: March 25' } }] } },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: 'BuildStack — Discovery — £3,200/mo — Close: April 4' } }] } },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: 'Pipeline total: £17,700 MRR | Booked MRR: £0 (pre-revenue)' } }] } },
  {
    object: 'block', type: 'heading_2',
    heading_2: { rich_text: [{ type: 'text', text: { content: '3. Operations — Legal, Compliance, Onboarding' } }] }
  },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: 'Outreach compliance review ✅ Complete (deliverables/outreach-compliance-check-v1.md)' } }] } },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: 'Contract templates 🔄 In progress' } }] } },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: 'Onboarding documentation ⏳ Not yet built' } }] } },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: 'Google Drive /RiteHire OS/ folder ⚠️ Not yet created' } }] } },
  { object: 'block', type: 'divider', divider: {} },
  {
    object: 'block', type: 'heading_1',
    heading_1: { rich_text: [{ type: 'text', text: { content: 'Section 5: Access & Integration Status' } }] }
  },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: 'GitHub ✅ Connected — fupcentral/ritehire-agentic-os — all code live' } }] } },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: 'Supabase ✅ Connected — vledjjqhycdkzgwwwlvu — 7 tables, RLS enabled, test data seeded' } }] } },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: 'Google Drive 🔧 In Setup — Workspace active; /RiteHire OS/ folder + Service Account needed' } }] } },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: 'Lovable ⏳ Not Started — New project not yet scaffolded' } }] } },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: 'Notion ✅ Connected — Architecture Blueprint + Daily Reports live' } }] } },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: 'LinkedIn 🔧 In Setup — Sales Navigator active; prospect list not yet imported' } }] } },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: 'Gmail 🔧 In Setup — Google Workspace active; Apollo OAuth not yet connected' } }] } },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: 'Stripe ⏳ Not Started — Configure when first deal closes' } }] } },
  { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: 'Claude Cowork ✅ Connected — Active execution runtime' } }] } },
  { object: 'block', type: 'divider', divider: {} },
  {
    object: 'block', type: 'heading_1',
    heading_1: { rich_text: [{ type: 'text', text: { content: 'Section 6: Pickup Guide' } }] }
  },
  { object: 'block', type: 'numbered_list_item', numbered_list_item: { rich_text: [{ type: 'text', text: { content: 'The system is built but stalled on 3 small Founder tasks. All the hard work is done — database, dashboard, content strategy, 300 prospects, agent definitions are ready to go.' } }] } },
  { object: 'block', type: 'numbered_list_item', numbered_list_item: { rich_text: [{ type: 'text', text: { content: 'Most urgent: Hive Analytics closes in 6 days (March 14). Check if the final commercial proposal was sent. If not, send it TODAY.' } }] } },
  { object: 'block', type: 'numbered_list_item', numbered_list_item: { rich_text: [{ type: 'text', text: { content: 'Get two API keys: Gemini (free, aistudio.google.com/apikey) and Anthropic (console.anthropic.com). Both take 5 minutes each.' } }] } },
  { object: 'block', type: 'numbered_list_item', numbered_list_item: { rich_text: [{ type: 'text', text: { content: 'Start Lemwarm TODAY. Sign up at lemwarm.com, connect your Google Workspace email, add DNS records in Hostinger. Every day you wait is a day of warmup lost before March 25.' } }] } },
  { object: 'block', type: 'numbered_list_item', numbered_list_item: { rich_text: [{ type: 'text', text: { content: 'After those three: import 300 prospects to Sales Navigator, approve first LinkedIn post, scaffold Lovable dashboard. Cowork handles all of that with you.' } }] } },
  { object: 'block', type: 'divider', divider: {} },
  {
    object: 'block', type: 'paragraph',
    paragraph: { rich_text: [
      { type: 'text', text: { content: 'Architecture Blueprint: ' } },
      { type: 'text', text: { content: 'https://www.notion.so/31714d73bdee8138ad6aca1ebcec4509', link: { url: 'https://www.notion.so/31714d73bdee8138ad6aca1ebcec4509' } } },
      { type: 'text', text: { content: ' | Generated by: ritehire-os-daily-report scheduled task | Claude Cowork' } }
    ] }
  }
];

async function createReport() {
  try {
    console.log('📤 Creating Notion page...');
    console.log('📄 Title:', REPORT_TITLE);
    console.log('📁 Parent:', PARENT_PAGE_ID);
    
    const response = await notion.pages.create({
      parent: { page_id: PARENT_PAGE_ID },
      properties: {
        title: {
          title: [{ text: { content: REPORT_TITLE } }]
        }
      },
      children: blocks
    });
    
    const pageUrl = `https://notion.so/${response.id.replace(/-/g, '')}`;
    console.log('✅ Report created successfully!');
    console.log('🔗 URL:', pageUrl);
    return response;
  } catch (error) {
    console.error('❌ Failed:', error.message);
    if (error.status === 401) {
      console.error('Invalid NOTION_TOKEN. Get one from: https://www.notion.so/my-integrations');
    }
    if (error.status === 404) {
      console.error('Parent page not found. Ensure integration has access to the page.');
    }
    throw error;
  }
}

createReport().catch(() => process.exit(1));
