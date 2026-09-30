# Dashboard Behavior

## Live data
The dashboard reads `content_items`, `trend_items`, and `reddit_opportunities` from Supabase on each request.

## Review actions
`PATCH /api/content/:id` supports:
- editing topic/hook/caption/hashtags
- `approved`
- `rejected`
- updating `scheduled_at`

Every approve/reject action also creates an `approvals` record.

## Authentication
Single-operator password gate:
- `DKB_ADMIN_PASSWORD`
- optional `DKB_SESSION_SECRET`

The Supabase secret key remains server-only.
