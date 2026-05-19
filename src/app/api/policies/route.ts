import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient, createSupabaseAdminClient } from '@/lib/supabase-server';
import { slugify, type DepartmentKey } from '@/lib/design';
import type { ExtractedPolicy } from '@/lib/anthropic';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  // Auth check
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  let formData: FormData;
  try { formData = await req.formData(); }
  catch { return NextResponse.json({ error: 'Invalid form data' }, { status: 400 }); }

  const pdf = formData.get('pdf');
  const rawData = formData.get('data');
  if (!(pdf instanceof File) || typeof rawData !== 'string') {
    return NextResponse.json({ error: 'Missing pdf or data' }, { status: 400 });
  }

  let data: ExtractedPolicy;
  try { data = JSON.parse(rawData); }
  catch { return NextResponse.json({ error: 'Invalid JSON in data' }, { status: 400 }); }

  // Generate a unique slug
  let slug = slugify(data.title);
  const { data: existing } = await supabase.from('policies').select('slug').like('slug', `${slug}%`);
  const taken = new Set((existing || []).map((r: any) => r.slug));
  if (taken.has(slug)) {
    let n = 2;
    while (taken.has(`${slug}-${n}`)) n++;
    slug = `${slug}-${n}`;
  }

  // Upload PDF to storage (use admin client to bypass RLS for the upload)
  const admin = createSupabaseAdminClient();
  const ext = (pdf.name.split('.').pop() || 'pdf').toLowerCase();
  const storagePath = `${slug}-${Date.now()}.${ext}`;
  const arrayBuf = await pdf.arrayBuffer();
  const { error: uploadErr } = await admin.storage
    .from('policy-sources')
    .upload(storagePath, arrayBuf, { contentType: 'application/pdf', upsert: false });
  if (uploadErr) {
    return NextResponse.json({ error: `Storage upload failed: ${uploadErr.message}` }, { status: 500 });
  }

  // Insert the policy row
  const { data: inserted, error: insertErr } = await supabase
    .from('policies')
    .insert({
      slug,
      title: data.title,
      department: data.department,
      summary: data.summary,
      clauses: data.clauses,
      tags: data.tags || [],
      adopted_date: data.adopted_date || null,
      applies_to: data.applies_to || null,
      length_pages: data.length_pages || null,
      source_filename: pdf.name,
      source_storage_path: storagePath,
      status: 'draft',
      created_by: user.id,
    })
    .select()
    .single();

  if (insertErr) {
    // Best-effort: delete the orphaned PDF
    await admin.storage.from('policy-sources').remove([storagePath]).catch(() => {});
    return NextResponse.json({ error: `Insert failed: ${insertErr.message}` }, { status: 500 });
  }

  return NextResponse.json({ id: inserted.id, slug: inserted.slug });
}
