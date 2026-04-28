/* ================================================================
   Exit1.dev Email Builder — Block Registry  (v2)
   Each block: type · label · icon · defaults() · render(data) · inspector(data, update)
   Accent colour flows in via CSS --e1-accent on the .e1-shell wrapper.
   ================================================================ */

const { useState } = React;

/* ─── Shared form primitives ─── */
const Field = ({ label, children, help }) => (
  <div className="field">
    {label && <label>{label}</label>}
    {children}
    {help && <div className="help-text">{help}</div>}
  </div>
);
const TI  = ({ value, onChange, placeholder }) => (
  <input type="text"  value={value||''} placeholder={placeholder||''} onChange={e=>onChange(e.target.value)} />
);
const UI  = ({ value, onChange }) => (
  <input type="url"   value={value||''} placeholder="https://…" onChange={e=>onChange(e.target.value)} />
);
const TA  = ({ value, onChange, rows=3 }) => (
  <textarea rows={rows} value={value||''} onChange={e=>onChange(e.target.value)} />
);
const Seg = ({ value, onChange, options }) => (
  <div className="segmented">
    {options.map(o=>(
      <button key={o.value} className={value===o.value?'on':''} onClick={()=>onChange(o.value)}>{o.label}</button>
    ))}
  </div>
);
const Chk = ({ value, onChange, label }) => (
  <label className="field-check">
    <input type="checkbox" checked={!!value} onChange={e=>onChange(e.target.checked)} />
    <span>{label}</span>
  </label>
);

/* ─── Block definitions ─── */
const BLOCKS = {

  /* ── Header ── */
  header: {
    type:'header', label:'Header', icon:'H',
    defaults: ()=>({ logoMark:'e_', brandName:'exit1.dev', showStatus:true, statusText:'All systems watching', statusType:'up' }),
    render: d=>(
      <header className="e1-header">
        <span className="e1-logo">
          <img
            src="assets/exit1-logo.png"
            alt="exit1.dev"
            width="130"
            height="28"
            style={{display:'block',width:130,height:28,objectFit:'contain',objectPosition:'left center'}}
          />
        </span>
        {d.showStatus&&(
          <span className="e1-status-pill">
            <span className={`e1-status-dot${d.statusType==='down'?' down':d.statusType==='warn'?' warn':''}`}></span>
            {d.statusText}
          </span>
        )}
      </header>
    ),
    inspector: (d,up)=>(
      <>
        <div className="help-text" style={{marginBottom:12}}>Logo uses the official exit1.dev PNG asset. The fields below are kept as fallback text for email clients that block images.</div>
        <Field label="Alt / fallback text"><TI value={d.brandName} onChange={v=>up({brandName:v})} /></Field>
        <Chk value={d.showStatus} onChange={v=>up({showStatus:v})} label="Show status pill" />
        {d.showStatus&&<>
          <Field label="Status label"><TI value={d.statusText} onChange={v=>up({statusText:v})} /></Field>
          <Field label="Status colour">
            <Seg value={d.statusType} onChange={v=>up({statusType:v})}
              options={[{value:'up',label:'Up'},{value:'warn',label:'Warn'},{value:'down',label:'Down'}]} />
          </Field>
        </>}
      </>
    ),
  },

  /* ── Hero ── */
  hero: {
    type:'hero', label:'Hero', icon:'A',
    defaults: ()=>({ eyebrow:'Welcome · Free tier', heading:'You just stopped flying blind.', sub:'Two minutes of setup. Then we watch, so your customers don\'t have to tell you first.' }),
    render: d=>(
      <section className="e1-hero">
        {d.eyebrow&&<span className="e1-eyebrow">{d.eyebrow}</span>}
        <h1>{d.heading}</h1>
        {d.sub&&<p className="sub">{d.sub}</p>}
      </section>
    ),
    inspector: (d,up)=>(
      <>
        <Field label="Eyebrow"><TI value={d.eyebrow} onChange={v=>up({eyebrow:v})} /></Field>
        <Field label="Heading"><TA value={d.heading} onChange={v=>up({heading:v})} rows={2} /></Field>
        <Field label="Subtitle"><TA value={d.sub} onChange={v=>up({sub:v})} rows={3} /></Field>
      </>
    ),
  },

  /* ── Body text ── */
  body: {
    type:'body', label:'Body text', icon:'¶',
    defaults: ()=>({ paragraphs:[
      {text:'Hey {{first_name}},', style:'lede'},
      {text:'Most teams find out their site is down the same way: a customer messages them.', style:'normal'},
      {text:'That gap — between when something breaks and when you know about it — is what exit1.dev closes.', style:'normal'},
    ]}),
    render: d=>(
      <section className="e1-body">
        {(d.paragraphs||[]).map((p,i)=>(
          <p key={i} className={p.style==='lede'?'lede':p.style==='close'?'close':''}>{p.text}</p>
        ))}
      </section>
    ),
    inspector: (d,up)=>{
      const ps=d.paragraphs||[];
      const set=(i,patch)=>up({paragraphs:ps.map((p,x)=>x===i?{...p,...patch}:p)});
      return <>
        {ps.map((p,i)=>(
          <div key={i} className="field-group">
            <div className="field-group-head">
              <h4>Para {i+1}</h4>
              <button className="mini-btn danger" onClick={()=>up({paragraphs:ps.filter((_,x)=>x!==i)})}>Remove</button>
            </div>
            <Field><TA value={p.text} onChange={v=>set(i,{text:v})} rows={3} /></Field>
            <Field label="Style">
              <Seg value={p.style||'normal'} onChange={v=>set(i,{style:v})}
                options={[{value:'normal',label:'Normal'},{value:'lede',label:'Lede'},{value:'close',label:'Close'}]} />
            </Field>
          </div>
        ))}
        <button className="topbar-btn" onClick={()=>up({paragraphs:[...ps,{text:'New paragraph.',style:'normal'}]})}>+ Add paragraph</button>
      </>;
    },
  },

  /* ── Step cards ── */
  steps: {
    type:'steps', label:'Step cards', icon:'☰',
    defaults: ()=>({ items:[
      {number:'01',label:'Step one',  title:'Add a check',      body:'Paste in any URL — your site, your API, your checkout page. exit1 starts watching immediately.',       ctaText:'Add your first check',    ctaUrl:'{{dashboard_url}}', ctaStyle:'ghost'},
      {number:'02',label:'Step two',  title:'Connect your team',body:'Slack, Discord, or plain email — choose where you want to hear about problems.',                       ctaText:'Connect an alert channel', ctaUrl:'{{alerts_url}}',    ctaStyle:'ghost'},
    ]}),
    render: d=>(
      <section className="e1-steps">
        {(d.items||[]).map((s,i)=>(
          <article key={i} className="e1-step">
            <div className="e1-step-meta">
              <span className="e1-step-num">{s.number}</span>
              <span className="e1-step-label">{s.label}</span>
            </div>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
            {s.ctaText&&(
              <a href={s.ctaUrl||'#'} className={s.ctaStyle==='primary'?'e1-cta-primary':'e1-cta-ghost'}>
                {s.ctaText} →
              </a>
            )}
          </article>
        ))}
      </section>
    ),
    inspector: (d,up)=>{
      const items=d.items||[];
      const set=(i,patch)=>up({items:items.map((it,x)=>x===i?{...it,...patch}:it)});
      return <>
        {items.map((s,i)=>(
          <div key={i} className="field-group">
            <div className="field-group-head">
              <h4>Step {i+1}</h4>
              <button className="mini-btn danger" onClick={()=>up({items:items.filter((_,x)=>x!==i)})}>Remove</button>
            </div>
            <div className="field-row">
              <Field label="Number"><TI value={s.number} onChange={v=>set(i,{number:v})} /></Field>
              <Field label="Label"><TI value={s.label}  onChange={v=>set(i,{label:v})}  /></Field>
            </div>
            <Field label="Title"><TI value={s.title} onChange={v=>set(i,{title:v})} /></Field>
            <Field label="Body"><TA value={s.body}   onChange={v=>set(i,{body:v})}   rows={3}/></Field>
            <Field label="CTA text"><TI value={s.ctaText} onChange={v=>set(i,{ctaText:v})} /></Field>
            <Field label="CTA URL"><UI  value={s.ctaUrl}  onChange={v=>set(i,{ctaUrl:v})}  /></Field>
            <Field label="CTA style">
              <Seg value={s.ctaStyle||'ghost'} onChange={v=>set(i,{ctaStyle:v})}
                options={[{value:'ghost',label:'Ghost'},{value:'primary',label:'Filled'}]} />
            </Field>
          </div>
        ))}
        <button className="topbar-btn" onClick={()=>up({items:[...items,{number:String(items.length+1).padStart(2,'0'),label:`Step ${items.length+1}`,title:'New step',body:'Description.',ctaText:'Call to action',ctaUrl:'#',ctaStyle:'ghost'}]})}>+ Add step</button>
      </>;
    },
  },

  /* ── Button / CTA block ── */
  ctablock: {
    type:'ctablock', label:'Button', icon:'▸',
    defaults: ()=>({text:'Get started',url:'{{dashboard_url}}',style:'primary'}),
    render: d=>(
      <div className="e1-ctablock">
        <a href={d.url||'#'} className={d.style==='ghost'?'e1-cta-ghost':'e1-cta-primary'}>
          {d.text} →
        </a>
      </div>
    ),
    inspector: (d,up)=>(
      <>
        <Field label="Button text"><TI value={d.text} onChange={v=>up({text:v})} /></Field>
        <Field label="URL"><UI value={d.url} onChange={v=>up({url:v})} /></Field>
        <Field label="Style">
          <Seg value={d.style} onChange={v=>up({style:v})}
            options={[{value:'primary',label:'Filled'},{value:'ghost',label:'Ghost'}]} />
        </Field>
      </>
    ),
  },

  /* ── Stat row ── */
  stats: {
    type:'stats', label:'Stat row', icon:'#',
    defaults: ()=>({items:[
      {label:'Uptime',   value:'99.98%', sub:'last 30 days'},
      {label:'Checks',   value:'3',      sub:'active'},
      {label:'Response', value:'142ms',  sub:'median'},
    ]}),
    render: d=>(
      <section className="e1-stats">
        {(d.items||[]).map((s,i)=>(
          <div key={i} className="e1-stat">
            <p className="e1-stat-label">{s.label}</p>
            <div className="e1-stat-value">{s.value}</div>
            {s.sub&&<div className="e1-stat-sub">{s.sub}</div>}
          </div>
        ))}
      </section>
    ),
    inspector: (d,up)=>{
      const items=d.items||[];
      const set=(i,patch)=>up({items:items.map((it,x)=>x===i?{...it,...patch}:it)});
      return <>
        {items.map((s,i)=>(
          <div key={i} className="field-group">
            <div className="field-group-head">
              <h4>Stat {i+1}</h4>
              <button className="mini-btn danger" onClick={()=>up({items:items.filter((_,x)=>x!==i)})}>Remove</button>
            </div>
            <Field label="Label"><TI value={s.label} onChange={v=>set(i,{label:v})} /></Field>
            <Field label="Value"><TI value={s.value} onChange={v=>set(i,{value:v})} /></Field>
            <Field label="Sub"><TI   value={s.sub}   onChange={v=>set(i,{sub:v})}   /></Field>
          </div>
        ))}
        <button className="topbar-btn" onClick={()=>up({items:[...items,{label:'Label',value:'0',sub:''}]})}>+ Add stat</button>
      </>;
    },
  },

  /* ── Feature card ── */
  feature: {
    type:'feature', label:'Feature card', icon:'▦',
    defaults: ()=>({imgUrl:'', mediaLabel:'[ Screenshot placeholder ]', imgAlt:'', heading:'New: Domain Intelligence', body:'Track domain registration expiry automatically across every URL you monitor.', ctaText:'', ctaUrl:'', ctaStyle:'ghost'}),
    render: d=>(
      <div className="e1-feature">
        {d.imgUrl
          ? <img src={d.imgUrl} alt={d.imgAlt||''} style={{display:'block',width:'100%',height:'auto',borderBottom:'1px solid rgba(255,255,255,0.08)'}} />
          : <div className="e1-feature-media">{d.mediaLabel}</div>
        }
        <div className="e1-feature-body">
          <h3>{d.heading}</h3>
          <p>{d.body}</p>
          {d.ctaText&&<a href={d.ctaUrl||'#'} className={d.ctaStyle==='primary'?'e1-cta-primary':'e1-cta-ghost'} style={{marginTop:12,display:'inline-flex'}}>{d.ctaText} →</a>}
        </div>
      </div>
    ),
    inspector: (d,up)=>(
      <>
        <Field label="Image URL" help="Paste a public https:// URL to replace the placeholder"><UI value={d.imgUrl} onChange={v=>up({imgUrl:v})} /></Field>
        {d.imgUrl
          ? <Field label="Image alt text"><TI value={d.imgAlt} onChange={v=>up({imgAlt:v})} /></Field>
          : <Field label="Placeholder label" help="Shown when no image URL is set"><TI value={d.mediaLabel} onChange={v=>up({mediaLabel:v})} /></Field>
        }
        <Field label="Heading"><TI value={d.heading} onChange={v=>up({heading:v})} /></Field>
        <Field label="Body"><TA value={d.body} onChange={v=>up({body:v})} rows={3} /></Field>
        <Field label="CTA text (optional)"><TI value={d.ctaText} onChange={v=>up({ctaText:v})} /></Field>
        {d.ctaText&&<>
          <Field label="CTA URL"><UI value={d.ctaUrl} onChange={v=>up({ctaUrl:v})} /></Field>
          <Field label="CTA style">
            <Seg value={d.ctaStyle||'ghost'} onChange={v=>up({ctaStyle:v})}
              options={[{value:'ghost',label:'Ghost'},{value:'primary',label:'Filled'}]} />
          </Field>
        </>}
      </>
    ),
  },

  /* ── Quote ── */
  quote: {
    type:'quote', label:'Quote', icon:'"',
    defaults: ()=>({quote:'exit1 told us about the outage four minutes before our users would have.',author:'Ana Reyes',role:'CTO, Stripe Ledger'}),
    render: d=>(
      <div className="e1-quote">
        <blockquote>"{d.quote}"</blockquote>
        <div className="e1-quote-attr">
          <div className="e1-quote-avatar"></div>
          <span><b>{d.author}</b> · {d.role}</span>
        </div>
      </div>
    ),
    inspector: (d,up)=>(
      <>
        <Field label="Quote"><TA value={d.quote} onChange={v=>up({quote:v})} rows={4} /></Field>
        <Field label="Author"><TI value={d.author} onChange={v=>up({author:v})} /></Field>
        <Field label="Role"><TI   value={d.role}   onChange={v=>up({role:v})}   /></Field>
      </>
    ),
  },

  /* ── Plan card ── */
  plan: {
    type:'plan', label:'Plan card', icon:'▭',
    defaults: ()=>({label:'Your plan', tier:'Free', specs:['10 checks','5-minute intervals','SSL monitoring','Email alerts'], upsell:'Need faster detection or SMS? Take a look at **Nano** when you\'re ready.'}),
    render: d=>(
      <aside className="e1-plan" aria-label="Your plan">
        <div className="e1-plan-head">
          <span className="e1-plan-label">{d.label}</span>
          <span className="e1-plan-tier">{d.tier}</span>
        </div>
        <ul className="e1-plan-specs">
          {(d.specs||[]).map((s,i)=><li key={i}>{s}</li>)}
        </ul>
        {d.upsell&&<p className="e1-plan-upsell" dangerouslySetInnerHTML={{__html:(d.upsell||'').replace(/\*\*(.+?)\*\*/g,'<b>$1</b>')}} />}
      </aside>
    ),
    inspector: (d,up)=>(
      <>
        <Field label="Label"><TI value={d.label} onChange={v=>up({label:v})} /></Field>
        <Field label="Tier badge"><TI value={d.tier} onChange={v=>up({tier:v})} /></Field>
        <Field label="Specs (one per line)">
          <TA value={(d.specs||[]).join('\n')} onChange={v=>up({specs:v.split('\n').map(s=>s.trim()).filter(Boolean)})} rows={5} />
        </Field>
        <Field label="Upsell line" help="Wrap **bold** with double asterisks">
          <TA value={d.upsell||''} onChange={v=>up({upsell:v})} rows={2} />
        </Field>
      </>
    ),
  },

  /* ── Divider ── */
  divider: {
    type:'divider', label:'Divider', icon:'—',
    defaults: ()=>({}),
    render: ()=><div className="e1-divider"><hr /></div>,
    inspector: ()=><div className="help-text">Horizontal rule between sections.</div>,
  },

  /* ── Footer ── */
  footer: {
    type:'footer', label:'Footer', icon:'F',
    defaults: ()=>({brand:'exit1.dev', links:[{text:'Preferences',url:'{{preferences_url}}'},{text:'Unsubscribe',url:'{{unsubscribe_url}}'}]}),
    render: d=>(
      <footer className="e1-footer">
        <span>{d.brand}</span>
        <span className="e1-footer-meta">
          {(d.links||[]).map((l,i)=><a key={i} href={l.url||'#'}>{l.text}</a>)}
        </span>
      </footer>
    ),
    inspector: (d,up)=>{
      const links=d.links||[];
      const setLink=(i,patch)=>up({links:links.map((l,x)=>x===i?{...l,...patch}:l)});
      return <>
        <Field label="Brand"><TI value={d.brand} onChange={v=>up({brand:v})} /></Field>
        {links.map((l,i)=>(
          <div key={i} className="field-group">
            <div className="field-group-head">
              <h4>Link {i+1}</h4>
              <button className="mini-btn danger" onClick={()=>up({links:links.filter((_,x)=>x!==i)})}>Remove</button>
            </div>
            <Field label="Text"><TI value={l.text} onChange={v=>setLink(i,{text:v})} /></Field>
            <Field label="URL"><UI  value={l.url}  onChange={v=>setLink(i,{url:v})}  /></Field>
          </div>
        ))}
        <button className="topbar-btn" onClick={()=>up({links:[...links,{text:'Link',url:'#'}]})}>+ Add link</button>
      </>;
    },
  },

  /* ── Alert banner ── */
  alert: {
    type:'alert', label:'Alert banner', icon:'!',
    defaults: ()=>({ type:'down', title:'example.com is down', body:'We detected an outage at 14:32 UTC. Our team has been notified and is investigating.', ctaText:'View status page', ctaUrl:'{{status_url}}' }),
    render: d=>{
      const colors = { down:{bg:'#2a0e0e',border:'#E24530',dot:'#E24530',label:'DOWN'}, warn:{bg:'#231a08',border:'#E3B24A',dot:'#E3B24A',label:'DEGRADED'}, up:{bg:'#0a1f12',border:'#3FB873',dot:'#3FB873',label:'OPERATIONAL'}, info:{bg:'#0c1428',border:'#4A8DB8',dot:'#4A8DB8',label:'NOTICE'} };
      const c = colors[d.type]||colors.down;
      return (
        <div style={{margin:'0 32px 16px',padding:20,background:c.bg,border:`1px solid ${c.border}`,borderRadius:10,borderLeft:`3px solid ${c.border}`}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
            <span style={{display:'inline-block',width:8,height:8,borderRadius:'50%',background:c.dot,flexShrink:0}}></span>
            <span style={{fontSize:10,fontWeight:700,color:c.dot,letterSpacing:'0.16em',textTransform:'uppercase'}}>{c.label}</span>
          </div>
          <h3 style={{margin:'0 0 6px',color:'#ffffff',fontSize:17,fontWeight:600}}>{d.title}</h3>
          {d.body&&<p style={{margin:'0 0 12px',color:'rgba(255,255,255,0.65)',fontSize:14,lineHeight:1.55}}>{d.body}</p>}
          {d.ctaText&&<a href={d.ctaUrl||'#'} style={{display:'inline-block',fontSize:13,color:c.dot,fontWeight:600,textDecoration:'underline'}}>{d.ctaText} →</a>}
        </div>
      );
    },
    inspector: (d,up)=>(
      <>
        <Field label="Alert type">
          <Seg value={d.type} onChange={v=>up({type:v})}
            options={[{value:'down',label:'Down'},{value:'warn',label:'Warn'},{value:'up',label:'Up'},{value:'info',label:'Info'}]} />
        </Field>
        <Field label="Title"><TI value={d.title} onChange={v=>up({title:v})} /></Field>
        <Field label="Body"><TA value={d.body} onChange={v=>up({body:v})} rows={3} /></Field>
        <Field label="CTA text"><TI value={d.ctaText} onChange={v=>up({ctaText:v})} /></Field>
        <Field label="CTA URL"><UI value={d.ctaUrl} onChange={v=>up({ctaUrl:v})} /></Field>
      </>
    ),
  },

  /* ── Checklist ── */
  checklist: {
    type:'checklist', label:'Checklist', icon:'✓',
    defaults: ()=>({ heading:'What you get on Nano', items:[
      {text:'200 checks — 20× more than Free',checked:true},
      {text:'2-minute intervals — 2.5× faster detection',checked:true},
      {text:'SMS alerts for urgent notifications',checked:true},
      {text:'Domain Intelligence — auto expiry tracking',checked:true},
      {text:'Maintenance windows & scheduled suppression',checked:true},
    ]}),
    render: d=>(
      <div style={{margin:'0 32px 16px',padding:20,background:'rgba(18,18,20,0.92)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:10}}>
        {d.heading&&<h3 style={{margin:'0 0 14px',color:'#ffffff',fontSize:17,fontWeight:600}}>{d.heading}</h3>}
        {(d.items||[]).map((it,i)=>(
          <div key={i} style={{display:'flex',alignItems:'flex-start',gap:10,marginBottom:10}}>
            <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:18,height:18,borderRadius:'50%',background:it.checked?'var(--e1-accent)':'rgba(255,255,255,0.08)',border:it.checked?'none':'1px solid rgba(255,255,255,0.18)',flexShrink:0,marginTop:1,fontSize:10,color:'var(--e1-accent-contrast)',fontWeight:700}}>{it.checked?'✓':''}</span>
            <span style={{fontSize:14,color:it.checked?'rgba(255,255,255,0.85)':'rgba(255,255,255,0.4)',lineHeight:1.45,textDecoration:it.checked?'none':'line-through'}}>{it.text}</span>
          </div>
        ))}
      </div>
    ),
    inspector: (d,up)=>{
      const items=d.items||[];
      const set=(i,patch)=>up({items:items.map((it,x)=>x===i?{...it,...patch}:it)});
      return <>
        <Field label="Heading"><TI value={d.heading} onChange={v=>up({heading:v})} /></Field>
        {items.map((it,i)=>(
          <div key={i} className="field-group">
            <div className="field-group-head">
              <h4>Item {i+1}</h4>
              <button className="mini-btn danger" onClick={()=>up({items:items.filter((_,x)=>x!==i)})}>Remove</button>
            </div>
            <Field><TI value={it.text} onChange={v=>set(i,{text:v})} /></Field>
            <Chk value={it.checked} onChange={v=>set(i,{checked:v})} label="Checked (tick)" />
          </div>
        ))}
        <button className="topbar-btn" onClick={()=>up({items:[...items,{text:'New item',checked:true}]})}>+ Add item</button>
      </>;
    },
  },

  /* ── Code block ── */
  code: {
    type:'code', label:'Code block', icon:'{}',
    defaults: ()=>({ label:'mcp.json', language:'json', code:`{
  "mcpServers": {
    "exit1": {
      "command": "npx",
      "args": ["-y", "exit1-mcp"],
      "env": {
        "EXIT1_API_KEY": "your_api_key_here"
      }
    }
  }
}` }),
    render: d=>(
      <div style={{margin:'0 32px 16px',borderRadius:10,overflow:'hidden',border:'1px solid rgba(255,255,255,0.09)'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 16px',background:'rgba(255,255,255,0.04)',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
          <span style={{fontSize:11,fontWeight:600,color:'rgba(255,255,255,0.4)',letterSpacing:'0.1em',textTransform:'uppercase',fontFamily:'monospace'}}>{d.label}</span>
          <span style={{fontSize:10,color:'rgba(255,255,255,0.25)',letterSpacing:'0.1em',textTransform:'uppercase'}}>{d.language}</span>
        </div>
        <pre style={{margin:0,padding:20,background:'#0a0a0c',color:'rgba(255,255,255,0.75)',fontSize:13,lineHeight:1.65,fontFamily:"'Courier New',Courier,monospace",overflowX:'auto',whiteSpace:'pre-wrap',wordBreak:'break-word'}}>{d.code}</pre>
      </div>
    ),
    inspector: (d,up)=>(
      <>
        <Field label="File label / title"><TI value={d.label} onChange={v=>up({label:v})} /></Field>
        <Field label="Language tag"><TI value={d.language} onChange={v=>up({language:v})} /></Field>
        <Field label="Code"><TA value={d.code} onChange={v=>up({code:v})} rows={10} /></Field>
      </>
    ),
  },

  /* ── Image ── */
  image: {
    type:'image', label:'Image', icon:'▨',
    defaults: ()=>({ src:'', alt:'', caption:'', width:'100%', link:'' }),
    render: d=>(
      <div style={{margin:'0 32px 16px',borderRadius:10,overflow:'hidden',border:'1px solid rgba(255,255,255,0.09)'}}>
        {d.src
          ? <img src={d.src} alt={d.alt||''} style={{display:'block',width:'100%',height:'auto',borderRadius:10}} />
          : <div style={{height:160,background:'rgba(18,18,20,0.9)',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,0.25)',fontSize:11,fontFamily:'monospace',letterSpacing:'0.1em',textTransform:'uppercase'}}>[ Image: {d.alt||'set URL in inspector'} ]</div>
        }
        {d.caption&&<p style={{margin:0,padding:'10px 16px',fontSize:12,color:'rgba(255,255,255,0.4)',background:'rgba(18,18,20,0.9)',borderTop:'1px solid rgba(255,255,255,0.06)',textAlign:'center'}}>{d.caption}</p>}
      </div>
    ),
    inspector: (d,up)=>(
      <>
        <Field label="Image URL" help="Must be a public https:// URL"><UI value={d.src} onChange={v=>up({src:v})} /></Field>
        <Field label="Alt text"><TI value={d.alt} onChange={v=>up({alt:v})} /></Field>
        <Field label="Caption (optional)"><TI value={d.caption} onChange={v=>up({caption:v})} /></Field>
        <Field label="Link (optional)"><UI value={d.link} onChange={v=>up({link:v})} /></Field>
      </>
    ),
  },

  /* ── Two-column ── */
  twocol: {
    type:'twocol', label:'Two columns', icon:'⊞',
    defaults: ()=>({ cols:[
      {heading:'Free', subhead:'Get started', body:'10 checks · 5-min intervals · SSL monitoring · Email alerts · Public status pages', ctaText:'Start free', ctaUrl:'{{signup_url}}', accent:false},
      {heading:'Nano', subhead:'For growing teams', body:'200 checks · 2-min intervals · SMS alerts · Domain intelligence · Maintenance windows', ctaText:'Upgrade to Nano', ctaUrl:'{{upgrade_url}}', accent:true},
    ]}),
    render: d=>(
      <div style={{margin:'0 32px 16px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
        {(d.cols||[]).map((col,i)=>(
          <div key={i} style={{padding:18,background:'rgba(18,18,20,0.92)',border:`1px solid ${col.accent?'var(--e1-accent)':'rgba(255,255,255,0.09)'}`,borderTop:`2px solid ${col.accent?'var(--e1-accent)':'rgba(255,255,255,0.09)'}`,borderRadius:10}}>
            <p style={{margin:'0 0 2px',fontSize:11,fontWeight:600,color:col.accent?'var(--e1-accent)':'rgba(255,255,255,0.38)',letterSpacing:'0.12em',textTransform:'uppercase'}}>{col.subhead}</p>
            <h3 style={{margin:'0 0 10px',color:'#ffffff',fontSize:20,fontWeight:700}}>{col.heading}</h3>
            <p style={{margin:'0 0 14px',color:'rgba(255,255,255,0.60)',fontSize:13,lineHeight:1.55}}>{col.body}</p>
            {col.ctaText&&<a href={col.ctaUrl||'#'} style={{display:'inline-block',fontSize:12,fontWeight:600,color:col.accent?'var(--e1-accent)':'rgba(255,255,255,0.7)',textDecoration:'none',borderBottom:`1px solid ${col.accent?'var(--e1-accent)':'rgba(255,255,255,0.2)'}`}}>{col.ctaText} →</a>}
          </div>
        ))}
      </div>
    ),
    inspector: (d,up)=>{
      const cols=d.cols||[];
      const set=(i,patch)=>up({cols:cols.map((c,x)=>x===i?{...c,...patch}:c)});
      return <>
        {cols.map((col,i)=>(
          <div key={i} className="field-group">
            <div className="field-group-head"><h4>Column {i+1}</h4></div>
            <Field label="Heading"><TI value={col.heading} onChange={v=>set(i,{heading:v})} /></Field>
            <Field label="Subhead"><TI value={col.subhead} onChange={v=>set(i,{subhead:v})} /></Field>
            <Field label="Body"><TA value={col.body} onChange={v=>set(i,{body:v})} rows={3} /></Field>
            <Field label="CTA text"><TI value={col.ctaText} onChange={v=>set(i,{ctaText:v})} /></Field>
            <Field label="CTA URL"><UI value={col.ctaUrl} onChange={v=>set(i,{ctaUrl:v})} /></Field>
            <Chk value={col.accent} onChange={v=>set(i,{accent:v})} label="Highlight with accent colour" />
          </div>
        ))}
      </>;
    },
  },


  /* ── Announcement ── */
  announcement: {
    type:'announcement', label:'Announcement', icon:'★',
    defaults: ()=>({ badge:'New', badgeStyle:'accent', heading:'Introducing MCP Server Integration', sub:'Query your monitoring data from Claude, Cursor, VS Code Copilot and more — without switching context.', ctaText:'Read the docs', ctaUrl:'{{docs_url}}' }),
    render: d=>{
      const badgeColors={accent:'var(--e1-accent)',green:'#3FB873',amber:'#E3B24A',red:'#E24530'};
      const bc=badgeColors[d.badgeStyle]||'var(--e1-accent)';
      return (
        <div style={{padding:'40px 32px 32px',textAlign:'center',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
          {d.badge&&<span style={{display:'inline-block',marginBottom:16,padding:'4px 14px',borderRadius:9999,border:`1px solid ${bc}`,background:`${bc}18`,fontSize:11,fontWeight:700,color:bc,letterSpacing:'0.14em',textTransform:'uppercase'}}>{d.badge}</span>}
          <h1 style={{margin:'0 0 14px',color:'#ffffff',fontSize:32,fontWeight:700,letterSpacing:'-0.025em',lineHeight:1.15}}>{d.heading}</h1>
          {d.sub&&<p style={{margin:'0 auto 20px',maxWidth:480,color:'rgba(255,255,255,0.65)',fontSize:17,lineHeight:1.55}}>{d.sub}</p>}
          {d.ctaText&&<a href={d.ctaUrl||'#'} className="e1-cta-primary" style={{display:'inline-flex'}}>{d.ctaText} →</a>}
        </div>
      );
    },
    inspector: (d,up)=>(
      <>
        <Field label="Badge text (leave blank to hide)"><TI value={d.badge} onChange={v=>up({badge:v})} /></Field>
        <Field label="Badge colour">
          <Seg value={d.badgeStyle||'accent'} onChange={v=>up({badgeStyle:v})}
            options={[{value:'accent',label:'Accent'},{value:'green',label:'Green'},{value:'amber',label:'Amber'},{value:'red',label:'Red'}]} />
        </Field>
        <Field label="Heading"><TA value={d.heading} onChange={v=>up({heading:v})} rows={2} /></Field>
        <Field label="Subtitle"><TA value={d.sub} onChange={v=>up({sub:v})} rows={3} /></Field>
        <Field label="CTA text"><TI value={d.ctaText} onChange={v=>up({ctaText:v})} /></Field>
        <Field label="CTA URL"><UI value={d.ctaUrl} onChange={v=>up({ctaUrl:v})} /></Field>
      </>
    ),
  },

  /* ── Incident timeline ── */
  timeline: {
    type:'timeline', label:'Incident timeline', icon:'⏱',
    defaults: ()=>({ heading:'Incident report', events:[
      {time:'14:32 UTC', status:'down',  text:'Monitoring detected elevated error rates on app.exit1.dev.'},
      {time:'14:35 UTC', status:'warn',  text:'Engineering alerted. Root cause identified as database connection pool exhaustion.'},
      {time:'14:51 UTC', status:'warn',  text:'Fix deployed. Monitoring recovery.'},
      {time:'15:04 UTC', status:'up',    text:'All systems operational. Incident resolved.'},
    ]}),
    render: d=>{
      const sc={down:'#E24530',warn:'#E3B24A',up:'#3FB873',info:'#4A8DB8'};
      return (
        <div style={{margin:'0 32px 16px',padding:20,background:'rgba(18,18,20,0.92)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:10}}>
          {d.heading&&<h3 style={{margin:'0 0 18px',color:'#ffffff',fontSize:17,fontWeight:600}}>{d.heading}</h3>}
          {(d.events||[]).map((ev,i)=>(
            <div key={i} style={{display:'flex',gap:14,paddingBottom:i<d.events.length-1?16:0,marginBottom:i<d.events.length-1?16:0,borderBottom:i<d.events.length-1?'1px solid rgba(255,255,255,0.06)':'none'}}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0}}>
                <div style={{width:10,height:10,borderRadius:'50%',background:sc[ev.status]||sc.info,marginTop:3,flexShrink:0}}></div>
                {i<d.events.length-1&&<div style={{width:1,flex:1,background:'rgba(255,255,255,0.08)',marginTop:6}}></div>}
              </div>
              <div style={{flex:1}}>
                <span style={{fontSize:11,fontWeight:600,color:'rgba(255,255,255,0.38)',letterSpacing:'0.08em',fontFamily:'monospace'}}>{ev.time}</span>
                <p style={{margin:'4px 0 0',fontSize:14,color:'rgba(255,255,255,0.72)',lineHeight:1.5}}>{ev.text}</p>
              </div>
            </div>
          ))}
        </div>
      );
    },
    inspector: (d,up)=>{
      const evs=d.events||[];
      const set=(i,patch)=>up({events:evs.map((e,x)=>x===i?{...e,...patch}:e)});
      return <>
        <Field label="Heading"><TI value={d.heading} onChange={v=>up({heading:v})} /></Field>
        {evs.map((ev,i)=>(
          <div key={i} className="field-group">
            <div className="field-group-head">
              <h4>Event {i+1}</h4>
              <button className="mini-btn danger" onClick={()=>up({events:evs.filter((_,x)=>x!==i)})}>Remove</button>
            </div>
            <Field label="Time"><TI value={ev.time} onChange={v=>set(i,{time:v})} /></Field>
            <Field label="Status">
              <Seg value={ev.status||'info'} onChange={v=>set(i,{status:v})}
                options={[{value:'down',label:'Down'},{value:'warn',label:'Warn'},{value:'up',label:'Up'},{value:'info',label:'Info'}]} />
            </Field>
            <Field label="Description"><TA value={ev.text} onChange={v=>set(i,{text:v})} rows={2} /></Field>
          </div>
        ))}
        <button className="topbar-btn" onClick={()=>up({events:[...evs,{time:'00:00 UTC',status:'info',text:'New event.'}]})}>+ Add event</button>
      </>;
    },
  },

  /* ── Big metric ── */
  bigmetric: {
    type:'bigmetric', label:'Big metric', icon:'∞',
    defaults: ()=>({ value:'99.98%', label:'Average uptime', sub:'across all monitored endpoints · last 30 days', accent:true }),
    render: d=>(
      <div style={{padding:'36px 32px',textAlign:'center',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
        <div style={{fontSize:64,fontWeight:700,color:d.accent?'var(--e1-accent)':'#ffffff',letterSpacing:'-0.04em',lineHeight:1,marginBottom:10}}>{d.value}</div>
        <div style={{fontSize:18,fontWeight:600,color:'#ffffff',marginBottom:6}}>{d.label}</div>
        {d.sub&&<div style={{fontSize:13,color:'rgba(255,255,255,0.45)',maxWidth:360,margin:'0 auto'}}>{d.sub}</div>}
      </div>
    ),
    inspector: (d,up)=>(
      <>
        <Field label="Value (the big number)"><TI value={d.value} onChange={v=>up({value:v})} /></Field>
        <Field label="Label"><TI value={d.label} onChange={v=>up({label:v})} /></Field>
        <Field label="Sub-label"><TI value={d.sub} onChange={v=>up({sub:v})} /></Field>
        <Chk value={d.accent} onChange={v=>up({accent:v})} label="Use accent colour for value" />
      </>
    ),
  },

  /* ── Link list ── */
  linklist: {
    type:'linklist', label:'Link list', icon:'↗',
    defaults: ()=>({ heading:'Quick links', links:[
      {text:'Dashboard',    url:'{{dashboard_url}}',  desc:'View your checks and uptime'},
      {text:'Docs',         url:'https://docs.exit1.dev', desc:'API reference and guides'},
      {text:'Status page',  url:'{{status_url}}',     desc:'Public status for your customers'},
      {text:'Unsubscribe',  url:'{{unsubscribe_url}}',desc:''},
    ]}),
    render: d=>(
      <div style={{margin:'0 32px 16px',padding:20,background:'rgba(18,18,20,0.92)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:10}}>
        {d.heading&&<h3 style={{margin:'0 0 14px',color:'#ffffff',fontSize:15,fontWeight:600,letterSpacing:'-0.005em'}}>{d.heading}</h3>}
        {(d.links||[]).map((l,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:i<d.links.length-1?'1px solid rgba(255,255,255,0.06)':'none'}}>
            <div>
              <a href={l.url||'#'} style={{fontSize:14,fontWeight:600,color:'var(--e1-accent)',textDecoration:'none'}}>{l.text}</a>
              {l.desc&&<span style={{fontSize:12,color:'rgba(255,255,255,0.38)',marginLeft:10}}>{l.desc}</span>}
            </div>
            <span style={{color:'rgba(255,255,255,0.25)',fontSize:14}}>→</span>
          </div>
        ))}
      </div>
    ),
    inspector: (d,up)=>{
      const links=d.links||[];
      const set=(i,patch)=>up({links:links.map((l,x)=>x===i?{...l,...patch}:l)});
      return <>
        <Field label="Heading"><TI value={d.heading} onChange={v=>up({heading:v})} /></Field>
        {links.map((l,i)=>(
          <div key={i} className="field-group">
            <div className="field-group-head">
              <h4>Link {i+1}</h4>
              <button className="mini-btn danger" onClick={()=>up({links:links.filter((_,x)=>x!==i)})}>Remove</button>
            </div>
            <Field label="Text"><TI value={l.text} onChange={v=>set(i,{text:v})} /></Field>
            <Field label="URL"><UI value={l.url} onChange={v=>set(i,{url:v})} /></Field>
            <Field label="Description"><TI value={l.desc} onChange={v=>set(i,{desc:v})} /></Field>
          </div>
        ))}
        <button className="topbar-btn" onClick={()=>up({links:[...links,{text:'New link',url:'#',desc:''}]})}>+ Add link</button>
      </>;
    },
  },

};

const BLOCK_ORDER = ['header','announcement','hero','body','alert','steps','checklist','ctablock','twocol','stats','bigmetric','code','image','feature','timeline','quote','linklist','plan','divider','footer'];

Object.assign(window, { BLOCKS, BLOCK_ORDER, Field, TI, UI, TA, Seg, Chk });
