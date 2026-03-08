/**
 * Google Drive folder/file mappings for RiteHire OS.
 * 
 * Drive root: /RiteHire OS/
 *   ├── Brand Assets/      — brand kit, content calendar, style guides
 *   ├── Contracts/          — client/employee contracts
 *   ├── Templates/          — SOPs, process templates
 *   ├── Deliverables/       — produced content, visuals, outputs
 *   └── Content/LinkedIn/   — LinkedIn post drafts, visual briefs
 */

const DRIVE_BASE = 'https://drive.google.com/drive/folders'

// Known folder IDs from the codebase
export const DRIVE_FOLDERS = {
    root: { id: '17yXAQNAlYDTr8xtUJDBOY7SGXOjdVyjn', name: 'RiteHire OS', path: '/' },
    deliverables: { id: '1XlkYdUWF4KPppEa_H2yIgud89biANYR3', name: 'Deliverables', path: '/Deliverables/' },
} as const

export function driveUrl(folderId: string): string {
    return `${DRIVE_BASE}/${folderId}`
}

// Marketing-specific Drive resource links
export interface DriveResource {
    label: string
    description: string
    driveUrl: string
    category: 'linkedin' | 'brand' | 'email' | 'general'
    icon: 'folder' | 'doc' | 'sheet' | 'image'
}

export const MARKETING_DRIVE_RESOURCES: DriveResource[] = [
    // LinkedIn content
    {
        label: 'LinkedIn Deliverables',
        description: 'All approved LinkedIn posts, images, and assets',
        driveUrl: driveUrl(DRIVE_FOLDERS.deliverables.id),
        category: 'linkedin',
        icon: 'folder',
    },
    {
        label: 'Visual Briefs',
        description: 'CDO visual briefs for LinkedIn post imagery',
        driveUrl: driveUrl(DRIVE_FOLDERS.deliverables.id),
        category: 'linkedin',
        icon: 'doc',
    },
    {
        label: 'LinkedIn Content Calendar',
        description: 'Week-by-week post schedule & pillar assignments',
        driveUrl: driveUrl(DRIVE_FOLDERS.root.id),
        category: 'linkedin',
        icon: 'sheet',
    },
    // Brand assets
    {
        label: 'Brand Assets',
        description: 'Logo system, colour tokens, typography, brand guidelines',
        driveUrl: driveUrl(DRIVE_FOLDERS.root.id),
        category: 'brand',
        icon: 'folder',
    },
    {
        label: 'Content Calendar (Notion Backup)',
        description: 'Full content calendar exported from Notion',
        driveUrl: driveUrl(DRIVE_FOLDERS.root.id),
        category: 'brand',
        icon: 'doc',
    },
    // Email
    {
        label: 'Email Outreach Templates',
        description: 'Cold outreach frameworks, ICP-specific email sequences',
        driveUrl: driveUrl(DRIVE_FOLDERS.deliverables.id),
        category: 'email',
        icon: 'doc',
    },
    {
        label: 'Outreach Compliance Checklist',
        description: 'GDPR & LinkedIn ToS compliance verification',
        driveUrl: driveUrl(DRIVE_FOLDERS.deliverables.id),
        category: 'general',
        icon: 'doc',
    },
]

// Activity-to-drive mapping: matches keywords in output_summary to relevant Drive links
export function getDriveLinksForActivity(outputSummary: string, skillUsed?: string): DriveResource[] {
    const text = `${outputSummary} ${skillUsed || ''}`.toLowerCase()
    const matches: DriveResource[] = []

    if (text.includes('linkedin') || text.includes('post') || text.includes('content')) {
        matches.push(...MARKETING_DRIVE_RESOURCES.filter((r) => r.category === 'linkedin'))
    }
    if (text.includes('brand') || text.includes('logo') || text.includes('colour') || text.includes('color') || text.includes('brand_kit')) {
        matches.push(...MARKETING_DRIVE_RESOURCES.filter((r) => r.category === 'brand'))
    }
    if (text.includes('email') || text.includes('outreach') || text.includes('outbound')) {
        matches.push(...MARKETING_DRIVE_RESOURCES.filter((r) => r.category === 'email'))
    }
    if (text.includes('compliance') || text.includes('gdpr') || text.includes('legal')) {
        matches.push(...MARKETING_DRIVE_RESOURCES.filter((r) => r.category === 'general'))
    }

    // Deduplicate by label
    return [...new Map(matches.map((m) => [m.label, m])).values()]
}
