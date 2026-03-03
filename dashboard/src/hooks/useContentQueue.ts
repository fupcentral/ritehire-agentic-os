/* ============================================================
   CONTENT QUEUE
   ============================================================
   Manages content created by AI agents / tools (NanoBanana, etc.)
   that needs human approval before publishing.
   
   Flow: draft → pending_approval → approved/rejected → published
   ============================================================ */

import { useState, useEffect, useCallback } from 'react'

export type ContentType = 'linkedin_post' | 'email_draft' | 'blog_post' | 'social_graphic'
export type ContentStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'scheduled' | 'published'

export interface ContentItem {
    id: string
    type: ContentType
    title: string
    body: string
    /** Which tool/agent created this */
    source: string
    /** Target platform */
    platform: 'linkedin' | 'email' | 'blog' | 'twitter'
    status: ContentStatus
    /** Optional image URL */
    imageUrl?: string
    /** Scheduled publish time */
    scheduledAt?: string
    createdAt: string
    updatedAt: string
    /** Who approved/rejected */
    reviewedBy?: string
    /** Optional notes from reviewer */
    reviewNote?: string
    /** Tags for filtering */
    tags: string[]
}

/* ============================================================
   DEMO DATA
   In production, this comes from a Supabase `content_queue` table.
   ============================================================ */
const DEMO_CONTENT: ContentItem[] = [
    {
        id: 'cq-1',
        type: 'linkedin_post',
        title: 'Why Pakistan is the Next EOR Frontier',
        body: `🇵🇰 Pakistan's tech talent pool is exploding — but most global companies don't know how to hire there compliantly.\n\nThat's exactly what we solve at RiteHire.\n\nHere's what makes Pakistan a compelling EOR market:\n\n✅ 200M+ population with a young, English-speaking workforce\n✅ 50%+ lower employment costs vs. traditional nearshore markets\n✅ Growing fintech infra making cross-border payroll seamless\n✅ Favorable timezone overlap with EU and Middle East\n\nWe handle EOBI, social security, tax withholding, and compliance — so you can focus on building your team.\n\nDM me if you're exploring Pakistan for your next hire. 🚀\n\n#EOR #Pakistan #GlobalHiring #RemoteWork #RiteHire`,
        source: 'NanoBanana',
        platform: 'linkedin',
        status: 'pending_approval',
        createdAt: '2026-03-04T07:30:00Z',
        updatedAt: '2026-03-04T07:30:00Z',
        tags: ['thought-leadership', 'pakistan', 'eor'],
    },
    {
        id: 'cq-2',
        type: 'linkedin_post',
        title: 'Client Success Story — TechScale',
        body: `Case study time 📊\n\nWhen TechScale needed 5 senior engineers in Pakistan within 30 days, most EOR providers said "impossible."\n\nWe said "here's how."\n\n🔹 Day 1-3: Sourced 40 qualified candidates\n🔹 Day 4-10: Client interviewed 15 finalists\n🔹 Day 11-20: Compliant employment contracts signed\n🔹 Day 21-30: All 5 engineers onboarded with benefits\n\nResult: 60% cost savings vs. their US team, zero compliance headaches.\n\nThis is what happens when your EOR actually understands Pakistani employment law.\n\n#ClientSuccess #EOR #TalentAcquisition #Pakistan`,
        source: 'NanoBanana',
        platform: 'linkedin',
        status: 'pending_approval',
        createdAt: '2026-03-04T06:15:00Z',
        updatedAt: '2026-03-04T06:15:00Z',
        tags: ['case-study', 'client-success'],
    },
    {
        id: 'cq-3',
        type: 'linkedin_post',
        title: 'EOBI Compliance Tips for Foreign Employers',
        body: `⚠️ Hiring in Pakistan without EOBI registration? You're at risk.\n\nHere's what every foreign employer needs to know about EOBI (Employees Old-Age Benefits Institution):\n\n1️⃣ Registration is mandatory for companies with 5+ employees\n2️⃣ Employer contribution: 5% of minimum wage\n3️⃣ Employee contribution: 1% of minimum wage\n4️⃣ Non-compliance penalties: Up to 3x unpaid contributions\n\nAs your EOR partner, RiteHire handles all EOBI registration, contributions, and annual filings.\n\nStop risking compliance violations. Let's talk. ✉️\n\n#Compliance #EOBI #Pakistan #EmploymentLaw #EOR`,
        source: 'NanoBanana',
        platform: 'linkedin',
        status: 'pending_approval',
        createdAt: '2026-03-03T14:00:00Z',
        updatedAt: '2026-03-03T14:00:00Z',
        tags: ['compliance', 'eobi', 'educational'],
    },
    {
        id: 'cq-4',
        type: 'linkedin_post',
        title: 'Intro post — Meet the RiteHire AI Team',
        body: `We run a 9-agent AI team that handles everything from sales to compliance.\n\nMeet the crew:\n🤖 CEO Agent — Strategy & oversight\n📊 CDO Agent — Data & analytics\n💰 CRO Agent — Revenue & sales\n💼 CFO Agent — Financial ops\n📱 LinkedIn Agent — Content & outreach\n✉️ Email Agent — Sequences & warmup\n🎨 Brand Agent — Visual identity\n⚖️ Legal Agent — Compliance & contracts\n🔧 Admin Agent — Operations & logistics\n\nThis is the future of lean operations. AMA 👇\n\n#AI #AgenticAI #Startup #EOR #Pakistan`,
        source: 'NanoBanana',
        platform: 'linkedin',
        status: 'approved',
        scheduledAt: '2026-03-05T09:00:00Z',
        createdAt: '2026-03-02T10:00:00Z',
        updatedAt: '2026-03-03T08:00:00Z',
        reviewedBy: 'Nabeel',
        tags: ['intro', 'team', 'ai'],
    },
    {
        id: 'cq-5',
        type: 'linkedin_post',
        title: 'Weekend motivation post',
        body: `Building a startup in Pakistan taught me one thing:\n\nThe talent here is world-class. The systems just hadn't caught up.\n\nUntil now. 🇵🇰\n\n#Startup #Pakistan #Motivation`,
        source: 'NanoBanana',
        platform: 'linkedin',
        status: 'published',
        createdAt: '2026-03-01T12:00:00Z',
        updatedAt: '2026-03-01T14:00:00Z',
        reviewedBy: 'Nabeel',
        tags: ['motivation'],
    },
    {
        id: 'cq-6',
        type: 'linkedin_post',
        title: 'Generic hiring post',
        body: `We are hiring! Join our amazing team.\n\n#Hiring #Jobs`,
        source: 'NanoBanana',
        platform: 'linkedin',
        status: 'rejected',
        createdAt: '2026-03-01T08:00:00Z',
        updatedAt: '2026-03-01T09:00:00Z',
        reviewedBy: 'Nabeel',
        reviewNote: 'Too generic. Needs RiteHire-specific messaging and value prop.',
        tags: ['hiring'],
    },
]

/* ============================================================
   HOOK
   ============================================================ */
export function useContentQueue(filters?: {
    status?: ContentStatus[]
    platform?: string
    type?: ContentType
}) {
    const [items, setItems] = useState<ContentItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Simulate loading from Supabase
        const timer = setTimeout(() => {
            let filtered = [...DEMO_CONTENT]
            if (filters?.status) {
                filtered = filtered.filter((i) => filters.status!.includes(i.status))
            }
            if (filters?.platform) {
                filtered = filtered.filter((i) => i.platform === filters.platform)
            }
            if (filters?.type) {
                filtered = filtered.filter((i) => i.type === filters.type)
            }
            // Sort: pending first, then by date desc
            filtered.sort((a, b) => {
                const statusOrder: Record<ContentStatus, number> = {
                    pending_approval: 0,
                    draft: 1,
                    approved: 2,
                    scheduled: 3,
                    published: 4,
                    rejected: 5,
                }
                const sDiff = statusOrder[a.status] - statusOrder[b.status]
                if (sDiff !== 0) return sDiff
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            })
            setItems(filtered)
            setLoading(false)
        }, 400)
        return () => clearTimeout(timer)
    }, [filters?.status?.join(','), filters?.platform, filters?.type])

    const approve = useCallback((id: string, scheduledAt?: string) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        status: scheduledAt ? 'scheduled' as ContentStatus : 'approved' as ContentStatus,
                        scheduledAt,
                        reviewedBy: 'Nabeel',
                        updatedAt: new Date().toISOString(),
                    }
                    : item
            )
        )
    }, [])

    const reject = useCallback((id: string, note?: string) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        status: 'rejected' as ContentStatus,
                        reviewNote: note,
                        reviewedBy: 'Nabeel',
                        updatedAt: new Date().toISOString(),
                    }
                    : item
            )
        )
    }, [])

    const publish = useCallback((id: string) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        status: 'published' as ContentStatus,
                        updatedAt: new Date().toISOString(),
                    }
                    : item
            )
        )
    }, [])

    const pendingCount = items.filter((i) => i.status === 'pending_approval').length

    return { items, loading, approve, reject, publish, pendingCount }
}
