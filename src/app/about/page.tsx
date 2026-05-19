import { C, FONTS } from '@/lib/design';

export default function AboutPage() {
  return (
    <section style={{ background: C.bone, padding: '80px 40px 120px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ fontFamily: FONTS.sans, fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.red, fontWeight: 700, marginBottom: 20 }}>§ About</div>
        <h1 style={{ fontFamily: FONTS.display, fontSize: 'clamp(48px, 6vw, 96px)', lineHeight: 0.92, letterSpacing: '-0.025em', color: C.black, marginBottom: 48 }}>
          What this <span style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontWeight: 400 }}>is.</span>
        </h1>
        <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 22, color: C.black, lineHeight: 1.55, maxWidth: 720 }}>
          <p style={{ marginBottom: 24 }}>The Mosaic Policy Portal is a single place where every Mosaic policy, procedure, and handbook lives — in plain English, with the original PDF one click away.</p>
          <p style={{ marginBottom: 24 }}>An admin drops a PDF into the upload page. Claude reads it, rewrites it for clarity, and saves the result. Ang Adamiak reviews and approves before anything is considered authoritative.</p>
          <p style={{ marginBottom: 24 }}>The original document always governs. This portal is a summary tool, not a replacement.</p>
        </div>
        <div style={{ marginTop: 64, padding: 32, background: C.black, color: '#fff', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.lime, fontWeight: 700, marginBottom: 10, fontFamily: FONTS.sans }}>Built by</div>
            <div style={{ fontFamily: FONTS.display, fontSize: 22 }}>Patrick W. McCaffity</div>
            <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>BFA Theatre Design & Production, University of Michigan</div>
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.lime, fontWeight: 700, marginBottom: 10, fontFamily: FONTS.sans }}>Approved by</div>
            <div style={{ fontFamily: FONTS.display, fontSize: 22 }}>Ang Adamiak</div>
            <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>Deputy Director, Mosaic Youth Theatre of Detroit</div>
          </div>
        </div>
      </div>
    </section>
  );
}
