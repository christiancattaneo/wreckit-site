Complete visual redesign of the existing wreckit marketing site. Keep the content/copy, rebuild the entire visual design from scratch.

## Core Vibe Shift
From: dark/hacker aesthetic
To: LIGHT MODE + FUTURIST + WRECKING/SMASHING/FISTS ENERGY

Think: a demolition crew with a tech PhD. Confidence, impact, destruction-as-a-service. 
Visual language: punch impact rings, shatter effects, cracked glass, heavy typography, explosive gradients.

## Design System

### Color Palette (LIGHT MODE)
```css
--bg: #ffffff
--bg-secondary: #fafafa
--text: #0a0014
--muted: #6b7280
--purple: #7c3aed       /* primary */
--rose: #f43f5e         /* secondary */
--orange: #fb923c       /* tertiary */
--cyan: #06b6d4         /* accent */
--yellow: #fbbf24       /* accent */

/* Gradients */
--grad-primary: linear-gradient(135deg, #7c3aed, #f43f5e, #fb923c)
--grad-secondary: linear-gradient(135deg, #06b6d4, #7c3aed, #f43f5e)
--grad-text: linear-gradient(90deg, #7c3aed, #f43f5e)  /* for gradient text */
```

### Typography
- Headings: `next/font` — **Syne** (free Google font, very futurist/geometric) OR keep Inter but ultra-bold
- Body: Inter or JetBrains Mono for code sections
- Hero headline: MASSIVE, maybe 80-100px, gradient text fill (purple→rose→orange)
- Subheadings: 700 weight, tight letter-spacing

### Backgrounds
- Hero: white base with a massive animated gradient mesh blob (purple/rose/orange) in the background, subtle opacity (~0.12), slowly drifting
- Sections alternate: white / very light purple (#f5f3ff) / white
- Cards: white with border, drop shadow, hover → lift + subtle gradient border

### Impact Visual Elements
- **Fist/punch emoji** 👊 used as decorative display element (extra large, 120px+)
- **Impact rings**: CSS animation — concentric circles pulsing outward from a central point, like a punch landing
- **Shatter cracks**: SVG crack pattern used as a section divider or hero accent
- **Bold numbers**: Gate numbers displayed as huge background text (like "01", "02" etc.) in light purple, behind the card content
- **"WRECKED" stamp effect**: red diagonal stamp on certain elements
- Gradient borders on hover: `border-image` or box-shadow with gradient

### Cards
- White background, 1px solid rgba(0,0,0,0.08) border
- box-shadow: 0 4px 24px rgba(124, 58, 237, 0.08)
- hover: transform: translateY(-4px), box-shadow increases, subtle gradient glow on border
- Rounded: 16px

## Section Redesigns

### Navbar
- White background, blur on scroll
- Logo: "wreckit" in bold Syne font with gradient text (purple→rose)
- Add a 👊 before the logo name
- Nav links in dark text, hover → gradient underline
- CTA button: gradient background (purple→rose), white text, subtle pulse animation

### 1. Hero
- Left side: HUGE headline — gradient text fill
  - Line 1 (massive): "WE WRECK"
  - Line 2 (massive): "YOUR CODE."
  - Line 3 (medium, dark): "So production doesn't."
- Tagline below: "Build it. Break it. Prove it works." in muted text
- Two CTAs: gradient button "Start Wrecking →" and outline button "View on GitHub"
- Right side: keep the animated terminal BUT style it light — white/cream background, dark text, colored gate results
- Background: large abstract animated gradient blob (very light, like 8% opacity) that slowly morphs — use CSS @keyframes with border-radius animation trick
- Add floating impact ring element (CSS, animated) behind the hero

### 2. The Problem
- Background: very light purple #f5f3ff
- Giant 💥 emoji as a section accent (decorative, large)
- Pain point cards: white, elevated shadow
- Add visual "crack" SVG between this section and the next

### 3. How It Works
- Big bold step numbers as giant background numbers (e.g., "01" in #f3f4f6 behind the content)
- Animated connector: gradient line between steps
- Step 3: show the SHIP/CAUTION/BLOCKED badges with their colors (green/amber/red) as attractive pill badges

### 4. The Gates
- Section title with 👊 emoji: "👊 Eleven gates. One verdict."
- Each gate card: white, numbered badge with gradient background (matches gate's position in rainbow spectrum)
- Hover: card lifts, border glows with a gradient
- Staggered entrance animations (Framer Motion useInView)
- Background: subtle grid pattern (CSS, very light gray lines, like graph paper)

### 5. Modes
- BUILD → gradient green/emerald
- REBUILD → gradient amber/yellow
- FIX → gradient rose/red  
- AUDIT → gradient blue/cyan
- Each card has the mode gradient as a top border (4px) and on hover as full background (at 8% opacity)
- Title: "One tool. Every situation."

### 6. Proof Bundle
- Show the proof.json code block in light mode (white bg, dark syntax colors)
- Use a "receipt" aesthetic — perforated top/bottom edges via CSS (dashed border)
- SHIP verdict badge: gradient green background, bold white text, with a ✅ and subtle glow
- Background: light purple tint

### 7. Verdicts
- Giant verdict cards, centered, with strong visual weight
- SHIP: deep green bg (#065f46), white text, pulsing green glow
- CAUTION: amber bg (#92400e tinted), white text, amber glow
- BLOCKED: rose/red bg (#9f1239 tinted), white text, red glow
- Keep these dark for contrast punch — dark cards on a light page

### 8. Footer/CTA
- Massive gradient background (purple → rose → orange, like a sunset)
- White text on gradient
- Large text: "Stop shipping vibes."
- Sub: "Start shipping proof."
- Giant 👊 emoji centered above the headline
- Buttons: white background, gradient text

## Sentry Integration

Install and configure Sentry for Next.js error tracking:

```bash
npm install @sentry/nextjs
```

Create `sentry.client.config.ts`:
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    Sentry.replayIntegration(),
  ],
});
```

Create `sentry.server.config.ts`:
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
});
```

Create `sentry.edge.config.ts`:
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
});
```

Update `next.config.mjs` to wrap with Sentry:
```javascript
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig = {
  // existing config
};

export default withSentryConfig(nextConfig, {
  org: "christiancattaneo",
  project: "wreckit-ralph",
  silent: true,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
```

Add to `.env.local` (create if missing):
```
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
```

Add to `.gitignore`:
```
.env.local
```

## Terminal Component — Light Mode Update

Update the Terminal component styling:
- Window chrome: #f1f5f9 (light gray) with subtle shadow
- Traffic light dots: red #ff5f56, yellow #febc2e, green #28c840
- Terminal body: #ffffff or #fafafa
- Text: #1e293b (dark)
- PASS lines: #16a34a (green)
- WARN lines: #d97706 (amber)
- Prompt ($): #7c3aed (purple)
- Gate labels: #374151

## Animation Enhancements

Add these to the site:

1. **Impact ring on hero**: CSS `@keyframes ripple` - concentric circles expanding outward from a point, repeat every 3s
```css
@keyframes ripple {
  0% { transform: scale(0.8); opacity: 0.8; }
  100% { transform: scale(2.5); opacity: 0; }
}
```
Three rings, staggered delay (0s, 0.5s, 1s)

2. **Gradient blob morphing**: 
```css
@keyframes morph {
  0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
}
```

3. **Gradient text shimmer** on hero headline (CSS `background-size: 200%` animated)

4. **Counter animation** on the "11 gates" stat — count up from 0 when scrolled into view

5. **Stagger all gate cards** with Framer Motion — come in from bottom, 80ms stagger

## Delivery Steps

1. Install Sentry: `npm install @sentry/nextjs`
2. Rewrite `src/app/globals.css` with new color system (light mode)
3. Rewrite `src/components/MarketingPage.tsx` with full redesign
4. Rewrite `src/components/Terminal.tsx` with light mode styling
5. Update `src/app/layout.tsx` — add Sentry font (Syne from Google Fonts)
6. Create all Sentry config files
7. Update `next.config.mjs` with Sentry wrapper
8. Run `npm run build` — fix ALL errors until clean
9. Run `git add -A && git commit -m "feat: futurist light mode redesign + Sentry"`
10. Run `vercel --yes --name wreckit-ralph` to redeploy
11. Save URL to DEPLOY_URL.txt
12. Run: `openclaw system event --text "Done: wreckit redesign deployed. URL in ~/Projects/wreckit-site/DEPLOY_URL.txt" --mode now`

Make every section feel like a punch to the face (in the best way). Light, bold, energetic, futurist.
