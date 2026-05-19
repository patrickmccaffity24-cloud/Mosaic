import Link from 'next/link';
import { C, FONTS } from '@/lib/design';

export default function NotFound() {
  return (
    <section style={{ background: C.bone, padding: '120px 40px 140px', textAlign: 'center' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ fontFamily: FONTS.sans, fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.red, fontWeight: 700, marginBottom: 24 }}>
          § 404 / Not found
        </div>
        <h1 style={{ fontFamily: FONTS.display, fontSize: 'clamp(48px, 7vw, 112px)', lineHeight: 0.92, letterSpacing: '-0.025em', color: C.black, marginBottom: 32 }}>
          Page <span style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontWeight: 400 }}>not found.</span>
        </h1>
        <p style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 20, color: 'rgba(0,0,0,0.6)', marginBottom: 40 }}>
          The policy you're looking for either doesn't exist or hasn't been published yet.
        </p>
        <Link href="/" style={{
          background: C.black, color: C.yellow, padding: '18px 28px',
          fontFamily: FONTS.display, fontSize: 14, letterSpacing: '0.04em',
          textTransform: 'uppercase', textDecoration: 'none',
        }}>← Back to the homepage</Link>
      </div>
    </section>
  );
}
