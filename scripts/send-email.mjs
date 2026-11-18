/**
 * Send one manual email via Resend (local CLI).
 *
 * Usage:
 *   node scripts/send-email.mjs --to user@example.com --subject "Hi" --text "Hello"
 *   node scripts/send-email.mjs --to user@example.com --from support --html "<p>Thanks</p>"
 *   node scripts/send-email.mjs --list
 *
 * Reads RESEND_API_KEY from .env.local (not committed).
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Resend } from 'resend';

const ADDRESSES = {
  hello: 'PaperPe <hello@paperpe.in>',
  support: 'PaperPe <support@paperpe.in>',
  office: 'PaperPe <office@paperpe.in>',
  noreply: 'PaperPe <noreply@paperpe.in>',
};

function loadEnvLocal() {
  const path = resolve(process.cwd(), '.env.local');
  try {
    for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith('#') || !t.includes('=')) continue;
      const i = t.indexOf('=');
      const k = t.slice(0, i).trim();
      const v = t.slice(i + 1).trim();
      if (!process.env[k]) process.env[k] = v;
    }
  } catch {
  }
}

function parseArgs(argv) {
  const out = { list: false, from: 'support' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--list') out.list = true;
    else if (a === '--to') out.to = argv[++i];
    else if (a === '--from') out.from = argv[++i];
    else if (a === '--subject') out.subject = argv[++i];
    else if (a === '--text') out.text = argv[++i];
    else if (a === '--html') out.html = argv[++i];
    else if (a === '--help' || a === '-h') out.help = true;
  }
  return out;
}

function usage() {
  console.log(`PaperPe — manual Resend send

  node scripts/send-email.mjs --to EMAIL --subject "..." [--text "..." | --html "..."]
      --from hello|support|office|noreply   (default: support)

  node scripts/send-email.mjs --list        last 10 sent emails (Resend API)

From addresses: ${Object.keys(ADDRESSES).join(', ')}
Reply-To on sends: support@paperpe.in`);
}

loadEnvLocal();
const args = parseArgs(process.argv.slice(2));
if (args.help) {
  usage();
  process.exit(0);
}

const key = process.env.RESEND_API_KEY;
if (!key) {
  console.error('RESEND_API_KEY missing. Add it to .env.local');
  process.exit(1);
}

const resend = new Resend(key);

if (args.list) {
  const { data, error } = await resend.emails.list({ limit: 10 });
  if (error) {
    console.error(error);
    process.exit(1);
  }
  for (const row of data?.data ?? []) {
    console.log(
      [row.id, row.created_at, row.from, '→', row.to?.join(','), row.subject, row.last_event]
        .filter(Boolean)
        .join(' | ')
    );
  }
  process.exit(0);
}

const from = ADDRESSES[args.from] ?? ADDRESSES.support;
if (!args.to || !args.subject || (!args.text && !args.html)) {
  usage();
  process.exit(1);
}

const { data, error } = await resend.emails.send({
  from,
  to: [args.to],
  replyTo: 'support@paperpe.in',
  subject: args.subject,
  ...(args.html ? { html: args.html } : { text: args.text }),
});

if (error) {
  console.error('Send failed:', error);
  process.exit(1);
}
console.log('Sent. id=', data?.id);
console.log('Check Resend dashboard → Emails for delivery status.');