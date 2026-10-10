import { isAdmin } from '@/lib/auth';
import { list, getConfig, getSite } from '@/lib/db';
import ImageField from '@/components/ImageField';
import { KINDS, SITE_FIELDS, GROUPS, getPath, toLines } from '@/lib/kinds';
import { loginAction, logoutAction, saveSite, saveItem, deleteItem, savePricing } from './actions';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin', robots: { index: false } };
const TABS = [['site', 'Site and hero'], ['project', 'Portfolio'], ['post', 'Blog'], ['faq', 'FAQ'], ['inquiry', 'Enquiries'], ['pricing', 'Pricing']];
const fmt = n => '₦' + (n / 1e6).toFixed(1) + 'M';
function Field({ f: [k, l, t], d }) {
  if (t === 'image') return <ImageField name={k} label={l} current={d[k] || ''} />;
  if (t === 'check') return <label className="opt" style={{ marginTop: 14 }}><input type="checkbox" name={k} defaultChecked={d[k]} /><span>{l}</span></label>;
  return <div><label className="f" htmlFor={k}>{l}</label>{t === 'area' ? <textarea id={k} name={k} defaultValue={d[k] || ''} rows={t === 'area' && k === 'body' ? 12 : 4} /> : <input id={k} name={k} defaultValue={d[k] || ''} />}</div>;
}
export default async function Admin({ searchParams }) {
  const q = await searchParams;
  const missing = ['DATABASE_URL', 'AUTH_SECRET', 'ADMIN_PASSWORD'].filter(k => !process.env[k]);
  if (missing.length) return <main className="wrap adm"><h2>Setup incomplete</h2><p>Missing environment variables: <b>{missing.join(', ')}</b>. Add them in Vercel under Settings → Environment Variables, then redeploy.</p></main>;
  if (!(await isAdmin())) return (
    <main className="wrap adm"><h2>Admin sign in</h2>
      <form action={loginAction} className="card" style={{ marginTop: 20 }}><label className="f" htmlFor="pw">Password</label><input id="pw" name="pw" type="password" required autoFocus />
        <div className="err">{q.e === '2' ? 'Server setup problem: check AUTH_SECRET.' : q.e && 'Wrong password.'}</div><button className="btn">Sign in</button></form></main>);
  const tab = TABS.some(t => t[0] === q.tab) ? q.tab : 'site';
  const K = KINDS[tab];
  let items = [];
  if (tab !== 'pricing') { try { items = await list(tab); } catch { return <main className="wrap adm"><h2>Database not reachable</h2><p>Check that Neon is connected to this project and DATABASE_URL is set, then redeploy.</p></main>; } }
  const cfg = tab === 'pricing' ? await getConfig() : null, site = tab === 'site' ? await getSite() : null;
  const edit = K && items.find(i => String(i.id) === q.edit);
  return (
    <main className="wrap adm">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h2>Admin</h2><form action={logoutAction}><button className="ghost small">Sign out</button></form></div>
      <div className="tabs">{TABS.map(([k, l]) => <a key={k} href={`/admin?tab=${k}`} className={k === tab ? 'on' : ''}>{l}</a>)}</div>
      {K && <>
        <form action={saveItem} className="card" key={edit?.id || 'new'}><h3 style={{ marginBottom: 6 }}>{edit ? 'Edit' : 'Add'} {K.label.toLowerCase()} item</h3>
          <input type="hidden" name="kind" value={tab} /><input type="hidden" name="id" value={edit?.id || ''} />
          {K.fields.map(f => <Field key={f[0]} f={f} d={edit || {}} />)}
          <div className="nav2"><button className="btn">Save</button>{edit && <a className="ghost" href={`/admin?tab=${tab}`}>Cancel</a>}</div></form>
        <div style={{ maxWidth: 760, margin: '28px auto 0' }}>{items.map(i => (
          <div className="item" key={i.id}><span>{i.name || i.title || i.question}{tab === 'post' && !i.published && <em className="meta"> (draft)</em>}</span>
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
      {tab === 'site' && <form action={saveSite} className="card"><h3>Site and hero</h3><p className="sub">Put *asterisks* around a word or two in the headline to highlight them in gold italics.</p>{SITE_FIELDS.map(f => <Field key={f[0]} f={f} d={site} />)}<div className="err" style={{ color: 'var(--em)' }}>{q.ok && 'Saved.'}</div><button className="btn">Save</button></form>}
      {tab === 'pricing' && (
        <form action={savePricing} className="card"><h3>Pricing</h3><p className="sub">One item per line as “Name: amount”. Changes apply to the quote tool immediately. Names must match exactly to keep existing rules.</p>
          {GROUPS.map(([id, l, p]) => <div key={id}><label className="f" htmlFor={id}>{l}</label><textarea id={id} name={id} rows={Object.keys(getPath(cfg, p)).length + 1} defaultValue={toLines(getPath(cfg, p))} /></div>)}
          <div className="err" style={{ color: 'var(--green)' }}>{q.ok && 'Pricing saved.'}</div><button className="btn">Save pricing</button></form>)}
    </main>
  );
}
