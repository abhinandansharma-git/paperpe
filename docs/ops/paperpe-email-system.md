# PaperPe email system (@paperpe.in)

Two layers work together. **Resend** sends mail from your domain (purchase receipts, welcome, auth). **Inbound routing** (Cloudflare Email Routing, Google Workspace, or Zoho) receives mail at `hello@`, `support@`, `office@`, and forwards to your real inbox.

Creating an address in Resend does **not** create a mailbox. It only means you may **send** as that address once DNS (SPF, DKIM, DMARC) is correct.

---

## Phase 1 — Must-have (solo founder)

| Address | Job | Receive (inbox / forward) | Send via Resend | Public? |
|---------|-----|---------------------------|-----------------|---------|
| **hello@paperpe.in** | Website, footer, legal pages, “contact us” | Yes → your Gmail | Optional (manual newsletters) | Yes |
| **support@paperpe.in** | User problems, order issues, “reply to this email” | Yes → same inbox as hello for now | No | Yes (in app email footers) |
| **office@paperpe.in** | Your business ops inbox (vendor mail, you reading daily) | Yes → your Gmail | Yes (you → partners) | No (signature / contracts) |
| **noreply@paperpe.in** | App: purchases, welcome, password flows | No (do not forward) | **Yes — default transactional FROM** | No |
| **admin@paperpe.in** | Sign up for hosting, Razorpay, Meta, Vercel, Supabase | Yes → Gmail, 2FA on that Google account | No | No |
| **abhinandan@** or **founder@** | Outreach, investors, cold mail | Personal choice | Optional | Semi-public |

**Reply path:** All automated mail uses `From: noreply@paperpe.in` and `Reply-To: support@paperpe.in` (or `hello@` if you prefer one public support line).

---

## Phase 2 — Strongly recommended

| Address | Job | Setup |
|---------|-----|--------|
| **security@** | Vulnerability reports | Forward → office@ or hello@; add line on `/security` or footer later |
| **abuse@** | Spam / abuse reports (RFC expectation) | Alias → hello@ |
| **postmaster@** | Bounce / mail admin (RFC expectation) | Alias → hello@ |
| **billing@** | Razorpay invoices, GST, payouts | Forward → office@ |

---

## Phase 3 — When you grow

| Address | Job |
|---------|-----|
| **careers@** / **jobs@** | Hiring |
| **press@** / **media@** | Journalists |
| **partnerships@** / **sales@** | B2B |
| **feedback@** | Product ideas |
| **legal@** / **privacy@** | DPA / legal notices |

Use **aliases** (all land in one inbox) until someone owns a queue full-time.

---

## Resend (sending)

1. **Domains → paperpe.in** — status must be **Verified**.
2. DNS at your registrar (often Cloudflare):
   - Resend **SPF** (include their send)
   - Resend **DKIM** (TXT records they give you)
   - **DMARC** — start with `p=none` monitoring, then tighten:
     ```
     v=DMARC1; p=none; rua=mailto:postmaster@paperpe.in; adkim=s; aspf=s
     ```
3. You do **not** need to “create” every sender in Resend. After the domain is verified, any `@paperpe.in` address can be used in the `from` field (use only addresses you actually own / forward).
4. **office@** — fine for manual sends from the Resend dashboard or your mail client (with “send as” if using Workspace).
5. **Transactional app** — use `noreply@` + `Reply-To: support@` (configured in `lib/email/resend.ts`).

Vercel production already has `RESEND_API_KEY`. Local dev uses `.env.local`.

---

## Inbound (receiving) — pick one provider

### Option A — Cloudflare Email Routing (free, good for solo)

If `paperpe.in` DNS is on Cloudflare:

1. **Email → Email Routing** → enable for `paperpe.in`.
2. Add destination: your personal Gmail (verify once).
3. Create routes:

   | Alias | Action |
   |-------|--------|
   | hello | → Gmail |
   | support | → Gmail |
   | office | → Gmail |
   | admin | → Gmail |
   | billing | → Gmail |
   | security, abuse, postmaster | → Gmail |
   | noreply | (no route — discard) |

4. In Gmail: **Settings → Accounts → Send mail as** for `hello@`, `support@`, `office@` (SMTP from Resend or Google if on Workspace).

### Option B — Google Workspace / Zoho

One paid mailbox (`office@`), unlimited aliases for hello, support, admin, etc. Better when multiple people need separate inboxes.

---

## PaperPe app (what the code uses)

| Constant | Value | Use |
|----------|-------|-----|
| `FROM_TRANSACTIONAL` | `PaperPe <noreply@paperpe.in>` | Purchases, welcome, auth emails |
| `REPLY_TO_SUPPORT` | `support@paperpe.in` | Reply-To on all automated mail |
| `PUBLIC_CONTACT_EMAIL` | `hello@paperpe.in` | Site, legal, dashboard copy |

Changing public copy from `hello@` to `contact@` is cosmetic; keep one canonical address on the site for SEO and trust.

---

## Checklist (do in order)

1. [ ] Resend: domain **Verified** (green).
2. [ ] SPF + DKIM + DMARC on `paperpe.in`.
3. [ ] Inbound: forward **hello**, **support**, **office**, **admin** to your Gmail.
4. [ ] Send a test from Resend: `office@` → your Gmail; Gmail → Reply (lands in support/hello).
5. [ ] Trigger a test purchase email on staging — `From: noreply@`, reply goes to **support@**.
6. [ ] Register new vendor accounts with **admin@** only (not personal Gmail).
7. [ ] 2FA on Gmail/Workspace that receives **admin@** and **office@**.

---

## What not to do

- Do not use **noreply@** as the only contact on the website (users cannot reply).
- Do not mix personal Gmail as `From` in the app — hurts deliverability and branding.
- Do not commit API keys; keep `RESEND_API_KEY` in Vercel + `.env.local` only.

---

## Related files

- `lib/email/resend.ts` — Resend client, FROM / Reply-To
- `lib/email/addresses.ts` — canonical address list
- `lib/admin/fulfillment.js` — `SUPPORT_EMAIL` for ops copy
- `docs/ops/production-runbook.md` — env vars