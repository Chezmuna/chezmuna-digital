import { neon } from '@neondatabase/serverless';
export const DEFAULTS = {
  base: { portal: 4500000, app: 6000000, site: 3000000 },
  size: { 'Under 200 users': 1, '200 to 2,000 users': 1.25, '2,000 to 20,000 users': 1.6, 'Over 20,000 users': 2.1 },
  feat: {
    portal: { 'Member registration and profiles': 0, 'Dues, renewals and online payments': 900000, 'Events and ticketing': 700000, 'Document library': 400000, 'Member directory': 400000, 'Email and SMS communications': 600000, 'Certificates and ID cards': 500000, 'Mobile-friendly app (PWA)': 800000 },
    app: { 'Role-based workflows and approvals': 900000, 'Client and record management': 700000, 'Reporting dashboards': 900000, 'Automatic document generation': 400000, 'Notifications and reminders': 400000, 'Mobile-friendly app (PWA)': 800000, 'Migration from spreadsheets': 700000 },
    site: { 'Multi-page corporate website': 0, 'Enquiry and CRM integration': 700000, 'Booking and scheduling': 600000, 'Blog and content management': 400000, 'Automated follow-ups': 800000, 'Multiple languages': 400000 },
  },
  integ: { 'Payment gateway (Paystack, Flutterwave)': 500000, 'Accounting software': 600000, 'CRM or ERP': 900000, 'SMS or WhatsApp': 400000, 'An existing database or system': 700000 },
};
let ready;
async function sql() {
  const s = neon(process.env.DATABASE_URL);
  ready ??= s`CREATE TABLE IF NOT EXISTS items (id SERIAL PRIMARY KEY, kind TEXT NOT NULL, data JSONB NOT NULL, created_at TIMESTAMPTZ DEFAULT now())`;
  await ready;
  return s;
}
export async function list(kind) {
  const s = await sql();
  const r = await s`SELECT id, data, created_at FROM items WHERE kind = ${kind} ORDER BY id DESC`;
  return r.map(x => ({ ...x.data, id: x.id, created_at: x.created_at }));
}
export async function save(kind, id, data) {
  const s = await sql(); const j = JSON.stringify(data);
  if (id) { await s`UPDATE items SET data = ${j}::jsonb WHERE id = ${id} AND kind = ${kind}`; return id; }
  const [r] = await s`INSERT INTO items (kind, data) VALUES (${kind}, ${j}::jsonb) RETURNING id`;
  return r.id;
}
export async function getImage(id) { const s = await sql(); const [r] = await s`SELECT data FROM items WHERE id = ${id} AND kind = 'image'`; return r?.data; }
export const SITE_DEFAULTS = {
  heroTitle: 'Digital platforms for organisations that *outgrew spreadsheets*.',
  heroText: 'We design and build membership portals, business platforms and automation systems for associations, institutions, NGOs and growing companies in Nigeria and beyond.',
  ctaText: 'Scope your project and get an estimate', heroImage: 0,
  email: 'info@chezmunadigital.com.ng', phone: '', location: 'Lagos, Nigeria',
};
export async function getSite() {
  try { const [c] = await list('site'); if (c) { const { id, created_at, ...r } = c; return { ...SITE_DEFAULTS, ...Object.fromEntries(Object.entries(r).filter(([, v]) => v)) }; } } catch {}
  return SITE_DEFAULTS;
}
export async function setSite(d) { const s = await sql(); await s`DELETE FROM items WHERE kind = 'site'`; await save('site', null, d); }
export async function remove(id) { const s = await sql(); await s`DELETE FROM items WHERE id = ${id}`; }
export async function getConfig() {
  try { const [c] = await list('config'); if (c) {
      const { id, created_at, ...r } = c, ok = o => o && Object.keys(o).length;
      return { base: Object.fromEntries(['portal', 'app', 'site'].map(k => [k, r.base?.[k] > 0 ? r.base[k] : DEFAULTS.base[k]])), size: ok(r.size) && Object.values(r.size).every(x => x > 0) ? r.size : DEFAULTS.size, integ: ok(r.integ) ? r.integ : DEFAULTS.integ,
        feat: Object.fromEntries(['portal', 'app', 'site'].map(t => [t, ok(r.feat?.[t]) ? r.feat[t] : DEFAULTS.feat[t]])) };
    }
  } catch {}
  return DEFAULTS;
}
export async function setConfig(cfg) { const s = await sql(); await s`DELETE FROM items WHERE kind = 'config'`; await save('config', null, cfg); }
