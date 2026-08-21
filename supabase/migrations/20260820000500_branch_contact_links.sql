ALTER TABLE public.branches
  ADD COLUMN IF NOT EXISTS whatsapp_url text;

ALTER TABLE public.branches
  ADD COLUMN IF NOT EXISTS display_phone text;
