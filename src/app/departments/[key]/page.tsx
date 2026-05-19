import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { C, FONTS, deptBySlug, type Policy } from '@/lib/design';
import { PolicyRow } from '@/components/PolicyRow';

export const dynamic = 'force-dynamic';

export default async function DepartmentPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const dept = deptBySlug(key);
  if (!dept) notFound();

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from('policies')
    .select('*')
    .eq('department', dept.key)
    .eq('status', 'published')
    .order('title');
  const list = (data || []) as Policy[];

  return (
    <>
      <section style={{ background: dept.color, color: dept.fg, padding: '80px 40px 100px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '180px 1fr', gap: 60, alignItems: 'end' }}>
          <div style={{
            background: dept.fg === '#fff' ? '#fff' : C.black,
            color: dept.color,
            width: 180, height: 180,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FONTS.display, fontSize: 84, letterSpacing: '-0.04em', lineHeight: 1,
          }}>{dept.abbr}</div>
          <div>
            <div style={{
              fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase',
              color: dept.fg === '#fff' ? C.yellow : C.red,
              fontWeight: 700, marginBottom: 18, fontFamily: FONTS.sans,
            }}>§ Department</div>
            <h1 style={{
              fontFamily: FONTS.display, fontSize: 'clamp(56px, 9vw, 132px)',
              lineHeight: 0.92, letterSpacing: '-0.025em', color: dept.fg, marginBottom: 24,
            }}>{dept.name}.</h1>
            <div style={{
              fontSize: 16, fontFamily: FONTS.serif, fontStyle: 'italic',
              color: dept.fg === '#fff' ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.75)',
            }}>
              {list.length} {list.length === 1 ? 'policy' : 'policies'} on file
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: C.bone, padding: '80px 40px 120px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          {list.length === 0 ? (
            <div style={{ padding: '60px 40px', textAlign: 'center', background: C.paper }}>
              <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 22, color: 'rgba(0,0,0,0.5)', marginBottom: 24 }}>
                No {dept.name} policies yet.
              </div>
              <Link href="/admin/upload" style={{
                background: C.black, color: C.yellow, padding: '18px 28px',
                fontFamily: FONTS.display, fontSize: 14, letterSpacing: '0.04em',
                textTransform: 'uppercase', textDecoration: 'none',
              }}>+ Upload a policy →</Link>
            </div>
          ) : (
            <div>
              {list.map(p => <PolicyRow key={p.id} policy={p} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
