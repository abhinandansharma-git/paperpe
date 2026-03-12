import { Resend } from 'resend';

export const FROM_EMAIL = 'PaperPe <hello@paperpe.in>';

// Lazy init — only creates client when actually needed (avoids build-time error)
let _resend: Resend | null = null;
export function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}
