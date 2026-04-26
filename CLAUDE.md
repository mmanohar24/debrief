# Project Rules for Claude Code

@AGENTS.md

## MANDATORY: Read DESIGN.md before writing any UI code

Before writing, editing, or generating any component, page, stylesheet, or
Tailwind class, you MUST read the DESIGN.md file in the project root.

```
cat DESIGN.md
```

This is not optional. Every UI decision — colors, fonts, spacing, border
radius, component variants, status indicators — must come from DESIGN.md.
Do not use default Tailwind colors, generic gray palettes, or Inter/system
fonts unless they are explicitly defined in DESIGN.md.

---

## Design System: Obsidian Terminal

The project uses the **Obsidian Terminal** design system. Key rules you must
internalize before touching any UI file:

### Colors — non-negotiable
- Page background: `#0D0F0E` (primary)
- Default surface (cards, panels): `#111311` (surface)
- Raised surface (interactive cards): `#161916` (surface-raised)
- Overlay (modals, dropdowns): `#1C1F1C` (surface-overlay)
- Default borders: `#242824` (border)
- Active/focus borders: `#2F3A30` (border-active)
- **Accent (the only true color): `#00E87A`** — used for primary CTA, live
  status, active agent state. One purpose per screen. Never decorative.
- Primary text: `#E8EDE8`
- Secondary text (labels, meta): `#8A9A8A`
- Tertiary text (disabled, ghost): `#4A5A4A`
- Text on accent backgrounds: `#001A0D`
- Info: `#4D9EFF` / Info surface: `#0A1F3D`
- Warning: `#F5A623` / Warning surface: `#2A1E00`
- Error: `#FF5C5C` / Error surface: `#2A0A0A`
- Success: `#00E87A` / Success surface: `#003D22`

**There is no light mode. Never use white or near-white backgrounds.**

### Typography — two fonts only
- **JetBrains Mono** — all headings, labels, status text, code output,
  any text that communicates system state. Negative letter-spacing on display.
- **Inter** — all body copy and prose-length descriptions only.
- Weights: 400 (Inter body) and 600–700 (Mono headings) only.
- Labels: always uppercase, `0.06em` letter-spacing, Mono font.
- Never use Inter for headings. Never use Mono for multi-line prose.

### Spacing
- Base grid: 8px
- Scale: xs=4px, sm=8px, md=16px, lg=24px, xl=40px, 2xl=64px
- Gutter: 24px. Max content width: 1200px (800px for single-column tools).

### Border radius
- Buttons, inputs, badges: 4px
- Cards, panels: 6px
- Pills and live status badges: 9999px (full)
- Never use 8px+ radius on rectangular containers.

### Elevation (no shadows — ever)
Depth is communicated through background color steps only:
1. Page: `#0D0F0E`
2. Surface: `#111311`
3. Raised: `#161916`
4. Overlay: `#1C1F1C`

The only allowed glow: `0 0 0 1px #00E87A33` on the single focused primary
element. Nowhere else.

---

## Component Patterns

### Buttons
- Primary: `bg-[#00E87A] text-[#001A0D]` — one per screen maximum.
- Secondary: `bg-transparent border border-[#00E87A] text-[#00E87A]`
- Ghost: `bg-transparent text-[#8A9A8A] hover:bg-[#161916]`
- All buttons: 4px radius, JetBrains Mono label font, uppercase.

### Cards
- Background: `#161916`, border: `1px solid #242824`, radius: 6px
- Hover: `#1C1F1C`, border: `#2F3A30`
- Transition: 120ms ease-out — nothing slower.

### Inputs
- Background: `#111311`, border: `1px solid #242824`
- Focus: border becomes `#2F3A30` — no box-shadow, no glow ring.

### Agent Log Panel (first-class component)
```
bg-[#0D0F0E] font-mono text-[#00E87A] rounded-[6px] p-4
```
- Active output lines: `#00E87A`
- Completed lines: `#8A9A8A`
- Streaming cursor: `▋` in `#00E87A`, CSS blink animation

### Status Badges
- Live/Active: green dot (pulsing) + "LIVE" — `bg-[#003D22] text-[#00E87A]`
- Running tool: `bg-[#0A1F3D] text-[#4D9EFF]`
- Warning: `bg-[#2A1E00] text-[#F5A623]`
- Error: `bg-[#2A0A0A] text-[#FF5C5C]`
- All badges: JetBrains Mono, uppercase, 2px radius.

---

## Hard Rules

1. **Read DESIGN.md first.** Always. No exceptions.
2. No white or light backgrounds. Ever.
3. Accent green (`#00E87A`) appears once per screen with one purpose.
4. No drop shadows, gradients, blur, or glassmorphism.
5. No generic Tailwind colors (gray-500, blue-600, etc.) — use exact hex.
6. No system fonts or Inter for headings.
7. Agent state must always be visually explicit: idle / running / complete / error
   must each look different without reading text.
8. Motion only communicates state change. No decorative animations.
9. Left-align all body content. Center-align only for empty states.
10. When in doubt, check DESIGN.md.
