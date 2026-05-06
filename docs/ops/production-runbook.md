# PaperPe Production Runbook

Last updated: May 4, 2026

## Live Stack

- App: Next.js on Vercel
- Domain: `https://paperpe.in`
- Database/Auth/Storage: Supabase (`kxwwinlmihtqtnscdiph`)
- Payments: Razorpay live
- Email: Resend
- Admin queue: `/admin`

## Current Product Reality

- Checkout is live.
- Paid orders are persisted.
- Automatic file download works only for products that already have a `file_url`.
- Products without uploaded files are fulfilled manually through WhatsApp/email.

## Daily Fulfillment Workflow

1. Open `/admin`.
2. Go to the `orders` tab.
3. Filter to `Paid` + `Manual pending`.
4. Use the built-in `WhatsApp` or `Email` action for the buyer.
5. Deliver the indicator manually.
6. Mark the order `delivered`.
7. If the buyer needs a resend, filter to `Manual delivered` and contact them again from the same row.

## Operational Response Targets

- New paid manual-delivery orders: within 30 to 60 minutes during active support hours
- Support replies: same day
- Duplicate payment or failed delivery: resolve same day

## Production Deploy Workflow

Normal `vercel deploy --prod` can be blocked if Vercel rejects the git author metadata for the current branch. When that happens, deploy from a clean snapshot instead.

### Recommended command

```powershell
.\scripts\deploy-production-snapshot.ps1
```

What it does:

- copies the repo into a temporary folder
- keeps the linked `.vercel` project config
- strips git metadata and build artifacts
- runs a production Vercel deploy from the clean snapshot

Use `-CleanupSnapshot` if you want the temp folder removed after deployment.

## Smoke Test Checklist After Each Deploy

1. Homepage loads: `/`
2. Indicator page loads: `/indicators`
3. Contact/support routes load: `/contact`, `/support`, `/trade`
4. Create a test Razorpay order through `/api/payment/create-order`
5. Verify `/api/payment/verify` rejects a bad signature with `400`
6. Open `/admin` and confirm orders/products/users load

## Required Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RESEND_API_KEY`

## Manual Delivery Checklist

- Confirm payment status is `paid`
- Confirm product and amount look correct
- Use the buyer's saved WhatsApp number first when available
- If no phone is present, use email
- Mark `delivered` only after the buyer has been sent the file/access details

## Known Caveats

- The local worktree may be ahead of GitHub if production was deployed from a clean snapshot.
- `OPERATIONS.md` is an older planning document and should not be treated as the launch-day source of truth.
- A real live-money purchase should still be run once after any material checkout change.
