-- Existing Supabase projects need this once after adding the rejected state.
ALTER TABLE public.content_items
  DROP CONSTRAINT IF EXISTS content_items_status_check;

ALTER TABLE public.content_items
  ADD CONSTRAINT content_items_status_check
  CHECK (status IN ('idea','draft','needs_review','approved','scheduled','publishing','published','failed','rejected','archived'));
