import { NextRequest, NextResponse } from 'next/server';
import { getResend, FROM_EMAIL } from '@/lib/email/resend';
import { welcomeEmail, purchaseEmail, newsletterEmail, promoEmail } from '@/lib/email/templates';

export async function POST(req: NextRequest) {
  try {
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
