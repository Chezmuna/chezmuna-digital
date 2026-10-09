import { isAdmin } from '@/lib/auth';
import { list, getConfig } from '@/lib/db';
import { KINDS, GROUPS, getPath, toLines } from '@/lib/kinds';
import { loginAction, logoutAction, saveItem, deleteItem, savePricing } from './actions';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin', robots: { index: false } };
const TABS = [['project', 'Portfolio'], ['post', 'Blog'], ['inquiry', 'Enquiries'], ['pricing', 'Pricing']];
const fmt = n => '₦' + (n / 1e6).toFixed(1) + 'M';
function Field({ f: [k, l, t], d }) {
  if (t === 'check') return <label className="opt" style={{ marginTop: 14 }}><input type="checkbox" name={k} defaultChecked={d[k]} /><span>{l}</span></label>;
  return <div><label className="f" htmlFor={k}>{l}</label>{t === 'area' ? <textarea id={k} name={k} defaultValue={d[k] || ''} rows={t === 'area' && k === 'body' ? 12 : 4} /> : <input id={k} name={k} defaultValue={d[k] || ''} />}</div>;
}
export default async function Admin({ searchParams }) {
  const q = await searchParams;
  if (!(await isAdmin())) return (
    <main className="wrap adm"><h2>Admin sign in</h2>
      <form action={loginAction} className="card" style={{ marginTop: 20 }}><label className="f" htmlFor="pw">Password</label><input id="pw" name="pw" type="password" required autoFocus />
        <div className="err">{q.e && 'Wrong password.'}</div><button className="btn">Sign in</button></form></main>);
  const tab = TABS.some(t => t[0] === q.tab) ? q.tab : 'project';
  const K = KINDS[tab];
  const items = tab !== 'pricing' ? await list(tab) : [];
  const edit = K && items.find(i => String(i.id) === q.edit);
  return (
    <main className="wrap adm">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h2>Admin</h2><form action={logoutAction}><button className="ghost small">Sign out</button></form></div>
      <div className="tabs">{TABS.map(([k, l]) => <a key={k} href={`/admin?tab=${k}`} className={k === tab ? 'on' : ''}>{l}</a>)}</div>
      {K && <>
        <form action={saveItem} className="card"><h3 style={{ marginBottom: 6 }}>{edit ? 'Edit' : 'Add'} {K.label.toLowerCase()} item</h3>
          <input type="hidden" name="kind" value={tab} /><input type="hidden" name="id" value={edit?.id || ''} />
          {K.fields.map(f => <Field key={f[0]} f={f} d={edit || {}} />)}
          <div className="nav2"><button className="btn">Save</button>{edit && <a className="ghost" href={`/admin?tab=${tab}`}>Cancel</a>}</div></form>
        <div style={{ maxWidth: 760, margin: '28px auto 0' }}>{items.map(i => (
          <div className="item" key={i.id}><span>{i.name || i.title}{tab === 'post' && !i.published && <em className="meta"> (draft)</em>}</span>
            <span><a className="ghost small" href={`/admin?tab=${tab}&edit=${i.id}`}>Edit</a>{' '}
              <form action={deleteItem}><input type="hidden" name="id" value={i.id} /><input type="hidden" name="kind" value={tab} /><button className="ghost small">Delete</button></form></span></div>))}
          {!items.length && <p className="meta">Nothing here yet.</p>}</div></>}
      {tab === 'inquiry' && <div style={{ maxWidth: 760, margin: '0 auto' }}>{items.map(i => (
        <div className="inq" key={i.id}><p><b>{i.name}</b>, {i.org} ({i.orgType}) · <a href={`mailto:${i.email}`}>{i.email}</a> {i.phone && `· ${i.phone}`}</p>
          <p>Project: {i.type} · Users: {i.size} · Timeline: {i.time} · Budget: {i.budget}</p>
          <p>Features: {i.feat?.join(', ') || '-'}</p><p>Integrations: {i.integ?.join(', ') || '-'}</p>
          <p>Today: {i.current || '-'}</p><p>Goals: {i.goals || '-'}</p>
          <p><b>Estimate shown: {fmt(i.range[0])} to {fmt(i.range[1])}</b> · <span className="meta">{new Date(i.created_at).toLocaleString('en-GB')}</span></p>
          <form action={deleteItem}><input type="hidden" name="id" value={i.id} /><input type="hidden" name="kind" value="inquiry" /><button className="ghost small">Delete</button></form></div>))}
        {!items.length && <p className="meta">No enquiries yet.</p>}</div>}
      {tab === 'pricing' && (async () => { const cfg = await getConfig(); return (
        <form action={savePricing} className="card"><h3>Pricing</h3><p className="sub">One item per line as “Name: amount”. Changes apply to the quote tool immediately. Names must match exactly to keep existing rules.</p>
          {GROUPS.map(([id, l, p]) => <div key={id}><label className="f" htmlFor={id}>{l}</label><textarea id={id} name={id} rows={Object.keys(getPath(cfg, p)).length + 1} defaultValue={toLines(getPath(cfg, p))} /></div>)}
          <div className="err" style={{ color: 'var(--green)' }}>{q.ok && 'Pricing saved.'}</div><button className="btn">Save pricing</button></form>); })()}
    </main>
  );
}
