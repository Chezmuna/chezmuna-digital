import { getConfig, save } from '@/lib/db';
import { estimate } from '@/lib/estimate';
const str = v => String(v || '').slice(0, 2000);
export async function POST(req) {
  let S; try { S = await req.json(); } catch { return Response.json({ error: 'Invalid request' }, { status: 400 }); }
  try {
    const c = await getConfig();
    if (!S.name || !/^\S+@\S+\.\S+$/.test(S.email || '') || !c.base[S.type]) return Response.json({ error: 'Please check your details and try again' }, { status: 400 });
    const d = {
      name: str(S.name), org: str(S.org), email: str(S.email), phone: str(S.phone), orgType: str(S.orgType), type: S.type,
      size: str(S.size), time: str(S.time), budget: str(S.budget), current: str(S.current), goals: str(S.goals),
      feat: (Array.isArray(S.feat) ? S.feat : []).filter(f => f in (c.feat[S.type] || {})), integ: (Array.isArray(S.integ) ? S.integ : []).filter(f => f in c.integ),
    };
    d.range = estimate(c, d);
    let saved = false, emailed = false;
    try { await save('inquiry', null, d); saved = true; } catch (e) { console.error('inquiry save failed', e); }
    if (process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL) {
      try {
        const r = await fetch('https://api.resend.com/emails', {
          method: 'POST', signal: AbortSignal.timeout(6000), headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ from: process.env.RESEND_FROM || 'onboarding@resend.dev', to: process.env.NOTIFY_EMAIL, reply_to: d.email, subject: `New enquiry: ${d.org} (${d.type})`, text: Object.entries(d).map(([k, v]) => `${k}: ${v}`).join('\n') }),
        });
        emailed = r.ok; if (!r.ok) console.error('resend failed', r.status, await r.text());
      } catch (e) { console.error('resend error', e); }
    }
    if (!saved && !emailed) return Response.json({ error: 'We could not record your enquiry' }, { status: 500 });
    return Response.json({ range: d.range });
  } catch (e) { console.error('inquiry error', e); return Response.json({ error: 'Something went wrong on our side' }, { status: 500 }); }
}
