import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { C, FONTS, DEPARTMENTS, DEPT_KEYS, type Policy } from '@/lib/design';

export const dynamic = 'force-dynamic';

export default async function DepartmentsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from('policies')
    .select('department')
    .eq('status', 'published');
  const counts = new Map<string, number>();
  (data || []).forEach((row: any) => {
    counts.set(row.department, (counts.get(row.department) || 0) + 1);
  });

  return (
    <section style={{ background: C.bone, padding: '60px 40px 120px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ fontFamily: FONTS.sans, fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.red, fontWeight: 700, marginBottom: 20 }}>§ Departments</div>
        <h1 style={{ fontFamily: FONTS.display, fontSize: 'clamp(48px, 6vw, 96px)', lineHeight: 0.92, letterSpacing: '-0.025em', color: C.black, marginBottom: 48 }}>
          Browse by <span style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontWeight: 400 }}>department.</span>
        </h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 8 }}>
          {DEPT_KEYS.map(key => {
            const dept = DEPARTMENTS[key];
            const count = counts.get(key) || 0;
            return (
              <Link key={key} href={`/departments/${dept.slug}`} style={{
                background: dept.color, color: dept.fg,
                padding: '48px 32px', textDecoration: 'none',
                display: 'flex', flexDirection: 'column', gap: 16, minHeight: 220,
                fontFamily: FONTS.sans,
              }}>
                <div style={{ fontFamily: FONTS.display, fontSize: 56, letterSpacing: '-0.03em', lineHeight: 1 }}>{dept.abbr}</div>
                <div style={{ fontFamily: FONTS.display, fontSize: 24, letterSpacing: '-0.01em', lineHeight: 1.1, marginTop: 'auto' }}>{dept.name}</div>
                <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700, opacity: 0.85 }}>
                  {count} {count === 1 ? 'policy' : 'policies'}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
