import { getConfig, save } from '@/lib/db';
import { estimate } from '@/lib/estimate';
const str = v => String(v || '').slice(0, 2000);
export async function POST(req) {
  let S; try { S = await req.json(); } catch { return Response.json({ error: 'bad' }, { status: 400 }); }
  const c = await getConfig();
  if (!S.name || !/^\S+@\S+\.\S+$/.test(S.email || '') || !c.base[S.type]) return Response.json({ error: 'invalid' }, { status: 400 });
  const d = {
    name: str(S.name), org: str(S.org), email: str(S.email), phone: str(S.phone), orgType: str(S.orgType), type: S.type,
    size: str(S.size), time: str(S.time), budget: str(S.budget), current: str(S.current), goals: str(S.goals),
    feat: (S.feat || []).filter(f => f in c.feat[S.type]), integ: (S.integ || []).filter(f => f in c.integ),
  };
  d.range = estimate(c, d);
  await save('inquiry', null, d);
  if (process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: process.env.RESEND_FROM || 'onboarding@resend.dev', to: process.env.NOTIFY_EMAIL, reply_to: d.email, subject: `New enquiry: ${d.org} (${d.type})`, text: Object.entries(d).map(([k, v]) => `${k}: ${v}`).join('\n') }),
    }).catch(() => {});
  }
  return Response.json({ range: d.range });
}
