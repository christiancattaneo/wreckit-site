Build a stunning, production-ready marketing website for **wreckit** — an AI code verification tool. The site should be visually spectacular and clearly communicate the product value.

## Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- Framer Motion for animations
- shadcn/ui components (run `npx shadcn@latest init -y` then add components as needed)
- Lucide React icons
- Install all deps with npm

## Product Overview
wreckit is an AI agent skill that provides bulletproof code verification.
Tagline: "Build it. Break it. Prove it works."
Philosophy: "AI cannot verify itself. Structure the pipeline so it cannot silently agree with itself."

**4 Modes:**
- 🟢 BUILD — Greenfield projects from scratch
- 🟡 REBUILD — Migrate/rewrite existing codebases
- 🔴 FIX — Fix bugs with proof nothing else broke
- 🔵 AUDIT — Verify existing code quality, no changes

**10 Verification Gates:**
1. AI Slop Scan — Detects placeholder code, template artifacts, dead code, hallucinated logic
2. Type Check — Full static analysis, zero type errors allowed
3. Ralph Loop — Adversarial AI tries to break your code (Builder vs Breaker)
4. Test Quality — Coverage, assertion density, test-to-code ratio
5. Mutation Kill — Mutates source code; tests must catch it (mutmut, cargo-mutants, Stryker)
6. Cross-Verify — Independent oracle validates behavior
7. SAST — Static security analysis
8. Design Review — Dependency coupling, circular dep detection
9. CI Integration — Validates CI config is real and working
10. Proof Bundle — Generates `.wreckit/` folder with signed verification report

**Verdicts:** 🟢 SHIP / 🟡 CAUTION / 🔴 BLOCKED

**Swarm Architecture:** Orchestrator spawns parallel AI workers, each running a gate independently. Results aggregated into proof bundle.

Language agnostic: Python, TypeScript/JS, Rust, Go, any stack.

## Design Direction
- Dark theme: background #0a0a0f
- Electric green accent #00ff88 for SHIP/success states
- Red #ff3366 for BLOCKED/danger
- Amber #ffaa00 for CAUTION
- Glassmorphism cards (backdrop-blur, subtle white/10 borders)
- Animated gradient mesh blobs in hero (CSS keyframes or Framer Motion)
- Terminal/code aesthetic sections (monospace font, green text on dark panels)
- Bold confident typography — use `next/font` with Geist or Inter
- Smooth scroll, subtle parallax on hero elements
- No stock photos — use icons, code snippets, animated UI elements

## Page Sections (single long-scroll page, no routing needed)

### 1. Hero
- Full-viewport height
- Left: headline "AI code verification that AI can't fake." + subheadline + two CTA buttons
- Right: animated terminal window showing a fake wreckit run
- Animated gradient mesh background (2-3 large blurred color blobs slowly moving)
- Floating particle dots (subtle)

### 2. The Problem (dark section)
- H2: "AI writes confident, broken code. And AI reviews agree with it."
- 3 pain point cards with icons: "AI reviewers hallucinate approvals" / "Tests pass. Bugs ship." / "No one actually knows if it works"
- Each card: glassmorphism style with red tint

### 3. How It Works
- H2: "Three steps. Zero excuses."
- Animated 3-step flow with connecting lines/arrows:
  1. Point wreckit at your code or prompt
  2. Swarm of parallel AI workers run 11 verification gates simultaneously
  3. Get a signed proof bundle — SHIP, CAUTION, or BLOCKED
- Show a simple visual of the swarm (orchestrator node → multiple worker nodes)

### 4. The Gates
- H2: "Eleven gates. One verdict."
- Responsive grid of 10 gate cards (2 cols mobile, 3-4 cols desktop)
- Each card: number badge, icon, name, one-line description
- Hover: card glows with green accent, slight lift
- Staggered entrance animation (Framer Motion when scrolled into view)

### 5. Modes
- H2: "One tool. Every situation."
- 2x2 grid of mode cards
- BUILD (green), REBUILD (yellow), FIX (red), AUDIT (blue)
- Each: emoji, mode name, trigger condition, short description
- Animated glowing border on hover matching mode color

### 6. The Proof Bundle
- H2: "Every run produces a receipt."
- Left: explanation text + key points
- Right: fake proof.json in a syntax-highlighted code block (dark panel, colored JSON)
- Show SHIP verdict badge on the code block

Sample proof.json to show:
```json
{
  "version": "2.1.0",
  "timestamp": "2026-02-22T14:32:01Z",
  "project": "./src",
  "stack": "TypeScript / Next.js / Vitest",
  "verdict": "SHIP",
  "score": 94,
  "gates": {
    "slop_scan": { "status": "PASS", "artifacts": 0 },
    "type_check": { "status": "PASS", "errors": 0 },
    "ralph_loop": { "status": "PASS", "exploits_found": 0 },
    "test_quality": { "status": "PASS", "coverage": 91, "assertions_per_test": 2.8 },
    "mutation_kill": { "status": "PASS", "kill_rate": 0.87 },
    "cross_verify": { "status": "PASS", "oracle_agreement": true },
    "sast": { "status": "PASS", "high_findings": 0 },
    "design_review": { "status": "PASS", "circular_deps": 0 },
    "ci_integration": { "status": "PASS", "config": "github-actions" },
    "proof_bundle": { "status": "GENERATED", "path": ".wreckit/proof-2026-02-22.json" }
  }
}
```

### 7. Verdicts
- H2: "Three outcomes. No ambiguity."
- 3 side-by-side cards (stack on mobile):
  - 🟢 SHIP: "All gates pass. Code is ready to merge." (green glow)
  - 🟡 CAUTION: "Some gates flagged. Review before shipping." (amber glow)
  - 🔴 BLOCKED: "Critical failures found. Do not ship." (red glow)
- Animated pulsing glow effect on each card

### 8. Footer / CTA
- Full-width dark section
- Large text: "Stop shipping vibes."
- Sub: "Start shipping proof."
- Two buttons: GitHub + ClawHub
- Links: https://github.com/christiancattaneo/wreckit and https://clawhub.com
- Small footer text: "wreckit — AI code verification"

## Animated Terminal Component (Hero)
Build a `<Terminal />` component that animates this output line by line with typewriter effect + auto-scroll:

```
$ wreckit audit ./src

🔍 Detecting stack... TypeScript / Next.js / Vitest
🚀 Spawning 11 verification workers...

[1/11] ✅ AI Slop Scan       PASS  (0 artifacts found)
[2/11] ✅ Type Check          PASS  (0 errors)
[3/11] ✅ Ralph Loop          PASS  (breaker failed to exploit)
[4/11] ✅ Test Quality        PASS  (87% coverage)
[5/11] ⚠️  Mutation Kill      WARN  (71% kill rate — threshold: 80%)
[6/11] ✅ Cross-Verify        PASS  (oracle agrees)
[7/11] ✅ SAST               PASS  (no HIGH findings)
[8/11] ✅ Design Review       PASS  (no circular deps)
[9/11] ✅ CI Integration      PASS  (GitHub Actions valid)
[10/11] ✅ Proof Bundle       GENERATED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Verdict: ⚠️  CAUTION
  1 gate below threshold.
  Report: .wreckit/proof-2026-02-22.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Style: dark terminal window with macOS-style traffic light buttons (red/yellow/green circles), green text for PASS lines, amber for WARN, monospace font. Add a blinking cursor at the end. Loop the animation every ~8 seconds.

## Navbar
- Fixed top navbar: logo ("wreckit" in monospace with green accent) + nav links (How It Works, Gates, Modes, Proof) + "Get Started" CTA button
- Blur backdrop on scroll

## Technical Notes
- Use `"use client"` for animated components
- Use Framer Motion `useInView` for scroll-triggered animations
- Keep TypeScript strict — no `any` types
- Use CSS variables for the color palette
- Make it fully responsive (mobile-first)

## Delivery Steps (execute all in order):
1. Create the complete Next.js app with all sections above — make it beautiful
2. Run `npm run build` and fix ALL TypeScript/build errors until it passes cleanly
3. Run `git add -A && git commit -m "feat: wreckit marketing site"`
4. Run `vercel --yes --name wreckit-ralph` to deploy (it will auto-detect Next.js)
5. Capture the deployment URL and write it to `DEPLOY_URL.txt` in the project root
6. Run: `openclaw system event --text "Done: wreckit-site live. URL in ~/Projects/wreckit-site/DEPLOY_URL.txt" --mode now`

This is a portfolio/product showcase. Make every section polished, every animation smooth, every interaction delightful. No placeholder text, no half-finished sections.
