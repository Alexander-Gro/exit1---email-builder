/* exit1.dev — Email Builder · editor.jsx
   Design system: exit1-design-system.md
   Flat-mode: no gradients, no glows, no MJML, no social. */

const { useState, useEffect, useRef } = React;

const uid = () => Math.random().toString(36).slice(2, 10);

/* ── Plan registry ── */
const PLANS = {
  free:   { label: 'Free',   accent: '#B2D3E6', contrast: '#000000', desc: '10 checks · 5 min' },
  nano:   { label: 'Nano',   accent: '#7C3AED', contrast: '#ffffff', desc: '50 checks · 2 min' },
  pro:    { label: 'Pro',    accent: '#F59E0B', contrast: '#000000', desc: '500 checks · 30s' },
  agency: { label: 'Agency', accent: '#3F9081', contrast: '#000000', desc: '1,000 checks · 15s' },
};

/* ── Email background options ── */
const EMAIL_SURFACES = [
  { id: 'app',      label: 'App',      bg: '#15151B', desc: 'exit1 canvas dark' },
  { id: 'void',     label: 'Void',     bg: '#000000', desc: 'Pure black' },
  { id: 'slate',    label: 'Slate',    bg: '#21212B', desc: 'Blue-gray' },
  { id: 'midnight', label: 'Midnight', bg: '#0E0E1A', desc: 'Deep purple' },
  { id: 'graphite', label: 'Graphite', bg: '#141414', desc: 'Warm dark' },
];

/* ── Colour helpers ── */
const hexLum = hex => {
  try {
    const r = parseInt(hex.slice(1,3),16)/255, g = parseInt(hex.slice(3,5),16)/255, b = parseInt(hex.slice(5,7),16)/255;
    const s = v => v<=0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4);
    return 0.2126*s(r) + 0.7152*s(g) + 0.0722*s(b);
  } catch { return 0; }
};
const autoContrast = hex => hexLum(hex) > 0.35 ? '#000000' : '#ffffff';

const getPlanAccent   = (meta, plan) => (meta.planColors?.[plan]) || PLANS[plan]?.accent || '#3F9081';
const getPlanContrast = (meta, plan) => meta.planColors?.[plan] ? autoContrast(meta.planColors[plan]) : (PLANS[plan]?.contrast || '#000000');
const getAccent       = meta => meta.accentOverride || getPlanAccent(meta, meta.plan || 'agency');
const getContrast     = meta => meta.accentOverride ? autoContrast(meta.accentOverride) : getPlanContrast(meta, meta.plan || 'agency');

/* ── Storage ── */
const SK = 'exit1-builder-v3';

const SEED = {
  meta: {
    name: 'Welcome · Free tier',
    subject: 'You just stopped flying blind',
    preview: "Your first check is already watching. Here's what happens next.",
    showGrid: false,
    plan: 'free',
    accentOverride: '',
    planColors: {},
    emailSurface: 'app',
    emailBg: '',
    logoUrl: '',
  },
  blocks: [
    { id: uid(), type: 'header', data: { brandName: 'exit1.dev', showStatus: true, statusText: 'All systems operational', statusType: 'up' } },
    { id: uid(), type: 'hero',   data: { eyebrow: 'Welcome to exit1.dev', heading: 'You just stopped flying blind.', sub: "Your first check is already running. Here's what to do next — takes about two minutes." } },
    { id: uid(), type: 'body',   data: { paragraphs: [
      { text: 'Hey {{first_name}},', style: 'lede' },
      { text: 'Most teams find out their site is down the same way their customers do: by accident. exit1.dev changes that — we check your services every few minutes and alert you the instant something goes wrong.', style: 'normal' },
    ]}},
    { id: uid(), type: 'steps', data: { items: [
      { number: '01', label: 'Already done',  title: 'Add a check',              body: 'Paste any URL — your site, API, checkout flow, or background job.',        ctaText: 'View your dashboard',    ctaUrl: '{{dashboard_url}}', ctaStyle: 'ghost' },
      { number: '02', label: 'Do this now',   title: 'Connect an alert channel', body: 'Choose where to hear about problems: email, Slack, Discord, or SMS.',      ctaText: 'Set up alerts',          ctaUrl: '{{alerts_url}}',    ctaStyle: 'primary' },
      { number: '03', label: 'Optional',      title: 'Share a status page',      body: 'A public status page shows customers you\'re on top of things — even before they notice.', ctaText: 'Create a status page', ctaUrl: '{{status_url}}',    ctaStyle: 'ghost' },
    ]}},
    { id: uid(), type: 'stats', data: { items: [
      { label: 'Monitors',        value: '10',     sub: 'on Free plan' },
      { label: 'Check interval',  value: '5 min',  sub: 'upgrade for 30s' },
      { label: 'Data retention',  value: '60 days',sub: 'full history' },
    ]}},
    { id: uid(), type: 'body', data: { paragraphs: [
      { text: "Once alerts are connected, exit1.dev runs quietly in the background. You'll forget it's there — right up until it matters.", style: 'normal' },
      { text: '— The exit1.dev team', style: 'close' },
    ]}},
    { id: uid(), type: 'footer', data: { brand: 'exit1.dev', links: [
      { text: 'Dashboard',   url: '{{dashboard_url}}' },
      { text: 'Preferences', url: '{{preferences_url}}' },
      { text: 'Unsubscribe', url: '{{unsubscribe_url}}' },
    ]}},
  ],
};

const loadDraft = () => {
  try { const d = JSON.parse(localStorage.getItem(SK) || 'null'); return d?.blocks && d?.meta ? d : SEED; }
  catch { return SEED; }
};
const saveDraft = d => { try { localStorage.setItem(SK, JSON.stringify(d)); } catch {} };

const GK = 'exit1-global-v2';
const GLOBAL_BLOCK_TYPES = new Set(['signature', 'footer', 'sociallinks']);
const loadGlobal = () => { try { return JSON.parse(localStorage.getItem(GK) || '{}'); } catch { return {}; } };
const saveGlobal = (type, data) => { try { const g = loadGlobal(); localStorage.setItem(GK, JSON.stringify({ ...g, [type]: data })); } catch {} };

/* ═══════════════════════════════════════════════════════
   INLINE HTML EXPORT
   Pure inline CSS — no <style> blocks, no CSS variables.
   All colours resolved to hex literals.
   Outlook VML fallbacks for rounded buttons only.
   ═══════════════════════════════════════════════════════ */

const xe = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

const generateInlineHtml = draft => {
  const accent   = getAccent(draft.meta);
  const contrast = getContrast(draft.meta);

  /* Resolved design-system tokens — hex only */
  const BG    = draft.meta.emailBg || (EMAIL_SURFACES.find(s => s.id === (draft.meta.emailSurface || 'app'))?.bg) || '#15151B';
  const CARD  = '#1C1C23';
  const MUTED = '#222229';
  const BORD  = '#2B2B33';
  const T1    = '#FAFAFA';
  const T2    = '#A8A8B0';
  const T3    = '#666670';
  const FONT  = "Arial, Helvetica, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const MONO  = "'Courier New', Courier, monospace";
  const P     = '32px';  /* horizontal padding inside email */

  const logoUrl = draft.meta.logoUrl || 'https://exit1.dev/e_.svg';

  /* Outlook-safe rounded button */
  const vmlBtn = (href, text, bg, fg, w = 200) =>
    `<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${xe(href)}" style="height:38px;v-text-anchor:middle;width:${w}px;" arcsize="14%" strokecolor="${bg}" fillcolor="${bg}"><w:anchorlock/><center style="color:${fg};font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;">${xe(text)} &#8594;</center></v:roundrect><![endif]--><!--[if !mso]><!-->${solidBtn(href, text, bg, fg)}<!--<![endif]-->`;

  const solidBtn = (href, text, bg, fg) =>
    `<a href="${xe(href)}" style="display:inline-block;background:${bg};color:${fg};padding:10px 22px;border-radius:6px;font-size:13px;font-weight:600;text-decoration:none;font-family:${FONT};">${xe(text)} &#8594;</a>`;

  const ghostBtn = (href, text) =>
    `<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${xe(href)}" style="height:36px;v-text-anchor:middle;width:200px;" arcsize="14%" strokecolor="${BORD}" fillcolor="${MUTED}"><w:anchorlock/><center style="color:${T1};font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;">${xe(text)} &#8594;</center></v:roundrect><![endif]--><!--[if !mso]><!--><a href="${xe(href)}" style="display:inline-block;background:${MUTED};color:${T1};padding:9px 18px;border-radius:6px;border:1px solid ${BORD};font-size:13px;font-weight:500;text-decoration:none;font-family:${FONT};">${xe(text)} &#8594;</a><!--<![endif]-->`;

  const discordBtn = (href, text) =>
    `<a href="${xe(href)}" style="display:inline-flex;align-items:center;gap:8px;background:#5865f2;color:#ffffff;padding:10px 22px;border-radius:6px;font-size:13px;font-weight:600;text-decoration:none;font-family:${FONT};"><img src="https://storage.exit1.dev/images/Discord-Symbol-White.png" width="16" height="16" style="display:inline-block;vertical-align:middle;object-fit:contain;" alt="" />${xe(text)}</a>`;

  const g2Btn = (href, text) =>
    `<a href="${xe(href)}" style="display:inline-flex;align-items:center;gap:8px;background:#FF492C;color:#ffffff;padding:10px 22px;border-radius:6px;font-size:13px;font-weight:600;text-decoration:none;font-family:${FONT};"><img src="https://storage.exit1.dev/images/G2Logo-Red.png" width="16" height="16" style="display:inline-block;vertical-align:middle;object-fit:contain;" alt="" />${xe(text)}</a>`;

  const dotColor = t => t === 'down' ? '#E5534B' : t === 'warn' ? '#F59E0B' : '#3EB87A';

  const blockHtml = b => {
    const d = b.data;
    const wrap = (inner, pad = `20px ${P}`) =>
      `\n<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">\n  <tr><td style="padding:${pad};">${inner}</td></tr>\n</table>`;
    const card = (inner, extraStyle = '') =>
      `<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${CARD}" style="background:${CARD};padding:20px;${extraStyle}"><![endif]--><!--[if !mso]><!--><table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${CARD}" style="background:${CARD};border-radius:8px;${extraStyle}"><tr><td style="padding:20px;">${inner}</td></tr></table><!--<![endif]--><!--[if mso]></td></tr></table><![endif]-->`;

    switch (b.type) {

      case 'header': return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:18px ${P};">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="vertical-align:middle;">
          <img src="${xe(logoUrl)}" alt="${xe(d.brandName || 'exit1.dev')}" height="24" style="display:block;height:24px;width:auto;border:0;" />
        </td>
        ${d.showStatus ? `<td style="vertical-align:middle;text-align:right;">
          <table cellpadding="0" cellspacing="0" border="0" align="right"><tr>
            <td style="padding:4px 10px;border-radius:99px;background:${dotColor(d.statusType)}1F;font-size:12px;font-weight:500;color:${dotColor(d.statusType)};font-family:${FONT};white-space:nowrap;vertical-align:middle;">
              <span style="color:${dotColor(d.statusType)};font-size:9px;margin-right:5px;vertical-align:middle;">&#9679;</span>${xe(d.statusText)}
            </td>
          </tr></table>
        </td>` : ''}
      </tr>
    </table>
  </td></tr>
</table>`;

      case 'hero': return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:40px ${P} 32px;">
    ${d.eyebrow ? `<p style="margin:0 0 12px;padding:0;font-size:11px;font-weight:700;color:${accent};letter-spacing:0.1em;text-transform:uppercase;font-family:${FONT};">${xe(d.eyebrow)}</p>` : ''}
    <h1 style="margin:0 0 14px;padding:0;color:${T1};font-size:36px;line-height:1.15;font-weight:700;letter-spacing:-0.02em;font-family:${FONT};">${xe(d.heading)}</h1>
    ${d.sub ? `<p style="margin:0;padding:0;color:${T2};font-size:16px;line-height:1.55;font-family:${FONT};">${xe(d.sub)}</p>` : ''}
  </td></tr>
</table>`;

      case 'body': return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:20px ${P};">
    ${(d.paragraphs || []).map(p => {
      const c  = p.style === 'lede' ? T1 : p.style === 'close' ? T3 : T2;
      const fw = p.style === 'lede' ? '500' : '400';
      const fs = p.style === 'lede' ? '16px' : p.style === 'close' ? '14px' : '15px';
      const ta = p.align === 'center' ? 'center' : 'left';
      return `<p style="margin:0 0 16px;padding:0;color:${c};font-size:${fs};font-weight:${fw};line-height:1.65;text-align:${ta};font-family:${FONT};">${xe(p.text)}</p>`;
    }).join('')}
  </td></tr>
</table>`;

      case 'simplelist': {
        const tag = d.listType === 'ordered' ? 'ol' : 'ul';
        const listStyle = d.listType === 'ordered' ? 'decimal' : 'disc';
        const items = (d.items || []).map(item =>
          `<li style="margin:0 0 8px;padding:0;color:${T2};font-size:15px;font-weight:400;line-height:1.65;font-family:${FONT};">${xe(item)}</li>`
        ).join('');
        return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:20px ${P};">
    <${tag} style="margin:0;padding:0 0 0 24px;list-style-type:${listStyle};">
      ${items}
    </${tag}>
  </td></tr>
</table>`;
      }

      case 'steps': return (d.items || []).map((s, i) => `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:${i === 0 ? '20' : '8'}px ${P} ${i === (d.items||[]).length - 1 ? '20' : '0'}px;">
    ${card(`
      <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px;">
        <tr>
          <td width="34" style="vertical-align:middle;padding-right:10px;">
            <table cellpadding="0" cellspacing="0" border="0"><tr><td width="26" height="26" align="center" bgcolor="${accent}" style="background:${accent};border-radius:50%;width:26px;height:26px;font-size:12px;font-weight:700;color:${contrast};font-family:${FONT};line-height:26px;text-align:center;">${xe(s.number)}</td></tr></table>
          </td>
          <td style="vertical-align:middle;font-size:11px;font-weight:600;color:${T3};letter-spacing:0.08em;text-transform:uppercase;font-family:${FONT};">${xe(s.label)}</td>
        </tr>
      </table>
      <h3 style="margin:0 0 8px;padding:0;color:${T1};font-size:16px;font-weight:500;letter-spacing:-0.01em;font-family:${FONT};">${xe(s.title)}</h3>
      <p style="margin:0 0 ${s.ctaText ? '16' : '0'}px;padding:0;color:${T2};font-size:14px;line-height:1.6;font-family:${FONT};">${xe(s.body)}</p>
      ${s.ctaText ? (s.ctaStyle === 'primary' ? vmlBtn(s.ctaUrl || '#', s.ctaText, accent, contrast) : ghostBtn(s.ctaUrl || '#', s.ctaText)) : ''}
    `)}
  </td></tr>
</table>`).join('');

      case 'ctablock': return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td align="center" style="padding:20px ${P};">
    ${d.style === 'ghost' ? ghostBtn(d.url || '#', d.text) : d.style === 'discord' ? discordBtn(d.url || '#', d.text) : d.style === 'g2' ? g2Btn(d.url || '#', d.text) : vmlBtn(d.url || '#', d.text, accent, contrast, 200)}
  </td></tr>
</table>`;

      case 'stats': return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:20px ${P};">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        ${(d.items || []).map((s, si) => `
        <td width="${Math.floor(100 / (d.items?.length || 1))}%" valign="top" style="${si > 0 ? 'padding-left:4px;' : ''}${si < (d.items?.length || 1) - 1 ? 'padding-right:4px;' : ''}">
          <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0"><tr><td bgcolor="${CARD}" style="background:${CARD};border:1px solid ${BORD};padding:16px;"><![endif]-->
          <!--[if !mso]><!-->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${CARD}" style="background:${CARD};border:1px solid ${BORD};border-radius:8px;">
            <tr><td style="padding:16px;text-align:center;">
          <!--<![endif]-->
              <p style="margin:0 0 4px;padding:0;font-size:10px;font-weight:600;color:${T3};letter-spacing:0.08em;text-transform:uppercase;font-family:${FONT};">${xe(s.label)}</p>
              <p style="margin:0;padding:0;font-size:28px;font-weight:700;color:${T1};letter-spacing:-0.02em;font-family:${FONT};">${xe(s.value)}</p>
              ${s.sub ? `<p style="margin:4px 0 0;padding:0;font-size:11px;color:${T3};font-family:${FONT};">${xe(s.sub)}</p>` : ''}
          <!--[if mso]></td></tr></table><![endif]-->
          <!--[if !mso]><!--></td></tr></table><!--<![endif]-->
        </td>`).join('')}
      </tr>
    </table>
  </td></tr>
</table>`;

      case 'alert': {
        const AC = {
          down: { bg: 'rgba(229,83,75,0.08)',   border: 'rgba(229,83,75,0.25)',   dot: '#E5534B', label: 'DOWN' },
          warn: { bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.25)',  dot: '#F59E0B', label: 'DEGRADED' },
          up:   { bg: 'rgba(62,184,122,0.08)',  border: 'rgba(62,184,122,0.25)',  dot: '#3EB87A', label: 'OPERATIONAL' },
          info: { bg: 'rgba(63,144,129,0.08)',  border: 'rgba(63,144,129,0.25)',  dot: '#3F9081', label: 'NOTICE' },
        };
        const c = AC[d.type] || AC.down;
        return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:20px ${P};">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${c.bg};border:1px solid ${c.border};border-left:3px solid ${c.dot};border-radius:8px;">
      <tr><td style="padding:16px 18px;">
        <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;">
          <tr>
            <td width="14" style="vertical-align:middle;padding-right:8px;"><div style="width:8px;height:8px;border-radius:50%;background:${c.dot};"></div></td>
            <td style="vertical-align:middle;font-size:10px;font-weight:700;color:${c.dot};letter-spacing:0.1em;text-transform:uppercase;font-family:${FONT};">${xe(c.label)}</td>
          </tr>
        </table>
        <h3 style="margin:0 0 6px;padding:0;color:${T1};font-size:16px;font-weight:700;font-family:${FONT};">${xe(d.title)}</h3>
        ${d.body ? `<p style="margin:0 0 10px;padding:0;color:${T2};font-size:14px;line-height:1.55;font-family:${FONT};">${xe(d.body)}</p>` : ''}
        ${d.ctaText ? `<a href="${xe(d.ctaUrl || '#')}" style="font-size:13px;color:${c.dot};font-weight:600;text-decoration:underline;font-family:${FONT};">${xe(d.ctaText)} &#8594;</a>` : ''}
      </td></tr>
    </table>
  </td></tr>
</table>`;
      }

      case 'checklist': return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:20px ${P};">
    ${card(`
      ${d.heading ? `<h3 style="margin:0 0 14px;padding:0;color:${T1};font-size:16px;font-weight:700;font-family:${FONT};">${xe(d.heading)}</h3>` : ''}
      ${(d.items || []).map(it => `
      <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px;width:100%;">
        <tr>
          <td width="26" style="vertical-align:top;padding-right:10px;padding-top:2px;">
            <table cellpadding="0" cellspacing="0" border="0"><tr><td width="18" height="18" align="center" bgcolor="${it.checked ? accent : MUTED}" style="background:${it.checked ? accent : MUTED};border:${it.checked ? 'none' : `1px solid ${BORD}`};border-radius:50%;font-size:10px;font-weight:700;color:${it.checked ? contrast : T3};font-family:${FONT};line-height:18px;text-align:center;width:18px;height:18px;">${it.checked ? '&#10003;' : ''}</td></tr></table>
          </td>
          <td style="vertical-align:top;font-size:14px;color:${it.checked ? T1 : T3};line-height:1.45;font-family:${FONT};${it.checked ? '' : 'text-decoration:line-through;'}">${xe(it.text)}</td>
        </tr>
      </table>`).join('')}
    `)}
  </td></tr>
</table>`;

      case 'todolist': {
        const its = d.items || [];
        const doneN = its.filter(it => it.done).length;
        const pct = its.length ? Math.round((doneN / its.length) * 100) : 0;
        const barFilled = Math.round(pct / 100 * 200);
        return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:20px ${P};">
    ${card(`
      ${d.heading ? `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:${d.showProgress ? '12px' : '14px'};"><tr><td style="font-size:16px;font-weight:700;color:${T1};font-family:${FONT};">${xe(d.heading)}</td>${d.showProgress ? `<td align="right" style="font-size:11px;font-weight:600;color:${T3};font-family:${FONT};">${doneN}/${its.length}</td>` : ''}</tr></table>` : ''}
      ${d.showProgress ? `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;"><tr><td width="${barFilled}" height="4" bgcolor="${accent}" style="background:${accent};border-radius:99px;height:4px;font-size:0;line-height:0;">&nbsp;</td><td height="4" bgcolor="${BORD}" style="background:${BORD};border-radius:99px;height:4px;font-size:0;line-height:0;">&nbsp;</td></tr></table>` : ''}
      ${its.map((it, idx) => `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="${idx < its.length - 1 ? `border-bottom:1px solid ${BORD};` : ''}">
        <tr>
          <td width="30" style="vertical-align:top;padding:10px 12px 10px 0;">
            <table cellpadding="0" cellspacing="0" border="0"><tr><td width="18" height="18" align="center" bgcolor="${it.done ? accent : CARD}" style="background:${it.done ? accent : CARD};border:${it.done ? 'none' : `1.5px solid ${BORD}`};border-radius:4px;font-size:11px;font-weight:700;color:${it.done ? (d.checkColor || '#000000') : CARD};font-family:${FONT};line-height:18px;text-align:center;width:18px;height:18px;">${it.done ? '&#10003;' : '&nbsp;'}</td></tr></table>
          </td>
          <td style="vertical-align:top;padding:10px 0;">
            <div style="font-size:14px;font-weight:500;color:${it.done ? T3 : T1};font-family:${FONT};line-height:1.4;${it.done ? 'text-decoration:line-through;' : ''}">${xe(it.text)}</div>
            ${it.note ? `<div style="font-size:12px;color:${T3};font-family:${FONT};line-height:1.4;margin-top:2px;">${xe(it.note)}</div>` : ''}
          </td>
        </tr>
      </table>`).join('')}
    `)}
  </td></tr>
</table>`;
      }

      case 'code': return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:20px ${P};">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0E0E14" style="background:#0E0E14;border:1px solid ${BORD};border-radius:8px;overflow:hidden;">
      <tr><td>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${MUTED}" style="background:${MUTED};border-bottom:1px solid ${BORD};">
          <tr>
            <td style="padding:7px 14px;font-size:11px;font-weight:600;color:${T3};letter-spacing:0.08em;text-transform:uppercase;font-family:${MONO};">${xe(d.label)}</td>
            <td style="padding:7px 14px;text-align:right;font-size:10px;color:${T3};letter-spacing:0.08em;text-transform:uppercase;font-family:${MONO};">${xe(d.language)}</td>
          </tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="padding:16px;font-size:12px;color:#A8C4D8;font-family:${MONO};line-height:1.65;">${xe(d.code).split('\n').map(line=>{const safe=line.replace(/^ +/,m=>'&nbsp;'.repeat(m.length));return `<span style="display:block;">${safe||'&#8203;'}</span>`;}).join('')}</td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>
</table>`;

      case 'image': return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:20px ${P};">
    ${d.link ? `<a href="${xe(d.link)}" style="display:block;text-decoration:none;">` : ''}
    ${d.src
      ? `<img src="${xe(d.src)}" alt="${xe(d.alt || '')}" width="536" style="display:block;width:100%;height:auto;max-width:536px;border-radius:8px;border:0;" />`
      : `<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${CARD}" style="background:${CARD};border:1px solid ${BORD};border-radius:8px;"><tr><td height="140" style="text-align:center;vertical-align:middle;font-size:11px;color:${T3};font-family:${MONO};letter-spacing:0.08em;text-transform:uppercase;">[ ${xe(d.alt || 'Image')} ]</td></tr></table>`
    }
    ${d.caption ? `<p style="margin:8px 0 0;padding:0;font-size:12px;color:${T3};text-align:center;font-family:${FONT};">${xe(d.caption)}</p>` : ''}
    ${d.link ? '</a>' : ''}
  </td></tr>
</table>`;

      case 'twocol': return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:20px ${P};">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        ${(d.cols || []).map((col, i) => {
          const cb = col.accent ? accent : BORD;
          return `<!--[if mso]><td width="262" valign="top" bgcolor="${CARD}" style="background:${CARD};border:1px solid ${cb};border-top:2px solid ${cb};padding:18px;${i === 0 ? 'padding-right:4px;' : 'padding-left:4px;'}"><![endif]-->
        <!--[if !mso]><!-->
        <td width="50%" valign="top" style="width:50%;padding:${i === 0 ? '0 4px 0 0' : '0 0 0 4px'};">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${CARD}" style="background:${CARD};border:1px solid ${cb};border-top:2px solid ${cb};border-radius:8px;">
            <tr><td style="padding:18px;">
        <!--<![endif]-->
              <p style="margin:0 0 2px;padding:0;font-size:10px;font-weight:600;color:${col.accent ? accent : T3};letter-spacing:0.08em;text-transform:uppercase;font-family:${FONT};">${xe(col.subhead)}</p>
              <h3 style="margin:0 0 10px;padding:0;color:${T1};font-size:18px;font-weight:700;font-family:${FONT};">${xe(col.heading)}</h3>
              <p style="margin:0 0 14px;padding:0;color:${T2};font-size:13px;line-height:1.55;font-family:${FONT};">${xe(col.body)}</p>
              ${col.ctaText ? `<a href="${xe(col.ctaUrl || '#')}" style="font-size:12px;font-weight:600;color:${col.accent ? accent : T2};text-decoration:none;border-bottom:1px solid ${col.accent ? accent : BORD};font-family:${FONT};">${xe(col.ctaText)} &#8594;</a>` : ''}
        <!--[if !mso]><!--></td></tr></table></td><!--<![endif]-->
        <!--[if mso]></td><![endif]-->`;
        }).join('')}
      </tr>
    </table>
  </td></tr>
</table>`;

      case 'feature': return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:20px ${P};">
    ${card(`
      ${d.imgUrl
        ? `<img src="${xe(d.imgUrl)}" alt="${xe(d.imgAlt || '')}" width="520" style="display:block;width:100%;height:auto;max-width:520px;border:0;margin-bottom:16px;border-radius:4px;" />`
        : `<p style="margin:0 0 16px;padding:48px 0;text-align:center;font-size:11px;color:${T3};font-family:${MONO};letter-spacing:0.08em;text-transform:uppercase;border-bottom:1px solid ${BORD};">${xe(d.mediaLabel)}</p>`
      }
      <h3 style="margin:0 0 8px;padding:0;color:${T1};font-size:16px;font-weight:500;letter-spacing:-0.01em;font-family:${FONT};">${xe(d.heading)}</h3>
      <p style="margin:0 0 ${d.ctaText ? '16' : '0'}px;padding:0;color:${T2};font-size:14px;line-height:1.6;font-family:${FONT};">${xe(d.body)}</p>
      ${d.ctaText ? (d.ctaStyle === 'primary' ? vmlBtn(d.ctaUrl || '#', d.ctaText, accent, contrast) : ghostBtn(d.ctaUrl || '#', d.ctaText)) : ''}
    `)}
  </td></tr>
</table>`;

      case 'quote': return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:20px ${P};">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${CARD}" style="background:${CARD};border:1px solid ${BORD};border-left:3px solid ${accent};border-radius:8px;">
      <tr><td style="padding:22px;">
        <p style="margin:0 0 14px;padding:0;color:${T1};font-size:17px;font-weight:500;line-height:1.5;font-family:${FONT};">&#8220;${xe(d.quote)}&#8221;</p>
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="40" style="vertical-align:middle;padding-right:10px;">
              <table cellpadding="0" cellspacing="0" border="0"><tr><td width="30" height="30" bgcolor="${MUTED}" style="background:${MUTED};border:1px solid ${BORD};border-radius:50%;width:30px;height:30px;">&nbsp;</td></tr></table>
            </td>
            <td style="vertical-align:middle;font-family:${FONT};">
              <b style="font-size:13px;color:${T1};font-weight:600;">${xe(d.author)}</b>
              <span style="font-size:13px;color:${T3};"> &middot; ${xe(d.role)}</span>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </td></tr>
</table>`;

      case 'plan': return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:20px ${P};">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${CARD}" style="background:${CARD};border:1px solid ${BORD};border-top:2px solid ${accent};border-radius:8px;">
      <tr><td style="padding:20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:14px;">
          <tr>
            <td style="font-size:11px;font-weight:600;color:${T3};letter-spacing:0.08em;text-transform:uppercase;font-family:${FONT};">${xe(d.label)}</td>
            <td style="text-align:right;"><span style="display:inline-block;background:${accent};color:${contrast};padding:3px 10px;border-radius:4px;font-size:10px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;font-family:${FONT};">${xe(d.tier)}</span></td>
          </tr>
        </table>
        ${(d.specs || []).map(s => `<p style="margin:0 0 7px;padding:0;font-size:13px;color:${T2};font-family:${FONT};"><span style="color:#3EB87A;font-weight:600;margin-right:8px;font-size:12px;">&#10003;</span>${xe(s)}</p>`).join('')}
        ${d.upsell ? `<p style="margin:12px 0 0;padding:0;color:${T3};font-size:13px;line-height:1.55;font-family:${FONT};">${xe(d.upsell).replace(/\*\*(.+?)\*\*/g, `<b style="color:${accent};font-weight:700;">$1</b>`)}</p>` : ''}
      </td></tr>
    </table>
  </td></tr>
</table>`;

      case 'divider': return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:4px ${P};">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td height="1" bgcolor="${BORD}" style="font-size:1px;line-height:1px;background:${BORD};">&nbsp;</td></tr>
    </table>
  </td></tr>
</table>`;

      case 'footer': return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:18px ${P} 24px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="font-size:12px;color:${T3};font-family:${FONT};">${xe(d.brand)} &middot; Uptime monitoring for teams that ship.${d.address ? `<br /><span style="font-size:10px;color:${T3};opacity:0.7;">${xe(d.address)}</span>` : ''}</td>
        <td style="text-align:right;white-space:nowrap;">
          ${(d.links || []).map(l => `<a href="${xe(l.url || '#')}" style="font-size:11px;color:${T3};text-decoration:underline;margin-left:16px;font-family:${FONT};">${xe(l.text)}</a>`).join('')}
        </td>
      </tr>
    </table>
  </td></tr>
</table>`;

      case 'announcement': return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td align="center" style="padding:40px ${P} 32px;">
    ${d.badge ? `<p style="margin:0 0 16px;"><span style="display:inline-block;padding:4px 12px;border-radius:4px;background:${accent};color:${contrast};font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;font-family:${FONT};">${xe(d.badge)}</span></p>` : ''}
    <h1 style="margin:0 0 14px;padding:0;color:${T1};font-size:32px;line-height:1.15;font-weight:700;letter-spacing:-0.025em;font-family:${FONT};">${xe(d.heading)}</h1>
    ${d.sub ? `<p style="margin:0 auto 20px;padding:0;max-width:460px;color:${T2};font-size:16px;line-height:1.55;font-family:${FONT};">${xe(d.sub)}</p>` : ''}
    ${d.ctaText ? vmlBtn(d.ctaUrl || '#', d.ctaText, accent, contrast, 200) : ''}
  </td></tr>
</table>`;

      case 'timeline': {
        const SC = { down: '#E5534B', warn: '#F59E0B', up: '#3EB87A', info: '#3F9081' };
        const evs = d.events || [];
        return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:20px ${P};">
    ${card(`
      ${d.heading ? `<h3 style="margin:0 0 16px;padding:0;color:${T1};font-size:16px;font-weight:700;font-family:${FONT};">${xe(d.heading)}</h3>` : ''}
      ${evs.map((ev, i) => `
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:${i < evs.length-1 ? '14' : '0'}px;padding-bottom:${i < evs.length-1 ? '14' : '0'}px;${i < evs.length-1 ? `border-bottom:1px solid ${BORD};` : ''}">
        <tr>
          <td width="20" valign="top" style="padding-right:12px;padding-top:3px;">
            <div style="width:10px;height:10px;border-radius:50%;background:${SC[ev.status] || SC.info};"></div>
          </td>
          <td valign="top">
            <p style="margin:0 0 3px;padding:0;font-size:11px;font-weight:600;color:${T3};letter-spacing:0.06em;font-family:${MONO};">${xe(ev.time)}</p>
            <p style="margin:0;padding:0;font-size:14px;color:${T2};line-height:1.5;font-family:${FONT};">${xe(ev.text)}</p>
          </td>
        </tr>
      </table>`).join('')}
    `)}
  </td></tr>
</table>`;
      }

      case 'bigmetric': return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td align="center" style="padding:40px ${P};">
    <p style="margin:0 0 8px;padding:0;font-size:64px;font-weight:700;color:${d.accent ? accent : T1};letter-spacing:-0.04em;line-height:1;font-family:${FONT};">${xe(d.value)}</p>
    <p style="margin:0 0 6px;padding:0;font-size:16px;font-weight:600;color:${T1};font-family:${FONT};">${xe(d.label)}</p>
    ${d.sub ? `<p style="margin:0 auto;padding:0;font-size:13px;color:${T3};max-width:360px;font-family:${FONT};">${xe(d.sub)}</p>` : ''}
  </td></tr>
</table>`;

      case 'linklist': return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:20px ${P};">
    ${card(`
      ${d.heading ? `<h3 style="margin:0 0 14px;padding:0;color:${T1};font-size:15px;font-weight:700;font-family:${FONT};">${xe(d.heading)}</h3>` : ''}
      ${(d.links || []).map((l, i) => `
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:${i === 0 ? '0' : '10px'} 0 10px;${i < d.links.length-1 ? `border-bottom:1px solid ${BORD};` : ''}">
        <tr>
          <td valign="middle">
            <a href="${xe(l.url || '#')}" style="font-size:14px;font-weight:600;color:${accent};text-decoration:none;font-family:${FONT};">${xe(l.text)}</a>
            ${l.desc ? `<span style="font-size:12px;color:${T3};margin-left:8px;font-family:${FONT};">${xe(l.desc)}</span>` : ''}
          </td>
          <td align="right" valign="middle" style="font-size:13px;color:${T3};">&#8594;</td>
        </tr>
      </table>`).join('')}
    `)}
  </td></tr>
</table>`;

      case 'signature': return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:28px ${P} 24px;">
    ${d.signoff ? `<p style="margin:0 0 20px;padding:0;color:${T2};font-size:15px;line-height:1.6;font-family:${FONT};">${xe(d.signoff)}</p>` : ''}
    <table cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td width="60" valign="middle" style="padding-right:14px;">
          ${d.avatarUrl
            ? `<img src="${xe(d.avatarUrl)}" alt="${xe(d.name || '')}" width="44" height="44" style="display:block;width:44px;height:44px;border-radius:50%;border:1px solid ${BORD};" />`
            : `<table cellpadding="0" cellspacing="0" border="0"><tr><td width="44" height="44" align="center" bgcolor="${CARD}" style="background:${CARD};border:1px solid ${BORD};border-radius:50%;font-size:18px;font-weight:700;color:${T3};font-family:${FONT};line-height:44px;text-align:center;width:44px;height:44px;">${xe((d.name || '?')[0])}</td></tr></table>`
          }
        </td>
        <td valign="middle">
          <p style="margin:0 0 2px;padding:0;color:${T1};font-size:15px;font-weight:700;font-family:${FONT};">${xe(d.name)}</p>
          <p style="margin:0;padding:0;color:${T3};font-size:13px;font-family:${FONT};">${xe(d.title)}</p>
        </td>
      </tr>
    </table>
    ${d.ps ? `<p style="margin:18px 0 0;padding:16px 0 0;color:${T3};font-size:13px;line-height:1.6;border-top:1px solid ${BORD};font-family:${FONT};">${xe('P.S. ' + d.ps)}</p>` : ''}
  </td></tr>
</table>`;

      case 'testimonial': {
        const stars = Math.min(5, d.stars || 0);
        return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:20px ${P};">
    ${card(`
      ${stars > 0 ? `<p style="margin:0 0 12px;padding:0;font-size:14px;letter-spacing:2px;color:${accent};font-family:${FONT};">${'&#9733;'.repeat(stars)}</p>` : ''}
      <p style="margin:0 0 16px;padding:0;color:${T1};font-size:15px;font-weight:500;line-height:1.5;font-family:${FONT};">"${xe(d.quote)}"</p>
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="46" valign="middle" style="padding-right:12px;">
            ${d.avatarUrl
              ? `<img src="${xe(d.avatarUrl)}" width="34" height="34" style="display:block;width:34px;height:34px;border-radius:50%;border:1px solid ${BORD};" />`
              : `<table cellpadding="0" cellspacing="0" border="0"><tr><td width="34" height="34" align="center" bgcolor="${MUTED}" style="background:${MUTED};border:1px solid ${BORD};border-radius:50%;font-size:14px;font-weight:700;color:${T3};font-family:${FONT};line-height:34px;text-align:center;width:34px;height:34px;">${xe((d.author || '?')[0])}</td></tr></table>`
            }
          </td>
          <td valign="middle">
            <p style="margin:0 0 1px;padding:0;font-size:13px;font-weight:600;color:${T1};font-family:${FONT};">${xe(d.author)}${d.company ? `<span style="color:${T3};font-weight:400;"> &middot; ${xe(d.company)}</span>` : ''}</p>
            ${d.role ? `<p style="margin:0;padding:0;font-size:12px;color:${T3};font-family:${FONT};">${xe(d.role)}</p>` : ''}
          </td>
        </tr>
      </table>
    `)}
  </td></tr>
</table>`;
      }

      case 'changelog': {
        const TC = { new: accent, improved: '#3EB87A', fixed: '#F59E0B', removed: '#E5534B' };
        const items = d.items || [];
        return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:20px ${P};">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${CARD}" style="background:${CARD};border:1px solid ${BORD};border-radius:8px;overflow:hidden;">
      <tr><td style="padding:12px 18px;border-bottom:1px solid ${BORD};">
        <span style="display:inline-block;padding:3px 9px;border-radius:4px;background:${accent};color:${contrast};font-size:11px;font-weight:700;letter-spacing:0.05em;font-family:${FONT};">${xe(d.version)}</span>
        ${d.date ? `<span style="font-size:12px;color:${T3};margin-left:10px;font-family:${MONO};">${xe(d.date)}</span>` : ''}
      </td></tr>
      <tr><td style="padding:14px 18px;">
        ${items.map((item, i) => `
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:${i < items.length-1 ? '10' : '0'}px;">
          <tr>
            <td width="76" valign="top" style="padding-right:8px;padding-top:1px;">
              <span style="display:inline-block;padding:2px 7px;border-radius:3px;background:${TC[item.type] || TC.new};color:#000;font-size:9px;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;font-family:${FONT};">${xe(item.type)}</span>
            </td>
            <td valign="top" style="font-size:13px;color:${T2};line-height:1.5;font-family:${FONT};">${xe(item.text)}</td>
          </tr>
        </table>`).join('')}
      </td></tr>
    </table>
  </td></tr>
</table>`;
      }

      case 'event': return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:32px ${P} 28px;">
    ${(d.tag || d.date || d.time) ? `
    <p style="margin:0 0 16px;padding:0;">
      ${d.tag ? `<span style="display:inline-block;padding:3px 10px;border-radius:4px;background:${accent};color:${contrast};font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;font-family:${FONT};">${xe(d.tag)}</span>` : ''}
      ${(d.date || d.time) ? `<span style="font-size:12px;color:${T3};margin-left:10px;font-family:${MONO};">${xe([d.date, d.time].filter(Boolean).join(' · '))}</span>` : ''}
    </p>` : ''}
    ${d.headline ? `<h2 style="margin:0 0 10px;padding:0;color:${T1};font-size:26px;font-weight:700;line-height:1.15;letter-spacing:-0.02em;font-family:${FONT};">${xe(d.headline)}</h2>` : ''}
    ${d.sub ? `<p style="margin:0 0 20px;padding:0;color:${T2};font-size:15px;line-height:1.6;font-family:${FONT};">${xe(d.sub)}</p>` : ''}
    ${d.ctaText ? vmlBtn(d.ctaUrl || '#', d.ctaText, accent, contrast, 220) : ''}
  </td></tr>
</table>`;

      case 'sociallinks': {
        const links = d.links || [];
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
        return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr><td style="padding:18px ${P} 22px;">
    ${links.map(l => `<a href="${xe(l.url || '#')}" style="display:inline-block;margin:0 8px 8px 0;text-decoration:none;background:#ffffff;border-radius:50%;width:36px;height:36px;line-height:36px;text-align:center;"><img src="${xe(resolveIcon(l))}" alt="${xe(l.platform || '')}" width="20" height="20" style="display:inline-block;vertical-align:middle;border:0;margin:8px;" /></a>`).join('\n    ')}
  </td></tr>
</table>`;
      }

      default: return '';
    }
  };

  const body = draft.blocks.map(blockHtml).join('\n');

  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="color-scheme" content="dark" />
  <meta name="format-detection" content="telephone=no,date=no,address=no,email=no,url=no" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${xe(draft.meta.subject)}</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
    table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;}
    img{-ms-interpolation-mode:bicubic;border:0;outline:none;text-decoration:none;}
    body{margin:0;padding:0;background:${BG};width:100%!important;min-width:100%;}
    a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important;}
    u+#body a{color:inherit;text-decoration:none;font-size:inherit;font-family:inherit;font-weight:inherit;line-height:inherit;}
    #MessageViewBody a{color:inherit;text-decoration:none;}
  </style>
</head>
<body id="body" style="margin:0;padding:0;background:${BG};width:100%!important;">

<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;visibility:hidden;opacity:0;color:transparent;font-size:1px;line-height:1px;">${xe(draft.meta.preview)}&nbsp;&zwnj;&hairsp;&zwnj;&hairsp;&zwnj;&hairsp;&zwnj;&hairsp;&zwnj;&hairsp;&zwnj;&hairsp;&zwnj;&hairsp;&zwnj;&hairsp;&zwnj;&hairsp;&zwnj;&hairsp;&zwnj;&hairsp;&zwnj;&hairsp;&zwnj;&hairsp;</div>

<!--[if mso | IE]><table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}"><tr><td align="center" bgcolor="${BG}"><![endif]-->
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG};">
  <tr>
    <td align="center" bgcolor="${BG}" style="background:${BG};padding:40px 16px;">
      <!--[if mso | IE]><table width="600" cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="${BG}"><tr><td bgcolor="${BG}"><![endif]-->
      <table width="600" cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="${BG}"
        style="max-width:600px;width:100%;background:${BG};border:1px solid ${BORD};border-radius:8px;overflow:hidden;">
        <tr><td bgcolor="${BG}" style="background:${BG};">

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

/* ═══════════════════════════════════════════
   CANVAS
   ═══════════════════════════════════════════ */
const Canvas = ({ draft, selectedId, onSelect, onReorder, onDelete, onDuplicate }) => {
  const [dragId,  setDragId]  = useState(null);
  const [dropIdx, setDropIdx] = useState(null);
  const accent = getAccent(draft.meta);

  const onDragStart = (e, id) => { setDragId(id); e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', id); } catch {} };
  const onDragOver  = (e, idx) => { e.preventDefault(); const r = e.currentTarget.getBoundingClientRect(); setDropIdx((e.clientY - r.top) > r.height / 2 ? idx + 1 : idx); };
  const onDrop      = e => {
    e.preventDefault();
    const nt = e.dataTransfer.getData('application/x-new-block');
    if (nt && BLOCKS[nt]) { window.__insertBlock?.(nt, dropIdx ?? draft.blocks.length); }
    else if (dragId != null && dropIdx != null) { onReorder(dragId, dropIdx); }
    setDragId(null); setDropIdx(null);
  };

  const surfaceBg = draft.meta.emailBg || (EMAIL_SURFACES.find(s => s.id === (draft.meta.emailSurface || 'app'))?.bg) || '#15151B';

  return (
    <div className="eb-canvas" onDragOver={e => e.preventDefault()} onDrop={onDrop} onClick={() => onSelect(null)}>
      {/* Canvas label strip */}
      <div style={{ width: '100%', maxWidth: 600, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, padding: '0 4px' }}>
        <span style={{ fontSize: 'var(--e1-fs-xs)', color: 'var(--e1-text-3)', fontWeight: 500 }}>{draft.meta.name || 'Untitled'}</span>
        <span style={{ fontSize: 'var(--e1-fs-xs)', color: 'var(--e1-text-3)' }}>
          {draft.blocks.length} block{draft.blocks.length !== 1 ? 's' : ''} · 600px
        </span>
      </div>

      {/* Email shell */}
      <div
        className="e1-shell"
        style={{ '--e1-email-bg': surfaceBg, '--e1-accent': accent, '--e1-accent-fg': getContrast(draft.meta) }}
      >
        {draft.blocks.length === 0 && (
          <div className="eb-canvas-empty" style={{ padding: '60px 40px', textAlign: 'center' }}>
            <div className="eb-canvas-empty-icon">✉</div>
            <p>Drag a block from the left to start.<br />Draft saves automatically.</p>
          </div>
        )}

        {draft.blocks.map((b, idx) => (
          <React.Fragment key={b.id}>
            {dropIdx === idx && <div style={{ height: 3, background: 'var(--e1-primary)', borderRadius: 2, margin: '2px 0' }} />}
            <div
              className={`eb-block-wrap${selectedId === b.id ? ' eb-block-selected' : ''}`}
              onClick={e => { e.stopPropagation(); onSelect(b.id); }}
              draggable
              onDragStart={e => onDragStart(e, b.id)}
              onDragOver={e => onDragOver(e, idx)}
              onDragEnd={() => { setDragId(null); setDropIdx(null); }}
            >
              {/* Block action bar */}
              <div className="eb-block-actions" onClick={e => e.stopPropagation()}>
                <button className="eb-btn eb-btn-icon" draggable onDragStart={e => onDragStart(e, b.id)} title="Drag to reorder" style={{ cursor: 'grab' }}>≡</button>
                <button className="eb-btn eb-btn-icon" onClick={() => onDuplicate(b.id)} title="Duplicate">⧉</button>
                <button className="eb-btn eb-btn-icon eb-btn-danger" onClick={() => onDelete(b.id)} title="Delete">×</button>
              </div>
              {BLOCKS[b.type]?.render(b.data)}
            </div>
          </React.Fragment>
        ))}
        {dropIdx === draft.blocks.length && <div style={{ height: 3, background: 'var(--e1-primary)', borderRadius: 2, margin: '2px 0' }} />}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   SETTINGS PANEL (no block selected)
   ═══════════════════════════════════════════ */
const SettingsPanel = ({ draft, updateMeta, updateBlock }) => {
  const meta = draft.meta;
  const planColors = meta.planColors || {};

  const setPlanColor = (plan, hex) => updateMeta({ planColors: { ...planColors, [plan]: hex } });
  const resetPlanColor = plan => { const next = { ...planColors }; delete next[plan]; updateMeta({ planColors: next }); };

  const headerBlock = draft.blocks.find(b => b.type === 'header');
  const updateHeader = patch => { if (headerBlock) updateBlock(headerBlock.id, { ...headerBlock.data, ...patch }); };

  return (
    <div className="eb-inspector">
      <div className="eb-inspector-header">
        <span className="eb-inspector-title">Email Settings</span>
      </div>
      <div className="eb-inspector-body">

        {/* ── Email metadata ── */}
        <div className="eb-meta-section">
          <div className="eb-meta-section-label">Metadata</div>
          <div className="eb-field">
            <label className="eb-label">Internal name</label>
            <input className="eb-input" type="text" value={meta.name || ''} onChange={e => updateMeta({ name: e.target.value })} placeholder="Email name" />
          </div>
          <div className="eb-field">
            <label className="eb-label">Subject line</label>
            <input className="eb-input" type="text" value={meta.subject || ''} onChange={e => updateMeta({ subject: e.target.value })} placeholder="Under 50 characters" />
            <span className="eb-help" style={{ textAlign: 'right' }}>{(meta.subject || '').length}/50</span>
          </div>
          <div className="eb-field">
            <label className="eb-label">Preview text</label>
            <textarea className="eb-textarea" rows={2} value={meta.preview || ''} onChange={e => updateMeta({ preview: e.target.value })} placeholder="Inbox snippet — under 90 chars" />
          </div>
        </div>

        <hr className="eb-divider" />

        {/* ── Plan selector ── */}
        <div className="eb-meta-section">
          <div className="eb-meta-section-label">Plan</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {Object.entries(PLANS).map(([key, p]) => {
              const planAcc = getPlanAccent(meta, key);
              const isActive = meta.plan === key;
              return (
                <div key={key}
                  onClick={() => updateMeta({ plan: key, accentOverride: '' })}
                  style={{
                    padding: '10px 12px', borderRadius: 'var(--e1-radius-md)', cursor: 'pointer',
                    background: isActive ? 'var(--e1-hover)' : 'var(--e1-muted)',
                    border: isActive ? `1px solid ${planAcc}` : '1px solid var(--e1-border)',
                    transition: 'all var(--e1-transition)',
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: planAcc, flexShrink: 0 }}></div>
                    <span style={{ fontSize: 'var(--e1-fs-sm)', fontWeight: 600, color: 'var(--e1-text-1)' }}>{p.label}</span>
                  </div>
                  <div style={{ fontSize: 'var(--e1-fs-xs)', color: 'var(--e1-text-3)' }}>{p.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        <hr className="eb-divider" />

        {/* ── Plan colours ── */}
        <div className="eb-meta-section">
          <div className="eb-meta-section-label">Plan accent colours</div>
          {Object.entries(PLANS).map(([key, p]) => {
            const cur = getPlanAccent(meta, key);
            const isOverridden = !!planColors[key] && planColors[key] !== PLANS[key].accent;
            return (
              <div key={key} className="eb-field" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label className="eb-label" style={{ width: 52, margin: 0, flexShrink: 0 }}>{p.label}</label>
                <div className="eb-color-row" style={{ flex: 1 }}>
                  <div className="eb-color-swatch">
                    <input type="color" value={cur} onChange={e => setPlanColor(key, e.target.value)} />
                  </div>
                  <input className="eb-input" type="text" value={cur}
                    onChange={e => { if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) setPlanColor(key, e.target.value); }}
                    style={{ fontFamily: 'var(--e1-mono)', fontSize: 'var(--e1-fs-xs)' }}
                  />
                  {isOverridden && (
                    <button className="eb-btn eb-btn-ghost eb-btn-sm" onClick={() => resetPlanColor(key)} title="Reset to default" style={{ padding: '4px 7px' }}>↺</button>
                  )}
                </div>
              </div>
            );
          })}
          <div className="eb-field">
            <label className="eb-label">One-off accent override</label>
            <div className="eb-color-row">
              <div className="eb-color-swatch">
                <input type="color" value={getAccent(meta)} onChange={e => updateMeta({ accentOverride: e.target.value })} />
              </div>
              <input className="eb-input" type="text" value={meta.accentOverride || ''} placeholder="Leave blank to use plan colour"
                onChange={e => updateMeta({ accentOverride: e.target.value })} />
              {meta.accentOverride && (
                <button className="eb-btn eb-btn-ghost eb-btn-sm" onClick={() => updateMeta({ accentOverride: '' })}>↺</button>
              )}
            </div>
            <span className="eb-help">Overrides active plan colour for this email only.</span>
          </div>
        </div>

        <hr className="eb-divider" />

        {/* ── Email canvas background ── */}
        <div className="eb-meta-section">
          <div className="eb-meta-section-label">Email background</div>
          <div className="eb-field">
            <label className="eb-label">Surface</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
              {EMAIL_SURFACES.map(s => (
                <div key={s.id}
                  onClick={() => updateMeta({ emailSurface: s.id, emailBg: '' })}
                  title={s.desc}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    padding: '8px 4px', borderRadius: 'var(--e1-radius)', cursor: 'pointer',
                    background: (meta.emailSurface || 'app') === s.id ? 'var(--e1-hover)' : 'transparent',
                    border: (meta.emailSurface || 'app') === s.id ? '1px solid var(--e1-primary)' : '1px solid transparent',
                  }}>
                  <div style={{ width: 20, height: 20, borderRadius: 4, background: s.bg, border: '1px solid var(--e1-border)' }}></div>
                  <span style={{ fontSize: 10, color: 'var(--e1-text-3)' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="eb-field">
            <label className="eb-label">Custom colour</label>
            <div className="eb-color-row">
              <div className="eb-color-swatch">
                <input type="color" value={meta.emailBg || '#15151B'} onChange={e => updateMeta({ emailBg: e.target.value })} />
              </div>
              <input className="eb-input" type="text" value={meta.emailBg || ''} placeholder="Leave blank to use surface"
                onChange={e => { const v = e.target.value; if (!v || /^#[0-9a-fA-F]{0,6}$/.test(v)) updateMeta({ emailBg: v }); }}
              />
              {meta.emailBg && <button className="eb-btn eb-btn-ghost eb-btn-sm" onClick={() => updateMeta({ emailBg: '' })}>↺</button>}
            </div>
          </div>
        </div>

        <hr className="eb-divider" />

        {/* ── Logo ── */}
        <div className="eb-meta-section">
          <div className="eb-meta-section-label">Logo</div>
          <div className="eb-field">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'var(--e1-muted)', borderRadius: 'var(--e1-radius)', border: '1px solid var(--e1-border)', marginBottom: 8 }}>
              <img src="assets/exit1-logo.png" alt="exit1.dev" style={{ height: 18, width: 'auto', opacity: 0.8 }} />
              <span style={{ fontSize: 'var(--e1-fs-xs)', color: 'var(--e1-text-3)' }}>exit1-logo.png (default)</span>
            </div>
            <input className="eb-input" type="url" value={meta.logoUrl || ''} onChange={e => updateMeta({ logoUrl: e.target.value })} placeholder="https://your-cdn.com/logo.png" />
            <span className="eb-help">Override for exported HTML. Leave blank to use default.</span>
          </div>
          <div className="eb-field">
            <label className="eb-label">Brand name (alt text)</label>
            <input className="eb-input" type="text" value={headerBlock?.data.brandName || 'exit1.dev'} onChange={e => updateHeader({ brandName: e.target.value })} />
          </div>
        </div>

        <span className="eb-help" style={{ display: 'block', marginTop: 12, lineHeight: 1.6 }}>
          All settings auto-save. Click any block on the canvas to edit its content.
        </span>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   BLOCK INSPECTOR
   ═══════════════════════════════════════════ */
const Inspector = ({ draft, selectedId, updateBlock, updateMeta }) => {
  if (!selectedId) return <SettingsPanel draft={draft} updateMeta={updateMeta} updateBlock={updateBlock} />;
  const block = draft.blocks.find(b => b.id === selectedId);
  if (!block) return <SettingsPanel draft={draft} updateMeta={updateMeta} updateBlock={updateBlock} />;
  const def = BLOCKS[block.type];
  if (!def) return null;

  return (
    <div className="eb-inspector">
      <div className="eb-inspector-header">
        <span className="eb-inspector-title">{def.label}</span>
        <span style={{ fontSize: 'var(--e1-fs-xs)', color: 'var(--e1-text-3)' }}>Block editor</span>
      </div>
      <div className="eb-inspector-body">
        {GLOBAL_BLOCK_TYPES.has(block.type) && (
          <div className="eb-global-badge">⟳ Saved globally — persists across emails</div>
        )}
        {def.inspector(block.data, patch => updateBlock(block.id, { ...block.data, ...patch }))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   PALETTE
   ═══════════════════════════════════════════ */
const Palette = ({ onAdd }) => (
  <div className="eb-palette">
    <div className="eb-palette-header">
      <span className="eb-palette-label">Blocks</span>
    </div>
    <div className="eb-palette-list">
      {BLOCK_ORDER.map(t => {
        const b = BLOCKS[t];
        return (
          <button key={t} className="eb-block-btn"
            draggable
            onDragStart={e => { e.dataTransfer.effectAllowed = 'copy'; try { e.dataTransfer.setData('application/x-new-block', t); e.dataTransfer.setData('text/plain', t); } catch {} }}
            onClick={() => onAdd(t, null)}>
            <span className="eb-block-icon">{b.icon}</span>
            <span>{b.label}</span>
          </button>
        );
      })}

      <div style={{ height: 1, background: 'var(--e1-border)', margin: '12px 0' }}></div>
      <div className="eb-palette-label" style={{ padding: '0 8px 6px' }}>Merge tags</div>
      <div style={{ padding: '0 8px', lineHeight: 2, fontFamily: 'var(--e1-mono)', fontSize: 'var(--e1-fs-xs)', color: 'var(--e1-text-3)' }}>
        {['first_name', 'dashboard_url', 'alerts_url', 'preferences_url', 'unsubscribe_url'].map(v => (
          <div key={v}>{`{{${v}}}`}</div>
        ))}
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   EXPORT MODAL
   ═══════════════════════════════════════════ */
const ExportModal = ({ draft, onClose }) => {
  const [copied, setCopied] = useState(false);
  const content = generateInlineHtml(draft);
  const name = (draft.meta.name || 'email').replace(/[^\w]+/g, '-').toLowerCase();

  const copy = () => {
    navigator.clipboard?.writeText(content).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600); });
  };
  const download = () => {
    const blob = new Blob([content], { type: 'text/html' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `${name}.html`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 600);
  };

  return (
    <div className="eb-modal-backdrop" onClick={onClose}>
      <div className="eb-modal" onClick={e => e.stopPropagation()}>
        <div className="eb-modal-header">
          <span className="eb-modal-title">Export HTML</span>
          <button className="eb-btn eb-btn-ghost eb-btn-sm" onClick={onClose}>Close</button>
        </div>
        <div style={{ padding: '10px 20px', borderBottom: '1px solid var(--e1-border)' }}>
          <span style={{ fontSize: 'var(--e1-fs-xs)', color: 'var(--e1-text-3)' }}>
            Fully inline-styled · paste directly into Resend, SendGrid, or any ESP
          </span>
        </div>
        <div className="eb-modal-body">
          <pre className="eb-code-block">{content}</pre>
        </div>
        <div className="eb-modal-footer">
          <button className="eb-btn eb-btn-ghost" onClick={download}>Download .html</button>
          <button className="eb-btn eb-btn-primary" onClick={copy}>
            {copied ? 'Copied ✓' : 'Copy HTML'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   APP ROOT
   ═══════════════════════════════════════════ */
const EmailApp = () => {
  const [draft,      setDraft]      = useState(loadDraft);
  const [selectedId, setSelectedId] = useState(null);
  const [showExport, setShowExport] = useState(false);
  const [toast,      setToast]      = useState(null);

  useEffect(() => { saveDraft(draft); }, [draft]);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 2000); };

  const updateMeta  = patch => setDraft(d => ({ ...d, meta: { ...d.meta, ...patch } }));
  const updateBlock = (id, newData) => setDraft(d => {
    const block = d.blocks.find(b => b.id === id);
    if (block && GLOBAL_BLOCK_TYPES.has(block.type)) saveGlobal(block.type, newData);
    return { ...d, blocks: d.blocks.map(b => b.id === id ? { ...b, data: newData } : b) };
  });

  const addBlock = (type, atIdx) => {
    if (!BLOCKS[type]) return;
    const globalData = GLOBAL_BLOCK_TYPES.has(type) ? loadGlobal()[type] : null;
    const nb = { id: uid(), type, data: globalData ?? BLOCKS[type].defaults() };
    setDraft(d => {
      const idx = typeof atIdx === 'number' ? atIdx : d.blocks.length;
      return { ...d, blocks: [...d.blocks.slice(0, idx), nb, ...d.blocks.slice(idx)] };
    });
    setSelectedId(nb.id);
  };
  window.__insertBlock = addBlock;

  const deleteBlock    = id => { setDraft(d => ({ ...d, blocks: d.blocks.filter(b => b.id !== id) })); if (selectedId === id) setSelectedId(null); };
  const duplicateBlock = id => {
    setDraft(d => {
      const i = d.blocks.findIndex(b => b.id === id); if (i < 0) return d;
      const copy = { ...d.blocks[i], id: uid(), data: JSON.parse(JSON.stringify(d.blocks[i].data)) };
      return { ...d, blocks: [...d.blocks.slice(0, i + 1), copy, ...d.blocks.slice(i + 1)] };
    });
  };
  const reorder = (dragId, targetIdx) => {
    setDraft(d => {
      const from = d.blocks.findIndex(b => b.id === dragId); if (from < 0) return d;
      const arr = [...d.blocks]; const [item] = arr.splice(from, 1);
      arr.splice(from < targetIdx ? targetIdx - 1 : targetIdx, 0, item);
      return { ...d, blocks: arr };
    });
  };

  const importJson = () => {
    const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.json,application/json';
    inp.onchange = () => {
      const f = inp.files?.[0]; if (!f) return;
      const r = new FileReader();
      r.onload = () => { try { const d = JSON.parse(r.result); if (d.blocks && d.meta) { setDraft(d); setSelectedId(null); showToast('Draft imported'); } } catch { alert('Invalid JSON'); } };
      r.readAsText(f);
    };
    inp.click();
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `${(draft.meta.name || 'email').replace(/[^\w]+/g, '-').toLowerCase()}.json`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 600);
  };

  const copyHtml = () => {
    navigator.clipboard?.writeText(generateInlineHtml(draft)).then(() => showToast('HTML copied'));
  };

  return (
    <div className="eb-app">
      {/* Topbar */}
      <div className="eb-topbar">
        <div className="eb-logo">
          <div className="eb-logo-mark">
            <img src="assets/exit1-logo.png" alt="exit1.dev" />
          </div>
          <span className="eb-logo-text">exit1.dev</span>
        </div>
        <div className="eb-topbar-sep"></div>
        <span className="eb-topbar-title">Email Builder</span>

        <div className="eb-topbar-actions">
          <button className="eb-btn eb-btn-ghost eb-btn-sm" onClick={() => { if (confirm('Start blank?')) { setDraft({ meta: { name: 'Untitled', subject: '', preview: '', showGrid: false, plan: 'agency', accentOverride: '', planColors: {}, emailSurface: 'app', emailBg: '', logoUrl: '' }, blocks: [] }); setSelectedId(null); } }}>New</button>
          <button className="eb-btn eb-btn-ghost eb-btn-sm" onClick={importJson}>Import</button>
          <button className="eb-btn eb-btn-ghost eb-btn-sm" onClick={exportJson}>Save JSON</button>
          <button className="eb-btn eb-btn-ghost eb-btn-sm" onClick={() => { if (confirm('Reset to welcome email?')) { setDraft(SEED); setSelectedId(null); } }}>Reset</button>
          <button className="eb-btn eb-btn-ghost eb-btn-sm" onClick={copyHtml}>Copy HTML</button>
          <button className="eb-btn eb-btn-primary" onClick={() => setShowExport(true)}>Export HTML</button>
        </div>
      </div>

      {/* Workspace */}
      <div className="eb-workspace" onClick={() => setSelectedId(null)}>
        <Palette onAdd={addBlock} />
        <Canvas
          draft={draft}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onReorder={reorder}
          onDelete={deleteBlock}
          onDuplicate={duplicateBlock}
        />
        <div onClick={e => e.stopPropagation()} style={{ minHeight: 0, height: '100%', overflow: 'hidden' }}>
          <Inspector
            draft={draft}
            selectedId={selectedId}
            updateBlock={updateBlock}
            updateMeta={updateMeta}
          />
        </div>
      </div>

      {/* Export modal */}
      {showExport && <ExportModal draft={draft} onClose={() => setShowExport(false)} />}

      {/* Toast */}
      {toast && <div className="eb-toast">{toast}</div>}
    </div>
  );
};
