# Dil Ki Baat AI — Hybrid MVP Starter

This starter is a local-first scaffold for a hybrid content workflow:
- Next.js dashboard for content drafts and review
- n8n for scheduled orchestration (workflow blueprint included)
- PostgreSQL-ready data model
- Instagram publishing and WhatsApp delivery are integration points, not activated until you configure Meta/WhatsApp credentials and permissions.

## MVP scope
1. Maintain content ideas and draft posts.
2. Review/approve drafts before publishing.
3. Track publishing state and basic performance fields.
4. Prepare a morning report payload.
5. Leave explicit adapters for Instagram Graph API and WhatsApp Cloud API.

## Run locally
Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```
Open http://localhost:3000

This is a prototype dashboard with sample data. It does not connect to Instagram or WhatsApp until credentials and API implementation are configured.

## Environment
Copy `.env.example` to `.env.local` and fill in values when ready. Never commit secrets.

## Suggested next milestones
- Configure Meta developer app and connect the professional Instagram account.
- Implement OAuth/token storage securely on a server.
- Implement publishing and insights adapters with official APIs.
- Configure WhatsApp Cloud API or a supported provider for reports.
- Deploy the dashboard and n8n with HTTPS, backups, and secret management.
