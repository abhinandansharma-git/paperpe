import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isStoragePath } from '@/lib/commerce/storage.js';

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

    // ── Verify ownership: downloads are tied to the purchasing account ──
    if (!order.user_id) {
      return NextResponse.json({
        error: 'This order is not linked to an account yet. Contact support@paperpe.in',
      }, { status: 409 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'Please sign in to download your purchase' }, { status: 401 });
    }

    if (order.user_id !== userId) {
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

    // If product has a file_url, sign storage paths or redirect to absolute URLs
    if (order.product?.file_url) {
      const fileUrl = order.product.file_url.trim();

      if (isStoragePath(fileUrl)) {
        const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
          .from('products')
          .createSignedUrl(fileUrl, 60 * 10, { download: true });

        if (signedUrlError || !signedUrlData?.signedUrl) {
          console.error('Signed URL error:', signedUrlError);
          return NextResponse.json({
            error: 'Download file is not ready yet. Contact support@paperpe.in',
          }, { status: 500 });
        }

        return NextResponse.redirect(signedUrlData.signedUrl);
      }

      return NextResponse.redirect(fileUrl);
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
