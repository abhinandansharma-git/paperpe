import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const PRODUCTS: Record<string, { name: string; price: number }> = {
  'early-bird': { name: 'Early Bird Lifetime Access', price: 499 },
  'aria-supreme': { name: 'ARIA SUPREME Indicator', price: 2999 },
  'oi-pulse': { name: 'OI Pulse Indicator', price: 999 },
  'fear-greed': { name: 'Fear & Greed Meter', price: 499 },
  'smart-sr': { name: 'Smart S/R Levels', price: 999 },
  'bundle': { name: 'Complete Indicator Bundle', price: 3999 },
};

// ── Input validation ──
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length < 255;
}

function sanitize(str: string): string {
  return str.replace(/[<>&"']/g, '').trim().slice(0, 200);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, email, name } = body;

    // ── Validate productId ──
    if (!productId || typeof productId !== 'string') {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const product = PRODUCTS[productId];
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 400 });
    }

    // ── Validate email ──
    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    // ── Validate name ──
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Name required (min 2 chars)' }, { status: 400 });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: 'Payment not configured' }, { status: 503 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const sanitizedName = sanitize(name);
    const sanitizedEmail = email.trim().toLowerCase();

    const order = await razorpay.orders.create({
      amount: product.price * 100, // Price from server-side catalog only — never trust client
      currency: 'INR',
      receipt: `order_${Date.now()}_${productId}`,
      notes: {
        productId,
        productName: product.name,
        customerEmail: sanitizedEmail,
        customerName: sanitizedName,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      productName: product.name,
    });
  } catch (error) {
    console.error('Razorpay order error:', error);
    // Don't leak internal errors
    return NextResponse.json({ error: 'Failed to create order. Please try again.' }, { status: 500 });
  }
}
