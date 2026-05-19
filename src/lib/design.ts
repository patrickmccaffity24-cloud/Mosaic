// Design tokens for the Mosaic Policy Portal
export const C = {
  black: '#0A0A0A',
  ink: '#1A1A1A',
  bone: '#F5F1EA',
  cream: '#EEE7D6',
  paper: '#FFFFFF',
  blue: '#1851A8',
  red: '#DC2626',
  green: '#5BB91E',
  yellow: '#F5D318',
  pink: '#E91E63',
  lime: '#A6D04A',
  orange: '#F57C00',
  purple: '#7B2D8E',
  teal: '#0FAFA5',
} as const;

export const FONTS = {
  display: "'Archivo Black', Impact, sans-serif",
  serif: "'Fraunces', Georgia, serif",
  sans: "'DM Sans', system-ui, sans-serif",
} as const;

export type DepartmentKey =
  | 'HR' | 'Admin' | 'Finance' | 'Development'
  | 'Programs' | 'Productions' | 'Operations';

export interface DepartmentMeta {
  key: DepartmentKey;
  name: string;
  abbr: string;
  color: string;
  fg: string;
  email: string;
  slug: string;
}

export const DEPARTMENTS: Record<DepartmentKey, DepartmentMeta> = {
  HR:          { key: 'HR',          name: 'Human Resources', abbr: 'HR', color: C.blue,   fg: '#fff',     email: 'hr@mosaicdetroit.org',          slug: 'hr' },
  Admin:       { key: 'Admin',       name: 'Administration',  abbr: 'AD', color: C.red,    fg: '#fff',     email: 'admin@mosaicdetroit.org',       slug: 'admin' },
  Finance:     { key: 'Finance',     name: 'Finance',         abbr: 'FN', color: C.green,  fg: '#fff',     email: 'finance@mosaicdetroit.org',     slug: 'finance' },
  Development: { key: 'Development', name: 'Development',     abbr: 'DV', color: C.orange, fg: '#fff',     email: 'development@mosaicdetroit.org', slug: 'development' },
  Programs:    { key: 'Programs',    name: 'Programs',        abbr: 'PG', color: C.yellow, fg: C.black,    email: 'programs@mosaicdetroit.org',    slug: 'programs' },
  Productions: { key: 'Productions', name: 'Productions',     abbr: 'PR', color: C.purple, fg: '#fff',     email: 'productions@mosaicdetroit.org', slug: 'productions' },
  Operations:  { key: 'Operations',  name: 'Operations',      abbr: 'OP', color: C.teal,   fg: '#fff',     email: 'operations@mosaicdetroit.org',  slug: 'operations' },
};

export const DEPT_KEYS: DepartmentKey[] = [
  'HR','Admin','Finance','Development','Programs','Productions','Operations',
];

export function deptBySlug(slug: string): DepartmentMeta | undefined {
  return Object.values(DEPARTMENTS).find(d => d.slug === slug);
}

export interface Clause {
  title: string;
  text: string;
  callout?: string | null;
}

export interface Policy {
  id: string;
  slug: string;
  title: string;
  department: DepartmentKey;
  summary: string;
  clauses: Clause[];
  tags: string[];
  adopted_date: string | null;
  applies_to: string | null;
  length_pages: number | null;
  source_filename: string | null;
  source_storage_path: string | null;
  status: 'draft' | 'pending_review' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export function slugify(text: string): string {
  const base = (text || 'policy')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
  return base || 'policy';
}
