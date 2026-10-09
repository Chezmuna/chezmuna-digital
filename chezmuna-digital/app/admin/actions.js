'use server';
import { redirect } from 'next/navigation';
import { login, logout, isAdmin } from '@/lib/auth';
import { save, remove, getConfig, setConfig } from '@/lib/db';
import { KINDS, GROUPS, setPath, fromLines, slugify } from '@/lib/kinds';
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
  for (const [k, , t] of K.fields) d[k] = t === 'check' ? fd.get(k) === 'on' : String(fd.get(k) || '').trim();
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
