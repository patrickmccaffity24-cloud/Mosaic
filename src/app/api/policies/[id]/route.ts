import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient, createSupabaseAdminClient } from '@/lib/supabase-server';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { id } = await params;
  let body;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  // Whitelist updatable fields
  const allowed = ['title', 'department', 'summary', 'clauses', 'tags', 'adopted_date', 'applies_to', 'length_pages', 'status'];
  const update: Record<string, any> = {};
  for (const k of allowed) if (k in body) update[k] = body[k];

  const { error } = await supabase.from('policies').update(update).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { id } = await params;

  // Get the storage path so we can clean up the PDF too
  const { data: existing } = await supabase
    .from('policies')
    .select('source_storage_path')
    .eq('id', id)
    .single();

  const { error } = await supabase.from('policies').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (existing?.source_storage_path) {
    const admin = createSupabaseAdminClient();
    await admin.storage.from('policy-sources').remove([existing.source_storage_path]).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
