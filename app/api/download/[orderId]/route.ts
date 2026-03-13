import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;

    // ── Auth check: verify user is logged in ──
    const authHeader = req.headers.get('authorization');
    const cookieToken = req.cookies.get('sb-kxwwinlmihtqtnscdiph-auth-token')?.value;
    const token = authHeader?.replace('Bearer ', '') || cookieToken;

    let userId: string | null = null;
    if (token) {
      const { data: { user } } = await supabaseAdmin.auth.getUser(token);
      userId = user?.id || null;
    }

    // Get order with product info
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('*, product:products(*)')
      .eq('id', orderId)
      .eq('status', 'paid')
      .single();

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found or not paid' }, { status: 404 });
    }

    // ── Verify ownership: order must belong to requesting user ──
    if (order.user_id && userId && order.user_id !== userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // ── Log download with IP for audit trail ──
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    await supabaseAdmin.from('downloads').insert({
      order_id: orderId,
      user_id: userId,
      ip_address: ip,
      user_agent: req.headers.get('user-agent') || 'unknown',
    }).then(() => {});

    // ── Check download count (max 5 per order) ──
    const { count } = await supabaseAdmin
      .from('downloads')
      .select('*', { count: 'exact', head: true })
      .eq('order_id', orderId);

    if (count && count > 10) {
      return NextResponse.json({
        error: 'Download limit exceeded (10 max). Contact support@paperpe.in',
      }, { status: 429 });
    }

    // If product has a file_url, redirect to it
    if (order.product?.file_url) {
      return NextResponse.redirect(order.product.file_url);
    }

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
