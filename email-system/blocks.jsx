/* exit1.dev — Email Builder · blocks.jsx
   Block registry: 24 block types.
   render()     → email preview (uses e1- CSS classes)
   inspector()  → property editor (uses eb- CSS classes)
   CSS vars --e1-accent / --e1-accent-fg flow from the shell wrapper. */

const { useState } = React;

/* ─── Form primitives ─────────────────────────────────────────────── */
const Field = ({ label, children, help }) => (
  <div className="eb-field">
    {label && <label className="eb-label">{label}</label>}
    {children}
    {help && <span className="eb-help">{help}</span>}
  </div>
);

const TI = ({ value, onChange, placeholder }) => (
  <input className="eb-input" type="text" value={value || ''} placeholder={placeholder || ''} onChange={e => onChange(e.target.value)} />
);
const UI = ({ value, onChange }) => (
  <input className="eb-input" type="url" value={value || ''} placeholder="https://…" onChange={e => onChange(e.target.value)} />
);
const TA = ({ value, onChange, rows = 3 }) => (
  <textarea className="eb-textarea" rows={rows} value={value || ''} onChange={e => onChange(e.target.value)} />
);
const Seg = ({ value, onChange, options }) => (
  <div className="eb-seg">
    {options.map(o => (
      <button key={o.value} className={`eb-seg-btn${value === o.value ? ' active' : ''}`} onClick={() => onChange(o.value)}>{o.label}</button>
    ))}
  </div>
);

const BUTTON_STYLES = [
  {
    value: 'primary',
    label: 'Filled',
    preview: <a style={{display:'inline-block',background:'var(--e1-accent,#3F9081)',color:'#fff',padding:'4px 10px',borderRadius:4,fontSize:11,fontWeight:600,textDecoration:'none'}}>Button →</a>
  },
  {
    value: 'ghost',
    label: 'Ghost',
    preview: <a style={{display:'inline-block',background:'transparent',color:'var(--e1-text-1)',padding:'4px 10px',borderRadius:4,fontSize:11,fontWeight:600,textDecoration:'none',border:'1px solid var(--e1-border)'}}>Button →</a>
  },
  {
    value: 'discord',
    label: 'Discord',
    preview: <a style={{display:'inline-flex',alignItems:'center',gap:5,background:'#5865f2',color:'#fff',padding:'4px 10px',borderRadius:4,fontSize:11,fontWeight:600,textDecoration:'none'}}>
      <img src="https://storage.exit1.dev/images/Discord-Symbol-White.png" style={{width:11,height:11,display:'block',objectFit:'contain'}} alt="" />
      Button
    </a>
  },
];

const StylePicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const current = BUTTON_STYLES.find(s => s.value === value) || BUTTON_STYLES[0];
  return (
    <div className="eb-style-picker">
      <button className="eb-style-picker-trigger" onClick={() => setOpen(o => !o)}>
        <span className="eb-style-picker-preview">{current.preview}</span>
        <span className="eb-style-picker-label">{current.label}</span>
        <span className="eb-style-picker-arrow">▾</span>
      </button>
      {open && (
        <div className="eb-style-picker-menu">
          {BUTTON_STYLES.map(s => (
            <button key={s.value} className={`eb-style-picker-option${s.value === value ? ' active' : ''}`}
              onClick={() => { onChange(s.value); setOpen(false); }}>
              <span className="eb-style-picker-preview">{s.preview}</span>
              <span className="eb-style-picker-label">{s.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
const Chk = ({ value, onChange, label }) => (
  <label className="eb-check">
    <input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)} />
    <span>{label}</span>
  </label>
);

/* ─── Group wrapper for repeatable items ─── */
const Group = ({ title, onRemove, children }) => (
  <div style={{ background: 'var(--e1-muted)', border: '1px solid var(--e1-border)', borderRadius: 'var(--e1-radius-md)', padding: '12px 12px 8px', marginBottom: 10 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
      <span style={{ fontSize: 'var(--e1-fs-xs)', fontWeight: 600, color: 'var(--e1-text-2)', letterSpacing: '-0.01em' }}>{title}</span>
      {onRemove && <button className="eb-btn eb-btn-danger eb-btn-sm" onClick={onRemove} style={{ padding: '2px 7px' }}>Remove</button>}
    </div>
    {children}
  </div>
);

const AddBtn = ({ onClick, children }) => (
  <button className="eb-btn eb-btn-ghost eb-btn-sm" onClick={onClick} style={{ width: '100%', marginTop: 4 }}>{children}</button>
);

/* ─── Block definitions ───────────────────────────────────────────── */
const BLOCKS = {

  /* ── Header ── */
  header: {
    type: 'header', label: 'Header', icon: 'H',
    defaults: () => ({ brandName: 'exit1.dev', showStatus: true, statusText: 'All systems operational', statusType: 'up' }),
    render: d => (
      <div className="e1-block e1-header">
        <div className="e1-header-logo">
          <img src="assets/exit1-logo.png" alt={d.brandName || 'exit1.dev'} style={{ height: 24, width: 'auto', display: 'block' }} />
        </div>
        {d.showStatus && (
          <span className={`e1-status-pill ${d.statusType || 'up'}`}>
            <span className="e1-status-dot"></span>
            {d.statusText}
          </span>
        )}
      </div>
    ),
    inspector: (d, up) => (
      <>
        <span className="eb-help" style={{ display: 'block', marginBottom: 12 }}>Logo uses the exit1-logo.png asset. The field below is alt/fallback text.</span>
        <Field label="Brand name (alt text)"><TI value={d.brandName} onChange={v => up({ brandName: v })} /></Field>
        <Chk value={d.showStatus} onChange={v => up({ showStatus: v })} label="Show status pill" />
        {d.showStatus && <>
          <Field label="Status label"><TI value={d.statusText} onChange={v => up({ statusText: v })} /></Field>
          <Field label="Status type">
            <Seg value={d.statusType || 'up'} onChange={v => up({ statusType: v })}
              options={[{ value: 'up', label: 'Up' }, { value: 'warn', label: 'Warn' }, { value: 'down', label: 'Down' }]} />
          </Field>
        </>}
      </>
    ),
  },

  /* ── Hero ── */
  hero: {
    type: 'hero', label: 'Hero', icon: 'A',
    defaults: () => ({ eyebrow: 'Welcome to exit1.dev', heading: 'You just stopped flying blind.', sub: "Your first check is already running. Here's what to do next." }),
    render: d => (
      <div className="e1-block e1-hero">
        {d.eyebrow && <div className="e1-eyebrow">{d.eyebrow}</div>}
        <h1 className="e1-h1">{d.heading}</h1>
        {d.sub && <p className="e1-subtitle">{d.sub}</p>}
      </div>
    ),
    inspector: (d, up) => (
      <>
        <Field label="Eyebrow"><TI value={d.eyebrow} onChange={v => up({ eyebrow: v })} /></Field>
        <Field label="Heading"><TA value={d.heading} onChange={v => up({ heading: v })} rows={2} /></Field>
        <Field label="Subtitle"><TA value={d.sub} onChange={v => up({ sub: v })} rows={3} /></Field>
      </>
    ),
  },

  /* ── Body text ── */
  body: {
    type: 'body', label: 'Body text', icon: '¶',
    defaults: () => ({ paragraphs: [
      { text: 'Hey {{first_name}},', style: 'lede' },
      { text: "Most teams find out their site is down the same way: a customer messages them. That gap — between when something breaks and when you know about it — is what exit1.dev closes.", style: 'normal' },
    ]}),
    render: d => (
      <div className="e1-block e1-body">
        {(d.paragraphs || []).map((p, i) => (
          <p key={i} className={p.style === 'lede' ? 'lede' : p.style === 'close' ? 'close' : ''} style={p.align === 'center' ? { textAlign: 'center' } : undefined}>{p.text}</p>
        ))}
      </div>
    ),
    inspector: (d, up) => {
      const ps = d.paragraphs || [];
      const set = (i, patch) => up({ paragraphs: ps.map((p, x) => x === i ? { ...p, ...patch } : p) });
      return <>
        {ps.map((p, i) => (
          <Group key={i} title={`Para ${i + 1}`} onRemove={() => up({ paragraphs: ps.filter((_, x) => x !== i) })}>
            <Field><TA value={p.text} onChange={v => set(i, { text: v })} rows={3} /></Field>
            <Field label="Style">
              <Seg value={p.style || 'normal'} onChange={v => set(i, { style: v })}
                options={[{ value: 'normal', label: 'Normal' }, { value: 'lede', label: 'Lede' }, { value: 'close', label: 'Close' }]} />
            </Field>
            <Field label="Align">
              <Seg value={p.align || 'left'} onChange={v => set(i, { align: v })}
                options={[{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }]} />
            </Field>
          </Group>
        ))}
        <AddBtn onClick={() => up({ paragraphs: [...ps, { text: 'New paragraph.', style: 'normal' }] })}>+ Add paragraph</AddBtn>
      </>;
    },
  },

  /* ── Simple list ── */
  simplelist: {
    type: 'simplelist', label: 'List', icon: '≡',
    defaults: () => ({ listType: 'unordered', items: ['First item.', 'Second item.', 'Third item.'] }),
    render: d => {
      const Tag = d.listType === 'ordered' ? 'ol' : 'ul';
      return (
        <div className="e1-block e1-simplelist">
          <Tag>
            {(d.items || []).map((item, i) => <li key={i}>{item}</li>)}
          </Tag>
        </div>
      );
    },
    inspector: (d, up) => {
      const items = d.items || [];
      return <>
        <Field label="Type">
          <Seg value={d.listType || 'unordered'} onChange={v => up({ listType: v })}
            options={[{ value: 'unordered', label: 'Bullets' }, { value: 'ordered', label: 'Numbered' }]} />
        </Field>
        {items.map((item, i) => (
          <Group key={i} title={`Item ${i + 1}`} onRemove={() => up({ items: items.filter((_, x) => x !== i) })}>
            <Field><TI value={item} onChange={v => up({ items: items.map((it, x) => x === i ? v : it) })} /></Field>
          </Group>
        ))}
        <AddBtn onClick={() => up({ items: [...items, 'New item.'] })}>+ Add item</AddBtn>
      </>;
    },
  },

  /* ── Steps ── */
  steps: {
    type: 'steps', label: 'Step cards', icon: '☰',
    defaults: () => ({ items: [
      { number: '01', label: 'Step one',  title: 'Add a check',       body: 'Paste any URL — your site, your API, your checkout page.',              ctaText: 'Add your first check',    ctaUrl: '{{dashboard_url}}', ctaStyle: 'ghost' },
      { number: '02', label: 'Step two',  title: 'Connect your team', body: 'Slack, Discord, or plain email — choose where to hear about problems.', ctaText: 'Connect an alert channel', ctaUrl: '{{alerts_url}}',    ctaStyle: 'primary' },
    ]}),
    render: d => (
      <div className="e1-block e1-steps">
        {(d.items || []).map((s, i) => (
          <div key={i} className="e1-step">
            <div className="e1-step-num">{s.number}</div>
            <div className="e1-step-content">
              <div className="e1-step-title">{s.title}</div>
              <div className="e1-step-body">{s.body}</div>
              {s.ctaText && (
                <a href={s.ctaUrl || '#'} className={`e1-cta ${s.ctaStyle === 'primary' ? 'e1-cta-primary' : 'e1-cta-ghost'}`} style={{ display: 'inline-block', marginTop: 12 }}>
                  {s.ctaText} →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    ),
    inspector: (d, up) => {
      const items = d.items || [];
      const set = (i, patch) => up({ items: items.map((it, x) => x === i ? { ...it, ...patch } : it) });
      return <>
        {items.map((s, i) => (
          <Group key={i} title={`Step ${i + 1}`} onRemove={() => up({ items: items.filter((_, x) => x !== i) })}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              <Field label="Number"><TI value={s.number} onChange={v => set(i, { number: v })} /></Field>
              <Field label="Label"><TI value={s.label}   onChange={v => set(i, { label: v })}  /></Field>
            </div>
            <Field label="Title"><TI value={s.title} onChange={v => set(i, { title: v })} /></Field>
            <Field label="Body"><TA  value={s.body}  onChange={v => set(i, { body: v })}  rows={2} /></Field>
            <Field label="CTA text"><TI value={s.ctaText} onChange={v => set(i, { ctaText: v })} /></Field>
            {s.ctaText && <>
              <Field label="CTA URL"><UI value={s.ctaUrl} onChange={v => set(i, { ctaUrl: v })} /></Field>
              <Field label="CTA style">
                <Seg value={s.ctaStyle || 'ghost'} onChange={v => set(i, { ctaStyle: v })}
                  options={[{ value: 'ghost', label: 'Ghost' }, { value: 'primary', label: 'Filled' }]} />
              </Field>
            </>}
          </Group>
        ))}
        <AddBtn onClick={() => up({ items: [...items, { number: String(items.length + 1).padStart(2, '0'), label: `Step ${items.length + 1}`, title: 'New step', body: 'Description.', ctaText: 'Call to action', ctaUrl: '#', ctaStyle: 'ghost' }] })}>+ Add step</AddBtn>
      </>;
    },
  },

  /* ── Button / CTA ── */
  ctablock: {
    type: 'ctablock', label: 'Button', icon: '▸',
    defaults: () => ({ text: 'Get started', url: '{{dashboard_url}}', style: 'primary' }),
    render: d => {
      const cls = d.style === 'ghost' ? 'e1-cta-ghost' : d.style === 'discord' ? 'e1-cta-discord' : 'e1-cta-primary';
      return (
        <div className="e1-block e1-ctablock">
          <a href={d.url || '#'} className={`e1-cta ${cls}`}>
            {d.style === 'discord' && <img src="https://storage.exit1.dev/images/Discord-Symbol-White.png" className="e1-cta-discord-icon" alt="" />}
            {d.text}{d.style !== 'discord' ? ' →' : ''}
          </a>
        </div>
      );
    },
    inspector: (d, up) => (
      <>
        <Field label="Button text"><TI value={d.text} onChange={v => up({ text: v })} /></Field>
        <Field label="URL"><UI value={d.url} onChange={v => up({ url: v })} /></Field>
        <Field label="Style">
          <StylePicker value={d.style || 'primary'} onChange={v => up({ style: v })} />
        </Field>
      </>
    ),
  },

  /* ── Stats ── */
  stats: {
    type: 'stats', label: 'Stat row', icon: '#',
    defaults: () => ({ items: [
      { label: 'Monitors', value: '3',      sub: 'active checks' },
      { label: 'Uptime',   value: '99.98%', sub: 'last 30 days' },
      { label: 'Response', value: '142ms',  sub: 'median TTFB' },
    ]}),
    render: d => (
      <div className="e1-block">
        <div className="e1-stats">
          {(d.items || []).map((s, i) => (
            <div key={i} className="e1-stat-cell">
              <div className="e1-stat-label">{s.label}</div>
              <div className="e1-stat-value">{s.value}</div>
              {s.sub && <div className="e1-stat-sub">{s.sub}</div>}
            </div>
          ))}
        </div>
      </div>
    ),
    inspector: (d, up) => {
      const items = d.items || [];
      const set = (i, patch) => up({ items: items.map((it, x) => x === i ? { ...it, ...patch } : it) });
      return <>
        {items.map((s, i) => (
          <Group key={i} title={`Stat ${i + 1}`} onRemove={() => up({ items: items.filter((_, x) => x !== i) })}>
            <Field label="Label"><TI value={s.label} onChange={v => set(i, { label: v })} /></Field>
            <Field label="Value"><TI value={s.value} onChange={v => set(i, { value: v })} /></Field>
            <Field label="Sub"><TI   value={s.sub}   onChange={v => set(i, { sub: v })}   /></Field>
          </Group>
        ))}
        <AddBtn onClick={() => up({ items: [...items, { label: 'Label', value: '0', sub: '' }] })}>+ Add stat</AddBtn>
      </>;
    },
  },

  /* ── Alert banner ── */
  alert: {
    type: 'alert', label: 'Alert banner', icon: '!',
    defaults: () => ({ type: 'down', title: 'example.com is down', body: 'We detected an outage at 14:32 UTC. Our team is investigating.', ctaText: 'View status page', ctaUrl: '{{status_url}}' }),
    render: d => (
      <div className="e1-block">
        <div className={`e1-alert ${d.type || 'down'}`}>
          <span className="e1-alert-dot"></span>
          <div>
            <div className="e1-alert-title">{d.title}</div>
            {d.body && <div className="e1-alert-body">{d.body}</div>}
            {d.ctaText && <a href={d.ctaUrl || '#'} style={{ display: 'inline-block', marginTop: 8, fontSize: 13, fontWeight: 600, textDecoration: 'underline', color: 'inherit' }}>{d.ctaText} →</a>}
          </div>
        </div>
      </div>
    ),
    inspector: (d, up) => (
      <>
        <Field label="Alert type">
          <Seg value={d.type || 'down'} onChange={v => up({ type: v })}
            options={[{ value: 'down', label: 'Down' }, { value: 'warn', label: 'Warn' }, { value: 'up', label: 'Up' }, { value: 'info', label: 'Info' }]} />
        </Field>
        <Field label="Title"><TI value={d.title} onChange={v => up({ title: v })} /></Field>
        <Field label="Body"><TA value={d.body} onChange={v => up({ body: v })} rows={3} /></Field>
        <Field label="CTA text"><TI value={d.ctaText} onChange={v => up({ ctaText: v })} /></Field>
        <Field label="CTA URL"><UI value={d.ctaUrl} onChange={v => up({ ctaUrl: v })} /></Field>
      </>
    ),
  },

  /* ── Checklist ── */
  checklist: {
    type: 'checklist', label: 'Checklist', icon: '✓',
    defaults: () => ({ heading: 'What you get on Nano', items: [
      { text: '50 monitors — 5× more than Free', checked: true },
      { text: '2-minute intervals — faster than Free\'s 5 min', checked: true },
      { text: 'Domain intelligence — auto expiry tracking', checked: true },
      { text: 'Maintenance windows & scheduled suppression', checked: true },
    ]}),
    render: d => (
      <div className="e1-block">
        {d.heading && <h3 className="e1-h3" style={{ marginBottom: 14 }}>{d.heading}</h3>}
        <ul className="e1-checklist">
          {(d.items || []).map((it, i) => (
            <li key={i} className={it.checked ? 'checked' : 'unchecked'}>
              <span className="e1-check-icon">{it.checked ? '✓' : '○'}</span>
              <span>{it.text}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
    inspector: (d, up) => {
      const items = d.items || [];
      const set = (i, patch) => up({ items: items.map((it, x) => x === i ? { ...it, ...patch } : it) });
      return <>
        <Field label="Heading"><TI value={d.heading} onChange={v => up({ heading: v })} /></Field>
        {items.map((it, i) => (
          <Group key={i} title={`Item ${i + 1}`} onRemove={() => up({ items: items.filter((_, x) => x !== i) })}>
            <Field><TI value={it.text} onChange={v => set(i, { text: v })} /></Field>
            <Chk value={it.checked} onChange={v => set(i, { checked: v })} label="Checked (tick)" />
          </Group>
        ))}
        <AddBtn onClick={() => up({ items: [...items, { text: 'New item', checked: true }] })}>+ Add item</AddBtn>
      </>;
    },
  },

  /* ── Code block ── */
  code: {
    type: 'code', label: 'Code block', icon: '{}',
    defaults: () => ({ label: 'mcp.json', language: 'json', code: `{\n  "mcpServers": {\n    "exit1": {\n      "command": "npx",\n      "args": ["-y", "exit1-mcp"],\n      "env": {\n        "EXIT1_API_KEY": "your_api_key_here"\n      }\n    }\n  }\n}` }),
    render: d => (
      <div className="e1-block">
        <div className="e1-code-wrap">
          <div className="e1-code-header">
            <span className="e1-code-file">{d.label}</span>
            <span className="e1-code-lang">{d.language}</span>
          </div>
          <pre className="e1-code-body">{d.code}</pre>
        </div>
      </div>
    ),
    inspector: (d, up) => (
      <>
        <Field label="File label / title"><TI value={d.label} onChange={v => up({ label: v })} /></Field>
        <Field label="Language tag"><TI value={d.language} onChange={v => up({ language: v })} /></Field>
        <Field label="Code"><TA value={d.code} onChange={v => up({ code: v })} rows={10} /></Field>
      </>
    ),
  },

  /* ── Image ── */
  image: {
    type: 'image', label: 'Image', icon: '▨',
    defaults: () => ({ src: '', alt: '', caption: '', link: '' }),
    render: d => (
      <div className="e1-block e1-image">
        {d.src
          ? <img src={d.src} alt={d.alt || ''} style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 8 }} />
          : <div style={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--e1-muted)', borderRadius: 8, border: '1px solid var(--e1-border)', fontSize: 11, color: 'var(--e1-text-3)', fontFamily: 'var(--e1-mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>[ {d.alt || 'Image'} ]</div>
        }
        {d.caption && <p className="e1-image-caption">{d.caption}</p>}
      </div>
    ),
    inspector: (d, up) => (
      <>
        <Field label="Image URL" help="Must be a public https:// URL"><UI value={d.src} onChange={v => up({ src: v })} /></Field>
        <Field label="Alt text"><TI value={d.alt} onChange={v => up({ alt: v })} /></Field>
        <Field label="Caption (optional)"><TI value={d.caption} onChange={v => up({ caption: v })} /></Field>
        <Field label="Link (optional)"><UI value={d.link} onChange={v => up({ link: v })} /></Field>
      </>
    ),
  },

  /* ── Two-column ── */
  twocol: {
    type: 'twocol', label: 'Two columns', icon: '⊞',
    defaults: () => ({ cols: [
      { heading: 'Free',  subhead: 'Get started',      body: '10 checks · 5-min intervals · SSL monitoring · Email alerts',      ctaText: 'Start free',       ctaUrl: '{{signup_url}}',  accent: false },
      { heading: 'Nano',  subhead: 'For growing teams', body: '200 checks · 2-min intervals · SMS alerts · Domain intelligence', ctaText: 'Upgrade to Nano', ctaUrl: '{{upgrade_url}}', accent: true  },
    ]}),
    render: d => (
      <div className="e1-block">
        <div className="e1-twocol">
          {(d.cols || []).map((col, i) => (
            <div key={i} className={`e1-col-card${col.accent ? ' accent' : ''}`}>
              <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: col.accent ? 'var(--e1-accent)' : 'var(--e1-text-3)', marginBottom: 4 }}>{col.subhead}</p>
              <h3 className="e1-h3">{col.heading}</h3>
              <p style={{ fontSize: 13, color: 'var(--e1-text-2)', lineHeight: 1.55, marginBottom: 12 }}>{col.body}</p>
              {col.ctaText && <a href={col.ctaUrl || '#'} style={{ fontSize: 12, fontWeight: 600, color: col.accent ? 'var(--e1-accent)' : 'var(--e1-text-2)', textDecoration: 'none', borderBottom: `1px solid ${col.accent ? 'var(--e1-accent)' : 'var(--e1-border)'}` }}>{col.ctaText} →</a>}
            </div>
          ))}
        </div>
      </div>
    ),
    inspector: (d, up) => {
      const cols = d.cols || [];
      const set = (i, patch) => up({ cols: cols.map((c, x) => x === i ? { ...c, ...patch } : c) });
      return <>
        {cols.map((col, i) => (
          <Group key={i} title={`Column ${i + 1}`}>
            <Field label="Heading"><TI value={col.heading}  onChange={v => set(i, { heading: v })}  /></Field>
            <Field label="Subhead"><TI value={col.subhead}  onChange={v => set(i, { subhead: v })}  /></Field>
            <Field label="Body"><TA    value={col.body}     onChange={v => set(i, { body: v })}     rows={2} /></Field>
            <Field label="CTA text"><TI value={col.ctaText} onChange={v => set(i, { ctaText: v })} /></Field>
            <Field label="CTA URL"><UI  value={col.ctaUrl}  onChange={v => set(i, { ctaUrl: v })}  /></Field>
            <Chk value={col.accent} onChange={v => set(i, { accent: v })} label="Highlight with accent colour" />
          </Group>
        ))}
      </>;
    },
  },

  /* ── Feature card ── */
  feature: {
    type: 'feature', label: 'Feature card', icon: '▦',
    defaults: () => ({ imgUrl: '', mediaLabel: '[ Screenshot placeholder ]', imgAlt: '', heading: '8 check types, one engine', body: 'HTTP, heartbeat, DNS, ICMP, TCP/UDP, WebSocket, and redirect monitoring — all with per-stage timing and instant alerts.', ctaText: 'See all check types', ctaUrl: '{{dashboard_url}}', ctaStyle: 'ghost' }),
    render: d => (
      <div className="e1-block">
        <div className="e1-feature">
          {d.imgUrl
            ? <img src={d.imgUrl} alt={d.imgAlt || ''} style={{ display: 'block', width: '100%', borderBottom: '1px solid var(--e1-border)' }} />
            : <div style={{ padding: '48px 20px', textAlign: 'center', background: 'var(--e1-muted)', borderBottom: '1px solid var(--e1-border)', fontSize: 11, color: 'var(--e1-text-3)', fontFamily: 'var(--e1-mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{d.mediaLabel}</div>
          }
          <div className="e1-feature-body">
            <h3 className="e1-h3">{d.heading}</h3>
            <p style={{ fontSize: 14, color: 'var(--e1-text-2)', lineHeight: 1.6, marginBottom: d.ctaText ? 14 : 0 }}>{d.body}</p>
            {d.ctaText && <a href={d.ctaUrl || '#'} className={`e1-cta ${d.ctaStyle === 'primary' ? 'e1-cta-primary' : 'e1-cta-ghost'}`} style={{ display: 'inline-block' }}>{d.ctaText} →</a>}
          </div>
        </div>
      </div>
    ),
    inspector: (d, up) => (
      <>
        <Field label="Image URL" help="Public https:// URL"><UI value={d.imgUrl} onChange={v => up({ imgUrl: v })} /></Field>
        {d.imgUrl
          ? <Field label="Image alt text"><TI value={d.imgAlt} onChange={v => up({ imgAlt: v })} /></Field>
          : <Field label="Placeholder label"><TI value={d.mediaLabel} onChange={v => up({ mediaLabel: v })} /></Field>
        }
        <Field label="Heading"><TI value={d.heading} onChange={v => up({ heading: v })} /></Field>
        <Field label="Body"><TA value={d.body} onChange={v => up({ body: v })} rows={3} /></Field>
        <Field label="CTA text"><TI value={d.ctaText} onChange={v => up({ ctaText: v })} /></Field>
        {d.ctaText && <>
          <Field label="CTA URL"><UI value={d.ctaUrl} onChange={v => up({ ctaUrl: v })} /></Field>
          <Field label="CTA style">
            <Seg value={d.ctaStyle || 'ghost'} onChange={v => up({ ctaStyle: v })}
              options={[{ value: 'ghost', label: 'Ghost' }, { value: 'primary', label: 'Filled' }]} />
          </Field>
        </>}
      </>
    ),
  },

  /* ── Quote ── */
  quote: {
    type: 'quote', label: 'Quote', icon: '"',
    defaults: () => ({ quote: "We were down for six minutes before exit1.dev told us. Now we know in under 30 seconds.", author: 'Alex Chen', role: 'Lead Engineer, SaaS team' }),
    render: d => (
      <div className="e1-block">
        <div className="e1-quote-wrap">
          <p className="e1-quote-text">"{d.quote}"</p>
          <div className="e1-quote-attr">
            <div className="e1-quote-avatar"></div>
            <div>
              <div className="e1-quote-name">{d.author}</div>
              <div className="e1-quote-role">{d.role}</div>
            </div>
          </div>
        </div>
      </div>
    ),
    inspector: (d, up) => (
      <>
        <Field label="Quote"><TA value={d.quote} onChange={v => up({ quote: v })} rows={4} /></Field>
        <Field label="Author"><TI value={d.author} onChange={v => up({ author: v })} /></Field>
        <Field label="Role"><TI   value={d.role}   onChange={v => up({ role: v })}   /></Field>
      </>
    ),
  },

  /* ── Plan card ── */
  plan: {
    type: 'plan', label: 'Plan card', icon: '▭',
    defaults: () => ({ label: 'Your current plan', tier: 'Free', specs: ['10 monitors', '5-minute check intervals', 'SSL certificate monitoring', 'Email alerts only', '1 status page', '60-day data retention'], upsell: 'Need 2-minute intervals, DNS monitoring, or SMS alerts? **Nano** starts at $9/month.' }),
    render: d => (
      <div className="e1-block">
        <div className="e1-plan-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--e1-text-3)' }}>{d.label}</span>
            <span className="e1-plan-tier" style={{ background: 'var(--e1-accent)', color: 'var(--e1-accent-fg, #000)' }}>{d.tier}</span>
          </div>
          <ul className="e1-plan-specs">
            {(d.specs || []).map((s, i) => (
              <li key={i} className="e1-plan-spec">
                <span className="e1-plan-check">✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
          {d.upsell && <p style={{ fontSize: 13, color: 'var(--e1-text-3)', lineHeight: 1.55, marginTop: 12 }} dangerouslySetInnerHTML={{ __html: (d.upsell || '').replace(/\*\*(.+?)\*\*/g, '<b style="color:var(--e1-accent)">$1</b>') }} />}
        </div>
      </div>
    ),
    inspector: (d, up) => (
      <>
        <Field label="Label"><TI value={d.label} onChange={v => up({ label: v })} /></Field>
        <Field label="Tier badge"><TI value={d.tier} onChange={v => up({ tier: v })} /></Field>
        <Field label="Specs (one per line)">
          <TA value={(d.specs || []).join('\n')} onChange={v => up({ specs: v.split('\n').map(s => s.trim()).filter(Boolean) })} rows={5} />
        </Field>
        <Field label="Upsell line" help="Use **bold** for emphasis">
          <TA value={d.upsell || ''} onChange={v => up({ upsell: v })} rows={2} />
        </Field>
      </>
    ),
  },

  /* ── Announcement ── */
  announcement: {
    type: 'announcement', label: 'Announcement', icon: '★',
    defaults: () => ({ badge: 'New', heading: 'Introducing MCP Server Integration', sub: 'Query your monitoring data from Claude, Cursor, VS Code Copilot and more — without switching context.', ctaText: 'Read the docs', ctaUrl: '{{docs_url}}' }),
    render: d => (
      <div className="e1-block e1-announcement">
        {d.badge && <div className="e1-badge">{d.badge}</div>}
        <h1 className="e1-h1" style={{ textAlign: 'center', fontSize: 32, letterSpacing: '-0.025em' }}>{d.heading}</h1>
        {d.sub && <p style={{ fontSize: 16, color: 'var(--e1-text-2)', lineHeight: 1.55, maxWidth: 460, margin: '0 auto 20px', textAlign: 'center' }}>{d.sub}</p>}
        {d.ctaText && <a href={d.ctaUrl || '#'} className="e1-cta e1-cta-primary">{d.ctaText} →</a>}
      </div>
    ),
    inspector: (d, up) => (
      <>
        <Field label="Badge text (blank to hide)"><TI value={d.badge} onChange={v => up({ badge: v })} /></Field>
        <Field label="Heading"><TA value={d.heading} onChange={v => up({ heading: v })} rows={2} /></Field>
        <Field label="Subtitle"><TA value={d.sub} onChange={v => up({ sub: v })} rows={3} /></Field>
        <Field label="CTA text"><TI value={d.ctaText} onChange={v => up({ ctaText: v })} /></Field>
        <Field label="CTA URL"><UI value={d.ctaUrl} onChange={v => up({ ctaUrl: v })} /></Field>
      </>
    ),
  },

  /* ── Incident timeline ── */
  timeline: {
    type: 'timeline', label: 'Incident timeline', icon: '⏱',
    defaults: () => ({ heading: 'Incident report', events: [
      { time: '14:32 UTC', status: 'down', text: 'Monitoring detected elevated error rates on app.exit1.dev.' },
      { time: '14:35 UTC', status: 'warn', text: 'Engineering alerted. Root cause identified.' },
      { time: '14:51 UTC', status: 'warn', text: 'Fix deployed. Monitoring recovery.' },
      { time: '15:04 UTC', status: 'up',   text: 'All systems operational. Incident resolved.' },
    ]}),
    render: d => {
      const SC = { down: 'var(--e1-error)', warn: 'var(--e1-warning)', up: 'var(--e1-success)', info: 'var(--e1-info)' };
      return (
        <div className="e1-block">
          {d.heading && <h3 className="e1-h3" style={{ marginBottom: 18 }}>{d.heading}</h3>}
          <div className="e1-timeline">
            {(d.events || []).map((ev, i) => (
              <div key={i} className="e1-timeline-item">
                <div className="e1-tl-track">
                  <div className="e1-tl-dot" style={{ background: SC[ev.status] || SC.info }}></div>
                  <div className="e1-tl-line"></div>
                </div>
                <div>
                  <div className="e1-tl-time">{ev.time}</div>
                  <p className="e1-tl-desc">{ev.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    },
    inspector: (d, up) => {
      const evs = d.events || [];
      const set = (i, patch) => up({ events: evs.map((e, x) => x === i ? { ...e, ...patch } : e) });
      return <>
        <Field label="Heading"><TI value={d.heading} onChange={v => up({ heading: v })} /></Field>
        {evs.map((ev, i) => (
          <Group key={i} title={`Event ${i + 1}`} onRemove={() => up({ events: evs.filter((_, x) => x !== i) })}>
            <Field label="Time"><TI value={ev.time} onChange={v => set(i, { time: v })} /></Field>
            <Field label="Status">
              <Seg value={ev.status || 'info'} onChange={v => set(i, { status: v })}
                options={[{ value: 'down', label: 'Down' }, { value: 'warn', label: 'Warn' }, { value: 'up', label: 'Up' }, { value: 'info', label: 'Info' }]} />
            </Field>
            <Field label="Description"><TA value={ev.text} onChange={v => set(i, { text: v })} rows={2} /></Field>
          </Group>
        ))}
        <AddBtn onClick={() => up({ events: [...evs, { time: '00:00 UTC', status: 'info', text: 'New event.' }] })}>+ Add event</AddBtn>
      </>;
    },
  },

  /* ── Big metric ── */
  bigmetric: {
    type: 'bigmetric', label: 'Big metric', icon: '∞',
    defaults: () => ({ value: '99.98%', label: 'Average uptime', sub: 'across all monitored endpoints · last 30 days', accent: true }),
    render: d => (
      <div className="e1-block e1-bigmetric">
        <div className="e1-bigmetric-value" style={{ color: d.accent ? 'var(--e1-accent)' : 'var(--e1-text-1)' }}>{d.value}</div>
        <div className="e1-bigmetric-label">{d.label}</div>
        {d.sub && <div className="e1-bigmetric-sub">{d.sub}</div>}
      </div>
    ),
    inspector: (d, up) => (
      <>
        <Field label="Value (the big number)"><TI value={d.value} onChange={v => up({ value: v })} /></Field>
        <Field label="Label"><TI value={d.label} onChange={v => up({ label: v })} /></Field>
        <Field label="Sub-label"><TI value={d.sub} onChange={v => up({ sub: v })} /></Field>
        <Chk value={d.accent} onChange={v => up({ accent: v })} label="Use accent colour for value" />
      </>
    ),
  },

  /* ── Link list ── */
  linklist: {
    type: 'linklist', label: 'Link list', icon: '↗',
    defaults: () => ({ heading: 'Quick links', links: [
      { text: 'Dashboard',   url: '{{dashboard_url}}',       desc: 'View your checks and uptime' },
      { text: 'Docs',        url: 'https://docs.exit1.dev',  desc: 'API reference and guides' },
      { text: 'Status page', url: '{{status_url}}',          desc: 'Public status for your customers' },
      { text: 'Unsubscribe', url: '{{unsubscribe_url}}',     desc: '' },
    ]}),
    render: d => (
      <div className="e1-block">
        {d.heading && <h3 className="e1-h3" style={{ marginBottom: 14 }}>{d.heading}</h3>}
        <div className="e1-linklist">
          {(d.links || []).map((l, i) => (
            <a key={i} href={l.url || '#'} className="e1-link-item">
              <div>
                <div className="e1-link-label">{l.text}</div>
                {l.desc && <div className="e1-link-desc">{l.desc}</div>}
              </div>
              <span className="e1-link-arrow">→</span>
            </a>
          ))}
        </div>
      </div>
    ),
    inspector: (d, up) => {
      const links = d.links || [];
      const set = (i, patch) => up({ links: links.map((l, x) => x === i ? { ...l, ...patch } : l) });
      return <>
        <Field label="Heading"><TI value={d.heading} onChange={v => up({ heading: v })} /></Field>
        {links.map((l, i) => (
          <Group key={i} title={`Link ${i + 1}`} onRemove={() => up({ links: links.filter((_, x) => x !== i) })}>
            <Field label="Text"><TI value={l.text} onChange={v => set(i, { text: v })} /></Field>
            <Field label="URL"><UI  value={l.url}  onChange={v => set(i, { url: v })}  /></Field>
            <Field label="Description"><TI value={l.desc} onChange={v => set(i, { desc: v })} /></Field>
          </Group>
        ))}
        <AddBtn onClick={() => up({ links: [...links, { text: 'New link', url: '#', desc: '' }] })}>+ Add link</AddBtn>
      </>;
    },
  },

  /* ── Signature ── */
  signature: {
    type: 'signature', label: 'Signature', icon: '✍',
    defaults: () => ({ signoff: 'Cheers,', name: 'Marcus Eriksson', title: 'Founder & CEO, exit1.dev', avatarUrl: '', ps: '' }),
    render: d => (
      <div className="e1-block e1-signature">
        <div>
          {d.signoff && <p className="e1-sig-signoff">{d.signoff}</p>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="e1-sig-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: 'var(--e1-text-3)' }}>
              {d.avatarUrl
                ? <img src={d.avatarUrl} alt={d.name || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : (d.name || '?')[0]
              }
            </div>
            <div>
              <div className="e1-sig-name">{d.name}</div>
              <div className="e1-sig-title">{d.title}</div>
            </div>
          </div>
          {d.ps && <p className="e1-sig-ps" style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--e1-border)' }}><b>P.S.</b> {d.ps}</p>}
        </div>
      </div>
    ),
    inspector: (d, up) => (
      <>
        <Field label="Sign-off line"><TI value={d.signoff} onChange={v => up({ signoff: v })} placeholder="Cheers," /></Field>
        <Field label="Name"><TI value={d.name} onChange={v => up({ name: v })} /></Field>
        <Field label="Title / Role"><TI value={d.title} onChange={v => up({ title: v })} /></Field>
        <Field label="Avatar URL" help="Public https:// image"><UI value={d.avatarUrl} onChange={v => up({ avatarUrl: v })} /></Field>
        <Field label="P.S. line (optional)"><TA value={d.ps} onChange={v => up({ ps: v })} rows={2} /></Field>
      </>
    ),
  },

  /* ── Testimonial ── */
  testimonial: {
    type: 'testimonial', label: 'Testimonial', icon: '★',
    defaults: () => ({ avatarUrl: '', quote: 'exit1 caught the incident before our own alerts fired. Saved us a brutal on-call night.', author: 'Priya Nair', role: 'Platform Engineer', company: 'Vercel', stars: 5 }),
    render: d => (
      <div className="e1-block">
        <div className="e1-testimonial">
          {d.stars > 0 && <div className="e1-stars">{'★'.repeat(Math.min(5, d.stars))}</div>}
          <p className="e1-testimonial-quote">"{d.quote}"</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="e1-quote-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, fontSize: 14, fontWeight: 700, color: 'var(--e1-text-3)' }}>
              {d.avatarUrl
                ? <img src={d.avatarUrl} alt={d.author} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : (d.author || '?')[0]
              }
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--e1-text-1)' }}>{d.author} {d.company && <span style={{ color: 'var(--e1-text-3)', fontWeight: 400 }}>· {d.company}</span>}</div>
              {d.role && <div style={{ fontSize: 12, color: 'var(--e1-text-3)' }}>{d.role}</div>}
            </div>
          </div>
        </div>
      </div>
    ),
    inspector: (d, up) => (
      <>
        <Field label="Quote"><TA value={d.quote} onChange={v => up({ quote: v })} rows={4} /></Field>
        <Field label="Stars (0–5)">
          <Seg value={String(d.stars)} onChange={v => up({ stars: Number(v) })} options={[{ value: '0', label: 'None' }, { value: '3', label: '★★★' }, { value: '4', label: '★★★★' }, { value: '5', label: '★★★★★' }]} />
        </Field>
        <Field label="Author"><TI value={d.author} onChange={v => up({ author: v })} /></Field>
        <Field label="Role"><TI value={d.role} onChange={v => up({ role: v })} /></Field>
        <Field label="Company"><TI value={d.company} onChange={v => up({ company: v })} /></Field>
        <Field label="Avatar URL" help="Public https:// image"><UI value={d.avatarUrl} onChange={v => up({ avatarUrl: v })} /></Field>
      </>
    ),
  },

  /* ── Changelog ── */
  changelog: {
    type: 'changelog', label: 'Changelog', icon: '⌥',
    defaults: () => ({ version: 'v2.4.0', date: 'Apr 28, 2025', items: [
      { type: 'new',      text: 'Multi-region failover with automatic DNS rerouting' },
      { type: 'improved', text: 'P99 alert latency reduced to under 8 seconds' },
      { type: 'fixed',    text: 'Resolved false positives on IPv6-only endpoints' },
    ]}),
    render: d => {
      const TAG_COLORS = { new: 'var(--e1-success)', improved: 'var(--e1-primary)', fixed: 'var(--e1-warning)', removed: 'var(--e1-error)' };
      return (
        <div className="e1-block">
          <div className="e1-changelog-header">
            <span className="e1-version-badge">{d.version}</span>
            {d.date && <span className="e1-changelog-date">{d.date}</span>}
          </div>
          <ul className="e1-changelog-list">
            {(d.items || []).map((item, i) => (
              <li key={i} className="e1-cl-item">
                <span className="e1-cl-tag" style={{ background: TAG_COLORS[item.type] || TAG_COLORS.new, color: '#000' }} >{item.type}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    },
    inspector: (d, up) => {
      const TYPES = ['new', 'improved', 'fixed', 'removed'];
      const items = d.items || [];
      const set = (i, patch) => { const a = [...items]; a[i] = { ...a[i], ...patch }; up({ items: a }); };
      return <>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <Field label="Version"><TI value={d.version} onChange={v => up({ version: v })} placeholder="v2.4.0" /></Field>
          <Field label="Date"><TI value={d.date} onChange={v => up({ date: v })} placeholder="Apr 28, 2025" /></Field>
        </div>
        {items.map((item, i) => (
          <Group key={i} title={`Item ${i + 1}`} onRemove={() => up({ items: items.filter((_, j) => j !== i) })}>
            <Field label="Type">
              <Seg value={item.type} onChange={v => set(i, { type: v })} options={TYPES.map(t => ({ value: t, label: t[0].toUpperCase() + t.slice(1) }))} />
            </Field>
            <Field label="Text"><TI value={item.text} onChange={v => set(i, { text: v })} /></Field>
          </Group>
        ))}
        <AddBtn onClick={() => up({ items: [...items, { type: 'new', text: '' }] })}>+ Add item</AddBtn>
      </>;
    },
  },

  /* ── Event banner ── */
  event: {
    type: 'event', label: 'Event', icon: '◈',
    defaults: () => ({ tag: 'WEBINAR', date: 'May 15, 2025', time: '2:00 PM UTC', headline: "Join us live: What's new in exit1 v3", sub: 'A 30-minute walkthrough of the biggest release yet — with live Q&A.', ctaText: 'Reserve your spot →', ctaUrl: '#' }),
    render: d => (
      <div className="e1-block e1-event">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          {d.tag && <span className="e1-event-tag">{d.tag}</span>}
          {(d.date || d.time) && <span className="e1-event-datetime">{[d.date, d.time].filter(Boolean).join(' · ')}</span>}
        </div>
        {d.headline && <h2 className="e1-h2">{d.headline}</h2>}
        {d.sub && <p style={{ fontSize: 15, color: 'var(--e1-text-2)', lineHeight: 1.6, marginBottom: 20 }}>{d.sub}</p>}
        {d.ctaText && <a href={d.ctaUrl || '#'} className="e1-cta e1-cta-primary">{d.ctaText}</a>}
      </div>
    ),
    inspector: (d, up) => (
      <>
        <Field label="Tag"><TI value={d.tag} onChange={v => up({ tag: v })} placeholder="WEBINAR" /></Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <Field label="Date"><TI value={d.date} onChange={v => up({ date: v })} placeholder="May 15, 2025" /></Field>
          <Field label="Time"><TI value={d.time} onChange={v => up({ time: v })} placeholder="2:00 PM UTC" /></Field>
        </div>
        <Field label="Headline"><TA value={d.headline} onChange={v => up({ headline: v })} rows={2} /></Field>
        <Field label="Subtext"><TA value={d.sub} onChange={v => up({ sub: v })} rows={2} /></Field>
        <Field label="CTA Text"><TI value={d.ctaText} onChange={v => up({ ctaText: v })} /></Field>
        <Field label="CTA URL"><UI value={d.ctaUrl} onChange={v => up({ ctaUrl: v })} /></Field>
      </>
    ),
  },

  /* ── Social links ── */
  sociallinks: {
    type: 'sociallinks', label: 'Social links', icon: '⇢',
    defaults: () => ({ links: [
      { platform: 'Facebook',  icon: 'https://storage.exit1.dev/images/facebook-icon.png',  url: '#' },
      { platform: 'GitHub',    icon: 'https://storage.exit1.dev/images/github-icon.png',    url: '#' },
      { platform: 'Instagram', icon: 'https://storage.exit1.dev/images/instagram-icon.png', url: '#' },
      { platform: 'X',         icon: 'https://storage.exit1.dev/images/x-icon.png',         url: '#' },
      { platform: 'LinkedIn',  icon: 'https://storage.exit1.dev/images/linkedin-icon.png',  url: '#' },
      { platform: 'Discord',   icon: 'https://storage.exit1.dev/images/discord-icon.png',   url: '#' },
    ]}),
    render: d => {
      const SOCIAL_ICONS = {
        facebook:  'https://storage.exit1.dev/images/facebook-icon.png',
        github:    'https://storage.exit1.dev/images/github-icon.png',
        instagram: 'https://storage.exit1.dev/images/instagram-icon.png',
        x:         'https://storage.exit1.dev/images/x-icon.png',
        twitter:   'https://storage.exit1.dev/images/x-icon.png',
        linkedin:  'https://storage.exit1.dev/images/linkedin-icon.png',
        discord:   'https://storage.exit1.dev/images/discord-icon.png',
      };
      const resolveIcon = l => l.icon || SOCIAL_ICONS[(l.platform || '').toLowerCase()] || '';
      return (
        <div className="e1-block">
          <div className="e1-social-links">
            {(d.links || []).map((l, i) => (
              <a key={i} href={l.url || '#'} className="e1-social-link">
                <img src={resolveIcon(l)} alt={l.platform} width="20" height="20" style={{ display: 'block' }} />
              </a>
            ))}
          </div>
        </div>
      );
    },
    inspector: (d, up) => {
      const links = d.links || [];
      const set = (i, patch) => { const a = [...links]; a[i] = { ...a[i], ...patch }; up({ links: a }); };
      return <>
        {links.map((l, i) => (
          <Group key={i} title={`Link ${i + 1}`} onRemove={() => up({ links: links.filter((_, j) => j !== i) })}>
            <Field label="Platform"><TI value={l.platform} onChange={v => set(i, { platform: v })} placeholder="X" /></Field>
            <Field label="Icon URL"><TI value={l.icon} onChange={v => set(i, { icon: v })} placeholder="https://..." /></Field>
            <Field label="URL"><UI value={l.url} onChange={v => set(i, { url: v })} /></Field>
          </Group>
        ))}
        <AddBtn onClick={() => up({ links: [...links, { platform: '', icon: '', url: '#' }] })}>+ Add link</AddBtn>
      </>;
    },
  },

  /* ── Divider ── */
  divider: {
    type: 'divider', label: 'Divider', icon: '—',
    defaults: () => ({}),
    render: () => <div className="e1-divider"><hr /></div>,
    inspector: () => <span className="eb-help">Horizontal rule between sections.</span>,
  },

  /* ── Footer ── */
  footer: {
    type: 'footer', label: 'Footer', icon: 'F',
    defaults: () => ({ brand: 'exit1.dev', address: '123 Main St, San Francisco, CA 94105', links: [
      { text: 'Dashboard',   url: '{{dashboard_url}}' },
      { text: 'Preferences', url: '{{preferences_url}}' },
      { text: 'Unsubscribe', url: '{{unsubscribe_url}}' },
    ]}),
    render: d => (
      <footer className="e1-footer">
        <div className="e1-footer-brand">{d.brand} · Uptime monitoring for teams that ship.</div>
        {d.address && <div className="e1-footer-address">{d.address}</div>}
        <div className="e1-footer-links">
          {(d.links || []).map((l, i) => (
            <a key={i} href={l.url || '#'} className="e1-footer-link">{l.text}</a>
          ))}
        </div>
        <div className="e1-footer-copy">© {new Date().getFullYear()} exit1.dev. All rights reserved.</div>
      </footer>
    ),
    inspector: (d, up) => {
      const links = d.links || [];
      const setLink = (i, patch) => up({ links: links.map((l, x) => x === i ? { ...l, ...patch } : l) });
      return <>
        <Field label="Brand"><TI value={d.brand} onChange={v => up({ brand: v })} /></Field>
        <Field label="Address"><TI value={d.address} onChange={v => up({ address: v })} placeholder="123 Main St, City, State ZIP" /></Field>
        {links.map((l, i) => (
          <Group key={i} title={`Link ${i + 1}`} onRemove={() => up({ links: links.filter((_, x) => x !== i) })}>
            <Field label="Text"><TI value={l.text} onChange={v => setLink(i, { text: v })} /></Field>
            <Field label="URL"><UI  value={l.url}  onChange={v => setLink(i, { url: v })}  /></Field>
          </Group>
        ))}
        <AddBtn onClick={() => up({ links: [...links, { text: 'Link', url: '#' }] })}>+ Add link</AddBtn>
      </>;
    },
  },

  /* ── To-do checklist ── */
  todolist: {
    type: 'todolist', label: 'To-do list', icon: '☐',
    defaults: () => ({ heading: 'Onboarding checklist', showProgress: true, checkColor: '#000000', items: [
      { text: 'Add your first monitor',        note: 'Paste any URL — site, API, or cron job.', done: true  },
      { text: 'Connect an alert channel',      note: 'Slack, email, Discord, or SMS.',           done: true  },
      { text: 'Invite your team',              note: 'Add teammates so alerts reach everyone.',   done: false },
      { text: 'Create a public status page',   note: 'Show customers you\'re on top of things.',  done: false },
    ]}),
    render: d => {
      const items  = d.items || [];
      const doneN  = items.filter(it => it.done).length;
      const pct    = items.length ? Math.round((doneN / items.length) * 100) : 0;
      return (
        <div className="e1-block">
          {d.heading && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 className="e1-h3" style={{ margin: 0 }}>{d.heading}</h3>
              {d.showProgress && <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--e1-text-3)' }}>{doneN}/{items.length}</span>}
            </div>
          )}
          {d.showProgress && (
            <div style={{ height: 4, background: 'var(--e1-border)', borderRadius: 99, marginBottom: 16, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: 'var(--e1-accent)', borderRadius: 99, transition: 'width 0.3s' }} />
            </div>
          )}
          <div className="e1-todolist">
            {items.map((it, i) => (
              <div key={i} className={`e1-todo-item${it.done ? ' done' : ''}`}>
                <div className="e1-todo-box">{it.done ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={d.checkColor || '#000000'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                ) : ''}</div>
                <div className="e1-todo-text">
                  <span className="e1-todo-label">{it.text}</span>
                  {it.note && <span className="e1-todo-note">{it.note}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    },
    inspector: (d, up) => {
      const items = d.items || [];
      const set = (i, patch) => up({ items: items.map((it, x) => x === i ? { ...it, ...patch } : it) });
      return <>
        <Field label="Heading"><TI value={d.heading} onChange={v => up({ heading: v })} /></Field>
        <Chk value={d.showProgress} onChange={v => up({ showProgress: v })} label="Show progress bar" />
        <Field label="Check colour">
          <div className="eb-color-row">
            <div className="eb-color-swatch"><input type="color" value={d.checkColor || '#000000'} onChange={e => up({ checkColor: e.target.value })} /></div>
            <span style={{ fontSize: 'var(--e1-fs-xs)', color: 'var(--e1-text-3)' }}>{d.checkColor || '#000000'}</span>
          </div>
        </Field>
        {items.map((it, i) => (
          <Group key={i} title={`Task ${i + 1}`} onRemove={() => up({ items: items.filter((_, x) => x !== i) })}>
            <Field label="Task"><TI value={it.text} onChange={v => set(i, { text: v })} /></Field>
            <Field label="Note (optional)"><TI value={it.note || ''} onChange={v => set(i, { note: v })} placeholder="Supporting detail" /></Field>
            <Chk value={it.done} onChange={v => set(i, { done: v })} label="Done" />
          </Group>
        ))}
        <AddBtn onClick={() => up({ items: [...items, { text: 'New task', note: '', done: false }] })}>+ Add task</AddBtn>
      </>;
    },
  },

};

const BLOCK_ORDER = [
  'header', 'announcement', 'hero', 'body', 'simplelist', 'alert', 'steps', 'checklist', 'todolist',
  'ctablock', 'twocol', 'stats', 'bigmetric', 'code', 'image', 'feature',
  'timeline', 'quote', 'testimonial', 'linklist', 'changelog', 'event',
  'plan', 'sociallinks', 'signature', 'divider', 'footer',
];

Object.assign(window, { BLOCKS, BLOCK_ORDER, Field, TI, UI, TA, Seg, Chk });
