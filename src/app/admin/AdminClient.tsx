'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import { C, FONTS, type Policy } from '@/lib/design';

export function AdminSignOut() {
  const router = useRouter();
  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }
  return (
    <button onClick={signOut} style={{
      background: 'transparent', color: C.black, padding: '14px 22px',
      border: `2px solid ${C.black}`,
      fontFamily: FONTS.display, fontSize: 13, letterSpacing: '0.04em',
      textTransform: 'uppercase', cursor: 'pointer',
    }}>Sign out</button>
  );
}

export function AdminActions({ policy }: { policy: Policy }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  async function setStatus(status: Policy['status']) {
    setBusy(true);
    await fetch(`/api/policies/${policy.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setBusy(false);
    router.refresh();
  }

  async function del() {
    setBusy(true);
    await fetch(`/api/policies/${policy.id}`, { method: 'DELETE' });
    setBusy(false);
    router.refresh();
  }

  if (confirmDel) {
    return (
      <div style={{ display: 'flex', gap: 4 }}>
        <button onClick={del} disabled={busy} style={btn(C.red, '#fff')}>Confirm delete</button>
        <button onClick={() => setConfirmDel(false)} style={btnOutline}>Cancel</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {policy.status === 'draft' && (
        <button onClick={() => setStatus('published')} disabled={busy} style={btn(C.black, C.yellow)}>Publish</button>
      )}
      {policy.status === 'pending_review' && (
        <button onClick={() => setStatus('published')} disabled={busy} style={btn(C.green, '#fff')}>Approve & publish</button>
      )}
      {policy.status === 'published' && (
        <button onClick={() => setStatus('archived')} disabled={busy} style={btnOutline}>Archive</button>
      )}
      {policy.status === 'archived' && (
        <button onClick={() => setStatus('published')} disabled={busy} style={btn(C.green, '#fff')}>Restore</button>
      )}
      <button onClick={() => setConfirmDel(true)} style={btnOutlineRed}>Delete</button>
    </div>
  );
}

function btn(bg: string, fg: string) {
  return {
    background: bg, color: fg, padding: '8px 12px', border: 'none',
    fontFamily: FONTS.sans, fontSize: 10, letterSpacing: '0.18em',
    textTransform: 'uppercase' as const, fontWeight: 700, cursor: 'pointer',
  };
}
const btnOutline = {
  background: 'transparent', color: C.black, padding: '8px 12px',
  border: `1.5px solid ${C.black}`,
  fontFamily: FONTS.sans, fontSize: 10, letterSpacing: '0.18em',
  textTransform: 'uppercase' as const, fontWeight: 700, cursor: 'pointer',
};
const btnOutlineRed = {
  ...btnOutline, color: C.red, borderColor: C.red,
};
