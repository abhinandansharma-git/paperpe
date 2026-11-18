import { Resend } from 'resend';
import { EMAIL, REPLY_TO_SUPPORT } from '@/lib/email/addresses';

/** Automated app mail (purchases, welcome, auth). Replies go to support@. */
export const FROM_TRANSACTIONAL = `PaperPe <${EMAIL.noreply}>`;
/** @deprecated Use FROM_TRANSACTIONAL */
export const FROM_EMAIL = FROM_TRANSACTIONAL;

export const DEFAULT_REPLY_TO = REPLY_TO_SUPPORT;

type ResendSendPayload = Parameters<Resend['emails']['send']>[0];

// Lazy init — only creates client when actually needed (avoids build-time error)
let _resend: Resend | null = null;
export function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

export async function sendTransactionalEmail(payload: Omit<ResendSendPayload, 'from'> & { from?: string }) {
  const client = getResend();
  if (!client) return null;
  return client.emails.send({
    ...payload,
    from: payload.from ?? FROM_TRANSACTIONAL,
    replyTo: payload.replyTo ?? DEFAULT_REPLY_TO,
  });
}
