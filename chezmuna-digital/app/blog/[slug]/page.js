import { list } from '@/lib/db';
import { notFound } from 'next/navigation';
export const revalidate = 60;
async function find(slug) { try { return (await list('post')).find(p => p.published && p.slug === slug); } catch {} }
export async function generateMetadata({ params }) { const p = await find((await params).slug); if (!p) return {};
  const img = p.image ? [{ url: `/api/img/${p.image}` }] : undefined;
  return { title: p.title, description: p.excerpt, alternates: { canonical: `/blog/${p.slug}` }, openGraph: { type: 'article', title: p.title, description: p.excerpt, publishedTime: p.created_at ? new Date(p.created_at).toISOString() : undefined, images: img } };
}
export default async function Post({ params }) {
  const p = await find((await params).slug); if (!p) notFound();
  const ld = { '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.excerpt, datePublished: p.created_at ? new Date(p.created_at).toISOString() : undefined, image: p.image ? `https://chezmunadigital.com.ng/api/img/${p.image}` : undefined, mainEntityOfPage: `https://chezmunadigital.com.ng/blog/${p.slug}`, author: { '@type': 'Organization', name: 'Chezmuna Digital' }, publisher: { '@type': 'Organization', name: 'Chezmuna Digital' } };
  return (
    <main className="wrap page"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} /><article className="prose">
      <p className="meta">{new Date(p.created_at).toLocaleDateString('en-GB', { dateStyle: 'long' })}</p><h1 style={{ fontSize: 44, margin: '8px 0 28px' }}>{p.title}</h1>{p.image ? <img className="cover" src={`/api/img/${p.image}`} alt="" /> : null}
      {p.body.split(/\n\s*\n/).map((t, i) => <p key={i}>{t}</p>)}
      <p style={{ marginTop: 40 }}><a className="btn" href="/quote">Get a quote for your project</a></p>
    </article></main>
  );
}
