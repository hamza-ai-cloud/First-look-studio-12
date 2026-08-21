CREATE TABLE IF NOT EXISTS public.branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  name text NOT NULL,
  address text,
  phone text,
  email text,
  hours text,
  maps_url text,

  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

CREATE INDEX IF NOT EXISTS branches_active_idx
  ON public.branches(is_active);

CREATE INDEX IF NOT EXISTS branches_sort_order_idx
  ON public.branches(sort_order);

ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.branches TO service_role;
