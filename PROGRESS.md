# PaperPe Progress Log
_Last updated: 2026-03-12_

---

## ✅ DONE

### Infrastructure
- [x] Next.js 14 app deployed on Vercel
- [x] Custom domain paperpe.in configured
- [x] Supabase project setup (tables: profiles, products, orders, downloads)
- [x] 5 products in DB (ARIA SUPREME, OI Pulse, Fear & Greed, Smart S/R, Bundle)
- [x] GitHub repo: abhinandansharma-git/paperpe (master branch)
- [x] All env vars set in Vercel (Supabase + Razorpay + App URL)

### Auth
- [x] Google OAuth working (login via Google)
- [x] Supabase Auth configured (site_url, redirect URIs)
- [x] Auth callback route built (app/auth/callback/route.ts)
- [x] Login page with Google button

### Payment Flow (fully wired 2026-03-12)
- [x] Razorpay Live keys added to Vercel (rzp_live_SMjdkgrkf5dhoz)
- [x] BuyButton — checks auth first, uses logged-in user data
- [x] /api/payment/create-order — creates Razorpay order
- [x] /api/payment/verify — verifies signature + saves order to Supabase DB
- [x] /api/download/[orderId] — serves download or redirects to file_url

### Dashboard (rebuilt 2026-03-12)
- [x] Dark theme dashboard (matches site design)
- [x] Overview tab — virtual balance ₹10L, P&L, win rate, quick actions
- [x] My Purchases tab — all paid orders + download buttons
- [x] Portfolio tab — virtual balance breakdown
- [x] Profile tab — editable name/phone/email

### UI & Design
- [x] Outfit font (via next/font/google)
- [x] Font weight 700 for headings (clean typography)
- [x] 25+ pages built (tools, blog, screener, charts, leaderboard, etc.)
- [x] 16 components
- [x] 4 free tools live (calculator, position sizer, brokerage, margin)

### Credentials (all saved in CREDENTIALS.md)
- [x] Supabase URL + Anon Key + Service Role Key
- [x] Razorpay Key ID + Secret (Live)
- [x] Vercel Token + Project ID
- [x] GitHub Token
- [x] Google OAuth Client ID + Secret

---

## 🔴 PENDING

### High Priority
- [ ] Upload .pine indicator files to Supabase Storage
- [ ] Add file_url to each product row in DB → downloads work end-to-end
- [ ] Legal pages: Terms of Service, Privacy Policy, Refund Policy
- [ ] Resend API key → email confirmation after purchase

### Medium Priority
- [ ] Admin panel (manage orders, users, products)
- [ ] Profile save button wired to Supabase (currently just UI)
- [ ] Paper trading engine (virtual ₹10L, buy/sell MCX & F&O)
- [ ] Telegram community channel

### Low Priority
- [ ] YouTube channel
- [ ] Discord server
- [ ] Referral/affiliate system
- [ ] Coupon/discount codes

---

## 📈 Git Commits (recent)
| Commit | Description |
|--------|-------------|
| `a66a91f` | chore: trigger redeploy with Razorpay env vars |
| `72213a4` | fix: complete payment flow - save orders to DB, add download API, fix BuyButton auth |
| `f261b31` | feat: complete user dashboard with overview, purchases, portfolio, profile tabs |
| `6cd26f8` | feat: switch font to Outfit |
| `4b6edcc` | feat: reduce heading font weight to 700 |
| `6cd26f8` | feat: Google OAuth login button + auth callback |

---

## 💰 Revenue Setup
- Razorpay Live mode: ✅ active
- Products priced: ₹499 – ₹3,999
- Payment → DB save → download: ✅ wired
- First sale possible once .pine files uploaded

---

_Full credentials → CREDENTIALS.md_
_Marketing plan → VIRAL_PLAN.md_
_Master roadmap → MASTER_PLAN.md_
