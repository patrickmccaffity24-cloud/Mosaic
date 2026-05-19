'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { C, FONTS } from '@/lib/design';

function Tile({ char, bg }: { char: string; bg: string }) {
  return (
    <div style={{
      width: 38, height: 38,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: FONTS.display, fontSize: 26, color: C.yellow,
      background: bg,
    }}>{char}</div>
  );
}

export function Header() {
  const pathname = usePathname();
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header style={{
      background: '#000',
      padding: '18px 40px 22px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 100,
      flexWrap: 'wrap', gap: 16,
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none' }}>
        <div style={{ display: 'flex' }}>
          <Tile char="M" bg={C.blue} />
          <Tile char="O" bg={C.red} />
          <Tile char="S" bg={C.green} />
          <Tile char="A" bg={C.red} />
          <Tile char="I" bg={C.green} />
          <Tile char="C" bg={C.blue} />
        </div>
        <div style={{
          fontFamily: FONTS.display, fontSize: 11, color: '#fff',
          letterSpacing: '0.18em', lineHeight: 1.2,
          paddingLeft: 12, borderLeft: '1px solid rgba(255,255,255,0.25)',
        }}>POLICY<br />PORTAL</div>
      </Link>
      <nav style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
        <NavLink href="/policies" active={isActive('/policies')}>All Policies</NavLink>
        <NavLink href="/departments" active={isActive('/departments')}>Departments</NavLink>
        <NavLink href="/about" active={isActive('/about')}>About</NavLink>
        <NavLink href="/admin/upload" active={isActive('/admin/upload')} pill>+ Upload</NavLink>
      </nav>
    </header>
  );
}

function NavLink({ href, active, pill, children }: { href: string; active: boolean; pill?: boolean; children: React.ReactNode }) {
  if (pill) {
    return (
      <Link href={href} style={{
        background: active ? C.pink : C.red,
        padding: '10px 18px', color: '#fff', fontWeight: 700,
        textDecoration: 'none', fontSize: 12, letterSpacing: '0.2em',
        textTransform: 'uppercase', fontFamily: FONTS.sans,
      }}>{children}</Link>
    );
  }
  return (
    <Link href={href} style={{
      color: active ? C.lime : '#fff',
      textDecoration: 'none', fontSize: 12, letterSpacing: '0.2em',
      fontWeight: 500, textTransform: 'uppercase',
      padding: '8px 0', fontFamily: FONTS.sans,
      borderBottom: active ? `2px solid ${C.lime}` : '2px solid transparent',
    }}>{children}</Link>
  );
}
