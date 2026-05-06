import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = 'data.abhinandan73@gmail.com';

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function verifyAdmin(req: NextRequest) {
  const supabaseAdmin = getSupabaseAdmin();
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user || user.email !== ADMIN_EMAIL) {
    return null;
  }

  return user;
}

export async function PUT(req: NextRequest) {
  const supabaseAdmin = getSupabaseAdmin();
  const user = await verifyAdmin(req);
  if (!user) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const { id, fulfillment_status } = body;

  if (!id || !fulfillment_status) {
    return NextResponse.json({ error: 'id and fulfillment_status required' }, { status: 400 });
  }

  if (!['pending', 'delivered'].includes(fulfillment_status)) {
    return NextResponse.json({ error: 'Invalid fulfillment status' }, { status: 400 });
  }

  const updates = {
    fulfillment_status,
    fulfilled_at: fulfillment_status === 'delivered' ? new Date().toISOString() : null,
  };

  const { data, error } = await supabaseAdmin
    .from('orders')
    .update(updates)
    .eq('id', id)
    .eq('status', 'paid')
    .select('id, fulfillment_status, fulfilled_at')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
