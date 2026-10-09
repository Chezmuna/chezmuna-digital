import { list } from '@/lib/db';
export const dynamic = 'force-dynamic';
const SAMPLES = [
  { name: 'Professional association portal', client: 'Association, 3,000 members', challenge: 'Dues were tracked in spreadsheets and renewals chased by phone.', result: 'Online registration, automatic renewal reminders and a live dues dashboard.' },
  { name: 'Faith community platform', client: 'Church network, 5 branches', challenge: 'Member records and events were managed separately by each branch.', result: 'One member database, event registration and giving records across all branches.' },
  { name: 'Operations approvals system', client: 'Logistics company', challenge: 'Requests and approvals moved through email and paper forms.', result: 'Role-based approvals, an audit trail and weekly management reports.' },
];
export default async function Home() {
  let projects = []; try { projects = await list('project'); } catch {}
  const sample = !projects.length; if (sample) projects = SAMPLES;
  return (
    <main>
      <div className="wrap hero">
        <div>
          <h1>Digital platforms for organisations that outgrew spreadsheets.</h1>
          <p>We design and build membership portals, business platforms and automation systems for associations, institutions, NGOs and growing companies in Nigeria and beyond.</p>
          <a className="btn" href="/quote">Scope your project and get an estimate</a>
        </div>
        <div className="portal" role="img" aria-label="Illustration of a membership portal dashboard">
          <div className="bar"><strong>Members dashboard</strong><span>Sample view</span></div>
          <div className="stats"><div><b>1,248</b><span>Active members</span></div><div><b>86%</b><span>Dues collected</span></div></div>
          <div className="row"><span>Adaeze Okafor</span><span className="tag">Renewed</span></div>
          <div className="row"><span>Tunde Bello</span><span className="tag due">Due in 7 days</span></div>
          <div className="row"><span>Annual general meeting</span><span className="tag">212 registered</span></div>
        </div>
      </div>
      <section id="services"><div className="wrap">
        <h2>What we build</h2><p className="lead">Each project is scoped to a defined outcome, delivered in milestones and supported after launch.</p>
        <div className="offers">
          <div className="offer main"><h3>Membership and business portals</h3><p>Registration, member records, dues and renewals, events, documents, communications and an admin dashboard.</p><small>Our main service</small></div>
          <div className="offer"><h3>Custom business platforms</h3><p>Approvals, client management, operations and reporting systems that replace fragmented spreadsheets and paper.</p></div>
          <div className="offer"><h3>Websites and automation</h3><p>Corporate websites connected to enquiry handling, CRM, booking and follow-up automation.</p></div>
        </div>
      </div></section>
      <section className="band"><div className="wrap">
        <h2>Built for organisations like yours</h2><p className="lead">We start with how your organisation actually works, then shape the platform around it.</p>
        <div className="who">{['Professional associations', 'Churches', 'NGOs', 'Schools and institutions', 'Trade bodies', 'Growing companies'].map(x => <span key={x}>{x}</span>)}</div>
      </div></section>
      <section id="work"><div className="wrap">
        <h2>Our work</h2><p className="lead">Selected platforms and what they changed for the client.</p>
        <div className="work">{projects.map((p, i) => (
          <div className="case" key={p.id || i}>
            {sample && <span className="flag">Sample: add real projects in Admin</span>}
            <h3>{p.name}</h3><p>{[p.client, p.sector].filter(Boolean).join(' · ')}</p>
            <p><b>Challenge:</b> {p.challenge}</p><p><b>Result:</b> {p.result}</p>
          </div>))}</div>
      </div></section>
      <section className="band"><div className="wrap">
        <h2>How a project works</h2><p className="lead">You see a working prototype before you commit to the full build.</p>
        <ol className="steps">
          <li><h3>Discover</h3><p>You complete our scoping questionnaire and we agree the scope on a call.</p></li>
          <li><h3>Demonstrate</h3><p>You review a prototype built around your processes.</p></li>
          <li><h3>Build</h3><p>We deliver in milestones, with payment tied to each one.</p></li>
          <li><h3>Support</h3><p>Hosting, maintenance and improvements on a monthly plan.</p></li>
        </ol>
      </div></section>
      <section className="cta"><div className="wrap">
        <h2>Tell us what you need to manage</h2>
        <p>Answer a few questions and see an indicative price range straight away. We follow with a formal quote after a short discovery call.</p>
        <a className="btn" href="/quote">Get a quote</a>
      </div></section>
    </main>
  );
}
