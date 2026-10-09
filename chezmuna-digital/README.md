# Chezmuna Digital

Next.js site with admin panel (portfolio, blog, enquiries, pricing) and a scoping questionnaire with instant estimate.

## Deploy on Vercel
1. Push this folder to a GitHub repository and import it in Vercel.
2. In Vercel: Storage → Marketplace → Neon (Postgres). Connect it to the project; this sets `DATABASE_URL`.
3. Add environment variables: `ADMIN_PASSWORD`, `AUTH_SECRET` (run `openssl rand -hex 32`). Optional: `RESEND_API_KEY`, `NOTIFY_EMAIL`, `RESEND_FROM` for email alerts.
4. Deploy, then sign in at `/admin`. The database table is created automatically on first use.
5. Add your domain under Project → Settings → Domains.

Run locally: `npm install`, copy `.env.example` to `.env.local`, then `npm run dev`.
