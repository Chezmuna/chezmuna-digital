'use server';
import { redirect } from 'next/navigation';
import { login, logout, isAdmin } from '@/lib/auth';
import { save, remove, getConfig, setConfig, setSite } from '@/lib/db';
import { KINDS, SITE_FIELDS, GROUPS, setPath, fromLines, slugify } from '@/lib/kinds';
async function img(fd, name) {
  const prev = Number(fd.get(name)) || 0, data = String(fd.get(name + '_data') || '');
  if (data.startsWith('data:image/jpeg;base64,') && data.length < 3.5e6) {
    const id = await save('image', null, { mime: 'image/jpeg', b64: data.split(',')[1] });
    if (prev) await remove(prev); return id;
  }
  if (fd.get(name + '_clear') === 'on' && prev) { await remove(prev); return 0; }
  return prev;
}
async function guard() { if (!(await isAdmin())) redirect('/admin'); }
export async function loginAction(fd) {
  let ok; try { ok = await login(String(fd.get('pw') || '').trim()); } catch { ok = null; }
  redirect(ok ? '/admin' : ok === null ? '/admin?e=2' : '/admin?e=1');
}
export async function logoutAction() { await logout(); redirect('/admin'); }
export async function saveItem(fd) {
  await guard();
  const kind = fd.get('kind'), K = KINDS[kind]; if (!K) return;
  const d = {};
  for (const [k, , t] of K.fields) d[k] = t === 'check' ? fd.get(k) === 'on' : t === 'image' ? await img(fd, k) : String(fd.get(k) || '').trim();
  if (kind === 'post') d.slug = slugify(d.slug || d.title);
  await save(kind, Number(fd.get('id')) || null, d);
  redirect(`/admin?tab=${kind}`);
}
export async function deleteItem(fd) { await guard(); await remove(Number(fd.get('id'))); redirect(`/admin?tab=${fd.get('kind')}`); }
export async function savePricing(fd) {
  await guard();
  const cfg = structuredClone(await getConfig());
  for (const [id, , path] of GROUPS) { const v = fromLines(String(fd.get(id) || '')); if (Object.keys(v).length) setPath(cfg, path, v); }
  await setConfig(cfg);
  redirect('/admin?tab=pricing&ok=1');
}
export async function saveSite(fd) {
  await guard(); const d = {};
  for (const [k, , t] of SITE_FIELDS) d[k] = t === 'image' ? await img(fd, k) : String(fd.get(k) || '').trim();
  await setSite(d); redirect('/admin?tab=site&ok=1');
}
