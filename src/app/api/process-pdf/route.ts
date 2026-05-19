import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { extractPolicyFromPDF } from '@/lib/anthropic';

export const maxDuration = 120; // 2 minutes — PDF processing can be slow

export async function POST(req: NextRequest) {
  // Auth check
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  let body;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { pdfBase64 } = body;
  if (!pdfBase64 || typeof pdfBase64 !== 'string') {
    return NextResponse.json({ error: 'Missing pdfBase64' }, { status: 400 });
  }

  try {
    const extracted = await extractPolicyFromPDF(pdfBase64);
    return NextResponse.json(extracted);
  } catch (e: any) {
    console.error('process-pdf error:', e);
    return NextResponse.json({ error: e.message || 'Processing failed' }, { status: 500 });
  }
}
