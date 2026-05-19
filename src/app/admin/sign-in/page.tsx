'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import { C, FONTS } from '@/lib/design';

function SignInForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get('next') || '/admin';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <section style={{ background: C.bone, padding: '60px 40px 120px', minHeight: '60vh' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <div style={{ fontFamily: FONTS.sans, fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.red, fontWeight: 700, marginBottom: 20 }}>§ Admin sign-in</div>
        <h1 style={{ fontFamily: FONTS.display, fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 0.92, letterSpacing: '-0.025em', color: C.black, marginBottom: 36 }}>
          Sign <span style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontWeight: 400 }}>in.</span>
        </h1>
        <form onSubmit={onSubmit} style={{ background: C.paper, padding: 32 }}>
          <div style={{ marginBottom: 20 }}>
            <div style={fieldLabel}>Email</div>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={input} autoComplete="email" />
          </div>
          <div style={{ marginBottom: 24 }}>
            <div style={fieldLabel}>Password</div>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={input} autoComplete="current-password" />
          </div>
          {error && (
            <div style={{ background: '#FEE', color: C.red, padding: 12, marginBottom: 16, fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 14, borderLeft: `4px solid ${C.red}` }}>
              {error}
            </div>
          )}
          <button type="submit" disabled={busy} style={{
            ...btn, opacity: busy ? 0.6 : 1, cursor: busy ? 'wait' : 'pointer', width: '100%',
          }}>{busy ? 'Signing in…' : 'Sign in →'}</button>
        </form>
        <div style={{ marginTop: 24, fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 14, color: 'rgba(0,0,0,0.6)' }}>
          Don't have an account? An existing admin must create one for you in the Supabase dashboard.
        </div>
      </div>
    </section>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}

const fieldLabel = { fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: 'rgba(0,0,0,0.6)', fontWeight: 700, marginBottom: 8, fontFamily: FONTS.sans };
const input = { width: '100%', padding: '12px 14px', border: `2px solid rgba(0,0,0,0.2)`, background: '#fff', fontFamily: FONTS.sans, fontSize: 16, color: C.black, outline: 'none' };
const btn = { background: C.black, color: C.yellow, padding: '16px 24px', border: 'none', fontFamily: FONTS.display, fontSize: 14, letterSpacing: '0.04em', textTransform: 'uppercase' as const };
