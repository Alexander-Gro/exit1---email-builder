/* =============================================================
   Exit1.dev — Social Post Builder
   React 18 + Babel standalone (shares global scope with editor.jsx)
   ============================================================= */

/* ── Formats ── */
const SOCIAL_FORMATS = [
  { id: 'ig-post',      label: 'Instagram Post',      dim: '1080 × 1080', w: 1080, h: 1080, carousel: false, icon: '◻' },
  { id: 'ig-carousel',  label: 'Instagram Carousel',  dim: '1080 × 1080', w: 1080, h: 1080, carousel: true,  icon: '⧉' },
  { id: 'fb-post',      label: 'Facebook Post',        dim: '1200 × 630',  w: 1200, h: 630,  carousel: false, icon: '◻' },
  { id: 'li-post',      label: 'LinkedIn Post',        dim: '1200 × 628',  w: 1200, h: 628,  carousel: false, icon: '◻' },
  { id: 'li-carousel',  label: 'LinkedIn Carousel',   dim: '1080 × 1080', w: 1080, h: 1080, carousel: true,  icon: '⧉' },
];

/* ── Plans (mirrors email builder) ── */
const SOCIAL_PLANS = {
  free:   { label: 'Free',   accent: '#B2D3E6', contrast: '#000000' },
  nano:   { label: 'Nano',   accent: '#4A8DB8', contrast: '#ffffff' },
  scale:  { label: 'Scale',  accent: '#3EB5A5', contrast: '#ffffff' },
  agency: { label: 'Agency', accent: '#3FB873', contrast: '#ffffff' },
};

/* ── Template definitions ── */
const SOCIAL_TEMPLATES = [
  {
    id: 'announcement',
    label: 'Announcement',
    desc: 'Headline + sub + CTA',
    icon: '📢',
    defaults: () => ({
      eyebrow: 'NEW FEATURE',
      headline: 'Build faster\nwith exit1.dev',
      sub: 'The developer infrastructure platform for teams that move fast.',
      ctaText: 'Learn more →',
    }),
  },
  {
    id: 'quote',
    label: 'Quote',
    desc: 'Pull quote + attribution',
    icon: '"',
    defaults: () => ({
      quote: '"This platform completely changed how we ship. Deployments went from hours to minutes."',
      author: 'Alex Johnson',
      role: 'CTO at Startup Co.',
    }),
  },
  {
    id: 'metric',
    label: 'Big Metric',
    desc: 'Giant number + label',
    icon: '#',
    defaults: () => ({
      value: '99.9%',
      label: 'Uptime SLA',
      sub: 'Backed by infrastructure you can trust, 24/7.',
    }),
  },
  {
    id: 'features',
    label: 'Feature List',
    desc: 'Headline + 3 bullets',
    icon: '✦',
    defaults: () => ({
      headline: 'Everything you\nneed to ship',
      points: [
        'Zero-config deployments in seconds',
        'Real-time monitoring & alerting',
        'Built-in team collaboration tools',
      ],
    }),
  },
  {
    id: 'twocol',
    label: 'Two-Col Stats',
    desc: '2×2 stat grid',
    icon: '▦',
    defaults: () => ({
      headline: 'By the numbers',
      stats: [
        { value: '10k+', label: 'Developers' },
        { value: '500M', label: 'Requests/day' },
        { value: '99.9%', label: 'Uptime' },
        { value: '<50ms', label: 'P99 latency' },
      ],
    }),
  },
  {
    id: 'status',
    label: 'Status Update',
    desc: 'Status badge + headline',
    icon: '●',
    defaults: () => ({
      status: 'up',
      badgeText: 'All Systems Operational',
      headline: 'Incident resolved.\nWe\'re back.',
      body: 'The outage affecting API responses has been fully resolved as of 14:32 UTC. All services are operating normally.',
    }),
  },
];

const SOCIAL_SK = 'exit1-social-v1';
const loadSocialDraft = () => {
  try {
    const d = JSON.parse(localStorage.getItem(SOCIAL_SK) || 'null');
    if (d && d.formatId && d.templateId) return d;
  } catch {}
  return {
    formatId: 'ig-post',
    templateId: 'announcement',
    plan: 'nano',
    slides: [SOCIAL_TEMPLATES[0].defaults()],
  };
};
const saveSocialDraft = d => localStorage.setItem(SOCIAL_SK, JSON.stringify(d));

/* ── Template renderers ── */
function renderTemplate(templateId, data, accent, contrast, isLandscape) {
  const STATUS_COLORS = { up: '#3FB873', down: '#E24530', warn: '#E3B24A', info: '#4A8DB8' };

  switch (templateId) {
    case 'announcement': return (
      <div className="spt-announcement">
        {data.eyebrow && (
          <div className="spt-eyebrow" style={{ color: accent }}>{data.eyebrow}</div>
        )}
        <div className="spt-headline">{(data.headline||'').split('\n').map((l,i)=><React.Fragment key={i}>{l}{i<(data.headline||'').split('\n').length-1&&<br/>}</React.Fragment>)}</div>
        {data.sub && <div className="spt-sub">{data.sub}</div>}
        {data.ctaText && (
          <div className="spt-cta" style={{ background: accent, color: contrast }}>{data.ctaText}</div>
        )}
      </div>
    );

    case 'quote': return (
      <div className="spt-quote">
        <div className="spt-quote-mark" style={{ color: accent }}>"</div>
        <div className="spt-quote-text">{data.quote}</div>
        <div className="spt-quote-attr">
          <div className="spt-quote-avatar" style={{ background: accent, color: contrast }}>
            {(data.author||'?')[0].toUpperCase()}
          </div>
          <div>
            <div className="spt-quote-author">{data.author}</div>
            <div className="spt-quote-role">{data.role}</div>
          </div>
        </div>
      </div>
    );

    case 'metric': return (
      <div className="spt-metric">
        <div className="spt-metric-value" style={{ color: accent }}>{data.value}</div>
        <div className="spt-metric-label">{data.label}</div>
        {data.sub && <div className="spt-metric-sub">{data.sub}</div>}
      </div>
    );

    case 'features': return (
      <div className="spt-features">
        <div className="spt-features-headline">{(data.headline||'').split('\n').map((l,i)=><React.Fragment key={i}>{l}{i<(data.headline||'').split('\n').length-1&&<br/>}</React.Fragment>)}</div>
        {(data.points||[]).map((pt, i) => (
          <div key={i} className="spt-feature-item">
            <div className="spt-feature-dot" style={{ background: accent, marginTop: isLandscape ? 7 : 8 }}></div>
            <div className="spt-feature-text">{pt}</div>
          </div>
        ))}
      </div>
    );

    case 'twocol': return (
      <div className="spt-twocol">
        {data.headline && <div className="spt-twocol-headline">{data.headline}</div>}
        <div className="spt-stat-grid">
          {(data.stats||[]).map((s, i) => (
            <div key={i} className="spt-stat-card">
              <div className="spt-stat-val" style={{ color: accent }}>{s.value}</div>
              <div className="spt-stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    );

    case 'status': {
      const sc = STATUS_COLORS[data.status] || STATUS_COLORS.up;
      return (
        <div className="spt-status">
          <div className="spt-status-badge">
            <div className="spt-status-dot" style={{ background: sc, boxShadow: `0 0 0 3px ${sc}30` }}></div>
            <span style={{ color: sc }}>{data.badgeText}</span>
          </div>
          <div className="spt-status-headline">{(data.headline||'').split('\n').map((l,i)=><React.Fragment key={i}>{l}{i<(data.headline||'').split('\n').length-1&&<br/>}</React.Fragment>)}</div>
          {data.body && <div className="spt-status-body">{data.body}</div>}
        </div>
      );
    }

    default: return <div style={{color:'rgba(255,255,255,0.3)',padding:40}}>Unknown template</div>;
  }
}

/* ── Inspector field primitives (reuse naming from email builder) ── */
const SF = ({ label, children }) => (
  <div className="field">
    <label>{label}</label>
    {children}
  </div>
);
const STI = ({ value, onChange, placeholder }) => (
  <input type="text" value={value||''} placeholder={placeholder||''} onChange={e=>onChange(e.target.value)} />
);
const STA = ({ value, onChange, placeholder, rows }) => (
  <textarea value={value||''} placeholder={placeholder||''} rows={rows||3} onChange={e=>onChange(e.target.value)} style={{minHeight: rows?`${rows*20}px`:'72px'}} />
);

function TemplateInspector({ templateId, data, update }) {
  const STATUS_OPTIONS = [
    { value: 'up',   label: 'Up' },
    { value: 'down', label: 'Down' },
    { value: 'warn', label: 'Warning' },
    { value: 'info', label: 'Info' },
  ];

  switch (templateId) {
    case 'announcement': return (
      <>
        <SF label="Eyebrow"><STI value={data.eyebrow} onChange={v=>update({eyebrow:v})} placeholder="NEW FEATURE" /></SF>
        <SF label="Headline"><STA value={data.headline} onChange={v=>update({headline:v})} placeholder="Your headline" rows={3} /></SF>
        <SF label="Subheading"><STA value={data.sub} onChange={v=>update({sub:v})} placeholder="Supporting text…" rows={2} /></SF>
        <SF label="CTA Text"><STI value={data.ctaText} onChange={v=>update({ctaText:v})} placeholder="Learn more →" /></SF>
      </>
    );

    case 'quote': return (
      <>
        <SF label="Quote"><STA value={data.quote} onChange={v=>update({quote:v})} rows={4} /></SF>
        <SF label="Author"><STI value={data.author} onChange={v=>update({author:v})} /></SF>
        <SF label="Role / Company"><STI value={data.role} onChange={v=>update({role:v})} /></SF>
      </>
    );

    case 'metric': return (
      <>
        <SF label="Value"><STI value={data.value} onChange={v=>update({value:v})} placeholder="99.9%" /></SF>
        <SF label="Label"><STI value={data.label} onChange={v=>update({label:v})} placeholder="Uptime SLA" /></SF>
        <SF label="Supporting Text"><STA value={data.sub} onChange={v=>update({sub:v})} rows={2} /></SF>
      </>
    );

    case 'features': return (
      <>
        <SF label="Headline"><STA value={data.headline} onChange={v=>update({headline:v})} rows={2} /></SF>
        {(data.points||[]).map((pt, i) => (
          <div key={i} className="field-group" style={{marginBottom:8}}>
            <div className="field-group-head">
              <h4>Point {i+1}</h4>
              <button className="mini-btn danger" onClick={()=>update({points:(data.points||[]).filter((_,j)=>j!==i)})}>Remove</button>
            </div>
            <div className="field">
              <input type="text" value={pt} onChange={e=>{const pts=[...(data.points||[])];pts[i]=e.target.value;update({points:pts});}} />
            </div>
          </div>
        ))}
        {(data.points||[]).length < 5 && (
          <button className="mini-btn" style={{width:'100%',padding:'6px',marginBottom:12}} onClick={()=>update({points:[...(data.points||[]),'New point']})}>+ Add point</button>
        )}
      </>
    );

    case 'twocol': return (
      <>
        <SF label="Headline"><STI value={data.headline} onChange={v=>update({headline:v})} /></SF>
        {(data.stats||[]).map((s, i) => (
          <div key={i} className="field-group" style={{marginBottom:8}}>
            <div className="field-group-head"><h4>Stat {i+1}</h4></div>
            <div className="field-row">
              <div className="field"><label>Value</label><input type="text" value={s.value} onChange={e=>{const ss=[...(data.stats||[])];ss[i]={...ss[i],value:e.target.value};update({stats:ss});}}/></div>
              <div className="field"><label>Label</label><input type="text" value={s.label} onChange={e=>{const ss=[...(data.stats||[])];ss[i]={...ss[i],label:e.target.value};update({stats:ss});}}/></div>
            </div>
          </div>
        ))}
      </>
    );

    case 'status': return (
      <>
        <SF label="Status">
          <select value={data.status||'up'} onChange={e=>update({status:e.target.value})}>
            {STATUS_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </SF>
        <SF label="Badge Text"><STI value={data.badgeText} onChange={v=>update({badgeText:v})} /></SF>
        <SF label="Headline"><STA value={data.headline} onChange={v=>update({headline:v})} rows={2} /></SF>
        <SF label="Body"><STA value={data.body} onChange={v=>update({body:v})} rows={3} /></SF>
      </>
    );

    default: return null;
  }
}

/* ── Post canvas component (rendered at native size for export) ── */
function PostCanvas({ formatId, templateId, data, plan, exportRef }) {
  const fmt = SOCIAL_FORMATS.find(f=>f.id===formatId) || SOCIAL_FORMATS[0];
  const planData = SOCIAL_PLANS[plan] || SOCIAL_PLANS.nano;
  const accent = planData.accent;
  const contrast = planData.contrast;
  const isLandscape = fmt.w > fmt.h;

  return (
    <div
      ref={exportRef}
      className={`sp-canvas${isLandscape?' landscape':''}`}
      style={{ width: fmt.w, height: fmt.h, '--e1-accent': accent }}
    >
      {renderTemplate(templateId, data, accent, contrast, isLandscape)}
      <div className="sp-logo-mark">e_</div>
    </div>
  );
}

/* ── Main SocialApp component ── */
const SocialApp = ({ view, setView }) => {
  const [draft, setDraft] = React.useState(loadSocialDraft);
  const [exporting, setExporting] = React.useState(false);
  const [exportingAll, setExportingAll] = React.useState(false);
  const exportRef = React.useRef(null);

  React.useEffect(() => { saveSocialDraft(draft); }, [draft]);

  const fmt = SOCIAL_FORMATS.find(f => f.id === draft.formatId) || SOCIAL_FORMATS[0];
  const tmpl = SOCIAL_TEMPLATES.find(t => t.id === draft.templateId) || SOCIAL_TEMPLATES[0];
  const planData = SOCIAL_PLANS[draft.plan] || SOCIAL_PLANS.nano;
  const currentSlide = draft.slides[draft.slideIndex || 0] || tmpl.defaults();

  const setFormatId = id => {
    setDraft(d => ({ ...d, formatId: id, slideIndex: 0 }));
  };

  const setTemplateId = id => {
    const tmplDef = SOCIAL_TEMPLATES.find(t => t.id === id);
    if (!tmplDef) return;
    setDraft(d => ({
      ...d,
      templateId: id,
      slideIndex: 0,
      slides: [tmplDef.defaults()],
    }));
  };

  const updateSlide = patch => {
    setDraft(d => {
      const idx = d.slideIndex || 0;
      const slides = d.slides.map((s, i) => i === idx ? { ...s, ...patch } : s);
      return { ...d, slides };
    });
  };

  const addSlide = () => {
    setDraft(d => ({
      ...d,
      slides: [...d.slides, tmpl.defaults()],
      slideIndex: d.slides.length,
    }));
  };

  const deleteSlide = () => {
    if (draft.slides.length <= 1) return;
    const idx = draft.slideIndex || 0;
    setDraft(d => {
      const slides = d.slides.filter((_, i) => i !== idx);
      return { ...d, slides, slideIndex: Math.max(0, idx - 1) };
    });
  };

  const goSlide = dir => {
    setDraft(d => {
      const next = Math.max(0, Math.min(d.slides.length - 1, (d.slideIndex || 0) + dir));
      return { ...d, slideIndex: next };
    });
  };

  const doExportPng = async (slideData, filename) => {
    if (!window.html2canvas) {
      alert('html2canvas not loaded. Check your internet connection.');
      return;
    }
    // Build a temp off-screen container at native size
    const container = document.createElement('div');
    container.style.cssText = `position:fixed;left:-9999px;top:0;width:${fmt.w}px;height:${fmt.h}px;z-index:-1;`;
    document.body.appendChild(container);

    const root = ReactDOM.createRoot(container);
    root.render(
      <PostCanvas formatId={draft.formatId} templateId={draft.templateId} data={slideData} plan={draft.plan} exportRef={{current:null}} />
    );

    // Give React a tick to render
    await new Promise(r => setTimeout(r, 120));

    const canvasEl = container.firstChild;
    try {
      const c = await window.html2canvas(canvasEl, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#000000',
        width: fmt.w,
        height: fmt.h,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = filename;
      link.href = c.toDataURL('image/png');
      link.click();
    } finally {
      root.unmount();
      document.body.removeChild(container);
    }
  };

  const exportPng = async () => {
    setExporting(true);
    try {
      const slug = draft.templateId;
      const ts = Date.now();
      await doExportPng(currentSlide, `exit1-${slug}-${ts}.png`);
    } finally {
      setExporting(false);
    }
  };

  const exportAllSlides = async () => {
    setExportingAll(true);
    try {
      const slug = draft.templateId;
      const ts = Date.now();
      for (let i = 0; i < draft.slides.length; i++) {
        await doExportPng(draft.slides[i], `exit1-${slug}-${ts}-slide${i + 1}.png`);
        await new Promise(r => setTimeout(r, 200));
      }
    } finally {
      setExportingAll(false);
    }
  };

  // Preview scaling
  const PREVIEW_MAX_W = 500;
  const previewW = PREVIEW_MAX_W;
  const scale = previewW / fmt.w;
  const previewH = fmt.h * scale;

  return (
    <>
      <div className="topbar">
        <span className="topbar-brand">
          <span className="mark">e_</span> exit1.dev
        </span>
        <div className="view-tabs">
          <button className={`view-tab${view==='email'?' active':''}`} onClick={()=>setView('email')}>Email</button>
          <button className={`view-tab${view==='social'?' active':''}`} onClick={()=>setView('social')}>Social</button>
        </div>
        {/* Plan indicator */}
        <span style={{
          display:'inline-flex',alignItems:'center',gap:6,
          marginLeft:8,padding:'3px 10px',
          borderRadius:9999,border:'1px solid rgba(255,255,255,0.1)',
          fontSize:11,fontWeight:600,letterSpacing:'0.06em',
          background:`${planData.accent}18`,
          color:planData.accent,
        }}>
          <span style={{width:6,height:6,borderRadius:'50%',background:planData.accent}}></span>
          {planData.label.toUpperCase()}
        </span>
        <span className="topbar-spacer"></span>
        <button
          className="topbar-btn primary"
          onClick={exportPng}
          disabled={exporting}
        >
          {exporting ? 'Exporting…' : 'Export PNG'}
        </button>
        {fmt.carousel && (
          <button
            className="topbar-btn ghost"
            onClick={exportAllSlides}
            disabled={exportingAll}
          >
            {exportingAll ? 'Exporting…' : `Export All (${draft.slides.length})`}
          </button>
        )}
      </div>

      <div className="social-workspace">
        {/* ── Left: Format + Template palette ── */}
        <div className="sp-palette">
          <div className="sp-section-title">Format</div>
          <div className="sp-format-list">
            {SOCIAL_FORMATS.map(f => (
              <div
                key={f.id}
                className={`sp-format-item${draft.formatId===f.id?' active':''}`}
                onClick={() => setFormatId(f.id)}
              >
                <div className="sp-format-icon">{f.carousel ? '⧉' : '◻'}</div>
                <div className="sp-format-meta">
                  <div className="sp-format-label">{f.label}</div>
                  <div className="sp-format-dim">{f.dim}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="sp-section-title">Template</div>
          <div className="sp-template-grid">
            {SOCIAL_TEMPLATES.map(t => (
              <div
                key={t.id}
                className={`sp-template-card${draft.templateId===t.id?' active':''}`}
                onClick={() => setTemplateId(t.id)}
              >
                <div className="sp-template-thumb" style={{ fontSize: 28 }}>{t.icon}</div>
                <div className="sp-template-name">{t.label}</div>
                <div className="sp-template-desc">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Center: Canvas ── */}
        <div className="sp-canvas-wrap">
          <div className="sp-canvas-meta">
            <span>{fmt.label} — {fmt.dim}</span>
            <span>{tmpl.label}</span>
          </div>

          <div className="sp-canvas-outer" style={{ width: previewW, height: previewH }}>
            <div style={{ width: fmt.w, height: fmt.h, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
              <PostCanvas
                formatId={draft.formatId}
                templateId={draft.templateId}
                data={currentSlide}
                plan={draft.plan}
                exportRef={exportRef}
              />
            </div>
          </div>

          {fmt.carousel && (
            <div className="sp-carousel-controls">
              <button className="sp-carousel-btn" onClick={() => goSlide(-1)} disabled={(draft.slideIndex||0) === 0}>‹</button>
              <span className="sp-carousel-label">
                Slide {(draft.slideIndex||0)+1} / {draft.slides.length}
              </span>
              <button className="sp-carousel-btn" onClick={() => goSlide(1)} disabled={(draft.slideIndex||0) >= draft.slides.length-1}>›</button>
              <button className="sp-carousel-btn" onClick={addSlide} title="Add slide" style={{marginLeft:6}}>+</button>
              <button className="sp-carousel-btn" onClick={deleteSlide} disabled={draft.slides.length<=1} title="Delete slide" style={{color:'#ff8095'}}>×</button>
            </div>
          )}
        </div>

        {/* ── Right: Inspector ── */}
        <div className="sp-inspector">
          <div className="sp-inspector-header">
            <h2>{tmpl.label}</h2>
            <span style={{fontSize:11,color:'var(--ed-text-dim)',letterSpacing:'0.1em',textTransform:'uppercase'}}>{fmt.label}</span>
          </div>
          <div className="sp-inspector-body">

            {/* Content fields */}
            <TemplateInspector
              templateId={draft.templateId}
              data={currentSlide}
              update={updateSlide}
            />

            <hr style={{border:'none',borderTop:'1px solid var(--ed-border)',margin:'16px 0'}} />

            {/* Plan selector */}
            <div className="field">
              <label>Plan Color</label>
              <div className="plan-grid">
                {Object.entries(SOCIAL_PLANS).map(([key, p]) => (
                  <div
                    key={key}
                    className={`plan-card${draft.plan===key?' selected':''}`}
                    onClick={() => setDraft(d=>({...d,plan:key}))}
                  >
                    <div className="plan-swatch" style={{background:p.accent}}></div>
                    <div className="plan-card-name">{p.label}</div>
                    <div className="plan-card-desc">{p.accent}</div>
                  </div>
                ))}
              </div>
            </div>

            <hr style={{border:'none',borderTop:'1px solid var(--ed-border)',margin:'16px 0'}} />

            {/* Export */}
            <button className="sp-export-btn" onClick={exportPng} disabled={exporting}>
              {exporting ? 'Exporting…' : '↓ Export PNG'}
            </button>
            {fmt.carousel && (
              <button className="sp-export-btn ghost" onClick={exportAllSlides} disabled={exportingAll}>
                {exportingAll ? 'Exporting…' : `↓ Export All Slides (${draft.slides.length})`}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
