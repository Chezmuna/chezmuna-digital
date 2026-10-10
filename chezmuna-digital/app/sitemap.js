import { list } from '@/lib/db';
export const revalidate = 60;
export default async function sitemap() {
  const b = 'https://chezmunadigital.com.ng'; let p = [];
  try { p = (await list('post')).filter(x => x.published); } catch {}
  return [{ url: b }, { url: b + '/quote' }, { url: b + '/blog' }, ...p.map(x => ({ url: `${b}/blog/${x.slug}`, lastModified: x.created_at }))];
}
