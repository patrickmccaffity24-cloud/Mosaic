import { C, FONTS } from '@/lib/design';

export function SectionHead({
  eyebrow,
  title,
  italicWord,
  color,
}: {
  eyebrow: string;
  title: string;
  italicWord?: string;
  color?: string;
}) {
  return (
    <>
      <div style={{
        fontFamily: FONTS.sans, fontSize: 12, letterSpacing: '0.3em',
        textTransform: 'uppercase', color: color || C.red,
        fontWeight: 700, marginBottom: 14,
      }}>{eyebrow}</div>
      <h2 style={{
        fontFamily: FONTS.display,
        fontSize: 'clamp(36px, 4vw, 64px)',
        lineHeight: 0.95, letterSpacing: '-0.02em',
        color: C.black,
      }}>
        {title}{italicWord && <> <span style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontWeight: 400 }}>{italicWord}</span></>}
      </h2>
    </>
  );
}
