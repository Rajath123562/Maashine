# Design System & UI Specifications — MaaShine

## 1. Visual Identity & Brand Aesthetics

MaaShine's visual aesthetic is designed to feel:
- **Clean & Fresh**: Built around natural, minty teals and warm linen backgrounds.
- **Modern & Premium**: Soft shadows, generous rounded borders (`rounded-3xl`), glassmorphic navigation bars, and vibrant highlight accents.
- **Trustworthy & Legible**: High-contrast typography, clear badge indicators, and explicit status colors.

---

## 2. Color Tokens

| Token Name | Hex Code | Variable | Usage |
|------------|----------|----------|-------|
| **Teal** | `#0d9488` | `--color-teal` | Primary brand color, headers, primary buttons, badges |
| **Lime** | `#a3e635` | `--color-lime` | Secondary CTA buttons, badge highlights, brand accents |
| **Marigold** | `#fbbf24` | `--color-marigold` | Price tags, pending badges, quote alerts |
| **Sage** | `#9ca3af` | `--color-sage` | Secondary text, borders, muted subtitles |
| **Linen** | `#fdf8f6` | `--color-linen` | Page backgrounds, card fills, neutral container surfaces |
| **Ink** | `#1e293b` | `--color-ink` | Primary body text, dark headers, dark mode container fills |

---

## 3. Typography System

- **Primary Font Family**: `Bricolage Grotesque` (via `next/font/google`)
  - Used for: Display headings (`h1`, `h2`, `h3`), navigation links, primary buttons, and card titles.
- **Monospace Font Family**: `IBM Plex Mono` (via `next/font/google`)
  - Used for: Status labels, request numbers, date tags, code snippets, and badge metadata.

---

## 4. Component Design Patterns

### Cards
- White background (`bg-white`), `rounded-3xl`, subtle border (`border border-sage/20`), soft drop shadow (`shadow-lg`).
- Hover state: `hover:border-teal/50 hover:shadow-xl hover:-translate-y-1 transition-all`.

### Buttons
- **Primary CTA**: `bg-teal text-white font-bold px-8 py-3 rounded-full hover:bg-teal/90 transition-colors shadow-md`.
- **Secondary CTA**: `bg-lime text-ink font-bold px-8 py-3 rounded-full hover:bg-marigold transition-colors shadow-sm`.
- **Outline Button**: `border-2 border-sage/20 text-ink font-bold px-8 py-3 rounded-full hover:border-teal/50 hover:bg-teal/5`.

### Status Badges
- `Pending`: `bg-marigold/20 text-marigold`
- `Contacted`: `bg-blue-100 text-blue-700`
- `Confirmed`: `bg-lime/30 text-teal`
- `In Progress`: `bg-teal/20 text-teal`
- `Completed`: `bg-teal/30 text-teal`
- `Cancelled / Rejected`: `bg-red-100 text-red-600`

---

## 5. Responsive Breakpoint Rules

- **Mobile Small (375px & 390px)**: Single column layouts, full-width buttons, collapsible mobile navigation drawer.
- **Mobile Large / Phablet (430px)**: Padding adjusts to `p-6`, font size scales smoothly.
- **Tablet (768px - 1024px)**: 2-column grids for services, side-by-side forms, tablet-friendly tables.
- **Desktop (1366px, 1440px, 1920px)**: 3-column service catalogues, fixed max-width containers (`max-w-7xl`), multi-column admin dashboards.
