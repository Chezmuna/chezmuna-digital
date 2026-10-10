import { list, getSite } from '@/lib/db';
import { Portal, Flow, Globe, Check, Arrow } from '@/components/Icons';
export const revalidate = 60;
export const metadata = { alternates: { canonical: '/' } };
const SAMPLES = [
  { name: 'Professional association portal', client: 'Association, 3,000 members', sector: 'Associations', challenge: 'Dues were tracked in spreadsheets and renewals chased by phone.', result: 'Online registration, automatic renewal reminders and a live dues dashboard.' },
  { name: 'Faith community platform', client: 'Church network, 5 branches', sector: 'Faith groups', challenge: 'Member records and events were managed separately by each branch.', result: 'One member database, event registration and giving records across all branches.' },
  { name: 'Operations approvals system', client: 'Logistics company', sector: 'Business platforms', challenge: 'Requests and approvals moved through email and paper forms.', result: 'Role-based approvals, an audit trail and weekly management reports.' },
];
const GRAD = ['linear-gradient(135deg,#15614a,#0b2e22)', 'linear-gradient(135deg,#e0a21b,#a8730a)', 'linear-gradient(135deg,#2b4a6b,#12263b)'];
const SECT = ['Professional associations', 'Churches', 'NGOs', 'Schools and institutions', 'Trade bodies', 'Growing companies', 'Cooperatives', 'Membership clubs'];
const Accent = ({ t }) => t.split(/\*(.+?)\*/g).map((s, i) => (i % 2 ? <em key={i}>{s}</em> : s));
const ini = n => n.split(' ').slice(0, 2).map(w => w[0]).join('');
export default async function Home() {
  const site = await getSite();
  let projects = [], posts = [];
  try { projects = await list('project'); posts = (await list('post')).filter(p => p.published).slice(0, 3); } catch {}
  const sample = !projects.length; if (sample) projects = SAMPLES;
  return (
    <main>
      <section className="hero-s" style={{ padding: 0 }}><div className="wrap hero">
        <div>
          <p className="eyebrow">Digital platforms · {site.location}</p>
          <h1><Accent t={site.heroTitle} /></h1>
          <p className="hl">{site.heroText}</p>
          <div className="ctas"><a className="btn lg" href="/quote">{site.ctaText} <Arrow /></a><a className="ghost lg dark" href="#work">See our work</a></div>
          <ul className="trust"><li><Check />Prototype before you commit</li><li><Check />Milestone-based payments</li><li><Check />Support after launch</li></ul>
        </div>
        <div className="visual">
          <div className="frame">{site.heroImage ? <img src={`/api/img/${site.heroImage}`} alt="Chezmuna Digital platform preview" /> : (
            <div className="art" role="img" aria-label="Illustration of a membership dashboard">
              <div><span>Active members</span><b>1,248</b></div><div><span>Renewals this month</span><b>96</b></div><div><span>Upcoming events</span><b>4</b></div></div>)}</div>
          <div className="float f1"><b>86%</b><span>Dues collected</span></div>
          <div className="float f2"><i className="dot" />212 members registered</div>
        </div>
      </div></section>
      <div className="marq" aria-hidden="true"><div className="mt">{[0, 1].map(k => <span key={k}>{SECT.map(s => <b key={s} style={{ fontWeight: 500 }}>{s}</b>)}</span>)}</div></div>
      <section id="services"><div className="wrap">
        <h2 data-r>What we <em>build</em></h2><p className="lead" data-r>Each project is scoped to a defined outcome, delivered in milestones and supported after launch.</p>
        <div className="svc">
          <div className="sc main" data-r><span className="no">01</span><span className="ic"><Portal /></span><span className="pill">Most requested</span><h3>Membership and business portals</h3><p>Registration, member records, dues and renewals, events, documents, communications and an administrator dashboard.</p></div>
          <div className="sc" data-r="2"><span className="no">02</span><span className="ic"><Flow /></span><h3>Custom business platforms</h3><p>Approvals, client management, operations and reporting systems that replace fragmented spreadsheets and paper.</p></div>
          <div className="sc" data-r="3"><span className="no">03</span><span className="ic"><Globe /></span><h3>Websites and automation</h3><p>Corporate websites connected to enquiry handling, CRM, booking and follow-up automation.</p></div>
        </div>
      </div></section>
      <section style={{ paddingTop: 0 }}><div className="wrap why">
        <div data-r><h2>Built around how you <em>actually</em> work</h2><p className="lead" style={{ marginBottom: 0 }}>We start with your processes and members, then shape the platform around them, not the other way round.</p>
          <div className="who">{SECT.slice(0, 6).map(s => <span key={s}>{s}</span>)}</div></div>
        <div className="pts">
          {[['A working prototype first', 'See your platform in action before committing to the full build.'], ['Milestone-based payments', 'Clear deliverables and payments tied to each stage.'], ['Made for Nigerian payments and messaging', 'Online payments, SMS and WhatsApp integrations where your project needs them.'], ['Hosting and support after launch', 'Monthly plans for hosting, fixes and improvements, so the platform keeps working for you.']].map(([t, d], i) => (
            <div className="pt" key={t} data-r={String(i % 3 + 1)}><Check /><div><h3>{t}</h3><p>{d}</p></div></div>))}
        </div>
      </div></section>
      <section id="work" style={{ paddingTop: 0 }}><div className="wrap">
        <h2 data-r>Our <em>work</em></h2><p className="lead" data-r>Selected platforms and what they changed for the client.</p>
        <div className="work">{projects.map((p, i) => (
          <article className="case" key={p.id || i} data-r={String(i % 3 + 1)}>
            <div className="thumb" style={p.image ? undefined : { background: GRAD[i % 3] }}>{p.image ? <img src={`/api/img/${p.image}`} alt={p.name} loading="lazy" /> : <span>{ini(p.name)}</span>}{sample && <em className="flag">Sample project</em>}</div>
            <div className="cb"><span className="tagline">{p.sector || 'Digital platform'}</span><h3>{p.name}</h3><p className="meta" style={{ margin: 0 }}>{p.client}</p><p><b>Challenge: </b>{p.challenge}</p><p><b>Result: </b>{p.result}</p></div>
          </article>))}</div>
      </div></section>
      <section id="process" className="dark-s"><div className="wrap">
        <h2 data-r>How a project <em>works</em></h2><p className="lead" data-r>You see a working prototype before you commit to the full build.</p>
        <ol className="steps">{[['Discover', 'You complete our scoping questionnaire and we agree the scope on a call.'], ['Demonstrate', 'You review a prototype built around your processes.'], ['Build', 'We deliver in milestones, with payment tied to each one.'], ['Support', 'Hosting, maintenance and improvements on a monthly plan.']].map(([t, d], i) => <li key={t} data-r={String(i % 3 + 1)}><h3>{t}</h3><p>{d}</p></li>)}</ol>
      </div></section>
      {posts.length > 0 && <section><div className="wrap"><h2 data-r>Latest <em>insights</em></h2><p className="lead" data-r>Practical notes on CRM, ERP, automation and digital platforms.</p>
        <div className="work">{posts.map((p, i) => <a className="case" key={p.id} href={`/blog/${p.slug}`} data-r={String(i % 3 + 1)}>
          <div className="thumb" style={p.image ? undefined : { background: GRAD[i % 3] }}>{p.image ? <img src={`/api/img/${p.image}`} alt="" loading="lazy" /> : <span>{ini(p.title)}</span>}</div>
          <div className="cb"><h3>{p.title}</h3><p>{p.excerpt}</p></div></a>)}</div></div></section>}
      <section className="cta" style={{ paddingTop: posts.length ? 0 : 96 }}><div className="wrap"><div className="ctab" data-r>
        <h2>Ready to scope your <em>platform</em>?</h2>
        <p>Answer a few questions and see an indicative price range straight away. We follow with a formal quote after a short discovery call.</p>
        <a className="btn lg" href="/quote">Get a quote <Arrow /></a></div></div></section>
    </main>
  );
}
