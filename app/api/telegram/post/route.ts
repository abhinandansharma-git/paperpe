import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHANNEL = process.env.TELEGRAM_CHANNEL_ID!;

async function sendMessage(text: string, parseMode: 'HTML' | 'Markdown' = 'HTML') {
  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHANNEL,
      text,
      parse_mode: parseMode,
      disable_web_page_preview: false,
    }),
  });
  return res.json();
}

function getTodayEvents(): string {
  const events: Record<string, string[]> = {
    // RBI MPC 2026
    '2026-04-07': ['🏦 RBI MPC Decision Day'],
    '2026-06-05': ['🏦 RBI MPC Decision Day'],
    '2026-08-07': ['🏦 RBI MPC Decision Day'],
    '2026-10-07': ['🏦 RBI MPC Decision Day'],
    '2026-12-04': ['🏦 RBI MPC Decision Day'],
    // FOMC 2026
    '2026-03-18': ['🇺🇸 FOMC Meeting (Mar 18-19)'],
    '2026-03-19': ['🇺🇸 FOMC Decision Day'],
    '2026-05-06': ['🇺🇸 FOMC Meeting'],
    '2026-05-07': ['🇺🇸 FOMC Decision Day'],
    '2026-06-17': ['🇺🇸 FOMC Meeting'],
    '2026-06-18': ['🇺🇸 FOMC Decision Day'],
  };

  const today = new Date().toISOString().split('T')[0];
  return events[today]?.join('\n') || '';
}

function getWeeklyExpiry(): string {
  const day = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'long' });
  if (day === 'Thursday') return '⚠️ <b>Today is NIFTY Expiry Day!</b>';
  if (day === 'Wednesday') return '📅 Tomorrow is NIFTY expiry — plan your positions!';
  return '';
}

function getMorningPost(): string {
  const now = new Date();
  const date = now.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'long', day: 'numeric', month: 'long' });
  const todayEvents = getTodayEvents();
  const expiryAlert = getWeeklyExpiry();

  return `🌅 <b>Good Morning, Traders!</b>
${date}

${expiryAlert ? expiryAlert + '\n' : ''}${todayEvents ? todayEvents + '\n' : ''}
<b>Before you trade today, check:</b>

📊 <b>Max Pain</b> — Where are option writers defending?
👉 https://paperpe.in/max-pain

📈 <b>Put-Call Ratio (PCR)</b> — What's market sentiment?
👉 https://paperpe.in/pcr

📅 <b>Upcoming Events</b> — Any volatility triggers today?
👉 https://paperpe.in/events

<i>All tools are free. No login required.</i>

#NIFTY #BankNifty #OptionsTrading #FnO #PaperPe`;
}

function getEveningPost(): string {
  const now = new Date();
  const date = now.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'long' });

  return `🌆 <b>Market Closed — ${date}</b>

Did you calculate your actual charges today?

Most traders don't realise how much STT + brokerage + SEBI fees eat into profits.

💰 <b>Check your real P&L with our free tools:</b>

🧮 Brokerage Calculator — See exact charges per trade
👉 https://paperpe.in/brokerage-calculator

📐 Position Sizing — Were you risking the right amount?
👉 https://paperpe.in/position-sizing-calculator

📊 Options P&L — Understand your payoff at expiry
👉 https://paperpe.in/options-pl-calculator

<i>Free. No login. No ads.</i>

#Trading #OptionsTrading #NIFTY #FnO #PaperPe`;
}

function getToolSpotlightPost(): string {
  const tools = [
    {
      name: '🧮 Brokerage Calculator',
      hook: 'How much did you actually pay in charges last month?\n\nMost F&O traders are shocked when they calculate it.',
      cta: 'See your exact brokerage + STT + SEBI fees in seconds:',
      url: 'https://paperpe.in/brokerage-calculator',
    },
    {
      name: '📐 Position Sizing Calculator',
      hook: 'The #1 reason traders blow up accounts:\n\nThey buy too many lots for their account size.',
      cta: 'Enter your capital + risk % → get the exact number of lots:',
      url: 'https://paperpe.in/position-sizing-calculator',
    },
    {
      name: '📊 Options P&L Calculator',
      hook: 'Do you know your breakeven before you enter an options trade?\n\nIf not, you\'re gambling.',
      cta: 'See your exact P&L at every NIFTY level at expiry:',
      url: 'https://paperpe.in/options-pl-calculator',
    },
    {
      name: '📅 F&O Events Calendar',
      hook: 'RBI policy. FOMC. Budget. Expiry.\n\nHigh volatility events catch traders off guard every time.',
      cta: 'All 2026 key dates in one place — free:',
      url: 'https://paperpe.in/events',
    },
  ];

  // Rotate based on day of week
  const day = new Date().getDay();
  const tool = tools[day % tools.length];

  return `💡 <b>Free Tool: ${tool.name}</b>

${tool.hook}

${tool.cta}
👉 ${tool.url}

<i>100% free. No login required.</i>

#FreeTools #OptionsTrading #NIFTY #FnO #PaperPe`;
}

export async function POST(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { type } = await req.json();

  let text: string;
  switch (type) {
    case 'morning':
      text = getMorningPost();
      break;
    case 'evening':
      text = getEveningPost();
      break;
    case 'tool':
      text = getToolSpotlightPost();
      break;
    default:
      return NextResponse.json({ error: 'Unknown post type' }, { status: 400 });
  }

  const result = await sendMessage(text);

  if (!result.ok) {
    console.error('Telegram send failed:', result);
    return NextResponse.json({ error: result.description }, { status: 500 });
  }

  return NextResponse.json({ success: true, message_id: result.result?.message_id });
}

// GET is called by Vercel cron (Authorization: Bearer CRON_SECRET sent automatically)
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'morning';

  let text: string;
  switch (type) {
    case 'morning': text = getMorningPost(); break;
    case 'evening': text = getEveningPost(); break;
    case 'tool': text = getToolSpotlightPost(); break;
    default: return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
  }

  const result = await sendMessage(text);

  if (!result.ok) {
    console.error('Telegram send failed:', result);
    return NextResponse.json({ error: result.description }, { status: 500 });
  }

  return NextResponse.json({ success: true, message_id: result.result?.message_id });
}
