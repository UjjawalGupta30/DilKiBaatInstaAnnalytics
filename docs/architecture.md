# Architecture notes

## MVP workflow
- n8n runs a daily workflow in Asia/Kolkata.
- Trend source adapters provide dated, source-linked candidates.
- AI planner generates up to 2 content briefs/day.
- Drafts are saved with `needs_review`.
- Dashboard is the approval surface.
- A separate publish workflow consumes only `approved` items.
- A metrics workflow collects supported insights and sends a WhatsApp summary.

## Review gate
Never publish drafts directly from the trend agent. Require status `approved` and validate asset URL, caption, and account configuration before publishing.

## Secrets
Store access tokens in n8n credentials or a server-side secret manager. Do not store tokens in browser code, source control, or content records.

## Reliability
Use idempotency keys for publishing jobs, log each state transition, and alert on expired credentials or failed uploads.
