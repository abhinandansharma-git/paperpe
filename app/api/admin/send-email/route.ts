import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  ADMIN_FROM_OPTIONS,
  type AdminFromKey,
  REPLY_TO_SUPPORT,
} from '@/lib/email/addresses';
import { sendTransactionalEmail } from '@/lib/email/resend';

const ADMIN_EMAIL = 'data.abhinandan73@gmail.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function verifyAdmin(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await getSupabaseAdmin().auth.getUser(token);
  if (error || !user || user.email !== ADMIN_EMAIL) return null;
  return user;
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function textToHtml(text: string) {
  return `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#111">${escapeHtml(text).replace(/\n/g, '<br/>')}</div>`;
}

export async function POST(req: NextRequest) {
  const user = await verifyAdmin(req);
  if (!user) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 503 });
  }

  let body: {
    to?: string;
    subject?: string;
    message?: string;
    from?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const to = body.to?.trim().toLowerCase();
  const subject = body.subject?.trim();
  const message = body.message?.trim();
  const fromKey = (body.from || 'support') as AdminFromKey;

  if (!to || !EMAIL_RE.test(to)) {
    return NextResponse.json({ error: 'Valid recipient email required' }, { status: 400 });
  }
  if (!subject || subject.length > 200) {
    return NextResponse.json({ error: 'Subject required (max 200 chars)' }, { status: 400 });
  }
  if (!message || message.length > 20_000) {
    return NextResponse.json({ error: 'Message required (max 20000 chars)' }, { status: 400 });
  }
  if (!(fromKey in ADMIN_FROM_OPTIONS)) {
    return NextResponse.json({ error: 'Invalid from address' }, { status: 400 });
  }

  const { data, error } = (await sendTransactionalEmail({
    from: ADMIN_FROM_OPTIONS[fromKey],
    to,
    subject,
    html: textToHtml(message),
    replyTo: REPLY_TO_SUPPORT,
  })) ?? { data: null, error: { message: 'Resend not configured' } };

  if (error || !data?.id) {
    return NextResponse.json(
      { error: error?.message || 'Resend did not return a message id' },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true, id: data.id });
}