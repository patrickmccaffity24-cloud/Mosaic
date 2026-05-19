import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { C, FONTS, DEPARTMENTS, type Policy } from '@/lib/design';
import { SectionHead } from '@/components/SectionHead';

export const dynamic = 'force-dynamic';

export default async function PolicyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: policy } = await supabase
    .from('policies')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!policy) notFound();

  const p = policy as Policy;
  const dept = DEPARTMENTS[p.department];

  return (
    <>
      <div style={{ background: C.bone, padding: '24px 40px 0', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{
          fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase',
          color: 'rgba(0,0,0,0.5)', fontWeight: 500, fontFamily: FONTS.sans,
        }}>
          <Link href="/policies" style={{ color: dept.color, fontWeight: 700, textDecoration: 'none' }}>All policies</Link>
          <span style={{ margin: '0 10px', opacity: 0.4 }}>/</span>
          <Link href={`/departments/${dept.slug}`} style={{ color: dept.color, fontWeight: 700, textDecoration: 'none' }}>{dept.name}</Link>
          <span style={{ margin: '0 10px', opacity: 0.4 }}>/</span>
          {p.title}
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '48px 40px 64px' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
          <Tag bg={dept.color} fg={dept.fg}>{dept.name}</Tag>
          {(p.tags || []).map((t, i) => <Tag key={i} outline>{t}</Tag>)}
        </div>
        <h1 style={{
          fontFamily: FONTS.display, fontSize: 'clamp(48px, 7vw, 112px)',
          lineHeight: 0.92, letterSpacing: '-0.025em', color: C.black,
          marginBottom: 36, maxWidth: 1100,
        }}>{p.title}</h1>
        <div style={{
          display: 'flex', gap: 36, flexWrap: 'wrap',
          padding: '24px 0',
          borderTop: `2px solid ${C.black}`, borderBottom: `2px solid ${C.black}`,
        }}>
          <Meta k="Adopted" v={p.adopted_date || 'Not specified'} />
          <Meta k="Owner" v={dept.name} />
          <Meta k="Length" v={`${p.length_pages || '—'} pages · ${(p.clauses || []).length} clauses`} />
          <Meta k="Applies to" v={p.applies_to || 'All staff'} />
          <Meta k="Approved by" v="Ang Adamiak" />
        </div>
      </div>

      <section style={{ background: C.yellow, padding: '80px 40px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.black, fontWeight: 700, marginBottom: 24 }}>
            The Short Version
          </div>
          <p style={{
            fontFamily: FONTS.serif, fontStyle: 'italic',
            fontSize: 'clamp(24px, 3vw, 40px)',
            lineHeight: 1.2, color: C.black, maxWidth: 1100, letterSpacing: '-0.01em',
          }}>{p.summary}</p>
        </div>
      </section>

      <section style={{ background: C.bone, padding: '100px 40px 80px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <SectionHead eyebrow="§ Clauses" title="The fine" italicWord="print." color={dept.color} />
          <div style={{ marginTop: 56 }}>
            {(p.clauses || []).map((cl, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '140px 1fr', gap: 40,
                padding: '36px 0',
                borderTop: i === 0 ? '1px solid rgba(0,0,0,0.15)' : 'none',
                borderBottom: '1px solid rgba(0,0,0,0.15)',
              }}>
                <div style={{ fontFamily: FONTS.display, fontSize: 'clamp(36px, 4vw, 60px)', lineHeight: 0.9, letterSpacing: '-0.02em' }}>§ {i + 1}</div>
                <div style={{ maxWidth: 880 }}>
                  <h3 style={{ fontFamily: FONTS.display, fontSize: 'clamp(24px, 2.6vw, 36px)', lineHeight: 1.1, letterSpacing: '-0.01em', marginBottom: 16 }}>{cl.title}</h3>
                  <p style={{ fontSize: 16, color: 'rgba(0,0,0,0.82)', lineHeight: 1.7, marginBottom: 14, fontFamily: FONTS.sans, whiteSpace: 'pre-wrap' }}>{cl.text}</p>
                  {cl.callout && (
                    <div style={{ background: C.paper, padding: '16px 20px', borderLeft: `4px solid ${dept.color}`, marginTop: 16 }}>
                      <strong style={{ fontFamily: FONTS.display, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Note</strong>
                      <span style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 15, color: C.black }}>{cl.callout}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SourceSection policy={p} />

      <section style={{ background: C.cream, padding: '60px 40px' }}>
        <div style={{
          maxWidth: 1400, margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: 16, flexWrap: 'wrap',
        }}>
          <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 16, color: 'rgba(0,0,0,0.6)' }}>
            Last updated {new Date(p.updated_at).toLocaleString()}
          </div>
          <Link href={`/departments/${dept.slug}`} style={{
            background: 'transparent', color: C.black, padding: '14px 24px',
            border: `2px solid ${C.black}`,
            fontFamily: FONTS.display, fontSize: 12, letterSpacing: '0.04em',
            textTransform: 'uppercase', textDecoration: 'none',
          }}>← Back to {dept.name}</Link>
        </div>
      </section>
    </>
  );
}

async function SourceSection({ policy }: { policy: Policy }) {
  // Generate a signed URL for the source PDF if it's in storage
  let signedUrl: string | null = null;
  if (policy.source_storage_path) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.storage
      .from('policy-sources')
      .createSignedUrl(policy.source_storage_path, 60 * 60); // 1 hour
    signedUrl = data?.signedUrl || null;
  }

  return (
    <section style={{ background: C.black, color: '#fff', padding: '80px 40px' }}>
      <div style={{
        maxWidth: 1400, margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 60, alignItems: 'center',
      }}>
        <div>
          <div style={{ fontFamily: FONTS.sans, fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.lime, fontWeight: 700, marginBottom: 18 }}>§ Source</div>
          <h2 style={{ fontFamily: FONTS.display, fontSize: 'clamp(32px, 4vw, 52px)', lineHeight: 0.95, letterSpacing: '-0.02em', color: '#fff' }}>
            This is a <span style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontWeight: 400, color: C.lime }}>summary.</span>
          </h2>
          <p style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 17, color: 'rgba(255,255,255,0.6)', marginTop: 18, lineHeight: 1.6 }}>
            The full text is in the original PDF. In any conflict between this page and the source document, the source document governs.
          </p>
        </div>
        {policy.source_filename ? (
          signedUrl ? (
            <a href={signedUrl} target="_blank" rel="noopener noreferrer" style={{ background: C.paper, padding: 32, display: 'flex', gap: 24, alignItems: 'center', textDecoration: 'none', color: C.black }}>
              <div style={{ width: 64, height: 64, background: C.red, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.display, fontSize: 14, letterSpacing: '0.05em', flexShrink: 0 }}>PDF</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONTS.display, fontSize: 16, lineHeight: 1.2, marginBottom: 6 }}>{policy.source_filename}</div>
                <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 13, color: 'rgba(0,0,0,0.6)' }}>Click to open original →</div>
              </div>
            </a>
          ) : (
            <div style={{ background: C.paper, padding: 32, display: 'flex', gap: 24, alignItems: 'center', color: C.black }}>
              <div style={{ width: 64, height: 64, background: C.red, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.display, fontSize: 14, letterSpacing: '0.05em', flexShrink: 0 }}>PDF</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONTS.display, fontSize: 16, lineHeight: 1.2, marginBottom: 6 }}>{policy.source_filename}</div>
                <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 13, color: 'rgba(0,0,0,0.6)' }}>Source file reference</div>
              </div>
            </div>
          )
        ) : null}
      </div>
    </section>
  );
}

function Tag({ bg, fg, outline, children }: { bg?: string; fg?: string; outline?: boolean; children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-block', fontSize: 11, letterSpacing: '0.22em',
      textTransform: 'uppercase', fontWeight: 700, padding: '6px 12px',
      background: outline ? 'transparent' : bg,
      color: outline ? C.black : fg,
      border: `2px solid ${outline ? C.black : bg}`,
      fontFamily: FONTS.sans,
    }}>{children}</span>
  );
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.5)', fontWeight: 700, fontFamily: FONTS.sans }}>{k}</span>
      <span style={{ fontFamily: FONTS.display, fontSize: 16, color: C.black, letterSpacing: '-0.01em' }}>{v}</span>
    </div>
  );
}
