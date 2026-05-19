import { C, FONTS } from '@/lib/design';

export function Footer() {
  return (
    <footer style={{ background: C.black, padding: '60px 40px 40px' }}>
      <div style={{
        maxWidth: 1400, margin: '0 auto',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 20,
        fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.4)', fontFamily: FONTS.sans,
      }}>
        <span>© {new Date().getFullYear()} Mosaic Youth Theatre of Detroit</span>
        <span style={{ color: C.lime, fontWeight: 700, letterSpacing: '0.22em' }}>
          Designed & built by Patrick W. McCaffity
        </span>
      </div>
    </footer>
  );
}
