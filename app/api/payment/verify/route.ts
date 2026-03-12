import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { getResend, FROM_EMAIL } from '@/lib/email/resend';
import { purchaseEmail } from '@/lib/email/templates';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      email,
      productId,
      productName,
      userId,
      amount,
    } = await req.json();

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Find product in DB
    const { data: product } = await supabaseAdmin
      .from('products')
      .select('id, name')
      .eq('slug', productId)
      .single();

    // Save order to DB
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: userId || null,
        product_id: product?.id || null,
        amount: amount || 0,
        razorpay_order_id,
        razorpay_payment_id,
        status: 'paid',
        email,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order save error:', orderError);
    }

    // Send purchase confirmation email
    if (email && process.env.RESEND_API_KEY) {
      try {
        const template = purchaseEmail({
          name: email.split('@')[0],
          productName: product?.name || productName,
          amount: amount || 0,
          orderId: order?.id || razorpay_order_id,
        });
        await getResend()?.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: template.subject,
          html: template.html,
        });
      } catch (emailErr) {
        console.error('Purchase email failed (non-critical):', emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment successful! Check your email and dashboard.',
      paymentId: razorpay_payment_id,
      orderId: order?.id,
    });
  } catch (error) {
    console.error('Payment verify error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
