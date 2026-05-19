'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { C, FONTS, DEPT_KEYS, DEPARTMENTS, type DepartmentKey } from '@/lib/design';
import type { ExtractedPolicy } from '@/lib/anthropic';

type Phase = 'idle' | 'reading' | 'processing' | 'review' | 'saving' | 'error';

export function UploadFlow() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('idle');
  const [filename, setFilename] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [extracted, setExtracted] = useState<ExtractedPolicy | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(f: File) {
    setFilename(f.name);
    setFile(f);
    setError(null);

    if (f.size > 10 * 1024 * 1024) {
      setError('PDF is over 10MB. Try splitting it or compressing it first.');
      setPhase('error');
      return;
    }
    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
      setError("That file isn't a PDF. Drop a .pdf file.");
      setPhase('error');
      return;
    }

    setPhase('reading');
    try {
      const base64 = await fileToBase64(f);
      setPhase('processing');
      const res = await fetch('/api/process-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfBase64: base64 }),
      });
      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`Processing failed: ${errBody.slice(0, 200)}`);
      }
      const data = (await res.json()) as ExtractedPolicy;
      setExtracted(data);
      setPhase('review');
    } catch (e: any) {
      setError(e.message || 'Something went wrong processing the PDF.');
      setPhase('error');
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  async function onSave() {
    if (!extracted || !file) return;
    setPhase('saving');
    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('data', JSON.stringify(extracted));
      const res = await fetch('/api/policies', { method: 'POST', body: formData });
      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`Save failed: ${errBody.slice(0, 200)}`);
      }
      const { slug } = await res.json();
      router.push(`/policies/${slug}`);
      router.refresh();
    } catch (e: any) {
      setError(e.message);
      setPhase('error');
    }
  }

  return (
    <section style={{ background: C.bone, padding: '60px 40px 120px', minHeight: '70vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ fontFamily: FONTS.sans, fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.red, fontWeight: 700, marginBottom: 20 }}>§ Upload</div>
        <h1 style={{ fontFamily: FONTS.display, fontSize: 'clamp(48px, 6vw, 88px)', lineHeight: 0.92, letterSpacing: '-0.025em', color: C.black, marginBottom: 48 }}>
          Add <span style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontWeight: 400 }}>a</span> policy.
        </h1>

        {phase === 'idle' && (
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            style={{
              border: `3px dashed ${dragOver ? C.red : 'rgba(0,0,0,0.25)'}`,
              background: dragOver ? '#FFF8F5' : C.paper,
              padding: '80px 40px', textAlign: 'center', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontFamily: FONTS.display, fontSize: 28, color: C.black, marginBottom: 16 }}>Drop a PDF here</div>
            <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 17, color: 'rgba(0,0,0,0.55)', marginBottom: 24 }}>
              or click to choose a file from your computer
            </div>
            <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700, color: 'rgba(0,0,0,0.5)' }}>
              PDF · up to 10 MB
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,.pdf"
              style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
          </div>
        )}

        {(phase === 'reading' || phase === 'processing') && (
          <Processing phase={phase} filename={filename} />
        )}

        {phase === 'review' && extracted && (
          <ReviewForm
            data={extracted}
            onChange={setExtracted}
            onSave={onSave}
            onCancel={() => { setPhase('idle'); setExtracted(null); setFile(null); setFilename(''); }}
            filename={filename}
          />
        )}

        {phase === 'saving' && (
          <div style={{ padding: '80px 40px', textAlign: 'center', background: C.paper }}>
            <div style={{ fontFamily: FONTS.display, fontSize: 28 }}>Saving…</div>
            <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 16, color: 'rgba(0,0,0,0.5)', marginTop: 12 }}>
              Uploading the PDF and writing the policy record.
            </div>
          </div>
        )}

        {phase === 'error' && (
          <div style={{ background: C.paper, padding: 48, borderLeft: `6px solid ${C.red}` }}>
            <div style={{ fontFamily: FONTS.display, fontSize: 24, color: C.red, marginBottom: 14 }}>Something went wrong.</div>
            <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 17, color: C.black, marginBottom: 24, whiteSpace: 'pre-wrap' }}>
              {error}
            </div>
            <button onClick={() => { setPhase('idle'); setError(null); }} style={btnPrimary}>Try again</button>
          </div>
        )}
      </div>
    </section>
  );
}

function Processing({ phase, filename }: { phase: Phase; filename: string }) {
  const steps = [
    { label: 'Reading the PDF',              done: true },
    { label: 'Sending to Claude',            done: phase === 'processing' },
    { label: 'Extracting text and structure', done: phase === 'processing' },
    { label: 'Classifying by department',    done: phase === 'processing' },
    { label: 'Writing plain-English summary', done: phase === 'processing' },
    { label: 'Breaking into clauses',        done: phase === 'processing' },
  ];
  return (
    <div style={{ background: C.paper, padding: 48 }}>
      <div style={{ fontFamily: FONTS.display, fontSize: 24, color: C.black, marginBottom: 8 }}>Processing {filename}</div>
      <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 16, color: 'rgba(0,0,0,0.6)', marginBottom: 36 }}>
        Claude is reading the document and structuring it for the portal.
      </div>
      {steps.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '16px 0', borderBottom: i < steps.length - 1 ? '1px solid rgba(0,0,0,0.08)' : 'none' }}>
          <div style={{
            width: 24, height: 24, borderRadius: '50%',
            background: s.done ? C.green : 'rgba(0,0,0,0.15)',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700,
          }}>{s.done ? '✓' : ''}</div>
          <div style={{ fontFamily: FONTS.sans, fontSize: 16, color: s.done ? C.black : 'rgba(0,0,0,0.5)' }}>{s.label}</div>
        </div>
      ))}
      <div style={{ marginTop: 32, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.5)', fontWeight: 700, fontFamily: FONTS.sans }}>
        Running on Claude Sonnet 4 · This may take 30-90 seconds
      </div>
    </div>
  );
}

function ReviewForm({ data, onChange, onSave, onCancel, filename }: {
  data: ExtractedPolicy;
  onChange: (d: ExtractedPolicy) => void;
  onSave: () => void;
  onCancel: () => void;
  filename: string;
}) {
  function update<K extends keyof ExtractedPolicy>(k: K, v: ExtractedPolicy[K]) {
    onChange({ ...data, [k]: v });
  }
  function updateClause(i: number, k: 'title' | 'text' | 'callout', v: string | null) {
    const clauses = [...data.clauses];
    clauses[i] = { ...clauses[i], [k]: v ?? null };
    onChange({ ...data, clauses });
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 40, alignItems: 'start' }}>
      <div style={{ background: C.paper, padding: 40 }}>
        <div style={{ fontFamily: FONTS.sans, fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.red, fontWeight: 700, marginBottom: 24 }}>
          Review & edit before saving
        </div>

        <Field label="Title">
          <input value={data.title} onChange={e => update('title', e.target.value)} style={inputBig} />
        </Field>

        <Field label="Department">
          <select value={data.department} onChange={e => update('department', e.target.value as DepartmentKey)} style={inputBig}>
            {DEPT_KEYS.map(k => <option key={k} value={k}>{DEPARTMENTS[k].name}</option>)}
          </select>
        </Field>

        <Field label="Plain-English summary">
          <textarea
            value={data.summary}
            onChange={e => update('summary', e.target.value)}
            style={{ ...inputBig, minHeight: 100, fontFamily: FONTS.serif, fontStyle: 'italic' }}
          />
        </Field>

        <Field label="Applies to">
          <input value={data.applies_to} onChange={e => update('applies_to', e.target.value)} style={inputBig} />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="Adopted date (YYYY-MM-DD)">
            <input value={data.adopted_date || ''} onChange={e => update('adopted_date', e.target.value || null)} style={inputBig} placeholder="e.g. 2010-10-25" />
          </Field>
          <Field label="Length (pages)">
            <input type="number" value={data.length_pages} onChange={e => update('length_pages', Number(e.target.value) || 0)} style={inputBig} />
          </Field>
        </div>

        <Field label="Tags (comma-separated)">
          <input
            value={data.tags.join(', ')}
            onChange={e => update('tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
            style={inputBig}
          />
        </Field>

        <div style={{ marginTop: 36, borderTop: '2px solid rgba(0,0,0,0.1)', paddingTop: 36 }}>
          <div style={{ fontFamily: FONTS.display, fontSize: 22, color: C.black, marginBottom: 20 }}>Clauses</div>
          {data.clauses.map((cl, i) => (
            <div key={i} style={{ background: C.bone, padding: 24, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                <div style={{ fontFamily: FONTS.display, fontSize: 14, letterSpacing: '0.04em', color: 'rgba(0,0,0,0.5)' }}>§ {i + 1}</div>
                <button onClick={() => onChange({ ...data, clauses: data.clauses.filter((_, j) => j !== i) })} style={{
                  background: 'transparent', color: C.red, padding: '6px 10px',
                  border: `1.5px solid ${C.red}`, fontFamily: FONTS.sans,
                  fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
                  fontWeight: 700, cursor: 'pointer',
                }}>Remove</button>
              </div>
              <Field label="Heading">
                <input value={cl.title} onChange={e => updateClause(i, 'title', e.target.value)} style={inputSmall} />
              </Field>
              <Field label="Text">
                <textarea value={cl.text} onChange={e => updateClause(i, 'text', e.target.value)} style={{ ...inputSmall, minHeight: 100 }} />
              </Field>
              <Field label="Callout / important note (optional)">
                <input value={cl.callout || ''} onChange={e => updateClause(i, 'callout', e.target.value || null)} style={inputSmall} placeholder="Leave blank if none" />
              </Field>
            </div>
          ))}
          <button
            onClick={() => onChange({ ...data, clauses: [...data.clauses, { title: '', text: '', callout: null }] })}
            style={btnSecondary}
          >+ Add clause</button>
        </div>

        <div style={{ marginTop: 40, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={onSave} style={btnPrimary}>Save as draft →</button>
          <button onClick={onCancel} style={btnSecondary}>Cancel</button>
        </div>
        <div style={{ marginTop: 16, fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 13, color: 'rgba(0,0,0,0.6)' }}>
          The policy will save as a draft. Publish it from the admin dashboard once Ang approves.
        </div>
      </div>

      <aside style={{ position: 'sticky', top: 100, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ background: C.cream, padding: 28 }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700, color: C.red, marginBottom: 14 }}>Source PDF</div>
          <div style={{ fontFamily: FONTS.display, fontSize: 16, color: C.black, marginBottom: 6, lineHeight: 1.2, wordBreak: 'break-all' }}>{filename}</div>
          <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 13, color: 'rgba(0,0,0,0.6)' }}>
            The original file uploads to Supabase storage and stays linked from the policy page.
          </div>
        </div>
        <div style={{ background: C.yellow, padding: 24 }}>
          <div style={{ fontFamily: FONTS.display, fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.black, marginBottom: 10 }}>Before publishing</div>
          <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 15, color: C.black, lineHeight: 1.5 }}>
            Saved as draft. Ang Adamiak reviews and approves in the admin dashboard before it goes public.
          </div>
        </div>
      </aside>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.6)', fontWeight: 700, marginBottom: 8, fontFamily: FONTS.sans }}>{label}</div>
      {children}
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve((r.result as string).split(',')[1]);
    r.onerror = () => reject(new Error('Failed to read file'));
    r.readAsDataURL(file);
  });
}

const btnPrimary = {
  background: C.black, color: C.yellow, padding: '18px 28px', border: 'none',
  fontFamily: FONTS.display, fontSize: 14, letterSpacing: '0.04em',
  textTransform: 'uppercase' as const, cursor: 'pointer',
};
const btnSecondary = {
  background: 'transparent', color: C.black, padding: '18px 28px', border: `2px solid ${C.black}`,
  fontFamily: FONTS.display, fontSize: 14, letterSpacing: '0.04em',
  textTransform: 'uppercase' as const, cursor: 'pointer',
};
const inputBig = {
  width: '100%', padding: '14px 16px', border: '2px solid rgba(0,0,0,0.2)', background: '#fff',
  fontFamily: FONTS.sans, fontSize: 16, color: C.black, outline: 'none',
};
const inputSmall = {
  width: '100%', padding: '10px 12px', border: '1.5px solid rgba(0,0,0,0.2)', background: '#fff',
  fontFamily: FONTS.sans, fontSize: 14, color: C.black, outline: 'none',
};
