import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;

    // Get order with product info
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('*, product:products(*)')
      .eq('id', orderId)
      .eq('status', 'paid')
      .single();

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Log download
    await supabaseAdmin.from('downloads').insert({
      order_id: orderId,
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
    }).then(() => {});

    // If product has a file_url, redirect to it
    if (order.product?.file_url) {
      return NextResponse.redirect(order.product.file_url);
    }

    // Otherwise return product info (placeholder until files are uploaded)
    return NextResponse.json({
      message: 'Download will be available soon. Contact support@paperpe.in',
      product: order.product?.name,
      orderId,
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}
