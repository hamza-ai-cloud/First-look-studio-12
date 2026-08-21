ALTER TABLE public.admins
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

ALTER TABLE public.admins
  ADD COLUMN IF NOT EXISTS updated_at timestamptz;

ALTER TABLE public.admins
  ADD COLUMN IF NOT EXISTS last_login_at timestamptz;

UPDATE public.admins
SET updated_at = COALESCE(updated_at, created_at)
WHERE updated_at IS NULL;

CREATE INDEX IF NOT EXISTS admins_role_idx
  ON public.admins(role);

CREATE INDEX IF NOT EXISTS admins_active_idx
  ON public.admins(is_active);
