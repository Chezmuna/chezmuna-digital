import { list } from '@/lib/db';
export const revalidate = 60;
export const metadata = { title: 'Insights on Digital Platforms, CRM and Automation', description: 'Practical notes on membership portals, CRM, ERP and business automation for associations, NGOs and growing companies in Nigeria.', alternates: { canonical: '/blog' } };
export default async function Blog() {
  let posts = []; try { posts = (await list('post')).filter(p => p.published); } catch {}
  return (
    <main className="wrap page"><h1>Our <em>insights</em></h1><p className="lead">Practical notes on CRM, ERP, automation and digital platforms for organisations.</p>
      {posts.length ? <div className="work">{posts.map(p => <a className="case" key={p.id} href={`/blog/${p.slug}`}>
        <div className="thumb" style={p.image ? undefined : { background: 'linear-gradient(135deg,#15614a,#0b2e22)' }}>{p.image ? <img src={`/api/img/${p.image}`} alt="" loading="lazy" /> : <span>{p.title[0]}</span>}</div>
        <div className="cb"><span className="meta">{new Date(p.created_at).toLocaleDateString('en-GB', { dateStyle: 'long' })}</span><h3>{p.title}</h3><p>{p.excerpt}</p></div></a>)}</div> : <p>No articles published yet.</p>}
    </main>
  );
}
