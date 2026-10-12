'use client';
import { useState } from 'react';
import { estimate } from '@/lib/estimate';
const TYPES = { portal: 'Membership or business portal', app: 'Custom business platform', site: 'Website with automation' };
const ORG = ['Professional association', 'Church or faith group', 'NGO', 'School or institution', 'Trade body', 'Company or SME', 'Other'];
const TIME = ['Under 2 months', '2 to 4 months', '4 to 8 months', 'Flexible'];
const BUD = ['Under ₦5M', '₦5M to ₦10M', '₦10M to ₦25M', 'Over ₦25M', 'Not sure yet'];
const REQ = [['name', 'org', 'email', 'orgType'], ['type'], ['size'], ['time', 'budget']];
const fmt = n => '₦' + (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
function F({ k, l, t, S, set }) {
  const v = S[k] || '', on = e => set(k, e.target.value);
  return (<><label className="f" htmlFor={k}>{l}</label>
    {Array.isArray(t) ? <select id={k} value={v} onChange={on}><option value="">Select</option>{t.map(o => <option key={o}>{o}</option>)}</select>
      : t === 'area' ? <textarea id={k} value={v} onChange={on} />
      : <input id={k} type={t || 'text'} value={v} onChange={on} />}</>);
}
function Checks({ g, opts, S, set }) {
  const a = S[g];
  return <div className="opts">{opts.map(o => <label className="opt" key={o}><input type="checkbox" checked={a.includes(o)} onChange={e => set(g, e.target.checked ? [...a, o] : a.filter(x => x !== o))} /><span>{o}</span></label>)}</div>;
}
export default function Wizard({ cfg, email }) {
  const [S, setS] = useState({ feat: [], integ: [] });
  const [st, setSt] = useState(0), [err, setErr] = useState(''), [res, setRes] = useState(null), [busy, setBusy] = useState(false), [fail, setFail] = useState(false);
  const set = (k, v) => setS(p => ({ ...p, [k]: v, ...(k === 'type' && v !== p.type ? { feat: [] } : {}) }));
  const next = () => {
    if (REQ[st].some(k => !S[k])) return setErr('Please complete the required fields.');
    if (st === 0 && !/^\S+@\S+\.\S+$/.test(S.email)) return setErr('Enter a valid email address.');
    setErr(''); setSt(st + 1); window.scrollTo({ top: 0 });
  };
  const send = async () => {
    setBusy(true); setErr(''); setFail(false);
    try {
      const r = await fetch('/api/inquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(S) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || 'Request failed');
      setRes(j.range);
    } catch (e) { setErr(`${e.message}. Please try again.`); setFail(true); }
    setBusy(false);
  };
  const p = { S, set };
  if (res) return (<div className="wiz"><h3>Thank you, {S.name.split(' ')[0]}</h3><p className="sub">We received your enquiry and will contact you at {S.email} to arrange a discovery call.</p><p className="meta">Your indicative range</p><div className="est">{fmt(res[0])} – {fmt(res[1])}</div><p className="sub">This is an estimate from your answers. Your formal quote follows the discovery call.</p></div>);
  const [a, b] = st === 4 ? estimate(cfg, S) : [0, 0];
  const rows = [['Organisation', `${S.org} (${S.orgType})`], ['Project', TYPES[S.type]], ['Users', S.size], ['Features', S.feat.join(', ') || '-'], ['Integrations', S.integ.join(', ') || '-'], ['Timeline', S.time], ['Budget', S.budget]];
  return (
    <div className="wiz">
      <div className="prog">{[0, 1, 2, 3, 4].map(i => <i key={i} className={i <= st ? 'on' : ''} />)}</div>
      {st === 0 && <><h3>About you</h3><p className="sub">So we know who we are talking to.</p><F k="name" l="Your name" {...p} /><F k="org" l="Organisation" {...p} /><F k="email" l="Email" t="email" {...p} /><F k="phone" l="Phone or WhatsApp" t="tel" {...p} /><F k="orgType" l="Type of organisation" t={ORG} {...p} /></>}
      {st === 1 && <><h3>What do you need?</h3><p className="sub">Choose the closest fit. We refine it together later.</p><div className="opts" style={{ gridTemplateColumns: '1fr' }}>{Object.entries(TYPES).map(([k, v]) => <label className="opt" key={k}><input type="radio" name="type" checked={S.type === k} onChange={() => set('type', k)} /><span>{v}</span></label>)}</div></>}
      {st === 2 && <><h3>Define the scope</h3><p className="sub">Tick everything you expect the platform to do.</p><F k="size" l="How many people will use it?" t={Object.keys(cfg.size)} {...p} /><label className="f">Features</label><Checks g="feat" opts={Object.keys(cfg.feat[S.type] || {})} {...p} /><label className="f">Needs to connect with</label><Checks g="integ" opts={Object.keys(cfg.integ)} {...p} /><F k="current" l="How do you handle this today?" t="area" {...p} /></>}
      {st === 3 && <><h3>Timing and budget</h3><p className="sub">This helps us propose the right phasing.</p><F k="time" l="When do you need it live?" t={TIME} {...p} /><F k="budget" l="Budget you have in mind" t={BUD} {...p} /><F k="goals" l="What should this project achieve for you?" t="area" {...p} /></>}
      {st === 4 && <><h3>Your indicative estimate</h3><div className="est">{fmt(a)} – {fmt(b)}</div><p className="sub">An estimate from your answers, not a formal quote. We confirm scope and price after a discovery call.</p><div className="sum">{rows.map(r => <div key={r[0]}><span>{r[0]}</span><span>{r[1]}</span></div>)}</div></>}
      <div className="err" role="alert">{err}</div>
      {fail && email && <p className="meta">Still not working? <a href={`mailto:${email}?subject=Project%20enquiry&body=${encodeURIComponent(Object.entries(S).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('\n'))}`}>Email your answers to {email}</a>.</p>}
      <div className="nav2">{st ? <button className="ghost" onClick={() => setSt(st - 1)}>Back</button> : <span />}
        {st < 4 ? <button className="btn" onClick={next}>{st === 3 ? 'See my estimate' : 'Continue'}</button> : <button className="btn" disabled={busy} onClick={send}>{busy ? 'Sending…' : 'Send enquiry'}</button>}</div>
    </div>
  );
}
