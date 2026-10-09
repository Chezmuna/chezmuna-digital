import { list } from '@/lib/db';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Insights' };
export default async function Blog() {
  let posts = []; try { posts = (await list('post')).filter(p => p.published); } catch {}
  return (
    <main className="wrap page"><h2>Insights</h2><p className="lead">Practical notes on CRM, ERP, automation and digital platforms for organisations.</p>
      {posts.length ? posts.map(p => <a className="post" key={p.id} href={`/blog/${p.slug}`}><span className="meta">{new Date(p.created_at).toLocaleDateString('en-GB', { dateStyle: 'long' })}</span><h3>{p.title}</h3><p>{p.excerpt}</p></a>) : <p>No articles published yet.</p>}
    </main>
  );
}
