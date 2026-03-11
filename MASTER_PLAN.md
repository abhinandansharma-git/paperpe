# 📋 PaperPe MASTER PLAN
> India's First MCX & F&O Paper Trading Platform
> Consolidated on: March 11, 2026

---

## 🎯 MISSION
Help Indian traders practice without losing money. Sell premium TradingView indicators.

---

## 🔢 WHAT'S BUILT (Quick Count)

| Category | Count |
|----------|-------|
| **Pages/Routes** | 25+ |
| **Free Tools** | 4 |
| **AI Agents** | 8 |
| **Components** | 16 |
| **Blog Articles** | 8 |
| **Backend Services** | 4 |

**Total lines of code:** ~24,000+

---

## 📊 CURRENT STATUS OVERVIEW

| Area | Progress | Notes |
|------|----------|-------|
| **Landing Page** | ✅ 100% | Live on paperpe.in |
| **Free Tools** | ✅ 100% | Calculator, Position Size, Margin, Brokerage |
| **Blog/SEO** | ✅ 80% | 8 articles written |
| **Database** | ❌ 0% | Supabase not setup |
| **Auth System** | ⚠️ 20% | Placeholder pages only |
| **Payments** | ⏳ 50% | Razorpay KYC pending |
| **Email** | ❌ 0% | Resend not configured |
| **Social** | ✅ Started | @paperpe_in on Twitter |

---

## 🏗️ TECH STACK

```
Frontend:     Next.js 14 + React + Tailwind CSS
Hosting:      Vercel (Free tier)
Database:     Supabase (Not setup yet)
Auth:         Supabase Auth
Payments:     Razorpay (KYC pending)
Email:        Resend.com
Domain:       paperpe.in
```

---

## 💰 PRODUCTS & PRICING

| Product | Price | Status |
|---------|-------|--------|
| ARIA SUPREME | ₹2,999 | Ready |
| OI Pulse | ₹999 | Ready |
| Fear & Greed | ₹499 | Ready |
| Smart S/R | ₹999 | Ready |
| Complete Bundle | ₹3,999 | Ready |

**Revenue Model:**
- Indicator sales (primary)
- Broker referrals (secondary)
- Future: Paper trading Pro subscription

---

## 🎁 COMPLETE FEATURE INVENTORY

### ✅ Free Tools (ALL LIVE)
| Tool | Route | Description |
|------|-------|-------------|
| Option Calculator | `/calculator` | Premium/Greeks calculator |
| Position Sizer | `/tools/position-size` | Risk-based position sizing |
| Brokerage Calculator | `/tools/brokerage` | Compare broker charges |
| Margin Calculator | `/tools/margin` | F&O margin requirements |

### ✅ Learning & Content (ALL LIVE)
| Feature | Route | Description |
|---------|-------|-------------|
| Learn Hub | `/learn` | Trading tutorials & guides |
| Blog | `/blog` | 8 SEO articles written |
| Broker Guide | `/brokers` | Broker comparisons + referrals |

### ✅ Trading Features (ALL LIVE)
| Feature | Route | Description |
|---------|-------|-------------|
| Charts | `/charts` | TradingView integration |
| Screener | `/screener` | Stock/F&O screener |
| Options Chain | `/options` | Live options data |
| Alerts | `/alerts` | Price/indicator alerts |
| Journal | `/journal` | Trade journaling |
| Today | `/today` | Daily market overview |

### ✅ Social & Gamification (ALL LIVE)
| Feature | Route | Description |
|---------|-------|-------------|
| Leaderboard | `/leaderboard` | Top paper traders |
| Contests | `/contests` | Trading competitions |
| Mood Tracker | `/mood` | Market sentiment |
| Analytics | `/analytics` | Performance stats |

### ✅ Market Intelligence (ALL LIVE)
| Feature | Route | Description |
|---------|-------|-------------|
| News | `/news` | Market news feed |
| Insider Activity | `/insider` | Insider trading data |

### ✅ Revenue Features (LIVE)
| Feature | Route | Description |
|---------|-------|-------------|
| Indicator Shop | `/indicators` | Premium indicators for sale |
| Broker Referrals | `/brokers` | Affiliate commissions |

### ✅ AI Agents (CODE READY - 8 Agents)
| Agent | Purpose | Status |
|-------|---------|--------|
| `analyst/` | Market analysis & insights | ✅ Built |
| `guru/` | Trading lessons & tips | ✅ Built |
| `scout/` | News monitoring & alerts | ✅ Built |
| `social/` | Twitter content generation | ✅ Built |
| `support/` | Customer support bot | ✅ Built |
| `visual/` | Design/infographic generation | ✅ Built |
| `qc/` | Quality check & review | ✅ Built |
| `skills/` | Shared agent capabilities | ✅ Built |

### ✅ Backend Services (CODE READY)
| Service | File | Description |
|---------|------|-------------|
| Real-time Feed | `services/feed/` | SSE server for live data |
| Market Data | `services/market_data.py` | Price/quote fetching |
| Broker Feeds | `services/feed/broker_feeds.py` | Multi-broker integration |
| Supabase Client | `lib/supabase.ts` | Database client |
| Real-time Hook | `hooks/useRealTimeFeed.ts` | React hook for live data |

### ✅ Components Library (16 Components)
```
Hero, Navigation, Header, Footer, Features, Pricing,
FAQ, Testimonials, SocialProof, CodeExample, FinalCTA,
HowItWorks, BuyButton, WaitlistForm, TradingChart,
PerformanceStats
```

### ⚠️ BUILT BUT NEEDS BACKEND
| Feature | Route | Blocker |
|---------|-------|---------|
| Login | `/login` | Supabase Auth |
| Signup | `/signup` | Supabase Auth |
| Dashboard | `/dashboard` | Auth + Database |
| Purchases | `/dashboard/purchases` | Payment system |
| Downloads | `/dashboard/downloads` | File storage |

### ❌ NOT BUILT YET
| Feature | Priority | Notes |
|---------|----------|-------|
| Admin Panel | HIGH | Manage orders/users |
| Support Tickets | MEDIUM | Zendesk-like system |
| Referral System | MEDIUM | User referral tracking |
| Discord/Telegram Bot | LOW | Community bots |

---

## 📄 PAGES STATUS

### ✅ DONE - Public Pages
| Page | Route | Status |
|------|-------|--------|
| Landing | `/` | ✅ Live |
| Tools Hub | `/tools` | ✅ Live |
| Option Calculator | `/calculator` | ✅ Live |
| Position Sizer | `/tools/position-size` | ✅ Live |
| Brokerage Calc | `/tools/brokerage` | ✅ Live |
| Margin Calc | `/tools/margin` | ✅ Live |
| Indicators Shop | `/indicators` | ✅ Live |
| Blog | `/blog` | ✅ Live |
| Brokers | `/brokers` | ✅ Live |
| Dashboard | `/dashboard` | ⚠️ Placeholder |
| Charts | `/charts` | ✅ Live |
| Screener | `/screener` | ✅ Live |
| Leaderboard | `/leaderboard` | ✅ Live |
| Contests | `/contests` | ✅ Live |
| Analytics | `/analytics` | ✅ Live |
| Alerts | `/alerts` | ✅ Live |
| Journal | `/journal` | ✅ Live |
| News | `/news` | ✅ Live |
| Insider | `/insider` | ✅ Live |
| Mood | `/mood` | ✅ Live |
| Options | `/options` | ✅ Live |
| Learn | `/learn` | ✅ Live |
| Today | `/today` | ✅ Live |

### ❌ NOT DONE - Required for Launch
| Page | Route | Priority |
|------|-------|----------|
| Terms of Service | `/terms` | HIGH |
| Privacy Policy | `/privacy` | HIGH |
| Refund Policy | `/refund` | HIGH |
| Contact | `/contact` | MEDIUM |
| About | `/about` | LOW |
| Login (functional) | `/login` | HIGH |
| Signup (functional) | `/signup` | HIGH |
| Dashboard (real) | `/dashboard/*` | HIGH |
| Admin Panel | `/admin/*` | MEDIUM |

---

## 🗄️ DATABASE SCHEMA (To Implement)

```sql
-- Required Tables in Supabase

profiles (id, email, full_name, phone, created_at)
products (id, slug, name, description, price, file_url, is_active)
orders (id, user_id, product_id, amount, razorpay_order_id, status)
downloads (id, order_id, downloaded_at, ip_address)
support_tickets (id, user_id, subject, message, status)
waitlist (id, email, created_at)
coupons (id, code, discount_percent, max_uses, expires_at)
```

---

## 🛒 PURCHASE FLOW (To Build)

```
1. User visits /indicators
2. Clicks "Buy" → Check if logged in
3. If not → Redirect to /login
4. After login → Razorpay checkout
5. Payment completes → Webhook verifies
6. Order saved → Email sent with download
7. User redirected to /dashboard/purchases
8. User downloads .pine file
```

---

## 🚀 90-DAY GROWTH PLAN

### Phase 1: Foundation (Week 1-2) ✅ DONE
- [x] Landing page live
- [x] Free tools deployed
- [x] Domain configured
- [x] Twitter account created
- [x] SEO blog posts written

### Phase 2: Backend (Week 2-4) ⏳ IN PROGRESS
- [ ] Supabase project setup
- [ ] Auth system working
- [ ] Razorpay KYC complete
- [ ] Payment flow functional
- [ ] Email system (Resend)
- [ ] Legal pages written

### Phase 3: Marketing (Week 4-8)
- [ ] Twitter threads (3x/week)
- [ ] Telegram group created
- [ ] DM 20 finfluencers
- [ ] Reddit posts (ISB, IndiaInvestments)
- [ ] YouTube channel + 3 videos
- [ ] Google Search Console submit

### Phase 4: Scale (Week 8-12)
- [ ] Paid ads (Google, Twitter)
- [ ] Affiliate program live
- [ ] Contest/giveaway
- [ ] Press coverage (YourStory, Inc42)
- [ ] 10,000 users target

---

## 📈 REVENUE TARGETS

| Period | Target | Sales Needed |
|--------|--------|--------------|
| Month 1 | ₹10,000 | 3-4 indicators |
| Month 3 | ₹30,000 | 10 indicators |
| Month 6 | ₹1,00,000 | 33 indicators |

---

## 🎨 DESIGN SYSTEM

**Colors:**
- Navy Primary: `#0F172A`
- Navy Light: `#1E293B`
- Orange Accent: `#F97316`
- Orange Light: `#FB923C`

**Typography:** Inter (Google Fonts)

**Style:** Glassmorphism + Subtle animations
- Inspired by: Stripe, Linear, Vercel
- NO emojis in UI (only SVG icons)
- Mobile-first responsive

---

## 🎯 TARGET KEYWORDS (SEO)

| Keyword | Monthly Searches |
|---------|-----------------|
| paper trading app india | 1,900 |
| virtual trading india | 1,200 |
| nifty paper trading | 800 |
| options paper trading | 600 |
| mcx paper trading | 300 |
| best tradingview indicators india | 400 |

---

## 📱 SOCIAL PRESENCE

| Platform | Handle | Status |
|----------|--------|--------|
| Twitter | @paperpe_in | ✅ Created |
| Reddit | u/Paperpe_in | ✅ Created |
| Telegram | - | ❌ Not created |
| Discord | - | ❌ Not created |
| YouTube | - | ❌ Not created |
| TradingView | - | ❌ Not created |

---

## 🤝 INFLUENCER TARGETS

### Tier 1 (100K+ followers)
- @PRSundar64 - Options guru
- @VivekBajaj - Face2Face
- @SaijSundar - Price action

### Tier 2 (20K-100K)
- @niki_poojary - Options
- @TraderKadam - Intraday
- @stocksdeveloper - Algo trading

### Approach:
1. FREE indicator access for review
2. 30% affiliate commission
3. Co-branded content

---

## 💸 COSTS (Monthly)

| Item | Cost |
|------|------|
| Domain | ~₹70/mo |
| Hosting | ₹0 (Vercel free) |
| Database | ₹0 (Supabase free) |
| Email | ₹0 (Resend free tier) |
| **Total** | **~₹70/mo** |

Variable: Razorpay 2% per transaction

---

## ✅ IMMEDIATE NEXT STEPS

### This Week (Priority Order):
1. [ ] Setup Supabase project
2. [ ] Create database tables
3. [ ] Complete Razorpay KYC
4. [ ] Write Terms of Service
5. [ ] Write Privacy Policy
6. [ ] Implement real login/signup
7. [ ] Test payment flow end-to-end
8. [ ] Push code to GitHub ⏳ (waiting for token)

### Next Week:
1. [ ] Create Telegram group
2. [ ] Post first Twitter thread
3. [ ] DM 10 finfluencers
4. [ ] Submit to Google Search Console
5. [ ] First YouTube video

---

## 📁 KEY FILES

| File | Purpose |
|------|---------|
| `OPERATIONS.md` | Full technical details |
| `VIRAL_PLAN.md` | Marketing strategy |
| `DESIGN_NOTES.md` | UI/UX guidelines |
| `INFLUENCER_PITCH.md` | DM templates |
| `TRADINGVIEW_IDEAS.md` | Content ideas |
| `TWITTER_QUEUE.md` | Scheduled tweets |

---

## 🔐 ENV VARIABLES NEEDED

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Email
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=https://paperpe.in
```

---

## 🚨 BLOCKERS

| Blocker | Owner | Status |
|---------|-------|--------|
| Razorpay KYC | Abhi | Pending |
| GitHub push | Abhi | Need token |
| Supabase setup | Max | Not started |

---

*Last Updated: March 11, 2026*
*Created by Max 🦊 for Abhi*
