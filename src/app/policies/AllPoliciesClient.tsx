'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { C, FONTS, DEPARTMENTS, DEPT_KEYS, type Policy, type DepartmentKey } from '@/lib/design';
import { PolicyRow } from '@/components/PolicyRow';

export function AllPoliciesClient({ policies }: { policies: Policy[] }) {
  const [q, setQ] = useState('');
  const [dept, setDept] = useState<DepartmentKey | 'all'>('all');

  const filtered = useMemo(() => {
    return policies.filter(p => {
      if (dept !== 'all' && p.department !== dept) return false;
      if (q && !(`${p.title} ${p.summary}`).toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [policies, q, dept]);

  return (
    <section style={{ background: C.bone, padding: '60px 40px 120px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ fontFamily: FONTS.sans, fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.red, fontWeight: 700, marginBottom: 20 }}>
          § All policies
        </div>
        <h1 style={{ fontFamily: FONTS.display, fontSize: 'clamp(48px, 6vw, 96px)', lineHeight: 0.92, letterSpacing: '-0.025em', color: C.black, marginBottom: 48 }}>
          Everything <span style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontWeight: 400 }}>on file.</span>
        </h1>

        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search policies…"
          style={{
            width: '100%', maxWidth: 640,
            fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 20,
            padding: '14px 0',
            border: 'none', borderBottom: `2px solid ${C.black}`,
            background: 'transparent', outline: 'none',
            marginBottom: 24,
          }}
        />

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
          <FilterChip active={dept === 'all'} onClick={() => setDept('all')} bg={C.black} fg="#fff">
            All ({policies.length})
          </FilterChip>
          {DEPT_KEYS.map(k => {
            const count = policies.filter(p => p.department === k).length;
            if (count === 0) return null;
            const d = DEPARTMENTS[k];
            return (
              <FilterChip key={k} active={dept === k} onClick={() => setDept(k)} bg={d.color} fg={d.fg}>
                {d.name} ({count})
              </FilterChip>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '80px 40px', textAlign: 'center', background: C.paper }}>
            <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 22, color: 'rgba(0,0,0,0.5)' }}>
              No policies match.
            </div>
            {policies.length === 0 && (
              <Link href="/admin/upload" style={{
                display: 'inline-block', marginTop: 32,
                background: C.black, color: C.yellow, padding: '18px 28px',
                fontFamily: FONTS.display, fontSize: 14, letterSpacing: '0.04em',
                textTransform: 'uppercase', textDecoration: 'none',
              }}>+ Upload your first policy →</Link>
            )}
          </div>
        ) : (
          <div>
            {filtered.map(p => <PolicyRow key={p.id} policy={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}

function FilterChip({ active, onClick, bg, fg, children }: { active: boolean; onClick: () => void; bg: string; fg: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      padding: '10px 16px',
      background: active ? bg : 'transparent',
      color: active ? fg : C.black,
      border: `2px solid ${active ? bg : C.black}`,
      fontFamily: FONTS.sans, fontSize: 12, letterSpacing: '0.1em',
      textTransform: 'uppercase', fontWeight: 700,
      cursor: 'pointer',
    }}>{children}</button>
  );
}
