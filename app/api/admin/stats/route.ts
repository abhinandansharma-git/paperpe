import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = 'data.abhinandan73@gmail.com';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  // Verify admin via auth header (user's JWT)
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const [
    { data: orders },
    { data: users },
    { data: products },
  ] = await Promise.all([
    supabaseAdmin.from('orders').select('*, product:products(name), user:profiles(full_name, email:id)').order('created_at', { ascending: false }),
    supabaseAdmin.from('profiles').select('*').order('created_at', { ascending: false }),
    supabaseAdmin.from('products').select('*').order('created_at', { ascending: false }),
  ]);

  const paidOrders = (orders || []).filter((o: any) => o.status === 'paid');
  const totalRevenue = paidOrders.reduce((sum: number, o: any) => sum + (o.amount || 0), 0);

  return NextResponse.json({
    orders: orders || [],
    users: users || [],
    products: products || [],
    stats: {
      totalRevenue,
      totalOrders: paidOrders.length,
      totalUsers: (users || []).length,
      totalProducts: (products || []).length,
      pendingOrders: (orders || []).filter((o: any) => o.status === 'created').length,
    }
  });
}
