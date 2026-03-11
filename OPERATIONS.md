# PaperPe - Complete Operations Document

> Everything needed to run PaperPe as a business

---

## 1. TECHNICAL INFRASTRUCTURE

### 1.1 Hosting & Domains
| Item | Provider | Status | Cost |
|------|----------|--------|------|
| Domain | paperpe.in | ✅ Active | ~Rs 800/yr |
| Hosting | Vercel | ✅ Active | Free tier |
| DNS | Vercel DNS | ✅ Active | Free |

### 1.2 Database & Auth
| Item | Provider | Status | Cost |
|------|----------|--------|------|
| Database | Supabase | ❌ Not setup | Free tier (500MB) |
| Authentication | Supabase Auth | ❌ Not setup | Free |
| File Storage | Supabase Storage | ❌ Not setup | Free (1GB) |

### 1.3 Payments
| Item | Provider | Status | Cost |
|------|----------|--------|------|
| Payment Gateway | Razorpay | ⏳ KYC pending | 2% per txn |
| Category | SaaS | ✅ Selected | - |

### 1.4 Email
| Item | Provider | Status | Cost |
|------|----------|--------|------|
| Transactional Email | Resend.com | ❌ Not setup | Free (100/day) |
| Email Types Needed | Order confirm, Download link, Password reset, Support reply | | |

### 1.5 Analytics
| Item | Provider | Status | Cost |
|------|----------|--------|------|
| Web Analytics | Vercel Analytics | ❌ Not setup | Free tier |
| Error Tracking | Sentry | ❌ Optional | Free tier |

---

## 2. DATABASE SCHEMA

### 2.1 Tables Required

```sql
-- Users (managed by Supabase Auth, extended)
profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP DEFAULT NOW()
)

-- Products (indicators)
products (
  id UUID PRIMARY KEY,
  slug TEXT UNIQUE,          -- aria-supreme
  name TEXT,                  -- ARIA SUPREME
  description TEXT,
  price INTEGER,              -- 2999 (in Rs)
  original_price INTEGER,     -- 5999
  file_url TEXT,              -- Supabase storage URL
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
)

-- Orders
orders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles,
  product_id UUID REFERENCES products,
  amount INTEGER,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  status TEXT,                -- pending, paid, failed, refunded
  created_at TIMESTAMP DEFAULT NOW()
)

-- Downloads (track download attempts)
downloads (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders,
  downloaded_at TIMESTAMP DEFAULT NOW(),
  ip_address TEXT
)

-- Support Tickets
support_tickets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles,
  subject TEXT,
  message TEXT,
  status TEXT,                -- open, in_progress, resolved, closed
  created_at TIMESTAMP DEFAULT NOW()
)

-- Ticket Replies
ticket_replies (
  id UUID PRIMARY KEY,
  ticket_id UUID REFERENCES support_tickets,
  sender TEXT,                -- user, admin
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
)

-- Waitlist
waitlist (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
)

-- Coupons (future)
coupons (
  id UUID PRIMARY KEY,
  code TEXT UNIQUE,
  discount_percent INTEGER,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true
)
```

---

## 3. PAGES & ROUTES

### 3.1 Public Pages
| Route | Purpose | Status |
|-------|---------|--------|
| / | Landing page | ✅ Done |
| /tools | Tools directory | ✅ Done |
| /calculator | Option calculator | ✅ Done |
| /tools/position-size | Position sizing | ✅ Done |
| /tools/brokerage | Brokerage calc | ✅ Done |
| /tools/margin | Margin calc | ✅ Done |
| /indicators | Indicator sales | ✅ Done |
| /blog | Blog listing | ✅ Done |
| /blog/[slug] | Blog post | ⚠️ Needs content |
| /brokers | Broker referrals | ✅ Done |
| /about | About us | ❌ Placeholder |
| /contact | Contact form | ❌ Missing |
| /support | FAQ + Help | ❌ Missing |
| /terms | Terms of Service | ❌ Missing |
| /privacy | Privacy Policy | ❌ Missing |
| /refund | Refund Policy | ❌ Missing |

### 3.2 Auth Pages
| Route | Purpose | Status |
|-------|---------|--------|
| /login | User login | ⚠️ Placeholder |
| /signup | User registration | ⚠️ Placeholder |
| /forgot-password | Password reset | ❌ Missing |
| /reset-password | Set new password | ❌ Missing |

### 3.3 User Dashboard (Protected)
| Route | Purpose | Status |
|-------|---------|--------|
| /dashboard | Overview | ⚠️ Placeholder |
| /dashboard/purchases | My purchases | ❌ Missing |
| /dashboard/downloads | Download files | ❌ Missing |
| /dashboard/orders | Order history | ❌ Missing |
| /dashboard/profile | Edit profile | ❌ Missing |
| /dashboard/support | My tickets | ❌ Missing |

### 3.4 Admin Dashboard (Protected)
| Route | Purpose | Status |
|-------|---------|--------|
| /admin | Admin overview | ❌ Missing |
| /admin/orders | All orders | ❌ Missing |
| /admin/users | All users | ❌ Missing |
| /admin/products | Manage products | ❌ Missing |
| /admin/tickets | Support tickets | ❌ Missing |
| /admin/analytics | Revenue stats | ❌ Missing |

### 3.5 API Routes
| Route | Purpose | Status |
|-------|---------|--------|
| /api/payment/create-order | Razorpay order | ✅ Exists |
| /api/payment/verify | Verify payment | ✅ Exists |
| /api/waitlist | Join waitlist | ✅ Exists |
| /api/auth/[...supabase] | Auth handlers | ❌ Missing |
| /api/download/[orderId] | Secure download | ❌ Missing |
| /api/support/ticket | Create ticket | ❌ Missing |
| /api/admin/* | Admin APIs | ❌ Missing |

---

## 4. USER FLOWS

### 4.1 Purchase Flow
```
1. User visits /indicators
2. Clicks "Buy" on product
3. If not logged in → redirect to /login
4. After login → Razorpay checkout opens
5. User completes payment
6. Backend verifies payment
7. Order created in database
8. Email sent with download link
9. User redirected to /dashboard/purchases
10. User can download .pine file
```

### 4.2 Support Flow
```
1. User visits /support
2. Reads FAQ, doesn\'t find answer
3. Clicks "Submit Ticket"
4. Fills form (subject, message)
5. Ticket created in database
6. Admin sees ticket in /admin/tickets
7. Admin replies
8. User gets email notification
9. User can reply in /dashboard/support
```

### 4.3 Auth Flow
```
Signup:
1. User enters email, password
2. Supabase creates account
3. Verification email sent
4. User clicks link
5. Account verified, logged in

Login:
1. User enters email, password
2. Supabase validates
3. Session created
4. Redirect to /dashboard

Password Reset:
1. User clicks "Forgot Password"
2. Enters email
3. Reset link sent
4. User clicks link
5. Enters new password
6. Password updated
```

---

## 5. LEGAL REQUIREMENTS

### 5.1 Documents Needed
| Document | Purpose | Status |
|----------|---------|--------|
| Terms of Service | User agreement | ❌ Need to write |
| Privacy Policy | Data handling | ❌ Need to write |
| Refund Policy | Return rules | ❌ Need to write |
| Disclaimer | Not SEBI registered | ❌ Need to write |

### 5.2 Business Registration
| Item | Status | Notes |
|------|--------|-------|
| GST Registration | ❌ Optional under 20L | Required if revenue > 20L/yr |
| Business PAN | ? | Using personal? |
| Bank Account | ? | For Razorpay payouts |

### 5.3 Compliance
- NOT providing investment advice (disclaimer needed)
- NOT SEBI registered (educational tools only)
- Razorpay category: SaaS (not Financial Services)

---

## 6. OPERATIONS

### 6.1 Daily Tasks
| Task | Frequency | Owner |
|------|-----------|-------|
| Check new orders | Daily | Admin |
| Reply support tickets | Daily | Admin |
| Monitor errors | Daily | Auto/Admin |

### 6.2 Weekly Tasks
| Task | Frequency | Owner |
|------|-----------|-------|
| Review analytics | Weekly | Admin |
| Social media posts | 3-4x/week | Admin |
| Blog content | 1-2x/week | Admin |

### 6.3 Monthly Tasks
| Task | Frequency | Owner |
|------|-----------|-------|
| Revenue review | Monthly | Admin |
| Update indicators | As needed | Admin |
| Razorpay payout | Auto/Manual | Admin |

---

## 7. MARKETING

### 7.1 Channels
| Channel | Status | Priority |
|---------|--------|----------|
| Twitter @paperpe_in | ✅ Created | High |
| SEO / Blog | ✅ Started | High |
| TradingView Profile | ❌ Not setup | Medium |
| YouTube | ❌ Not setup | Medium |
| Telegram Group | ❌ Not setup | Medium |
| Reddit r/IndianStreetBets | ❌ Not active | Low |

### 7.2 Content Types
- Educational blog posts (SEO)
- Twitter threads (engagement)
- Indicator screenshots (proof)
- User testimonials (social proof)
- Free tools promotion (lead gen)

### 7.3 Referral/Affiliate
| Program | Status | Commission |
|---------|--------|------------|
| TradingView Affiliate | ✅ Active | ? |
| Broker Referrals | ✅ Pages exist | Varies |
| User Referral Program | ❌ Not built | TBD |

---

## 8. COSTS & REVENUE

### 8.1 Fixed Costs (Monthly)
| Item | Cost | Notes |
|------|------|-------|
| Domain | ~Rs 70/mo | Rs 800/yr |
| Hosting | Rs 0 | Vercel free |
| Database | Rs 0 | Supabase free |
| Email | Rs 0 | Resend free tier |
| **Total** | **~Rs 70/mo** | |

### 8.2 Variable Costs (Per Sale)
| Item | Cost | Notes |
|------|------|-------|
| Razorpay fee | 2% | Per transaction |
| GST on Razorpay | 18% of 2% | |

### 8.3 Products & Pricing
| Product | Price | After Razorpay |
|---------|-------|----------------|
| ARIA SUPREME | Rs 2,999 | Rs 2,939 |
| OI Pulse | Rs 999 | Rs 979 |
| Fear & Greed | Rs 499 | Rs 489 |
| Smart S/R | Rs 999 | Rs 979 |
| Complete Bundle | Rs 3,999 | Rs 3,919 |

### 8.4 Revenue Targets
| Period | Target | Sales Needed |
|--------|--------|-------------|
| Month 1 | Rs 10,000 | 3-4 indicators |
| Month 3 | Rs 30,000 | 10 indicators |
| Month 6 | Rs 100,000 | 33 indicators |

---

## 9. TECH STACK SUMMARY

```
Frontend:     Next.js 14 + React + Tailwind CSS
Animations:   Framer Motion
Icons:        Lucide React
Hosting:      Vercel
Database:     Supabase (PostgreSQL)
Auth:         Supabase Auth
Storage:      Supabase Storage
Payments:     Razorpay
Email:        Resend.com
Analytics:    Vercel Analytics
Domain:       paperpe.in (Vercel DNS)
```

---

## 10. ENVIRONMENT VARIABLES

### 10.1 Required (.env.local)
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=

# Email (Resend)
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=https://paperpe.in
ADMIN_EMAILS=abhi@email.com
```

### 10.2 Vercel Environment Variables
Same as above, set in Vercel dashboard for production.

---

## 11. SECURITY CHECKLIST

| Item | Status |
|------|--------|
| HTTPS enabled | ✅ Vercel auto |
| Auth tokens secure | ⏳ Need Supabase |
| API routes protected | ⏳ Need middleware |
| Admin routes protected | ❌ Not built |
| Download links expire | ❌ Not built |
| Rate limiting | ❌ Not setup |
| Input validation | ⚠️ Partial |
| SQL injection prevention | ✅ Supabase handles |

---

## 12. LAUNCH CHECKLIST

### Pre-Launch
- [ ] Supabase project created
- [ ] Database tables created
- [ ] Auth system working
- [ ] Payment flow tested
- [ ] Email system working
- [ ] Admin dashboard functional
- [ ] Legal pages written
- [ ] Indicator files uploaded
- [ ] Test purchase end-to-end

### Launch Day
- [ ] Deploy to production
- [ ] Verify all env vars
- [ ] Test live payment
- [ ] Announce on Twitter
- [ ] Submit to Google Search Console
- [ ] Monitor for errors

### Post-Launch
- [ ] Respond to support tickets
- [ ] Collect user feedback
- [ ] Fix bugs quickly
- [ ] Start content marketing

---

*Document created: March 3, 2026*
*Last updated: March 3, 2026*
