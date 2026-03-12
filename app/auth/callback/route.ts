import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { getResend, FROM_EMAIL } from '@/lib/email/resend';
import { welcomeEmail } from '@/lib/email/templates';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const isNewUser = requestUrl.searchParams.get('new') === '1';

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data } = await supabase.auth.exchangeCodeForSession(code);
    const user = data?.user;

    // Send welcome email only for new signups
    if (user && process.env.RESEND_API_KEY) {
      try {
        // Check if this is their first login (created_at close to now)
        const createdAt = new Date(user.created_at).getTime();
        const now = Date.now();
        const isNew = now - createdAt < 60000; // within last 60 seconds

        if (isNew) {
          const name = user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'Trader';
          const template = welcomeEmail({ name });
          await getResend()?.emails.send({
            from: FROM_EMAIL,
            to: user.email!,
            subject: template.subject,
            html: template.html,
          });
        }
      } catch (emailErr) {
        console.error('Welcome email failed (non-critical):', emailErr);
      }
    }
  }

  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
}
