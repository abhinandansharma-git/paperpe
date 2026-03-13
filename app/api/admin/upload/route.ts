import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = 'data.abhinandan73@gmail.com';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  // Verify admin
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File;
  const productId = formData.get('productId') as string;

  if (!file || !productId) {
    return NextResponse.json({ error: 'file and productId required' }, { status: 400 });
  }

  // Validate file type
  const name = file.name.toLowerCase();
  if (!name.endsWith('.pine') && !name.endsWith('.txt') && !name.endsWith('.zip')) {
    return NextResponse.json({ error: 'Only .pine, .txt, and .zip files allowed' }, { status: 400 });
  }

  // Max 5MB
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const storagePath = `indicators/${productId}/${file.name}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabaseAdmin.storage
    .from('products')
    .upload(storagePath, buffer, {
      contentType: file.type || 'application/octet-stream',
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 });
  }

  // Get the file URL (private — accessed via download API, not public)
  const fileUrl = storagePath;

  // Update product with file path
  const { error: updateError } = await supabaseAdmin
    .from('products')
    .update({ file_url: fileUrl })
    .eq('id', productId);

  if (updateError) {
    return NextResponse.json({ error: `Product update failed: ${updateError.message}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true, file_url: fileUrl });
}
