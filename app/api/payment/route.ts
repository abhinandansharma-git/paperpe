import { NextRequest, NextResponse } from 'next/server';

// Products catalog
const PRODUCTS: Record<string, { name: string; price: number; description: string }> = {
  'early-bird': {
    name: 'Early Bird Lifetime Access',
    price: 49900, // ₹499
    description: 'Lifetime access to PaperPe Pro at 86% off',
  },
  'oi-pulse': {
    name: 'OI Pulse Indicator',
    price: 99900, // in paise (₹999)
    description: 'Open Interest based trading signals for TradingView',
  },
  'fear-greed': {
    name: 'Fear & Greed Meter',
    price: 49900, // ₹499
    description: 'Market sentiment oscillator for TradingView',
  },
  'smart-sr': {
    name: 'Smart S/R Zones',
    price: 99900, // ₹999
    description: 'Auto support & resistance zones for TradingView',
  },
  'bundle': {
    name: 'ARIA Indicator Bundle (All 3)',
    price: 199900, // ₹1999
    description: 'OI Pulse + Fear & Greed + Smart S/R - Complete package',
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, email, name, referral } = body;

    const product = PRODUCTS[productId];
    if (!product) {
      return NextResponse.json({ error: 'Invalid product' }, { status: 400 });
    }

    // Dynamic import to avoid build issues
    const Razorpay = (await import('razorpay')).default;
    
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: product.price,
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        productId,
        email,
        name,
        referral: referral || 'direct',
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: product.price,
      currency: 'INR',
      productName: product.name,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error('Payment error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    products: Object.entries(PRODUCTS).map(([id, p]) => ({
      id,
      name: p.name,
      price: p.price / 100,
      description: p.description,
    })),
  });
}
