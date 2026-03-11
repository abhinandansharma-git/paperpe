# CLAUDE.md - PaperPe Project

## FIRST: Start dev server
```bash
npm run dev
```
Then open http://localhost:3001 to see changes.

## What is PaperPe?
India\'s first paper trading platform for MCX & F&O. Practice trading with ₹10 lakh virtual capital, test strategies, learn without losing real money.

**Domains:** paperpe.in, mocktrade.in
**Twitter:** @paperpe_in
**Reddit:** u/Paperpe_in

## Current Task: Make Landing Page WORLD CLASS

The landing page exists but needs polish. Make it premium quality like Groww/Zerodha.

### What exists:
- [x] Header with logo + nav
- [x] Hero section with email signup
- [x] Live trading chart simulation
- [x] Stats section (500+ traders, etc.)
- [x] Analytics preview (portfolio, win rate)
- [x] Features section (4 cards)
- [x] API code example
- [x] Pricing (Free + Early Bird ₹499 lifetime)
- [x] Final CTA
- [x] Footer
- [x] Security headers configured

### What needs improvement:
1. **FAQ section** - Add common questions about paper trading
2. **How it works** - 3-step visual (Sign up → Practice → Master)
3. **Mobile responsiveness** - Test and fix any issues
4. **Testimonials** - Add 3 realistic Indian trader testimonials
5. **Trust badges** - "Secure", "No real money", "Free forever tier"
6. **Logo** - Ensure logo displays correctly in header
7. **Animations** - Smooth scroll, subtle hover effects
8. **Loading states** - Skeleton loaders if needed
9. **Error handling** - Form validation, user feedback
10. **SEO** - Meta tags, OG image, descriptions

### Design Philosophy
**Groww warmth + Zerodha trust** — NOT generic AI aesthetic

- Clean, minimal, confident
- Warm orange (#F97316) as primary
- Dark navy background
- Trust signals matter (this is finance)
- Mobile-first (India = phones)
- Fast, no bloat

## Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)

## Key Files
```
app/
├── page.tsx              # Main page (imports components)
├── layout.tsx            # Root layout
├── globals.css           # Tailwind + custom styles
└── api/waitlist/route.ts # Waitlist API (rate-limited)

components/
├── Header.tsx            # Logo + nav
├── Hero.tsx              # Hero + email form
├── TradingChart.tsx      # Live chart simulation
├── SocialProof.tsx       # Stats
├── PerformanceStats.tsx  # Analytics preview
├── Features.tsx          # Feature cards
├── CodeExample.tsx       # API example
├── Pricing.tsx           # Free + Early Bird
├── FinalCTA.tsx          # Bottom CTA
└── ... 

public/
└── logo.png              # PaperPe logo
```

## Commands
```bash
npm run dev    # Dev server (localhost:3001)
npm run build  # Production build
```

## Owner
Abhi (Abhinandan) — @paperpe_in
