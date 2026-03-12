// ─── Email Templates ───────────────────────────────────────────────────────

const baseStyle = `
  font-family: 'Helvetica Neue', Arial, sans-serif;
  background: #0D1117;
  color: #ffffff;
  padding: 40px 20px;
`;

const cardStyle = `
  max-width: 580px;
  margin: 0 auto;
  background: #161B22;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #21262D;
`;

const headerStyle = `
  background: linear-gradient(135deg, #00C076, #0070f3);
  padding: 32px 40px;
  text-align: center;
`;

const bodyStyle = `padding: 40px;`;

const btnStyle = `
  display: inline-block;
  background: #00C076;
  color: #0D1117;
  font-weight: 700;
  text-decoration: none;
  padding: 14px 32px;
  border-radius: 10px;
  font-size: 16px;
`;

const footerStyle = `
  text-align: center;
  color: #6B7280;
  font-size: 13px;
  padding: 24px 40px;
  border-top: 1px solid #21262D;
`;

// ─── Welcome Email ──────────────────────────────────────────────────────────
export function welcomeEmail({ name }: { name: string }) {
  return {
    subject: `Welcome to PaperPe, ${name}! 🚀`,
    html: `
<div style="${baseStyle}">
  <div style="${cardStyle}">
    <div style="${headerStyle}">
      <div style="width:48px;height:48px;background:rgba(0,0,0,0.2);border-radius:12px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
        <span style="font-size:24px;font-weight:900;color:white;">P</span>
      </div>
      <h1 style="margin:0;color:white;font-size:24px;">Welcome to PaperPe!</h1>
    </div>
    <div style="${bodyStyle}">
      <p style="color:#D1D5DB;font-size:16px;line-height:1.6;">Hey ${name},</p>
      <p style="color:#D1D5DB;font-size:16px;line-height:1.6;">
        Welcome aboard! You're now part of India's fastest-growing paper trading community.
      </p>
      <p style="color:#9CA3AF;font-size:15px;line-height:1.6;">Here's what you can do right now:</p>
      <ul style="color:#9CA3AF;font-size:15px;line-height:2;">
        <li>📊 <strong style="color:#D1D5DB;">Practice trading</strong> with ₹10L virtual money — zero risk</li>
        <li>🛠️ <strong style="color:#D1D5DB;">Free tools</strong> — Option calculator, Position sizer, Brokerage calculator</li>
        <li>📈 <strong style="color:#D1D5DB;">Premium indicators</strong> — Battle-tested TradingView scripts</li>
        <li>🏆 <strong style="color:#D1D5DB;">Leaderboard</strong> — Compete with top traders</li>
      </ul>
      <div style="text-align:center;margin:32px 0;">
        <a href="https://paperpe.in/dashboard" style="${btnStyle}">Go to Dashboard →</a>
      </div>
    </div>
    <div style="${footerStyle}">
      <p>PaperPe — Practice. Learn. Trade.<br/>
      <a href="https://paperpe.in" style="color:#00C076;">paperpe.in</a></p>
    </div>
  </div>
</div>`,
  };
}

// ─── Purchase Confirmation ───────────────────────────────────────────────────
export function purchaseEmail({
  name,
  productName,
  amount,
  orderId,
}: {
  name: string;
  productName: string;
  amount: number;
  orderId: string;
}) {
  return {
    subject: `✅ Purchase Confirmed — ${productName}`,
    html: `
<div style="${baseStyle}">
  <div style="${cardStyle}">
    <div style="${headerStyle}">
      <div style="font-size:40px;margin-bottom:8px;">✅</div>
      <h1 style="margin:0;color:white;font-size:22px;">Payment Successful!</h1>
    </div>
    <div style="${bodyStyle}">
      <p style="color:#D1D5DB;font-size:16px;">Hey ${name},</p>
      <p style="color:#D1D5DB;font-size:15px;line-height:1.6;">
        Your purchase is confirmed. Here are your order details:
      </p>
      <div style="background:#0D1117;border-radius:12px;padding:20px;margin:20px 0;border:1px solid #21262D;">
        <table style="width:100%;color:#9CA3AF;font-size:14px;">
          <tr><td>Product</td><td style="text-align:right;color:#fff;font-weight:600;">${productName}</td></tr>
          <tr><td style="padding-top:10px;">Amount Paid</td><td style="text-align:right;color:#00C076;font-weight:700;padding-top:10px;">₹${amount}</td></tr>
          <tr><td style="padding-top:10px;">Order ID</td><td style="text-align:right;color:#6B7280;padding-top:10px;font-size:12px;">${orderId}</td></tr>
        </table>
      </div>
      <p style="color:#D1D5DB;font-size:15px;">Your indicator file is ready to download from your dashboard:</p>
      <div style="text-align:center;margin:28px 0;">
        <a href="https://paperpe.in/dashboard" style="${btnStyle}">Download Now →</a>
      </div>
      <p style="color:#6B7280;font-size:13px;">
        Need help setting up the indicator? Reply to this email or contact
        <a href="mailto:support@paperpe.in" style="color:#00C076;">support@paperpe.in</a>
      </p>
    </div>
    <div style="${footerStyle}">
      <p>PaperPe — <a href="https://paperpe.in" style="color:#00C076;">paperpe.in</a></p>
    </div>
  </div>
</div>`,
  };
}

// ─── Newsletter ─────────────────────────────────────────────────────────────
export function newsletterEmail({
  subject,
  headline,
  body,
  ctaText = 'Read More',
  ctaUrl = 'https://paperpe.in/blog',
}: {
  subject: string;
  headline: string;
  body: string;
  ctaText?: string;
  ctaUrl?: string;
}) {
  return {
    subject,
    html: `
<div style="${baseStyle}">
  <div style="${cardStyle}">
    <div style="${headerStyle}">
      <p style="margin:0;color:rgba(255,255,255,0.7);font-size:13px;letter-spacing:2px;text-transform:uppercase;">PaperPe Weekly</p>
      <h1 style="margin:12px 0 0;color:white;font-size:22px;line-height:1.3;">${headline}</h1>
    </div>
    <div style="${bodyStyle}">
      <div style="color:#D1D5DB;font-size:15px;line-height:1.8;">${body}</div>
      <div style="text-align:center;margin:32px 0;">
        <a href="${ctaUrl}" style="${btnStyle}">${ctaText}</a>
      </div>
    </div>
    <div style="${footerStyle}">
      <p>You're receiving this because you signed up at PaperPe.</p>
      <p><a href="https://paperpe.in/unsubscribe" style="color:#6B7280;">Unsubscribe</a> &nbsp;·&nbsp;
      <a href="https://paperpe.in" style="color:#00C076;">paperpe.in</a></p>
    </div>
  </div>
</div>`,
  };
}

// ─── Promo Email ────────────────────────────────────────────────────────────
export function promoEmail({
  name,
  promoTitle,
  promoBody,
  discount,
  ctaUrl,
}: {
  name: string;
  promoTitle: string;
  promoBody: string;
  discount?: string;
  ctaUrl: string;
}) {
  return {
    subject: `🔥 ${promoTitle} — PaperPe`,
    html: `
<div style="${baseStyle}">
  <div style="${cardStyle}">
    <div style="background:linear-gradient(135deg,#f59e0b,#ef4444);padding:32px 40px;text-align:center;">
      ${discount ? `<div style="background:rgba(0,0,0,0.2);display:inline-block;padding:6px 16px;border-radius:20px;color:white;font-weight:700;font-size:14px;margin-bottom:12px;">🔥 ${discount} OFF</div>` : ''}
      <h1 style="margin:0;color:white;font-size:22px;">${promoTitle}</h1>
    </div>
    <div style="${bodyStyle}">
      <p style="color:#D1D5DB;font-size:16px;">Hey ${name},</p>
      <div style="color:#D1D5DB;font-size:15px;line-height:1.8;">${promoBody}</div>
      <div style="text-align:center;margin:32px 0;">
        <a href="${ctaUrl}" style="${btnStyle.replace('#00C076', '#f59e0b')}">Grab the Deal →</a>
      </div>
    </div>
    <div style="${footerStyle}">
      <p><a href="https://paperpe.in/unsubscribe" style="color:#6B7280;">Unsubscribe</a> &nbsp;·&nbsp;
      <a href="https://paperpe.in" style="color:#00C076;">paperpe.in</a></p>
    </div>
  </div>
</div>`,
  };
}
