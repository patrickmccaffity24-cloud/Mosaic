import { C } from '@/lib/design';

export function UtilBar() {
  return (
    <div style={{
      background: '#000', color: '#fff',
      padding: '10px 40px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontSize: 11, letterSpacing: '0.08em',
      flexWrap: 'wrap', gap: 12,
    }}>
      <span>PHONE: 313.872.6910</span>
      <span style={{ color: C.lime, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
        Database created by Patrick W. McCaffity
      </span>
    </div>
  );
}
