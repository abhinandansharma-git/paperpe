import { NextRequest, NextResponse } from 'next/server';
import { getProductCatalogEntry } from '@/lib/commerce/catalog.js';

const PRODUCT_DESCRIPTIONS: Record<string, string> = {
  'early-bird': 'Lifetime access to PaperPe Pro at an early-launch price',
  'aria-supreme': '7-in-1 flagship TradingView indicator for Indian markets',
  'oi-pulse': 'Open Interest based trading signals for TradingView',
  'fear-greed': 'Market sentiment oscillator for TradingView',
  'smart-sr': 'Auto support and resistance levels for TradingView',
  'complete-bundle': 'All premium PaperPe indicators in one bundle',
};

const SUPPORTED_PRODUCTS = [
  'early-bird',
  'aria-supreme',
  'oi-pulse',
  'fear-greed',
  'smart-sr',
  'complete-bundle',
] as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, email, name, referral } = body;

    const product = getProductCatalogEntry(productId);
    if (!product) {
      return NextResponse.json({ error: 'Invalid product' }, { status: 400 });
    }

    // Dynamic import to avoid build issues
    const Razorpay = (await import('razorpay')).default;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });

    const order = await razorpay.orders.create({
      amount: product.price * 100,
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        productId: product.canonicalId,
        email,
        name,
        referral: referral || 'direct',
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: product.price * 100,
      currency: 'INR',
      productName: product.name,
      productId: product.canonicalId,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error('Payment error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    products: SUPPORTED_PRODUCTS.map((id) => {
      const product = getProductCatalogEntry(id)!;
      return {
        id: product.canonicalId,
        name: product.name,
        price: product.price,
        description: PRODUCT_DESCRIPTIONS[product.canonicalId] || '',
      };
    }),
  });
}
