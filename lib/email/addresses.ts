/**
 * Canonical @paperpe.in addresses.
 * See docs/ops/paperpe-email-system.md for inbox vs Resend roles.
 */
export const EMAIL = {
  /** Public contact on site, legal, footer */
  hello: 'hello@paperpe.in',
  /** User replies on transactional mail */
  support: 'support@paperpe.in',
  /** Founder / business ops (you created this in Resend) */
  office: 'office@paperpe.in',
  /** Vendor & console registrations */
  admin: 'admin@paperpe.in',
  /** App automated sends only */
  noreply: 'noreply@paperpe.in',
  security: 'security@paperpe.in',
  abuse: 'abuse@paperpe.in',
  postmaster: 'postmaster@paperpe.in',
  billing: 'billing@paperpe.in',
} as const;

export const PUBLIC_CONTACT_EMAIL = EMAIL.hello;
export const REPLY_TO_SUPPORT = EMAIL.support;