import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getResend, FROM_EMAIL } from '@/lib/email/resend';
import { welcomeEmail, purchaseEmail, newsletterEmail, promoEmail } from '@/lib/email/templates';

const ADMIN_EMAIL = 'data.abhinandan73@gmail.com';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // ── Auth: only admin or internal calls can send emails ──
    const authHeader = req.headers.get('authorization');
    const internalSecret = req.headers.get('x-internal-secret');

    // Allow internal calls (from payment verify route etc.)
    if (internalSecret === process.env.SUPABASE_SERVICE_ROLE_KEY) {
      // Trusted internal call — proceed
    } else if (authHeader) {
      // Verify admin user
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabaseAdmin.auth.getUser(token);
      if (!user || user.email !== ADMIN_EMAIL) {
        return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 });
      }
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { type, to, data } = body;

    if (!type || !to) {
      return NextResponse.json({ error: 'Missing type or to' }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not set — skipping email');
      return NextResponse.json({ success: true, skipped: true });
    }

    let template;
    switch (type) {
      case 'welcome':
        template = welcomeEmail(data);
        break;
      case 'purchase':
        template = purchaseEmail(data);
        break;
      case 'newsletter':
        template = newsletterEmail(data);
        break;
      case 'promo':
        template = promoEmail(data);
        break;
      default:
        return NextResponse.json({ error: 'Unknown email type' }, { status: 400 });
    }

    const result = await getResend()?.emails.send({
      from: FROM_EMAIL,
      to,
      subject: template.subject,
      html: template.html,
    });

    return NextResponse.json({ success: true, id: result?.data?.id });
  } catch (error: any) {
    console.error('Email send error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
