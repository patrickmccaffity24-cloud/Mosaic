'use client';

import Link from 'next/link';
import { useState } from 'react';
import { C, FONTS, DEPARTMENTS, type Policy } from '@/lib/design';

export function PolicyRow({ policy }: { policy: Policy }) {
  const [hover, setHover] = useState(false);
  const dept = DEPARTMENTS[policy.department];

  return (
    <Link
      href={`/policies/${policy.slug}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '70px 1fr 200px 60px',
        gap: 24,
        padding: '24px 28px',
        alignItems: 'center',
        borderTop: '1px solid rgba(0,0,0,0.15)',
        borderBottom: '1px solid rgba(0,0,0,0.15)',
        background: hover ? dept.color : 'transparent',
        color: hover ? dept.fg : C.black,
        textDecoration: 'none',
        transition: 'all 0.2s',
        fontFamily: FONTS.sans,
      }}
    >
      <span style={{ fontFamily: FONTS.display, fontSize: 14, letterSpacing: '0.04em' }}>{dept.abbr}</span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: FONTS.display, fontSize: 20, lineHeight: 1.1, letterSpacing: '-0.01em', marginBottom: 4 }}>
          {policy.title}
        </div>
        <div style={{
          fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 14,
          color: hover ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.55)',
          lineHeight: 1.4,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{policy.summary}</div>
      </div>
      <div style={{
        fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
        fontWeight: 700, opacity: hover ? 0.85 : 0.5,
      }}>
        {(policy.clauses || []).length} clauses · {policy.length_pages || '—'} pages
      </div>
      <div style={{
        fontFamily: FONTS.display, fontSize: 22, textAlign: 'right',
        transform: hover ? 'translateX(8px)' : 'none',
        transition: 'transform 0.2s',
      }}>→</div>
    </Link>
  );
}
