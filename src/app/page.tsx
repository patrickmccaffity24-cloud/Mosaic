import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { C, FONTS, DEPARTMENTS, DEPT_KEYS, type Policy } from '@/lib/design';
import { PolicyRow } from '@/components/PolicyRow';
import { SectionHead } from '@/components/SectionHead';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from('policies')
    .select('*')
    .eq('status', 'published')
    .order('updated_at', { ascending: false });

  const policies = (data || []) as Policy[];
  const total = policies.length;

  return (
    <>
      <Hero />
      {total === 0 ? <EmptyState /> : <PopulatedHome policies={policies} total={total} />}
    </>
  );
}

function Hero() {
  return (
    <section style={{ background: '#000', color: '#fff', padding: '120px 40px 140px', textAlign: 'center' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{
          fontFamily: FONTS.sans, fontSize: 12, letterSpacing: '0.3em',
          textTransform: 'uppercase', color: C.lime, fontWeight: 700, marginBottom: 28,
        }}>§ Mosaic Youth Theatre of Detroit</div>
        <h1 style={{
          fontFamily: FONTS.display,
          fontSize: 'clamp(56px, 9vw, 140px)',
          lineHeight: 0.9, letterSpacing: '-0.025em',
          color: '#fff', marginBottom: 36,
        }}>
          Every policy. Every{' '}
          <span style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontWeight: 400, color: C.yellow }}>procedure.</span>
        </h1>
        <p style={{
          fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 22,
          color: 'rgba(255,255,255,0.7)',
          maxWidth: 720, margin: '0 auto', lineHeight: 1.5,
        }}>
          One database, plain English, with the source PDFs one click away.
        </p>
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <section style={{ background: C.bone, padding: '120px 40px 140px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.red, fontWeight: 700, marginBottom: 24 }}>
          § Empty database
        </div>
        <h2 style={{ fontFamily: FONTS.display, fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 0.95, letterSpacing: '-0.02em', marginBottom: 32 }}>
          No policies <span style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontWeight: 400 }}>yet.</span>
        </h2>
        <p style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 20, color: 'rgba(0,0,0,0.6)', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.5 }}>
          Sign in as an admin and upload your first Mosaic policy PDF.
        </p>
        <Link href="/admin/upload" style={{
          background: C.black, color: C.yellow, padding: '22px 36px',
          fontFamily: FONTS.display, fontSize: 16, letterSpacing: '0.04em',
          textTransform: 'uppercase', textDecoration: 'none',
        }}>+ Upload your first policy →</Link>
      </div>
    </section>
  );
}

function PopulatedHome({ policies, total }: { policies: Policy[]; total: number }) {
  return (
    <>
      <section style={{ background: C.yellow, padding: '60px 40px' }}>
        <div style={{
          maxWidth: 1400, margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 32,
        }}>
          <div style={{
            fontFamily: FONTS.display, fontSize: 'clamp(40px, 5vw, 72px)',
            lineHeight: 0.95, letterSpacing: '-0.02em', color: C.black,
          }}>
            <span style={{ color: C.red }}>{total}</span> {total === 1 ? 'policy' : 'policies'}{' '}
            <span style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontWeight: 400 }}>in the database.</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/policies" style={btnPrimary}>Browse all →</Link>
            <Link href="/admin/upload" style={btnSecondary}>+ Add another</Link>
          </div>
        </div>
      </section>

      <section style={{ background: C.bone, padding: '100px 40px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <SectionHead eyebrow="§ Recent" title="Most recently" italicWord="added." />
          <div style={{ marginTop: 48 }}>
            {policies.slice(0, 6).map(p => <PolicyRow key={p.id} policy={p} />)}
          </div>
        </div>
      </section>

      <section style={{ background: C.cream, padding: '100px 40px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <SectionHead eyebrow="§ Departments" title="Where Mosaic" italicWord="operates." />
          <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 8 }}>
            {DEPT_KEYS.map(key => {
              const dept = DEPARTMENTS[key];
              const count = policies.filter(p => p.department === key).length;
              return (
                <Link
                  key={key}
                  href={`/departments/${dept.slug}`}
                  style={{
                    background: count ? dept.color : C.paper,
                    color: count ? dept.fg : C.black,
                    padding: '32px 28px',
                    textDecoration: 'none',
                    display: 'flex', flexDirection: 'column', gap: 12, minHeight: 160,
                    fontFamily: FONTS.sans,
                  }}
                >
                  <div style={{ fontFamily: FONTS.display, fontSize: 36, letterSpacing: '-0.02em', lineHeight: 1 }}>{dept.abbr}</div>
                  <div style={{ fontFamily: FONTS.display, fontSize: 20, letterSpacing: '-0.01em', lineHeight: 1.1, marginTop: 'auto' }}>{dept.name}</div>
                  <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700, opacity: 0.8 }}>
                    {count} {count === 1 ? 'policy' : 'policies'}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

const btnPrimary = {
  background: C.black, color: C.yellow, padding: '18px 28px',
  fontFamily: FONTS.display, fontSize: 14, letterSpacing: '0.04em',
  textTransform: 'uppercase' as const, textDecoration: 'none',
};
const btnSecondary = {
  background: 'transparent', color: C.black, padding: '18px 28px',
  border: `2px solid ${C.black}`,
  fontFamily: FONTS.display, fontSize: 14, letterSpacing: '0.04em',
  textTransform: 'uppercase' as const, textDecoration: 'none',
};
