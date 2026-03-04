import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const PRODUCTS: Record<string, { name: string; price: number }> = {
  'early-bird': { name: 'Early Bird Lifetime Access', price: 499 },
  'aria-supreme': { name: 'ARIA SUPREME Indicator', price: 2999 },
  'oi-pulse': { name: 'OI Pulse Indicator', price: 999 },
  'fear-greed': { name: 'Fear & Greed Meter', price: 499 },
  'smart-sr': { name: 'Smart S/R Levels', price: 999 },
  'bundle': { name: 'Complete Indicator Bundle', price: 3999 },
};

export async function POST(req: NextRequest) {
  try {
    const { productId, email, name } = await req.json();
    
    const product = PRODUCTS[productId];
    if (!product) {
      return NextResponse.json({ error: 'Invalid product' }, { status: 400 });
    }

    const order = await razorpay.orders.create({
      amount: product.price * 100, // paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        productId,
        productName: product.name,
        customerEmail: email,
        customerName: name,
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
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
