import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { getResend, FROM_EMAIL } from '@/lib/email/resend';
import { purchaseEmail } from '@/lib/email/templates';
import { getProductCatalogEntry } from '@/lib/commerce/catalog.js';
import { buildVerifiedOrderInsert } from '@/lib/commerce/checkout.js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
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

    const catalogProduct = getProductCatalogEntry(productId);
    const canonicalProductId = catalogProduct?.canonicalId || productId;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const { data: existingOrder } = await supabaseAdmin
      .from('orders')
      .select('id')
      .eq('razorpay_payment_id', razorpay_payment_id)
      .maybeSingle();

    if (existingOrder) {
      return NextResponse.json({
        success: true,
        message: 'Payment already verified.',
        paymentId: razorpay_payment_id,
        orderId: existingOrder.id,
      });
    }

    // Find product in DB
    const { data: product } = await supabaseAdmin
      .from('products')
      .select('id, name')
      .eq('slug', canonicalProductId)
      .single();

    const resolvedAmount = Number.isFinite(amount) && amount > 0
      ? amount
      : (catalogProduct?.price || 0);
    const normalizedEmail = typeof email === 'string'
      ? email.trim().toLowerCase()
      : undefined;

    // Save order to DB
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert(buildVerifiedOrderInsert({
        userId,
        productId: product?.id,
        amount: resolvedAmount,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        email: normalizedEmail,
      }))
      .select()
      .single();

    if (orderError) {
      console.error('Order save error:', orderError);
    }

    // Send purchase confirmation email
    if (normalizedEmail && process.env.RESEND_API_KEY) {
      try {
        const template = purchaseEmail({
          name: normalizedEmail.split('@')[0],
          productName: product?.name || catalogProduct?.name || productName,
          amount: resolvedAmount,
          orderId: order?.id || razorpay_order_id,
        });
        await getResend()?.emails.send({
          from: FROM_EMAIL,
          to: normalizedEmail,
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
    // Never leak internal errors to client
    return NextResponse.json({ error: 'Payment verification failed. Contact support@paperpe.in' }, { status: 500 });
  }
}
