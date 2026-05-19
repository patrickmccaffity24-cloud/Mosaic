import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { C, FONTS, DEPARTMENTS, type Policy } from '@/lib/design';
import { AdminActions, AdminSignOut } from './AdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from('policies')
    .select('*')
    .order('updated_at', { ascending: false });
  const policies = (data || []) as Policy[];

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <section style={{ background: C.bone, padding: '60px 40px 120px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 16, marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.red, fontWeight: 700, marginBottom: 20 }}>§ Admin dashboard</div>
            <h1 style={{ fontFamily: FONTS.display, fontSize: 'clamp(40px, 5vw, 80px)', lineHeight: 0.92, letterSpacing: '-0.025em' }}>
              Manage <span style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontWeight: 400 }}>everything.</span>
            </h1>
            <div style={{ marginTop: 12, fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 14, color: 'rgba(0,0,0,0.6)' }}>
              Signed in as {user?.email}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link href="/admin/upload" style={{
              background: C.black, color: C.yellow, padding: '14px 22px',
              fontFamily: FONTS.display, fontSize: 13, letterSpacing: '0.04em',
              textTransform: 'uppercase', textDecoration: 'none',
            }}>+ Upload</Link>
            <AdminSignOut />
          </div>
        </div>

        {policies.length === 0 ? (
          <div style={{ padding: '60px 40px', textAlign: 'center', background: C.paper }}>
            <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 22, color: 'rgba(0,0,0,0.5)', marginBottom: 24 }}>
              No policies yet.
            </div>
            <Link href="/admin/upload" style={{
              background: C.black, color: C.yellow, padding: '18px 28px',
              fontFamily: FONTS.display, fontSize: 14, letterSpacing: '0.04em',
              textTransform: 'uppercase', textDecoration: 'none',
            }}>+ Upload your first policy →</Link>
          </div>
        ) : (
          <div style={{ background: C.paper }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '60px 1fr 140px 140px 200px',
              gap: 16, padding: '16px 24px',
              borderBottom: `2px solid ${C.black}`,
              fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
              fontWeight: 700, color: 'rgba(0,0,0,0.6)', fontFamily: FONTS.sans,
            }}>
              <div>Dept</div>
              <div>Title</div>
              <div>Status</div>
              <div>Updated</div>
              <div>Actions</div>
            </div>
            {policies.map(p => {
              const dept = DEPARTMENTS[p.department];
              return (
                <div key={p.id} style={{
                  display: 'grid', gridTemplateColumns: '60px 1fr 140px 140px 200px',
                  gap: 16, padding: '20px 24px', alignItems: 'center',
                  borderBottom: '1px solid rgba(0,0,0,0.1)',
                }}>
                  <div style={{ fontFamily: FONTS.display, fontSize: 14, color: dept.color }}>{dept.abbr}</div>
                  <div>
                    <Link href={`/policies/${p.slug}`} style={{ fontFamily: FONTS.display, fontSize: 16, lineHeight: 1.2, color: C.black, textDecoration: 'none' }}>{p.title}</Link>
                    <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.5)', marginTop: 2, fontFamily: FONTS.sans }}>{(p.clauses || []).length} clauses</div>
                  </div>
                  <StatusBadge status={p.status} />
                  <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.6)', fontFamily: FONTS.sans }}>
                    {new Date(p.updated_at).toLocaleDateString()}
                  </div>
                  <AdminActions policy={p} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; fg: string }> = {
    draft:           { bg: 'rgba(0,0,0,0.08)', fg: C.black },
    pending_review:  { bg: C.yellow,            fg: C.black },
    published:       { bg: C.green,             fg: '#fff' },
    archived:        { bg: 'rgba(0,0,0,0.3)',  fg: '#fff' },
  };
  const c = colors[status] || colors.draft;
  return (
    <span style={{
      background: c.bg, color: c.fg,
      padding: '4px 10px', fontSize: 10, letterSpacing: '0.18em',
      textTransform: 'uppercase', fontWeight: 700, fontFamily: FONTS.sans,
      alignSelf: 'start',
    }}>{status.replace('_', ' ')}</span>
  );
}
