import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email, productId, productName } = await req.json();
    
    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // TODO: Send email with .pine file
    // For now, log the successful payment
    console.log('Payment successful!', {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      email,
      productId,
      productName,
    });

    // TODO: Store in database
    
    return NextResponse.json({ 
      success: true,
      message: 'Payment verified! Check your email for the indicator file.',
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error('Payment verify error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
