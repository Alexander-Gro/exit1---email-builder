/* ================================================================
   Exit1.dev Email Builder — Editor  (v2)
   Brand panel · Plan theming · MJML export · Compiled HTML export
   ================================================================ */

const { useState, useEffect, useRef } = React;

const uid = () => Math.random().toString(36).slice(2, 10);

/* ── Plan registry (Design Manual §3) ── */
const PLANS = {
  free:   { label:'Free',   accent:'#B2D3E6', contrast:'#000000', desc:'Entry level',  cls:'plan-free'   },
  nano:   { label:'Nano',   accent:'#4A8DB8', contrast:'#ffffff', desc:'Main brand',   cls:'plan-nano'   },
  scale:  { label:'Scale',  accent:'#3EB5A5', contrast:'#ffffff', desc:'High speed',   cls:'plan-scale'  },
  agency: { label:'Agency', accent:'#3FB873', contrast:'#ffffff', desc:'Enterprise',   cls:'plan-agency' },
};
const getAccent   = m => m.accentOverride || PLANS[m.plan||'nano']?.accent   || '#4A8DB8';
const getContrast = m => m.accentOverride ? '#ffffff' : PLANS[m.plan||'nano']?.contrast || '#ffffff';

/* ── Seed ── */
const SEED = {
  meta: { name:'Welcome · Free tier', subject:'You just stopped flying blind', preview:'Two minutes of setup. Then we watch.', showGrid:true, plan:'free', accentOverride:'' },
  blocks: [
    { id:uid(), type:'header', data:BLOCKS.header.defaults() },
    { id:uid(), type:'hero',   data:BLOCKS.hero.defaults()   },
    { id:uid(), type:'body',   data:BLOCKS.body.defaults()   },
    { id:uid(), type:'steps',  data:BLOCKS.steps.defaults()  },
    { id:uid(), type:'body',   data:{ paragraphs:[
      {text:'Once those two things are done, exit1 runs quietly in the background. You won\'t think about it until it matters — and when it does, you\'ll be glad it\'s there.',style:'normal'},
      {text:'I\'ll check in tomorrow with a look at what your monitoring data is already telling you.',style:'normal'},
      {text:'— The exit1.dev team',style:'close'},
    ]}},
    { id:uid(), type:'plan',   data:BLOCKS.plan.defaults()  },
    { id:uid(), type:'footer', data:BLOCKS.footer.defaults() },
  ],
};

/* ── Storage ── */
const SK = 'exit1-builder-v2';
const loadDraft = () => { try { const d=JSON.parse(localStorage.getItem(SK)||'null'); return d?.blocks&&d?.meta?d:SEED; } catch{return SEED;} };
const saveDraft = d => localStorage.setItem(SK, JSON.stringify(d));

/* ════════════════════════════════════════════
   INLINE HTML EXPORT  (Resend-ready)
   All CSS resolved to real values — no vars,
   no <style> blocks, no class names.
   Pixel-perfect match to the builder preview.
   ════════════════════════════════════════════ */
const xe = s => String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const xr = s => String(s??''); // raw (for style attrs)

const generateInlineHtml = (draft) => {
  const accent   = getAccent(draft.meta);
  const contrast = getContrast(draft.meta);
  const logoUrl  = draft.meta.logoUrl || 'https://exit1.dev/exit1-logo.png';

  /* ── Resolved tokens — no CSS vars, Outlook-safe solid values ── */
  const FONT  = "Arial,Helvetica,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  const MONO  = "'Courier New',Courier,monospace";
  const BG    = '#000000';
  const CARD  = '#111113';   // solid equiv of rgba(18,18,20,0.92)
  const CARD2 = '#0d0d0f';   // slightly darker for alternates
  const T1    = '#ffffff';
  const T2    = '#b0b0b8';   // solid equiv of rgba(255,255,255,0.65)
  const T3    = '#606068';   // solid equiv of rgba(255,255,255,0.38)
  const BORD  = '#222226';   // solid border — Outlook cant do rgba on bgcolor
  const P     = '32px';      // horizontal padding

  /* ── Outlook-safe button via VML ── */
  const vmlBtn = (href, text, bg, color, w=200) =>
    `<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${xe(href)}" style="height:38px;v-text-anchor:middle;width:${w}px;" arcsize="50%" strokecolor="${bg}" fillcolor="${bg}"><w:anchorlock/><center style="color:${color};font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;">${xe(text)} &rarr;</center></v:roundrect><![endif]--><!--[if !mso]><!-->${ghostBtn(href,text,bg,color)}<!--<![endif]-->`;

  const ghostBtn = (href, text, bg, color) =>
    `<a href="${xe(href)}" style="display:inline-block;background:${bg};color:${color};padding:10px 22px;border-radius:9999px;font-size:13px;font-weight:600;text-decoration:none;font-family:${FONT};">${xe(text)} &rarr;</a>`;

  const outlineBtn = (href, text) =>
    `<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${xe(href)}" style="height:36px;v-text-anchor:middle;width:200px;" arcsize="50%" strokecolor="#444448" fillcolor="#111113"><w:anchorlock/><center style="color:#e0e0e8;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;">${xe(text)} &rarr;</center></v:roundrect><![endif]--><!--[if !mso]><!--><a href="${xe(href)}" style="display:inline-block;background:#111113;color:#e0e0e8;padding:9px 18px;border-radius:9999px;border:1px solid #444448;font-size:13px;font-weight:500;text-decoration:none;font-family:${FONT};">${xe(text)} &rarr;</a><!--<![endif]-->`;

  const dotColor = t => t==='down'?'#E24530':t==='warn'?'#E3B24A':'#3FB873';

  /* ── Block renderers ── */
  const blockHtml = b => {
    const d = b.data;
    switch(b.type) {

      case 'header': return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};border-bottom:1px solid ${BORD};">
  <tr><td style="padding:20px ${P};">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td width="160" style="vertical-align:middle;">
          <img src="${xe(logoUrl)}" alt="${xe(d.brandName||'exit1.dev')}" width="130" height="28" style="display:block;width:130px;height:28px;border:0;" />
        </td>
        ${d.showStatus ? `<td style="vertical-align:middle;text-align:right;">
          <span style="display:inline-block;padding:5px 13px;border-radius:9999px;border:1px solid #333338;background:#1a1a1e;font-size:12px;font-weight:500;color:#909098;font-family:${FONT};white-space:nowrap;">
            <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${dotColor(d.statusType)};vertical-align:middle;margin-right:6px;"></span>${xe(d.statusText)}
          </span>
        </td>` : ''}
      </tr>
    </table>
  </td></tr>
</table>`;

      case 'hero': return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};border-bottom:1px solid ${BORD};">
  <tr><td style="padding:40px ${P} 32px;">
    ${d.eyebrow ? `<p style="margin:0 0 14px;padding:0;font-size:11px;font-weight:700;color:${accent};letter-spacing:2px;text-transform:uppercase;font-family:${FONT};">${xe(d.eyebrow.toUpperCase())}</p>` : ''}
    <h1 style="margin:0 0 14px;padding:0;color:${T1};font-size:36px;line-height:1.15;font-weight:700;font-family:${FONT};">${xe(d.heading)}</h1>
    ${d.sub ? `<p style="margin:0;padding:0;color:${T2};font-size:17px;line-height:1.55;font-family:${FONT};">${xe(d.sub)}</p>` : ''}
  </td></tr>
</table>`;

      case 'body': return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:28px ${P} 8px;">
    ${(d.paragraphs||[]).map(p => {
      const c = p.style==='lede'?T1:p.style==='close'?'#d8d8e0':T2;
      const fw = p.style==='close'?'600':'400';
      const fs = p.style==='lede'?'16px':'15px';
      return `<p style="margin:0 0 16px;padding:0;color:${c};font-size:${fs};font-weight:${fw};line-height:1.65;font-family:${FONT};">${xe(p.text)}</p>`;
    }).join('')}
  </td></tr>
</table>`;

      case 'steps': return (d.items||[]).map((s,i) => `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:${i===0?'8':'4'}px ${P} 0;">
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${CARD}" style="background:${CARD};border:1px solid ${BORD};padding:20px;"><![endif]-->
    <!--[if !mso]><!-->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${CARD}" style="background:${CARD};border:1px solid ${BORD};border-radius:10px;">
    <tr><td style="padding:20px;">
    <!--<![endif]-->
      <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px;">
        <tr>
          <td style="vertical-align:middle;padding-right:10px;">
            <span style="display:inline-block;background:${accent};color:${contrast};padding:2px 9px;border-radius:9999px;font-size:11px;font-weight:700;font-family:${FONT};">${xe(s.number)}</span>
          </td>
          <td style="vertical-align:middle;font-size:11px;font-weight:600;color:${T3};letter-spacing:2px;text-transform:uppercase;font-family:${FONT};">${xe(s.label)}</td>
        </tr>
      </table>
      <h3 style="margin:0 0 8px;padding:0;color:${T1};font-size:18px;font-weight:700;font-family:${FONT};">${xe(s.title)}</h3>
      <p style="margin:0 0 ${s.ctaText?'16':'0'}px;padding:0;color:${T2};font-size:15px;line-height:1.6;font-family:${FONT};">${xe(s.body)}</p>
      ${s.ctaText ? (s.ctaStyle==='primary' ? vmlBtn(s.ctaUrl||'#',s.ctaText,accent,contrast) : outlineBtn(s.ctaUrl||'#',s.ctaText)) : ''}
    <!--[if mso]></td></tr></table><![endif]-->
    <!--[if !mso]><!--></td></tr></table><!--<![endif]-->
  </td></tr>
</table>`).join('');

      case 'ctablock': return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td align="center" style="padding:12px ${P} 28px;">
    ${d.style==='ghost' ? outlineBtn(d.url||'#', d.text) : vmlBtn(d.url||'#', d.text, accent, contrast, 180)}
  </td></tr>
</table>`;

      case 'stats': return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:8px ${P} 16px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        ${(d.items||[]).map((s,i) => `<td width="${Math.floor(100/d.items.length)}%" style="padding:0 ${i<d.items.length-1?'4px 0 0':'0 0 0'}; vertical-align:top;">
          <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${CARD}" style="background:${CARD};border:1px solid ${BORD};padding:16px;"><![endif]-->
          <!--[if !mso]><!-->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${CARD}" style="background:${CARD};border:1px solid ${BORD};border-radius:10px;">
            <tr><td style="padding:16px;">
          <!--<![endif]-->
            <p style="margin:0 0 6px;padding:0;font-size:10px;font-weight:700;color:${T3};letter-spacing:2px;text-transform:uppercase;font-family:${FONT};">${xe(s.label)}</p>
            <p style="margin:0;padding:0;font-size:26px;font-weight:700;color:${T1};font-family:${FONT};">${xe(s.value)}</p>
            ${s.sub?<p style="margin:4px 0 0;padding:0;font-size:11px;color:${T3};font-family:${FONT};">${xe(s.sub)}</p>:''}
          <!--[if mso]></td></tr></table><![endif]-->
          <!--[if !mso]><!--></td></tr></table><!--<![endif]-->
        </td>`).join('')}
      </tr>
    </table>
  </td></tr>
</table>`;

      case 'feature': return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:0 ${P} 16px;">
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${CARD}" style="background:${CARD};border:1px solid ${BORD};"><![endif]-->
    <!--[if !mso]><!-->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${CARD}" style="background:${CARD};border:1px solid ${BORD};border-radius:10px;overflow:hidden;">
    <tr><td>
    <!--<![endif]-->
      ${d.imgUrl
        ? `<img src="${xe(d.imgUrl)}" alt="${xe(d.imgAlt||'')}" width="536" style="display:block;width:100%;height:auto;max-width:536px;border:0;border-bottom:1px solid ${BORD};" />`
        : `<p style="margin:0;padding:48px 20px;text-align:center;font-size:11px;color:${T3};font-family:${MONO};letter-spacing:2px;text-transform:uppercase;border-bottom:1px solid ${BORD};">${xe(d.mediaLabel)}</p>`
      }
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td style="padding:20px;">
          <h3 style="margin:0 0 8px;padding:0;color:${T1};font-size:18px;font-weight:700;font-family:${FONT};">${xe(d.heading)}</h3>
          <p style="margin:0 0 ${d.ctaText?'16':'0'}px;padding:0;color:${T2};font-size:15px;line-height:1.6;font-family:${FONT};">${xe(d.body)}</p>
          ${d.ctaText ? (d.ctaStyle==='primary' ? vmlBtn(d.ctaUrl||'#',d.ctaText,accent,contrast) : outlineBtn(d.ctaUrl||'#',d.ctaText)) : ''}
        </td></tr>
      </table>
    <!--[if mso]></td></tr></table><![endif]-->
    <!--[if !mso]><!--></td></tr></table><!--<![endif]-->
  </td></tr>
</table>`;

      case 'quote': return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:0 ${P} 16px;">
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${CARD}" style="background:${CARD};border:1px solid ${BORD};border-left:3px solid ${accent};padding:24px;"><![endif]-->
    <!--[if !mso]><!-->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${CARD}" style="background:${CARD};border:1px solid ${BORD};border-left:3px solid ${accent};border-radius:10px;">
    <tr><td style="padding:24px;">
    <!--<![endif]-->
      <p style="margin:0 0 16px;padding:0;color:${T1};font-size:18px;font-weight:500;line-height:1.45;font-family:${FONT};">&#8220;${xe(d.quote)}&#8221;</p>
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="36" style="vertical-align:middle;padding-right:10px;">
            <div style="width:28px;height:28px;border-radius:50%;background:#222226;display:block;">&nbsp;</div>
          </td>
          <td style="vertical-align:middle;font-size:13px;color:${T3};font-family:${FONT};">
            <b style="color:${T2};font-weight:700;">${xe(d.author)}</b> &middot; ${xe(d.role)}
          </td>
        </tr>
      </table>
    <!--[if mso]></td></tr></table><![endif]-->
    <!--[if !mso]><!--></td></tr></table><!--<![endif]-->
  </td></tr>
</table>`;

      case 'plan': return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:8px ${P} 28px;">
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${CARD}" style="background:${CARD};border:1px solid ${BORD};border-top:2px solid ${accent};padding:20px;"><![endif]-->
    <!--[if !mso]><!-->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${CARD}" style="background:${CARD};border:1px solid ${BORD};border-top:2px solid ${accent};border-radius:10px;">
    <tr><td style="padding:20px;">
    <!--<![endif]-->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:14px;">
        <tr>
          <td style="font-size:11px;font-weight:600;color:${T3};letter-spacing:2px;text-transform:uppercase;font-family:${FONT};">${xe(d.label)}</td>
          <td style="text-align:right;"><span style="display:inline-block;background:${accent};color:${contrast};padding:3px 11px;border-radius:9999px;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;font-family:${FONT};">${xe(d.tier)}</span></td>
        </tr>
      </table>
      ${(d.specs||[]).map(s=>`<p style="margin:0 0 6px;padding:0;font-size:13px;color:${T2};font-family:${FONT};"><span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:${accent};vertical-align:middle;margin-right:8px;"></span>${xe(s)}</p>`).join('')}
      ${d.upsell?<p style="margin:12px 0 0;padding:0;color:${T3};font-size:13px;line-height:1.55;font-family:${FONT};">${xe(d.upsell).replace(/\*\*(.+?)\*\*/g,`<b style="color:${accent};font-weight:700;">$1</b>`)}</p>:''}
    <!--[if mso]></td></tr></table><![endif]-->
    <!--[if !mso]><!--></td></tr></table><!--<![endif]-->
  </td></tr>
</table>`;

      case 'divider': return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:8px ${P};">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td height="1" bgcolor="${BORD}" style="font-size:1px;line-height:1px;background:${BORD};">&nbsp;</td></tr>
    </table>
  </td></tr>
</table>`;

      case 'footer': return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};border-top:1px solid ${BORD};">
  <tr><td style="padding:18px ${P} 24px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="font-size:11px;color:${T3};font-family:${FONT};letter-spacing:1px;">${xe(d.brand)} &middot; Uptime monitoring for teams that ship.</td>
        <td style="text-align:right;white-space:nowrap;">
          ${(d.links||[]).map(l=>`<a href="${xe(l.url||'#')}" style="font-size:11px;color:#808088;text-decoration:underline;margin-left:20px;font-family:${FONT};">${xe(l.text)}</a>`).join('')}
        </td>
      </tr>
    </table>
  </td></tr>
</table>`;

      case 'alert': {
        const colors = {
          down:{ bg:'#2a0e0e', border:'#E24530', dot:'#E24530', label:'DOWN' },
          warn:{ bg:'#231a08', border:'#E3B24A', dot:'#E3B24A', label:'DEGRADED' },
          up:  { bg:'#0a1f12', border:'#3FB873', dot:'#3FB873', label:'OPERATIONAL' },
          info:{ bg:'#0c1428', border:'#4A8DB8', dot:'#4A8DB8', label:'NOTICE' },
        };
        const c = colors[d.type]||colors.down;
        return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:0 ${P} 16px;">
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${c.bg}" style="background:${c.bg};border:1px solid ${c.border};border-left:3px solid ${c.border};padding:20px;"><![endif]-->
    <!--[if !mso]><!-->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${c.bg}" style="background:${c.bg};border:1px solid ${c.border};border-left:3px solid ${c.border};border-radius:10px;">
    <tr><td style="padding:20px;">
    <!--<![endif]-->
      <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;">
        <tr>
          <td width="14" style="vertical-align:middle;padding-right:8px;">
            <div style="width:8px;height:8px;border-radius:50%;background:${c.dot};"></div>
          </td>
          <td style="vertical-align:middle;font-size:10px;font-weight:700;color:${c.dot};letter-spacing:2px;text-transform:uppercase;font-family:${FONT};">${xe(c.label)}</td>
        </tr>
      </table>
      <h3 style="margin:0 0 6px;padding:0;color:${T1};font-size:17px;font-weight:700;font-family:${FONT};">${xe(d.title)}</h3>
      ${d.body?`<p style="margin:0 0 12px;padding:0;color:${T2};font-size:14px;line-height:1.55;font-family:${FONT};">${xe(d.body)}</p>`:''}
      ${d.ctaText?`<a href="${xe(d.ctaUrl||'#')}" style="font-size:13px;color:${c.dot};font-weight:600;text-decoration:underline;font-family:${FONT};">${xe(d.ctaText)} &#8594;</a>`:''}
    <!--[if mso]></td></tr></table><![endif]-->
    <!--[if !mso]><!--></td></tr></table><!--<![endif]-->
  </td></tr>
</table>`;
      }

      case 'checklist': return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:0 ${P} 16px;">
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${CARD}" style="background:${CARD};border:1px solid ${BORD};padding:20px;"><![endif]-->
    <!--[if !mso]><!-->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${CARD}" style="background:${CARD};border:1px solid ${BORD};border-radius:10px;">
    <tr><td style="padding:20px;">
    <!--<![endif]-->
      ${d.heading?`<h3 style="margin:0 0 14px;padding:0;color:${T1};font-size:17px;font-weight:700;font-family:${FONT};">${xe(d.heading)}</h3>`:''}
      ${(d.items||[]).map(it=>`
      <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px;">
        <tr>
          <td width="22" style="vertical-align:top;padding-right:10px;padding-top:1px;">
            <div style="width:18px;height:18px;border-radius:50%;background:${it.checked?accent:'#222226'};border:${it.checked?'none':'1px solid #444448'};text-align:center;font-size:10px;font-weight:700;color:${it.checked?contrast:'transparent'};line-height:18px;font-family:${FONT};">${it.checked?'&#10003;':''}</div>
          </td>
          <td style="vertical-align:top;font-size:14px;color:${it.checked?'#d8d8e0':'#606068'};line-height:1.45;font-family:${FONT};${it.checked?'':'text-decoration:line-through;'}">${xe(it.text)}</td>
        </tr>
      </table>`).join('')}
    <!--[if mso]></td></tr></table><![endif]-->
    <!--[if !mso]><!--></td></tr></table><!--<![endif]-->
  </td></tr>
</table>`;

      case 'code': return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:0 ${P} 16px;">
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#0a0a0c" style="background:#0a0a0c;border:1px solid ${BORD};"><![endif]-->
    <!--[if !mso]><!-->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0a0a0c" style="background:#0a0a0c;border:1px solid ${BORD};border-radius:10px;overflow:hidden;">
    <tr><td>
    <!--<![endif]-->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#111114" style="background:#111114;border-bottom:1px solid ${BORD};">
        <tr>
          <td style="padding:8px 16px;font-size:11px;font-weight:700;color:${T3};letter-spacing:2px;text-transform:uppercase;font-family:${MONO};">${xe(d.label)}</td>
          <td style="padding:8px 16px;text-align:right;font-size:10px;color:#444450;letter-spacing:2px;text-transform:uppercase;font-family:${MONO};">${xe(d.language)}</td>
        </tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td style="padding:20px;font-size:13px;color:#b0b8c8;line-height:1.65;font-family:${MONO};white-space:pre-wrap;word-break:break-word;">${xe(d.code)}</td></tr>
      </table>
    <!--[if mso]></td></tr></table><![endif]-->
    <!--[if !mso]><!--></td></tr></table><!--<![endif]-->
  </td></tr>
</table>`;

      case 'image': return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:0 ${P} 16px;">
    ${d.link?`<a href="${xe(d.link)}" style="display:block;text-decoration:none;">`:''}
    ${d.src
      ? `<img src="${xe(d.src)}" alt="${xe(d.alt||'')}" width="536" style="display:block;width:100%;height:auto;max-width:536px;border-radius:10px;border:0;" />`
      : `<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${CARD}" style="background:${CARD};border:1px solid ${BORD};border-radius:10px;"><tr><td height="160" style="text-align:center;vertical-align:middle;font-size:11px;color:${T3};font-family:${MONO};letter-spacing:2px;text-transform:uppercase;">[ ${xe(d.alt||'Image')} ]</td></tr></table>`
    }
    ${d.caption?`<p style="margin:8px 0 0;padding:0;font-size:12px;color:${T3};text-align:center;font-family:${FONT};">${xe(d.caption)}</p>`:''}
    ${d.link?`</a>`:''}
  </td></tr>
</table>`;

      case 'twocol': return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:0 ${P} 16px;">
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><![endif]-->
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        ${(d.cols||[]).map((col,i)=>{
          const colBorder = col.accent ? accent : BORD;
          return `<!--[if mso]><td width="262" valign="top" bgcolor="${CARD}" style="background:${CARD};border:1px solid ${colBorder};border-top:2px solid ${colBorder};padding:18px;${i===0?'padding-right:4px;':'padding-left:4px;'}"><![endif]-->
        <!--[if !mso]><!-->
        <td width="50%" valign="top" style="width:50%;padding:${i===0?'0 4px 0 0':'0 0 0 4px'};">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${CARD}" style="background:${CARD};border:1px solid ${colBorder};border-top:2px solid ${colBorder};border-radius:10px;">
            <tr><td style="padding:18px;">
        <!--<![endif]-->
              <p style="margin:0 0 3px;padding:0;font-size:10px;font-weight:700;color:${col.accent?accent:T3};letter-spacing:2px;text-transform:uppercase;font-family:${FONT};">${xe(col.subhead)}</p>
              <h3 style="margin:0 0 10px;padding:0;color:${T1};font-size:20px;font-weight:700;font-family:${FONT};">${xe(col.heading)}</h3>
              <p style="margin:0 0 14px;padding:0;color:${T2};font-size:13px;line-height:1.55;font-family:${FONT};">${xe(col.body)}</p>
              ${col.ctaText?`<a href="${xe(col.ctaUrl||'#')}" style="font-size:12px;font-weight:700;color:${col.accent?accent:'#808088'};text-decoration:none;border-bottom:1px solid ${col.accent?accent:'#444448'};font-family:${FONT};">${xe(col.ctaText)} &#8594;</a>`:''}
        <!--[if !mso]><!--></td></tr></table></td><!--<![endif]-->
        <!--[if mso]></td><![endif]-->`;
        }).join('')}
      </tr>
    </table>
    <!--[if mso]></tr></table><![endif]-->
  </td></tr>
</table>`;

      case 'announcement': {
        const bc = ({accent:accent,green:'#3FB873',amber:'#E3B24A',red:'#E24530'})[d.badgeStyle]||accent;
        let h = '<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="'+BG+'" style="background:'+BG+';border-bottom:1px solid '+BORD+';"><tr><td align="center" style="padding:40px '+P+' 32px;">';
        if (d.badge) h += '<p style="margin:0 0 16px;padding:0;"><span style="display:inline-block;padding:4px 14px;border-radius:9999px;border:1px solid '+bc+';font-size:11px;font-weight:700;color:'+bc+';letter-spacing:2px;text-transform:uppercase;font-family:'+FONT+';">'+xe(d.badge)+'</span></p>';
        h += '<h1 style="margin:0 0 14px;padding:0;color:'+T1+';font-size:32px;line-height:1.15;font-weight:700;letter-spacing:-0.025em;font-family:'+FONT+';">'+xe(d.heading)+'</h1>';
        if (d.sub) h += '<p style="margin:0 auto 20px;padding:0;max-width:480px;color:'+T2+';font-size:17px;line-height:1.55;font-family:'+FONT+';">'+xe(d.sub)+'</p>';
        if (d.ctaText) h += vmlBtn(d.ctaUrl||'#', d.ctaText, accent, contrast, 200);
        h += '</td></tr></table>';
        return h;
      }
      case 'timeline': {
        const sc={down:'#E24530',warn:'#E3B24A',up:'#3FB873',info:'#4A8DB8'};
        let t = '<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="'+BG+'" style="background:'+BG+';"><tr><td style="padding:0 '+P+' 16px;">';
        t += '<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="'+CARD+'" style="background:'+CARD+';border:1px solid '+BORD+';padding:20px;"><![endif]-->';
        t += '<!--[if !mso]><!-->';
        t += '<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="'+CARD+'" style="background:'+CARD+';border:1px solid '+BORD+';border-radius:10px;"><tr><td style="padding:20px;">';
        t += '<!--<![endif]-->';
        if (d.heading) t += '<h3 style="margin:0 0 18px;padding:0;color:'+T1+';font-size:17px;font-weight:700;font-family:'+FONT+';">'+xe(d.heading)+'</h3>';
        (d.events||[]).forEach((ev,i) => {
          t += '<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:'+(i<d.events.length-1?'16':'0')+'px;padding-bottom:'+(i<d.events.length-1?'16':'0')+'px;'+(i<d.events.length-1?'border-bottom:1px solid #222226;':'')+'">';
          t += '<tr><td width="24" valign="top" style="padding-right:12px;padding-top:3px;"><div style="width:10px;height:10px;border-radius:50%;background:'+(sc[ev.status]||sc.info)+';"></div></td>';
          t += '<td valign="top"><p style="margin:0 0 4px;padding:0;font-size:11px;font-weight:600;color:'+T3+';letter-spacing:1px;font-family:'+MONO+';">'+xe(ev.time)+'</p>';
          t += '<p style="margin:0;padding:0;font-size:14px;color:'+T2+';line-height:1.5;font-family:'+FONT+';">'+xe(ev.text)+'</p></td></tr></table>';
        });
        t += '<!--[if mso]></td></tr></table><![endif]--><!--[if !mso]><!--></td></tr></table><!--<![endif]--></td></tr></table>';
        return t;
      }
      case 'bigmetric': {
        let m = '<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="'+BG+'" style="background:'+BG+';border-bottom:1px solid '+BORD+';"><tr><td align="center" style="padding:36px '+P+';">';
        m += '<p style="margin:0 0 10px;padding:0;font-size:64px;font-weight:700;color:'+(d.accent?accent:T1)+';letter-spacing:-4px;line-height:1;font-family:'+FONT+';">'+xe(d.value)+'</p>';
        m += '<p style="margin:0 0 6px;padding:0;font-size:18px;font-weight:600;color:'+T1+';font-family:'+FONT+';">'+xe(d.label)+'</p>';
        if (d.sub) m += '<p style="margin:0 auto;padding:0;font-size:13px;color:'+T3+';max-width:360px;font-family:'+FONT+';">'+xe(d.sub)+'</p>';
        m += '</td></tr></table>';
        return m;
      }
      case 'linklist': {
        let ll = '<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="'+BG+'" style="background:'+BG+';"><tr><td style="padding:0 '+P+' 16px;">';
        ll += '<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="'+CARD+'" style="background:'+CARD+';border:1px solid '+BORD+';padding:20px;"><![endif]-->';
        ll += '<!--[if !mso]><!--><table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="'+CARD+'" style="background:'+CARD+';border:1px solid '+BORD+';border-radius:10px;"><tr><td style="padding:20px;"><!--<![endif]-->';
        if (d.heading) ll += '<h3 style="margin:0 0 14px;padding:0;color:'+T1+';font-size:15px;font-weight:700;font-family:'+FONT+';">'+xe(d.heading)+'</h3>';
        (d.links||[]).forEach((l,i) => {
          ll += '<table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:'+(i===0?'0':'10px')+' 0 10px;'+(i<d.links.length-1?'border-bottom:1px solid #222226;':'')+'">';
          ll += '<tr><td valign="middle"><a href="'+xe(l.url||'#')+'" style="font-size:14px;font-weight:600;color:'+accent+';text-decoration:none;font-family:'+FONT+';">'+xe(l.text)+'</a>';
          if (l.desc) ll += '<span style="font-size:12px;color:'+T3+';margin-left:8px;font-family:'+FONT+';">'+xe(l.desc)+'</span>';
          ll += '</td><td align="right" valign="middle" style="font-size:13px;color:#404048;">&#8594;</td></tr></table>';
        });
        ll += '<!--[if mso]></td></tr></table><![endif]--><!--[if !mso]><!--></td></tr></table><!--<![endif]--></td></tr></table>';
        return ll;
      }
    }
  };

  const body = draft.blocks.map(blockHtml).join('\n');

  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="format-detection" content="telephone=no,date=no,address=no,email=no,url=no" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${xe(draft.meta.subject)}</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
    table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;}
    img{-ms-interpolation-mode:bicubic;border:0;outline:none;text-decoration:none;}
    body{margin:0;padding:0;background-color:#000000;width:100%!important;min-width:100%;}
    a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important;font-size:inherit!important;font-family:inherit!important;font-weight:inherit!important;line-height:inherit!important;}
    u+#body a{color:inherit;text-decoration:none;font-size:inherit;font-family:inherit;font-weight:inherit;line-height:inherit;}
    #MessageViewBody a{color:inherit;text-decoration:none;font-size:inherit;font-family:inherit;font-weight:inherit;line-height:inherit;}
  </style>
</head>
<body id="body" style="margin:0;padding:0;background-color:#000000;width:100%!important;">

<!-- Preview text + filler to prevent bleed-through -->
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;visibility:hidden;opacity:0;color:transparent;font-size:1px;line-height:1px;">${xe(draft.meta.preview)}&nbsp;&zwnj;&hairsp;&zwnj;&hairsp;&zwnj;&hairsp;&zwnj;&hairsp;&zwnj;&hairsp;&zwnj;&hairsp;&zwnj;&hairsp;&zwnj;&hairsp;&zwnj;&hairsp;&zwnj;&hairsp;&zwnj;&hairsp;&zwnj;&hairsp;&zwnj;&hairsp;&zwnj;&hairsp;&zwnj;&hairsp;&zwnj;&hairsp;&zwnj;&hairsp;&zwnj;&hairsp;&zwnj;&hairsp;&zwnj;&hairsp;&zwnj;&hairsp;</div>

<!--[if mso | IE]><table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#000000"><tr><td align="center" bgcolor="#000000"><![endif]-->
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#000000" style="background-color:#000000;">
  <tr>
    <td align="center" bgcolor="#000000" style="background-color:#000000;padding:32px 16px;">

      <!--[if mso | IE]><table width="600" cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="#000000"><tr><td bgcolor="#000000"><![endif]-->
      <table width="600" cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="#000000"
        style="max-width:600px;width:100%;background-color:#000000;border:1px solid #222226;">
        <tr><td bgcolor="#000000" style="background-color:#000000;">

${body}

        </td></tr>
      </table>
      <!--[if mso | IE]></td></tr></table><![endif]-->

    </td>
  </tr>
</table>
<!--[if mso | IE]></td></tr></table><![endif]-->

</body>
</html>`;
};

/* ════════════════════════════════════════════
   MJML EXPORT
   ════════════════════════════════════════════ */
const GFONT = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';

const blockToMjml = (b, accent, contrast) => {
  const d = b.data;
  const P = '32px';
  switch (b.type) {

    case 'header': return `
  <mj-section padding="20px ${P}" border-bottom="1px solid #1A1A1A">
    <mj-column vertical-align="middle">
      <mj-image src="https://exit1.dev/e_.svg" alt="${xe(d.brandName)}" width="130px" align="left" padding="0" />
    </mj-column>${d.showStatus ? `
    <mj-column vertical-align="middle">
      <mj-text align="right" font-size="12px" color="rgba(255,255,255,0.6)" padding="0" font-family="Inter,sans-serif"><span style="border:1px solid rgba(255,255,255,0.12);border-radius:9999px;padding:4px 12px;display:inline-block"><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${d.statusType==='down'?'#E24530':d.statusType==='warn'?'#E3B24A':'#3FB873'};vertical-align:middle;margin-right:6px"></span>${xe(d.statusText)}</span></mj-text>
    </mj-column>` : ''}
  </mj-section>`;

    case 'hero': return `
  <mj-section padding="32px ${P} 24px" border-bottom="1px solid #1A1A1A">
    <mj-column>${d.eyebrow ? `
      <mj-text font-size="11px" font-weight="500" color="${accent}" letter-spacing="2px" padding="0 0 12px 0" font-family="Inter,sans-serif" text-transform="uppercase">${xe(d.eyebrow.toUpperCase())}</mj-text>` : ''}
      <mj-text font-size="32px" font-weight="700" color="#ffffff" line-height="1.15" padding="0 0 12px 0" font-family="Inter,sans-serif">${xe(d.heading)}</mj-text>${d.sub ? `
      <mj-text font-size="16px" color="rgba(255,255,255,0.7)" line-height="1.5" padding="0" font-family="Inter,sans-serif">${xe(d.sub)}</mj-text>` : ''}
    </mj-column>
  </mj-section>`;

    case 'body': return `
  <mj-section padding="24px ${P}">
    <mj-column>
      ${(d.paragraphs||[]).map(p =>
        `<mj-text font-size="15px" color="${p.style==='lede'||p.style==='close'?'#ffffff':'rgba(255,255,255,0.7)'}${p.style==='close'?'" font-weight="500':''}" line-height="1.6" padding="0 0 14px 0" font-family="Inter,sans-serif">${xe(p.text)}</mj-text>`
      ).join('\n      ')}
    </mj-column>
  </mj-section>`;

    case 'steps': return (d.items||[]).map((s, i) => `
  <mj-section padding="${i===0?'16px':'8px'} ${P} 0">
    <mj-column background-color="#1A1A1A" border="1px solid rgba(255,255,255,0.1)" border-radius="10px" padding="20px">
      <mj-text font-size="11px" padding="0 0 10px 0" font-family="Inter,sans-serif" color="${accent}"><span style="display:inline-block;background:${accent};color:${contrast};padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:700;margin-right:8px">${xe(s.number)}</span><span style="text-transform:uppercase;letter-spacing:0.1em;font-size:11px;color:rgba(255,255,255,0.45)">${xe(s.label)}</span></mj-text>
      <mj-text font-size="18px" font-weight="600" color="#ffffff" padding="0 0 8px 0" font-family="Inter,sans-serif">${xe(s.title)}</mj-text>
      <mj-text font-size="15px" color="rgba(255,255,255,0.7)" line-height="1.6" padding="0 0 ${s.ctaText?'14':'0'}px 0" font-family="Inter,sans-serif">${xe(s.body)}</mj-text>${s.ctaText ? `
      <mj-button href="${xe(s.ctaUrl||'#')}" background-color="${s.ctaStyle==='primary'?accent:'transparent'}" color="${s.ctaStyle==='primary'?contrast:'#ffffff'}" border="${s.ctaStyle==='primary'?'none':'1px solid rgba(255,255,255,0.25)'}" border-radius="9999px" font-size="13px" font-weight="500" padding="8px 20px" inner-padding="0" font-family="Inter,sans-serif">${xe(s.ctaText)} →</mj-button>` : ''}
    </mj-column>
  </mj-section>`).join('');

    case 'ctablock': return `
  <mj-section padding="16px ${P} 24px">
    <mj-column>
      <mj-button href="${xe(d.url||'#')}" background-color="${d.style==='ghost'?'transparent':accent}" color="${d.style==='ghost'?'#ffffff':contrast}" border="${d.style==='ghost'?'1px solid rgba(255,255,255,0.25)':'none'}" border-radius="9999px" font-size="14px" font-weight="600" padding="12px 28px" inner-padding="0" font-family="Inter,sans-serif">${xe(d.text)} →</mj-button>
    </mj-column>
  </mj-section>`;

    case 'stats': return `
  <mj-section padding="8px ${P} 0">
    ${(d.items||[]).map(s =>
      `<mj-column background-color="#1A1A1A" border="1px solid rgba(255,255,255,0.1)" border-radius="10px" padding="16px">
      <mj-text font-size="11px" font-weight="500" color="rgba(255,255,255,0.45)" letter-spacing="1px" padding="0 0 6px 0" text-transform="uppercase" font-family="Inter,sans-serif">${xe(s.label)}</mj-text>
      <mj-text font-size="24px" font-weight="600" color="#ffffff" padding="0${s.sub?' 0 4px':''}" font-family="Inter,sans-serif">${xe(s.value)}</mj-text>${s.sub ? `
      <mj-text font-size="11px" color="rgba(255,255,255,0.4)" padding="0" font-family="Inter,sans-serif">${xe(s.sub)}</mj-text>` : ''}
    </mj-column>`).join('\n    ')}
  </mj-section>`;

    case 'feature': return `
  <mj-section padding="8px ${P}">
    <mj-column background-color="#1A1A1A" border="1px solid rgba(255,255,255,0.1)" border-radius="10px" padding="0">
      <mj-text align="center" padding="48px 0" font-size="11px" color="rgba(255,255,255,0.3)" font-family="monospace" letter-spacing="2px" text-transform="uppercase">${xe(d.mediaLabel)}</mj-text>
      <mj-divider border-color="rgba(255,255,255,0.08)" border-width="1px" padding="0" />
      <mj-text font-size="18px" font-weight="600" color="#ffffff" padding="20px 20px 8px" font-family="Inter,sans-serif">${xe(d.heading)}</mj-text>
      <mj-text font-size="15px" color="rgba(255,255,255,0.7)" line-height="1.6" padding="0 20px 20px" font-family="Inter,sans-serif">${xe(d.body)}</mj-text>
    </mj-column>
  </mj-section>`;

    case 'quote': return `
  <mj-section padding="8px ${P}">
    <mj-column background-color="#1A1A1A" border="1px solid rgba(255,255,255,0.1)" border-left="3px solid ${accent}" border-radius="10px" padding="24px">
      <mj-text font-size="18px" font-weight="500" color="#ffffff" line-height="1.4" padding="0 0 16px 0" font-family="Inter,sans-serif">"${xe(d.quote)}"</mj-text>
      <mj-text font-size="13px" color="rgba(255,255,255,0.5)" padding="0" font-family="Inter,sans-serif"><b style="color:rgba(255,255,255,0.7)">${xe(d.author)}</b> · ${xe(d.role)}</mj-text>
    </mj-column>
  </mj-section>`;

    case 'plan': return `
  <mj-section padding="8px ${P} 24px">
    <mj-column background-color="#1A1A1A" border="1px solid rgba(255,255,255,0.1)" border-top="2px solid ${accent}" border-radius="10px" padding="20px">
      <mj-text font-size="11px" color="rgba(255,255,255,0.45)" padding="0 0 14px 0" font-family="Inter,sans-serif"><span style="text-transform:uppercase;letter-spacing:1px">${xe(d.label)}</span>&nbsp;&nbsp;<span style="background:${accent};color:${contrast};padding:2px 10px;border-radius:9999px;font-weight:700;font-size:10px;letter-spacing:0.06em">${xe(d.tier.toUpperCase())}</span></mj-text>
      <mj-text font-size="13px" color="rgba(255,255,255,0.7)" line-height="1.8" padding="0 0 12px 0" font-family="Inter,sans-serif">${(d.specs||[]).map(s=>`<span style="margin-right:14px"><span style="display:inline-block;width:4px;height:4px;border-radius:50%;background:${accent};vertical-align:middle;margin-right:6px"></span>${xe(s)}</span>`).join('')}</mj-text>${d.upsell ? `
      <mj-text font-size="13px" color="rgba(255,255,255,0.65)" line-height="1.5" padding="0" font-family="Inter,sans-serif">${xe(d.upsell).replace(/\*\*(.+?)\*\*/g, `<b style="color:${accent}">$1</b>`)}</mj-text>` : ''}
    </mj-column>
  </mj-section>`;

    case 'divider': return `
  <mj-section padding="4px ${P}">
    <mj-column><mj-divider border-color="#1A1A1A" border-width="1px" padding="0" /></mj-column>
  </mj-section>`;

    case 'footer': return `
  <mj-section padding="16px ${P}" border-top="1px solid #1A1A1A">
    <mj-column vertical-align="middle">
      <mj-text font-size="12px" color="rgba(255,255,255,0.35)" padding="0" font-family="Inter,sans-serif">${xe(d.brand)}</mj-text>
    </mj-column>
    <mj-column vertical-align="middle">
      <mj-text align="right" font-size="12px" padding="0" font-family="Inter,sans-serif">${(d.links||[]).map(l=>`<a href="${xe(l.url||'#')}" style="color:rgba(255,255,255,0.55);text-decoration:none;margin-left:16px">${xe(l.text)}</a>`).join('')}</mj-text>
    </mj-column>
  </mj-section>`;

    case 'alert': {
      const ac = {down:{bg:'#2a0e0e',border:'#E24530',dot:'#E24530',label:'DOWN'},warn:{bg:'#231a08',border:'#E3B24A',dot:'#E3B24A',label:'DEGRADED'},up:{bg:'#0a1f12',border:'#3FB873',dot:'#3FB873',label:'OPERATIONAL'},info:{bg:'#0c1428',border:'#4A8DB8',dot:'#4A8DB8',label:'NOTICE'}};
      const c = ac[d.type]||ac.down;
      return `
  <mj-section padding="0 ${P} 16px">
    <mj-column background-color="${c.bg}" border="1px solid ${c.border}" border-left="3px solid ${c.border}" border-radius="10px" padding="20px">
      <mj-text font-size="10px" font-weight="700" color="${c.dot}" letter-spacing="2px" text-transform="uppercase" padding="0 0 8px 0" font-family="Inter,sans-serif"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${c.dot};vertical-align:middle;margin-right:6px"></span>${xe(c.label)}</mj-text>
      <mj-text font-size="17px" font-weight="700" color="#ffffff" padding="0 0 6px 0" font-family="Inter,sans-serif">${xe(d.title)}</mj-text>
      ${d.body?`<mj-text font-size="14px" color="rgba(255,255,255,0.65)" line-height="1.55" padding="0 0 12px 0" font-family="Inter,sans-serif">${xe(d.body)}</mj-text>`:''}
      ${d.ctaText?`<mj-text font-size="13px" color="${c.dot}" font-weight="600" padding="0" font-family="Inter,sans-serif"><a href="${xe(d.ctaUrl||'#')}" style="color:${c.dot};font-weight:600;text-decoration:underline;">${xe(d.ctaText)} →</a></mj-text>`:''}
    </mj-column>
  </mj-section>`; }

    case 'checklist': return `
  <mj-section padding="0 ${P} 16px">
    <mj-column background-color="#1A1A1A" border="1px solid rgba(255,255,255,0.1)" border-radius="10px" padding="20px">
      ${d.heading?`<mj-text font-size="17px" font-weight="700" color="#ffffff" padding="0 0 14px 0" font-family="Inter,sans-serif">${xe(d.heading)}</mj-text>`:''}
      ${(d.items||[]).map(it=>`<mj-text font-size="14px" color="${it.checked?'#d8d8e0':'#606068'}" line-height="1.45" padding="0 0 10px 0" font-family="Inter,sans-serif"><span style="display:inline-block;width:18px;height:18px;border-radius:50%;background:${it.checked?accent:'#222226'};color:${it.checked?contrast:'transparent'};text-align:center;font-size:10px;font-weight:700;line-height:18px;vertical-align:middle;margin-right:8px;">${it.checked?'&#10003;':''}</span>${it.checked?xe(it.text):`<span style="text-decoration:line-through">${xe(it.text)}</span>`}</mj-text>`).join('\n      ')}
    </mj-column>
  </mj-section>`;

    case 'code': return `
  <mj-section padding="0 ${P} 16px">
    <mj-column background-color="#0a0a0c" border="1px solid rgba(255,255,255,0.09)" border-radius="10px" padding="0">
      <mj-text font-size="11px" font-weight="700" color="rgba(255,255,255,0.35)" letter-spacing="2px" text-transform="uppercase" padding="8px 16px" background-color="#111114" font-family="'Courier New',Courier,monospace">${xe(d.label)} <span style="float:right;color:#444450">${xe(d.language)}</span></mj-text>
      <mj-divider border-color="rgba(255,255,255,0.09)" border-width="1px" padding="0" />
      <mj-text font-size="13px" color="#b0b8c8" line-height="1.65" padding="20px" font-family="'Courier New',Courier,monospace"><pre style="margin:0;white-space:pre-wrap;word-break:break-word;font-family:'Courier New',Courier,monospace">${xe(d.code)}</pre></mj-text>
    </mj-column>
  </mj-section>`;

    case 'image': return `
  <mj-section padding="0 ${P} 16px">
    <mj-column>
      ${d.src
        ? `<mj-image src="${xe(d.src)}" alt="${xe(d.alt||'')}" width="536px" border-radius="10px" padding="0"${d.link?` href="${xe(d.link)}"`:''}  />`
        : `<mj-text align="center" padding="48px 0" font-size="11px" color="rgba(255,255,255,0.3)" font-family="monospace" letter-spacing="2px" background-color="#1A1A1A">[ ${xe(d.alt||'Image')} ]</mj-text>`}
      ${d.caption?`<mj-text align="center" font-size="12px" color="rgba(255,255,255,0.38)" padding="8px 0 0" font-family="Inter,sans-serif">${xe(d.caption)}</mj-text>`:''}
    </mj-column>
  </mj-section>`;

    case 'twocol': return `
  <mj-section padding="0 ${P} 16px">
    ${(d.cols||[]).map(col=>`<mj-column background-color="#1A1A1A" border="1px solid ${col.accent?accent:'rgba(255,255,255,0.1)'}" border-top="2px solid ${col.accent?accent:'rgba(255,255,255,0.1)'}" border-radius="10px" padding="18px">
      <mj-text font-size="10px" font-weight="700" color="${col.accent?accent:'rgba(255,255,255,0.38)'}" letter-spacing="2px" text-transform="uppercase" padding="0 0 3px 0" font-family="Inter,sans-serif">${xe(col.subhead)}</mj-text>
      <mj-text font-size="20px" font-weight="700" color="#ffffff" padding="0 0 10px 0" font-family="Inter,sans-serif">${xe(col.heading)}</mj-text>
      <mj-text font-size="13px" color="rgba(255,255,255,0.65)" line-height="1.55" padding="0 0 14px 0" font-family="Inter,sans-serif">${xe(col.body)}</mj-text>
      ${col.ctaText?`<mj-text font-size="12px" font-weight="700" color="${col.accent?accent:'rgba(255,255,255,0.5)'}" padding="0" font-family="Inter,sans-serif"><a href="${xe(col.ctaUrl||'#')}" style="color:${col.accent?accent:'rgba(255,255,255,0.5)'};text-decoration:none;border-bottom:1px solid ${col.accent?accent:'rgba(255,255,255,0.25)'};">${xe(col.ctaText)} →</a></mj-text>`:''}
    </mj-column>`).join('\n    ')}
  </mj-section>`;

    case 'announcement': {
      const bc2 = ({accent:accent,green:'#3FB873',amber:'#E3B24A',red:'#E24530'})[d.badgeStyle]||accent;
      let ma = '<mj-section padding="40px '+P+' 32px" border-bottom="1px solid #1A1A1A"><mj-column>';
      if (d.badge) ma += '<mj-text align="center" padding="0 0 16px 0" font-family="Inter,sans-serif"><span style="display:inline-block;padding:4px 14px;border-radius:9999px;border:1px solid '+bc2+';font-size:11px;font-weight:700;color:'+bc2+';letter-spacing:2px;text-transform:uppercase;">'+xe(d.badge)+'</span></mj-text>';
      ma += '<mj-text align="center" font-size="32px" font-weight="700" color="#ffffff" line-height="1.15" padding="0 0 14px 0" font-family="Inter,sans-serif">'+xe(d.heading)+'</mj-text>';
      if (d.sub) ma += '<mj-text align="center" font-size="17px" color="rgba(255,255,255,0.65)" line-height="1.55" padding="0 0 20px 0" font-family="Inter,sans-serif">'+xe(d.sub)+'</mj-text>';
      if (d.ctaText) ma += '<mj-button href="'+xe(d.ctaUrl||'#')+'" background-color="'+accent+'" color="'+contrast+'" border-radius="9999px" font-size="13px" font-weight="600" padding="10px 22px" inner-padding="0" font-family="Inter,sans-serif" align="center">'+xe(d.ctaText)+' →</mj-button>';
      ma += '</mj-column></mj-section>';
      return ma;
    }
    case 'timeline': {
      const sc2={down:'#E24530',warn:'#E3B24A',up:'#3FB873',info:'#4A8DB8'};
      let mt = '<mj-section padding="0 '+P+' 16px"><mj-column background-color="#1A1A1A" border="1px solid rgba(255,255,255,0.1)" border-radius="10px" padding="20px">';
      if (d.heading) mt += '<mj-text font-size="17px" font-weight="700" color="#ffffff" padding="0 0 18px 0" font-family="Inter,sans-serif">'+xe(d.heading)+'</mj-text>';
      (d.events||[]).forEach(ev => {
        mt += '<mj-text font-size="14px" color="rgba(255,255,255,0.7)" line-height="1.5" padding="0 0 12px 0" font-family="Inter,sans-serif"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:'+(sc2[ev.status]||sc2.info)+';vertical-align:middle;margin-right:8px;"></span><span style="font-size:11px;color:rgba(255,255,255,0.38);font-family:Courier New,monospace;margin-right:10px;">'+xe(ev.time)+'</span>'+xe(ev.text)+'</mj-text>';
      });
      mt += '</mj-column></mj-section>';
      return mt;
    }
    case 'bigmetric': {
      let mb = '<mj-section padding="36px '+P+'" border-bottom="1px solid #1A1A1A"><mj-column>';
      mb += '<mj-text align="center" font-size="64px" font-weight="700" color="'+(d.accent?accent:'#ffffff')+'" padding="0 0 10px 0" font-family="Inter,sans-serif">'+xe(d.value)+'</mj-text>';
      mb += '<mj-text align="center" font-size="18px" font-weight="600" color="#ffffff" padding="0 0 6px 0" font-family="Inter,sans-serif">'+xe(d.label)+'</mj-text>';
      if (d.sub) mb += '<mj-text align="center" font-size="13px" color="rgba(255,255,255,0.45)" padding="0" font-family="Inter,sans-serif">'+xe(d.sub)+'</mj-text>';
      mb += '</mj-column></mj-section>';
      return mb;
    }
    case 'linklist': {
      let ml = '<mj-section padding="0 '+P+' 16px"><mj-column background-color="#1A1A1A" border="1px solid rgba(255,255,255,0.1)" border-radius="10px" padding="20px">';
      if (d.heading) ml += '<mj-text font-size="15px" font-weight="700" color="#ffffff" padding="0 0 14px 0" font-family="Inter,sans-serif">'+xe(d.heading)+'</mj-text>';
      (d.links||[]).forEach(l => {
        ml += '<mj-text font-size="14px" color="rgba(255,255,255,0.65)" line-height="1" padding="0 0 12px 0" font-family="Inter,sans-serif"><a href="'+xe(l.url||'#')+'" style="font-weight:600;color:'+accent+';text-decoration:none;">'+xe(l.text)+'</a>'+(l.desc?'<span style="color:rgba(255,255,255,0.38);font-size:12px;margin-left:8px;">'+xe(l.desc)+'</span>':'')+'</mj-text>';
      });
      ml += '</mj-column></mj-section>';
      return ml;
    }
  }
};

const generateMjml = draft => {
  const accent   = getAccent(draft.meta);
  const contrast = getContrast(draft.meta);
  return `<mjml>
  <mj-head>
    <mj-font name="Inter" href="${GFONT}" />
    <mj-preview>${xe(draft.meta.preview)}</mj-preview>
    <mj-attributes>
      <mj-all font-family="Inter, ui-sans-serif, -apple-system, sans-serif" />
      <mj-body background-color="#000000" width="600px" />
      <mj-section background-color="#000000" padding="0px" />
      <mj-column padding="0px" />
      <mj-text color="#ffffff" font-size="15px" line-height="1.5" padding="0px" />
      <mj-button font-family="Inter,sans-serif" align="left" />
    </mj-attributes>
  </mj-head>
  <mj-body>
${draft.blocks.map(b => blockToMjml(b, accent, contrast)).join('')}
  </mj-body>
</mjml>`;
};

/* ════════════════════════════════════════════
   CANVAS
   ════════════════════════════════════════════ */
const Canvas = ({ draft, selectedId, onSelect, onReorder, onDelete, onDuplicate }) => {
  const [dragId,  setDragId]  = useState(null);
  const [dropIdx, setDropIdx] = useState(null);
  const accent   = getAccent(draft.meta);
  const planCls  = PLANS[draft.meta.plan||'nano']?.cls || 'plan-nano';
  const gridCls  = draft.meta.showGrid ? '' : ' no-grid';

  const onDragStart = (e, id) => { setDragId(id); e.dataTransfer.effectAllowed='move'; try{e.dataTransfer.setData('text/plain',id);}catch{} };
  const onDragOver  = (e, idx) => { e.preventDefault(); const r=e.currentTarget.getBoundingClientRect(); setDropIdx((e.clientY-r.top)>r.height/2?idx+1:idx); };
  const onDrop      = e => {
    e.preventDefault();
    const nt = e.dataTransfer.getData('application/x-new-block');
    if (nt && BLOCKS[nt]) { window.__insertBlock?.(nt, dropIdx??draft.blocks.length); }
    else if (dragId!=null && dropIdx!=null) { onReorder(dragId, dropIdx); }
    setDragId(null); setDropIdx(null);
  };

  return (
    <div className="canvas-wrap" onDragOver={e=>e.preventDefault()} onDrop={onDrop} onClick={()=>onSelect(null)}>
      <div className="canvas-meta">
        <span>{draft.meta.name || 'Untitled'}</span>
        <span style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{width:10,height:10,borderRadius:'50%',background:accent,display:'inline-block'}}></span>
          {PLANS[draft.meta.plan]?.label||'Nano'} · {draft.blocks.length} blocks · 600px
        </span>
      </div>

      {draft.blocks.length===0&&(
        <div className="empty-state">Drag a block from the left to start.<br/>Draft saves automatically.</div>
      )}

      <div className={`e1-shell blocks-container${gridCls} ${planCls}`} style={{'--e1-accent':accent}}>
        {draft.blocks.map((b, idx) => (
          <React.Fragment key={b.id}>
            {dropIdx===idx&&<div className="drop-indicator"/>}
            <div
              className={`block-wrap${selectedId===b.id?' selected':''}`}
              onClick={e=>{e.stopPropagation();onSelect(b.id);}}
              draggable
              onDragStart={e=>onDragStart(e,b.id)}
              onDragOver={e=>onDragOver(e,idx)}
              onDragEnd={()=>{setDragId(null);setDropIdx(null);}}
            >
              <span className="block-label">{BLOCKS[b.type]?.label}</span>
              <div className="block-actions" onClick={e=>e.stopPropagation()}>
                <button className="handle" draggable onDragStart={e=>onDragStart(e,b.id)} title="Drag">≡</button>
                <button onClick={()=>onDuplicate(b.id)} title="Duplicate">⧉</button>
                <button className="danger" onClick={()=>onDelete(b.id)} title="Delete">×</button>
              </div>
              {BLOCKS[b.type]?.render(b.data)}
            </div>
          </React.Fragment>
        ))}
        {dropIdx===draft.blocks.length&&<div className="drop-indicator"/>}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   BRAND PANEL (shown when no block selected)
   ════════════════════════════════════════════ */
const BrandPanel = ({ draft, updateMeta, updateBlock }) => {
  const meta = draft.meta;
  const currentAccent = getAccent(meta);

  // Find first header block to sync logo fields
  const headerBlock = draft.blocks.find(b => b.type==='header');
  const updateHeader = patch => {
    if (headerBlock) updateBlock(headerBlock.id, {...headerBlock.data, ...patch});
  };

  return (
    <div className="inspector">
      <div className="inspector-header">
        <div>
          <h2>Brand &amp; Plan</h2>
          <span className="sub">Global settings</span>
        </div>
      </div>
      <div className="inspector-body">

        {/* ── Plan selector ── */}
        <div className="field" style={{marginBottom:18}}>
          <label>Plan</label>
          <div className="plan-grid">
            {Object.entries(PLANS).map(([key, p]) => (
              <div
                key={key}
                className={`plan-card${meta.plan===key?' selected':''}`}
                onClick={()=>updateMeta({plan:key, accentOverride:''})}
              >
                <div className="plan-swatch" style={{background:p.accent}}></div>
                <div className="plan-card-name">{p.label}</div>
                <div className="plan-card-desc">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Accent override ── */}
        <Field label="Accent colour" help="Override plan default. Clear to restore plan colour.">
          <div className="color-swatch">
            <input type="color" value={currentAccent}
              onChange={e=>updateMeta({accentOverride:e.target.value})} />
            <input type="text"  value={meta.accentOverride||''}
              placeholder={PLANS[meta.plan||'nano']?.accent}
              onChange={e=>updateMeta({accentOverride:e.target.value})} />
            {meta.accentOverride&&(
              <button className="mini-btn" style={{flexShrink:0}}
                onClick={()=>updateMeta({accentOverride:''})}>Reset</button>
            )}
          </div>
        </Field>

        {/* ── Logo ── */}
        <Field label="Logo">
          <div style={{padding:'10px 12px',background:'var(--ed-bg)',border:'1px solid var(--ed-border)',borderRadius:6,display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
            <img src="assets/exit1-logo.png" alt="exit1.dev" style={{height:20,width:'auto',opacity:0.9}} />
            <span style={{fontSize:11,color:'rgba(255,255,255,0.3)'}}>exit1-logo.png</span>
          </div>
          <TI value={meta.logoUrl||''} onChange={v=>updateMeta({logoUrl:v})} placeholder="https://your-cdn.com/exit1-logo.png" />
          <div className="help-text">Hosted URL used in exported HTML. Must be publicly accessible for email clients.</div>
        </Field>
        <Field label="Alt text (fallback)">
          <TI value={headerBlock?.data.brandName||'exit1.dev'}
            onChange={v=>updateHeader({brandName:v})} />
        </Field>

        {/* ── Grid toggle ── */}
        <Chk value={meta.showGrid} onChange={v=>updateMeta({showGrid:v})} label="Grid background" />

        <hr style={{border:'none',borderTop:'1px solid rgba(255,255,255,0.08)',margin:'16px 0'}} />

        {/* ── Email metadata ── */}
        <div style={{fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',color:'rgba(255,255,255,0.35)',fontWeight:500,marginBottom:12}}>Email metadata</div>

        <Field label="Internal name">
          <TI value={meta.name} onChange={v=>updateMeta({name:v})} />
        </Field>
        <Field label="Subject line" help="Keep under 50 chars. Front-load the key info.">
          <TI value={meta.subject} onChange={v=>updateMeta({subject:v})} />
          <div className="help-text" style={{textAlign:'right',marginTop:3}}>{(meta.subject||'').length}/50</div>
        </Field>
        <Field label="Preview text" help="Inbox snippet — under 90 chars.">
          <TA value={meta.preview} onChange={v=>updateMeta({preview:v})} rows={2} />
        </Field>

        <div className="help-text" style={{marginTop:16}}>
          Click any block on the canvas to edit its content. Use <b>Export HTML</b> to get Resend-ready inline HTML, or <b>Export MJML</b> for a compilable source file.
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   BLOCK INSPECTOR
   ════════════════════════════════════════════ */
const Inspector = ({ draft, selectedId, updateBlock, updateMeta }) => {
  if (!selectedId) return <BrandPanel draft={draft} updateMeta={updateMeta} updateBlock={updateBlock} />;
  const block = draft.blocks.find(b=>b.id===selectedId);
  if (!block) return <BrandPanel draft={draft} updateMeta={updateMeta} updateBlock={updateBlock} />;
  const def = BLOCKS[block.type];
  return (
    <div className="inspector">
      <div className="inspector-header">
        <div>
          <h2>{def.label}</h2>
          <span className="sub">Block editor</span>
        </div>
      </div>
      <div className="inspector-body">
        {def.inspector(block.data, patch => updateBlock(block.id, {...block.data, ...patch}))}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   PALETTE
   ════════════════════════════════════════════ */
const Palette = ({ onAdd }) => (
  <div className="palette">
    <p className="palette-title">Blocks — drag or click</p>
    {BLOCK_ORDER.map(t=>{
      const b=BLOCKS[t];
      return (
        <div key={t} className="palette-item"
          draggable
          onDragStart={e=>{e.dataTransfer.effectAllowed='copy';try{e.dataTransfer.setData('application/x-new-block',t);e.dataTransfer.setData('text/plain',t);}catch{}}}
          onClick={()=>onAdd(t,null)}>
          <span className="icon">{b.icon}</span>
          <span>{b.label}</span>
        </div>
      );
    })}
    <p className="palette-title" style={{marginTop:20}}>Merge variables</p>
    <div className="help-text" style={{lineHeight:1.9,fontFamily:'ui-monospace,monospace',fontSize:11}}>
      {['first_name','dashboard_url','alerts_url','preferences_url','unsubscribe_url'].map(v=>(
        <div key={v} style={{color:'rgba(255,255,255,0.5)'}}>{'{{'+v+'}}'}</div>
      ))}
    </div>
  </div>
);

/* ════════════════════════════════════════════
   EXPORT MODAL
   ════════════════════════════════════════════ */
const ExportModal = ({ content, type, name, onClose }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(content).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),1400);});
  };
  const download = () => {
    const ext  = type==='mjml' ? 'mjml' : 'html';
    const mime = type==='mjml' ? 'text/plain' : 'text/html';
    const blob = new Blob([content],{type:mime});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href=url; a.download=`${(name||'email').replace(/[^\w]+/g,'-').toLowerCase()}.${ext}`; a.click();
    setTimeout(()=>URL.revokeObjectURL(url),600);
  };
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3>{modal.type==='html'?'Export HTML (Resend-ready)':modal.type==='mjml'?'MJML Source':'Draft JSON'}</h3>
            {modal.type==='html'&&<div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginTop:2}}>Fully inline-styled · paste directly into Resend as a template</div>}
            {modal.type==='mjml'&&<div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginTop:2}}>Compile with <code>mjml input.mjml -o output.html</code> or paste at mjml.io</div>}
          </div>
          <button className="topbar-btn ghost" onClick={()=>setModal(null)}>Close</button>
        </div>
        <div className="modal-body"><pre>{modal.content}</pre></div>
        <div className="modal-foot">
          <button className="topbar-btn" id="copy-btn" onClick={()=>{
            navigator.clipboard?.writeText(modal.content).then(()=>{
              const b=document.getElementById('copy-btn');
              if(b){const t=b.textContent;b.textContent='Copied ✓';setTimeout(()=>b.textContent=t,1400);}
            });
          }}>Copy</button>
          <button className="topbar-btn primary" onClick={()=>{
            const ext  = modal.type==='json'?'json':modal.type==='mjml'?'mjml':'html';
            const mime = modal.type==='json'?'application/json':modal.type==='mjml'?'text/plain':'text/html';
            const blob = new Blob([modal.content],{type:mime});
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement('a');
            a.href=url; a.download=`${(draft.meta.name||'email').replace(/[^\w]+/g,'-').toLowerCase()}.${ext}`; a.click();
            setTimeout(()=>URL.revokeObjectURL(url),600);
          }}>Download .{modal.type==='json'?'json':modal.type==='mjml'?'mjml':'html'}</button>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   APP
   ════════════════════════════════════════════ */
const EmailApp = ({ view, setView }) => {
  const [draft,      setDraft]      = useState(loadDraft);
  const [selectedId, setSelectedId] = useState(null);
  const [modal,      setModal]      = useState(null); // {type,content}

  useEffect(()=>{ saveDraft(draft); }, [draft]);

  const updateMeta  = patch => setDraft(d=>({...d, meta:{...d.meta,...patch}}));
  const updateBlock = (id, newData) => setDraft(d=>({...d, blocks:d.blocks.map(b=>b.id===id?{...b,data:newData}:b)}));

  const addBlock = (type, atIdx) => {
    if (!BLOCKS[type]) return;
    const nb = {id:uid(), type, data:BLOCKS[type].defaults()};
    setDraft(d=>{
      const idx = typeof atIdx==='number' ? atIdx : d.blocks.length;
      return {...d, blocks:[...d.blocks.slice(0,idx),nb,...d.blocks.slice(idx)]};
    });
    setSelectedId(nb.id);
  };
  window.__insertBlock = addBlock;

  const deleteBlock    = id => { setDraft(d=>({...d,blocks:d.blocks.filter(b=>b.id!==id)})); if(selectedId===id)setSelectedId(null); };
  const duplicateBlock = id => {
    setDraft(d=>{
      const i=d.blocks.findIndex(b=>b.id===id); if(i<0)return d;
      const copy={...d.blocks[i],id:uid(),data:JSON.parse(JSON.stringify(d.blocks[i].data))};
      const blocks=[...d.blocks.slice(0,i+1),copy,...d.blocks.slice(i+1)];
      return {...d,blocks};
    });
  };
  const reorder = (dragId, targetIdx) => {
    setDraft(d=>{
      const from=d.blocks.findIndex(b=>b.id===dragId); if(from<0)return d;
      const arr=[...d.blocks]; const [item]=arr.splice(from,1);
      arr.splice(from<targetIdx?targetIdx-1:targetIdx,0,item);
      return {...d,blocks:arr};
    });
  };

  const exportMjml = () => setModal({type:'mjml', content:generateMjml(draft)});
  const exportHtml = () => setModal({type:'html', content:generateInlineHtml(draft)});
  const exportJson = () => setModal({type:'json', content:JSON.stringify(draft,null,2)});

  const importJson = () => {
    const inp=document.createElement('input'); inp.type='file'; inp.accept='.json,application/json';
    inp.onchange=()=>{
      const f=inp.files?.[0]; if(!f)return;
      const r=new FileReader();
      r.onload=()=>{ try{const d=JSON.parse(r.result);if(d.blocks&&d.meta){setDraft(d);setSelectedId(null);}}catch{alert('Invalid JSON');} };
      r.readAsText(f);
    };
    inp.click();
  };

  const currentPlan = PLANS[draft.meta.plan]||PLANS.nano;

  return (
    <>
      <div className="topbar">
        <span className="topbar-brand">
          <span className="mark">e_</span> exit1.dev
        </span>
        <div className="view-tabs">
          <button className={`view-tab${view==='email'?' active':''}`} onClick={e=>{e.stopPropagation();setView('email');}}>Email</button>
          <button className={`view-tab${view==='social'?' active':''}`} onClick={e=>{e.stopPropagation();setView('social');}}>Social</button>
        </div>
        {/* Plan indicator */}
        <span style={{
          display:'inline-flex',alignItems:'center',gap:6,
          marginLeft:8,padding:'3px 10px',
          borderRadius:9999,border:'1px solid rgba(255,255,255,0.1)',
          fontSize:11,fontWeight:600,letterSpacing:'0.06em',
          background:`${currentPlan.accent}18`,
          color:currentPlan.accent,
        }}>
          <span style={{width:6,height:6,borderRadius:'50%',background:currentPlan.accent}}></span>
          {currentPlan.label.toUpperCase()}
        </span>

        <span className="topbar-spacer"></span>
        <button className="topbar-btn ghost" onClick={()=>{if(confirm('Start blank?')){setDraft({meta:{name:'Untitled',subject:'',preview:'',showGrid:true,plan:'nano',accentOverride:'',logoUrl:''},blocks:[]});setSelectedId(null);}}}>New</button>
        <button className="topbar-btn ghost" onClick={importJson}>Import</button>
        <button className="topbar-btn ghost" onClick={exportJson}>Save JSON</button>
        <button className="topbar-btn ghost" onClick={()=>{if(confirm('Reset to welcome email?')){setDraft(SEED);setSelectedId(null);}}}>Reset</button>
        <button className="topbar-btn ghost" onClick={exportMjml}>Export MJML</button>
        <button className="topbar-btn primary" onClick={exportHtml}>Export HTML</button>
      </div>

      <div className="workspace" onClick={()=>setSelectedId(null)}>
        <Palette onAdd={addBlock} />
        <Canvas
          draft={draft}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onReorder={reorder}
          onDelete={deleteBlock}
          onDuplicate={duplicateBlock}
        />
        <div onClick={e=>e.stopPropagation()}>
          <Inspector
            draft={draft}
            selectedId={selectedId}
            updateBlock={updateBlock}
            updateMeta={updateMeta}
          />
        </div>
      </div>

      {modal&&(
        <div className="modal-backdrop" onClick={()=>setModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h3>{modal.type==='html'?'Export HTML (Resend-ready)':modal.type==='mjml'?'MJML Source':'Draft JSON'}</h3>
                {modal.type==='html'&&<div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginTop:2}}>Fully inline-styled · paste directly into Resend as a template</div>}
                {modal.type==='mjml'&&<div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginTop:2}}>Compile with <code>mjml input.mjml -o output.html</code> or paste at mjml.io</div>}
              </div>
              <button className="topbar-btn ghost" onClick={()=>setModal(null)}>Close</button>
            </div>
            <div className="modal-body"><pre>{modal.content}</pre></div>
            <div className="modal-foot">
              <button className="topbar-btn" id="copy-btn" onClick={()=>{
                navigator.clipboard?.writeText(modal.content).then(()=>{
                  const b=document.getElementById('copy-btn');
                  if(b){const t=b.textContent;b.textContent='Copied ✓';setTimeout(()=>b.textContent=t,1400);}
                });
              }}>Copy</button>
              <button className="topbar-btn primary" onClick={()=>{
                const ext  = modal.type==='json'?'json':modal.type==='mjml'?'mjml':'html';
                const mime = modal.type==='json'?'application/json':modal.type==='mjml'?'text/plain':'text/html';
                const blob = new Blob([modal.content],{type:mime});
                const url  = URL.createObjectURL(blob);
                const a    = document.createElement('a');
                a.href=url; a.download=`${(draft.meta.name||'email').replace(/[^\w]+/g,'-').toLowerCase()}.${ext}`; a.click();
                setTimeout(()=>URL.revokeObjectURL(url),600);
              }}>Download .{modal.type==='json'?'json':modal.type==='mjml'?'mjml':'html'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Root mount moved to Email Builder.html
