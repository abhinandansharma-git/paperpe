'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search);
      const oauthError = params.get('error_description') || params.get('error');
      if (oauthError) {
        setError(oauthError);
        return;
      }

      const code = params.get('code');
      const requestedRedirect = params.get('redirect') || '/dashboard';
      const safeRedirect = requestedRedirect.startsWith('/') ? requestedRedirect : '/dashboard';

      if (!code) {
        setError('Missing login code. Try signing in again.');
        return;
      }

      // PKCE verifier lives in this browser — exchange must run client-side, not on a Route Handler.
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) {
        setError(exchangeError.message);
        return;
      }

      const user = data.user;
      const createdAt = user?.created_at ? new Date(user.created_at).getTime() : 0;
      const isNew = user && Date.now() - createdAt < 60_000;

      if (isNew && user?.email) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          const name = user.user_metadata?.full_name?.split(' ')[0] || user.email.split('@')[0] || 'Trader';
          try {
            await fetch('/api/email/send', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ type: 'welcome', to: user.email, data: { name } }),
            });
          } catch {
            // non-critical
          }
        }
      }

      router.replace(safeRedirect);
    };

    run();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#161B22] flex flex-col items-center justify-center px-6 text-center">
        <p className="text-red-400 mb-4 max-w-md text-sm">{error}</p>
        <Link href="/login" className="text-[#00C076] font-medium">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#161B22] flex flex-col items-center justify-center gap-3 text-gray-400">
      <Loader2 className="w-8 h-8 animate-spin text-[#00C076]" />
      <p className="text-sm">Signing you in…</p>
    </div>
  );
}