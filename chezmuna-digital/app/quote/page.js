import { getConfig, getSite } from '@/lib/db';
import Wizard from '@/components/Wizard';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Get a quote' };
export default async function Quote() {
  const site = await getSite();
  return (
    <main className="wrap page">
      <h2 style={{ textAlign: 'center' }}>Scope your <em>project</em></h2>
      <p className="lead" style={{ textAlign: 'center', margin: '0 auto 28px' }}>Answer a few questions. You see an indicative range straight away and we follow with a formal quote.</p>
      <Wizard cfg={await getConfig()} />
      <p className="meta" style={{ textAlign: 'center', marginTop: 24 }}>Prefer to talk first? Email <a href={`mailto:${site.email}`}>{site.email}</a></p>
    </main>
  );
}
