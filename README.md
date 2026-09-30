# Dil Ki Baat AI — Live MVP v0.4

Production-oriented dashboard for the Dil Ki Baat content operating system.

## Working today
n8n -> Gemini -> Structured Reel -> Supabase -> Vercel dashboard

## Local

```bash
npm install
npm run build
npm run dev
```

Create `.env.local` from `.env.example`.

Required server variables:
- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY` (or the existing legacy `SUPABASE_SERVICE_ROLE_KEY`)
- `DKB_ADMIN_PASSWORD`

Health endpoint:
`/api/health`

## Deploy
Push `main` to GitHub; Vercel deploys from it.

Never commit secrets.

## Integration status
Meta/Instagram, Reddit, WhatsApp and live trend sources are intentionally gated until their external account/API setup is complete.
