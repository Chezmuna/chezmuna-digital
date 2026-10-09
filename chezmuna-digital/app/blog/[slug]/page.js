import { list } from '@/lib/db';
import { notFound } from 'next/navigation';
export const dynamic = 'force-dynamic';
async function find(slug) { try { return (await list('post')).find(p => p.published && p.slug === slug); } catch {} }
export async function generateMetadata({ params }) { const p = await find((await params).slug); return p ? { title: p.title, description: p.excerpt } : {}; }
export default async function Post({ params }) {
  const p = await find((await params).slug); if (!p) notFound();
  return (
    <main className="wrap page"><article className="prose">
      <p className="meta">{new Date(p.created_at).toLocaleDateString('en-GB', { dateStyle: 'long' })}</p><h1 style={{ fontSize: 44, margin: '8px 0 28px' }}>{p.title}</h1>{p.image ? <img className="cover" src={`/api/img/${p.image}`} alt="" /> : null}
      {p.body.split(/\n\s*\n/).map((t, i) => <p key={i}>{t}</p>)}
      <p style={{ marginTop: 40 }}><a className="btn" href="/quote">Get a quote for your project</a></p>
    </article></main>
  );
}
