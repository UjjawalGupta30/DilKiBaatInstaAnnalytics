# Dil Ki Baat AI — Project Source of Truth

## Locked product decisions
- Instagram account: Creator
- Target cadence: 2 Reels/day
- Human approval is required before Instagram publishing
- WhatsApp morning report target: 9:00 AM IST
- Orchestration: n8n Cloud
- Dashboard: Next.js on Vercel
- Database + storage: Supabase
- AI: Gemini first; current n8n workflow is tested with Gemini Chat Model + Structured Output Parser
- Reddit: discover relevant conversations and draft useful replies; human approval before posting
- Prefer free/open-source options where practical
- Brand voice: simple, warm, conversational, mostly English, limited natural Hinglish
- Core themes: sharing, listening, friendship, relationships, loneliness, venting, connection
- Avoid: society-bashing, rage bait, fabricated facts, fake psychology, generic motivation, spam

## Current working data path
n8n `DKB AI studio` -> Gemini -> Structured Output Parser -> Supabase REST -> `content_items` -> Vercel dashboard.

## Deployment source of truth
This repository is the only production source. GitHub `main` is canonical; Vercel deploys from `main`.
Do not create parallel production folders.
