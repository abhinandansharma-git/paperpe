import { Resend } from 'resend';
import { EMAIL, REPLY_TO_SUPPORT } from '@/lib/email/addresses';

/** Automated app mail (purchases, welcome, auth). Replies go to support@. */
export const FROM_TRANSACTIONAL = `PaperPe <${EMAIL.noreply}>`;
/** @deprecated Use FROM_TRANSACTIONAL */
export const FROM_EMAIL = FROM_TRANSACTIONAL;

export const DEFAULT_REPLY_TO = REPLY_TO_SUPPORT;

export type TransactionalEmailPayload = {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string | string[];
};

// Lazy init — only creates client when actually needed (avoids build-time error)
let _resend: Resend | null = null;
export function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

export async function sendTransactionalEmail(payload: TransactionalEmailPayload) {
  const client = getResend();
  if (!client) return null;
  const out = await client.emails.send({
    from: payload.from ?? FROM_TRANSACTIONAL,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    replyTo: payload.replyTo ?? DEFAULT_REPLY_TO,
  });
  return out;
}
