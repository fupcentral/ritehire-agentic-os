---
name: apple-design
description: Apply Apple Human Interface Guidelines (HIG) principles to UI design, visual reviews, component specs, and product decisions. Use when creating Apple-aesthetic interfaces, reviewing designs for HIG compliance, designing for iOS/macOS/visionOS, or when the user wants clean, minimal, premium UI.
---

# Apple Design (HIG)

Apply Apple's Human Interface Guidelines to create interfaces that feel native, intuitive, and premium.

## Core Principles

### Clarity
- Every pixel serves a purpose. Remove anything decorative that doesn't aid comprehension.
- Text is legible at every size. Use SF Pro / SF Compact / New York.
- Icons are precise and unambiguous. Use SF Symbols where possible.
- Negative space is a design element — give content room to breathe.

### Deference
- The UI supports the content, never competes with it.
- Translucency and blur reveal hierarchy without obscuring content.
- Animation conveys context and continuity, not decoration.
- Controls recede; content leads.

### Depth
- Layers and motion express hierarchy.
- Depth is used purposefully: sheets, popovers, cards.
- Shadows are soft, diffuse, and directional (light from above).
- Parallax and physics-based animations reinforce spatial metaphors.

---

## Typography

### Font Stack
- **Display / Headlines:** SF Pro Display (>20pt) or New York (editorial contexts)
- **Body / UI:** SF Pro Text (<=19pt)
- **Monospace:** SF Mono
- **Minimum legible size:** 11pt (iOS), 13pt (macOS)

### Type Scale (iOS)
| Style | Size | Weight | Usage |
|-------|------|--------|-------|
| Large Title | 34pt | Regular | Navigation titles |
| Title 1 | 28pt | Regular | Section headers |
| Title 2 | 22pt | Regular | Sub-headers |
| Title 3 | 20pt | Regular | Card titles |
| Headline | 17pt | Semibold | Emphasized body |
| Body | 17pt | Regular | Primary content |
| Callout | 16pt | Regular | Secondary content |
| Subhead | 15pt | Regular | Supporting text |
| Footnote | 13pt | Regular | Captions |
| Caption 1 | 12pt | Regular | Labels |
| Caption 2 | 11pt | Regular | Fine print |

### Rules
- Use Dynamic Type. Never hardcode font sizes.
- Tracking: keep default. Avoid manual letter-spacing.
- Line height: 1.2-1.5x for body, tighter for display.
- Left-align body text. Center only for short labels/titles.

---

## Color

### System Colors (iOS/macOS)
- **Blue** `#007AFF` — primary actions, links
- **Green** `#34C759` — success, confirmation
- **Red** `#FF3B30` — destructive, errors
- **Orange** `#FF9500` — warnings
- **Yellow** `#FFCC00` — attention
- **Purple** `#AF52DE` — premium
- **Teal** `#5AC8FA` — informational
- **Gray** system grays 1-6 — UI chrome, separators

### Rules
- Always provide Light and Dark mode variants.
- Use semantic color labels (label, secondaryLabel, systemBackground, etc.) not hardcoded hex.
- Tint color should be a single accent throughout the app.
- Avoid pure #000000 or #FFFFFF — use system off-blacks and off-whites.
- Minimum contrast ratio: 4.5:1 for body text, 3:1 for large text/UI components.

---

## Spacing & Layout

### 8pt Grid
- Base unit: **8pt**
- Common spacings: 4, 8, 12, 16, 20, 24, 32, 44, 56
- Touch targets: **minimum 44x44pt** (Apple requirement)
- Margins: 16pt standard, 20pt for full-bleed content

### Safe Areas
- Always respect safe area insets on iPhone (notch, home indicator, Dynamic Island).
- Content should not extend behind navigation bars or tab bars without proper blurring.

### Layout Guides
- List rows: 44pt minimum height
- Card padding: 16pt all sides
- Section headers: 20pt top, 8pt bottom
- Group spacing: 32pt between sections

---

## Components

### Navigation
- **NavigationBar**: Large Title collapses to inline on scroll. Back button uses chevron.left.
- **TabBar**: Max 5 items. Icons + labels. Active item uses tint color.
- **Sidebar** (iPad/Mac): List-based, collapsible. Source list style.

### Buttons
- **Primary (Filled)**: Rounded rect, tint fill, white text. Corner radius: continuousCurve (~10pt).
- **Secondary (Gray)**: System gray fill, label color text.
- **Tertiary (Tinted)**: Tint color background at 12% opacity.
- **Destructive**: Red fill or red tint.
- **Borderless**: Text-only, tint color.
- Avoid custom button shapes — use standard pill or rounded rect.

### Inputs
- **TextField**: Rounded rect, system background, 1pt separator or subtle border.
- **SearchBar**: Rounded, gray background, magnifyingglass icon.
- Placeholder text: secondaryLabel color.

### Lists & Tables
- Grouped style for settings/forms. Inset grouped for modern iOS 13+ apps.
- Swipe actions: red for destructive, other tints for constructive actions.

### Modals
- **Sheet** (bottom): Slides up, has grab handle if resizable.
- **Alert**: Center card, max 2 action buttons (Cancel left, Confirm right). Destructive is red.
- **Popover**: Arrow points to source on iPad/Mac.

### Cards
- Corner radius: 12-16pt (continuousRoundedRectangle)
- Shadow: `0 2px 8px rgba(0,0,0,0.08)` light mode; reduce or eliminate in dark mode
- Background: secondarySystemBackground (grouped) or systemBackground (card on bg)

---

## Iconography (SF Symbols)

### Usage Rules
- Prefer SF Symbols over custom icons for standard actions.
- Match symbol weight to surrounding text weight.
- Use multicolor symbols purposefully (e.g., folder.fill in yellow for documents).
- Scale: Small (17pt), Medium (22pt), Large (28pt) aligned to text categories.

### Common Symbols
| Action | Symbol |
|--------|--------|
| Add | `plus` / `plus.circle.fill` |
| Delete | `trash` / `minus.circle.fill` |
| Edit | `pencil` / `square.and.pencil` |
| Share | `square.and.arrow.up` |
| Settings | `gear` / `gearshape.fill` |
| Search | `magnifyingglass` |
| Close | `xmark` / `xmark.circle.fill` |
| Back | `chevron.left` |
| More | `ellipsis` / `ellipsis.circle` |
| Favorite | `heart` / `heart.fill` |
| Notifications | `bell` / `bell.badge.fill` |

---

## Motion & Animation

### Principles
- Animations communicate state changes, not style.
- Default duration: 0.3s. Quick feedback: 0.2s.
- Use spring physics (damping 0.7-0.9) for natural feel.
- Reduce motion: always provide fallback.

### Standard Patterns
- **Push navigation**: Horizontal slide (250ms, ease-in-out)
- **Modal present**: Slide up from bottom
- **Sheet dismiss**: Slide down, spring
- **Fade**: Subtle 0.2s for contextual changes
- **Scale**: 0.92->1.0 for tap feedback (spring)

---

## Dark Mode

### Requirements
- Every screen must support both light and dark appearances.
- Never hardcode colors — use semantic system colors.
- Images: provide dark-mode variants or use SF Symbols.
- Elevation uses darker backgrounds (not shadows) in dark mode:
  - Base: `systemBackground`
  - Elevated: `secondarySystemBackground`
  - Grouped: `systemGroupedBackground`

---

## Accessibility

### Minimum Requirements
- **Dynamic Type**: All text scales from xSmall to AX5.
- **VoiceOver**: Every interactive element has an accessibility label.
- **Color Independence**: Never use color alone to convey meaning.
- **Minimum Touch Target**: 44x44pt.
- **Contrast**: 4.5:1 for normal text, 3:1 for large text.

### Enhanced (Recommended)
- Support Switch Control and Full Keyboard Access.
- Implement accessibilityHint for non-obvious actions.
- Group related elements with accessibilityElement(children: .combine).

---

## Review Checklist

- [ ] Typography uses SF Pro / Dynamic Type
- [ ] Colors use semantic system values (light + dark)
- [ ] Touch targets >= 44x44pt
- [ ] 8pt grid alignment
- [ ] Safe area insets respected
- [ ] Navigation pattern follows platform conventions
- [ ] SF Symbols used for standard iconography
- [ ] Dark mode tested and verified
- [ ] Animations use spring physics, reduce motion supported
- [ ] Contrast ratios pass WCAG AA
- [ ] VoiceOver labels present on all interactive elements
- [ ] No decorative elements that impede content

---

## RiteHire Application

When applying Apple design to RiteHire:

- **Primary tint**: `#007AFF` (system blue) — trust, professionalism
- **Success states**: `#34C759` — candidate accepted, deal closed
- **Warning states**: `#FF9500` — review needed, pipeline stale
- **Destructive**: `#FF3B30` — rejections, deletions
- **Typography**: SF Pro Text body, SF Pro Display for headers
- **Card style**: 14pt corner radius, subtle shadow, inset grouped lists for forms
- **Agent avatars**: SF Symbol + tint color, not photos
- **Data tables**: Plain list style with disclosure indicators for drill-down
