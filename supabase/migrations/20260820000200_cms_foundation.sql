-- ============================================================
-- FIRST LOOK STUDIO
-- CMS FOUNDATION
-- ============================================================

-- ------------------------------------------------------------
-- Site settings
-- One row per setting, allowing future settings without schema
-- changes.
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text NOT NULL UNIQUE,
  setting_value jsonb NOT NULL DEFAULT '{}'::jsonb,
  description text,
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

CREATE INDEX IF NOT EXISTS site_settings_public_idx
  ON public.site_settings(is_public);


-- ------------------------------------------------------------
-- Theme
-- Global visual configuration.
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.theme_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Default Theme',
  is_active boolean NOT NULL DEFAULT false,

  primary_color text NOT NULL DEFAULT '#C99634',
  secondary_color text NOT NULL DEFAULT '#171208',
  accent_color text NOT NULL DEFAULT '#D4A33D',

  background_color text NOT NULL DEFAULT '#0B0F14',
  surface_color text NOT NULL DEFAULT '#161B22',
  text_color text NOT NULL DEFAULT '#FFFFFF',
  muted_text_color text NOT NULL DEFAULT '#8B949E',
  border_color text NOT NULL DEFAULT '#30363D',

  heading_font text,
  body_font text,

  button_radius integer NOT NULL DEFAULT 12,
  card_radius integer NOT NULL DEFAULT 20,

  custom_css text,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS theme_settings_active_idx
  ON public.theme_settings(is_active)
  WHERE is_active = true;


-- ------------------------------------------------------------
-- Pages
-- Represents editable website pages.
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  slug text NOT NULL UNIQUE,
  title text NOT NULL,

  status text NOT NULL DEFAULT 'published'
    CHECK (status IN ('draft', 'published', 'archived')),

  template text NOT NULL DEFAULT 'default',

  excerpt text,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,

  featured_image_id uuid,

  seo_title text,
  seo_description text,
  seo_keywords text,
  og_image_url text,

  sort_order integer NOT NULL DEFAULT 0,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

CREATE INDEX IF NOT EXISTS pages_status_idx
  ON public.pages(status);

CREATE INDEX IF NOT EXISTS pages_sort_order_idx
  ON public.pages(sort_order);


-- ------------------------------------------------------------
-- Page sections
-- Individual editable blocks inside pages.
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.page_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  page_id uuid NOT NULL
    REFERENCES public.pages(id)
    ON DELETE CASCADE,

  section_key text NOT NULL,
  section_type text NOT NULL,

  title text,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,

  sort_order integer NOT NULL DEFAULT 0,

  is_visible boolean NOT NULL DEFAULT true,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

CREATE INDEX IF NOT EXISTS page_sections_page_idx
  ON public.page_sections(page_id);

CREATE INDEX IF NOT EXISTS page_sections_order_idx
  ON public.page_sections(page_id, sort_order);


-- ------------------------------------------------------------
-- Media library
-- Stores metadata for Supabase Storage assets.
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  file_name text NOT NULL,
  storage_path text NOT NULL UNIQUE,

  public_url text,

  mime_type text,
  file_size bigint,

  width integer,
  height integer,

  alt_text text,
  caption text,

  folder text NOT NULL DEFAULT 'general',

  is_active boolean NOT NULL DEFAULT true,

  uploaded_by uuid
    REFERENCES public.admins(id)
    ON DELETE SET NULL,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

CREATE INDEX IF NOT EXISTS media_folder_idx
  ON public.media(folder);

CREATE INDEX IF NOT EXISTS media_active_idx
  ON public.media(is_active);


-- ------------------------------------------------------------
-- Navigation
-- Header/footer/navigation items.
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.navigation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  location text NOT NULL
    CHECK (location IN ('header', 'footer', 'mobile', 'custom')),

  label text NOT NULL,
  href text NOT NULL,

  icon text,

  parent_id uuid
    REFERENCES public.navigation_items(id)
    ON DELETE CASCADE,

  sort_order integer NOT NULL DEFAULT 0,

  is_visible boolean NOT NULL DEFAULT true,
  open_new_tab boolean NOT NULL DEFAULT false,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

CREATE INDEX IF NOT EXISTS navigation_location_idx
  ON public.navigation_items(location);

CREATE INDEX IF NOT EXISTS navigation_order_idx
  ON public.navigation_items(location, sort_order);


-- ------------------------------------------------------------
-- SEO metadata
-- Allows page-level and global SEO management.
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.seo_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  page_id uuid
    REFERENCES public.pages(id)
    ON DELETE CASCADE,

  route_path text UNIQUE,

  title text,
  description text,
  keywords text,

  canonical_url text,

  og_title text,
  og_description text,
  og_image_url text,

  twitter_title text,
  twitter_description text,
  twitter_image_url text,

  robots text NOT NULL DEFAULT 'index,follow',

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

CREATE INDEX IF NOT EXISTS seo_metadata_page_idx
  ON public.seo_metadata(page_id);


-- ------------------------------------------------------------
-- CMS audit log
-- Tracks important admin CMS changes.
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.cms_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  admin_id uuid
    REFERENCES public.admins(id)
    ON DELETE SET NULL,

  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,

  description text,

  before_data jsonb,
  after_data jsonb,

  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS cms_activity_admin_idx
  ON public.cms_activity_log(admin_id);

CREATE INDEX IF NOT EXISTS cms_activity_entity_idx
  ON public.cms_activity_log(entity_type, entity_id);

CREATE INDEX IF NOT EXISTS cms_activity_created_idx
  ON public.cms_activity_log(created_at DESC);


-- ------------------------------------------------------------
-- Seed default theme
-- ------------------------------------------------------------

INSERT INTO public.theme_settings (
  name,
  is_active,
  primary_color,
  secondary_color,
  accent_color,
  background_color,
  surface_color,
  text_color,
  muted_text_color,
  border_color,
  button_radius,
  card_radius
)
SELECT
  'First Look Default',
  true,
  '#C99634',
  '#171208',
  '#D4A33D',
  '#0B0F14',
  '#161B22',
  '#FFFFFF',
  '#8B949E',
  '#30363D',
  12,
  20
WHERE NOT EXISTS (
  SELECT 1
  FROM public.theme_settings
  WHERE is_active = true
);


-- ------------------------------------------------------------
-- Seed core pages
-- ------------------------------------------------------------

INSERT INTO public.pages (
  slug,
  title,
  status,
  template,
  sort_order
)
VALUES
  ('/', 'Home', 'published', 'home', 0),
  ('/about', 'About', 'published', 'default', 1),
  ('/services', 'Services', 'published', 'services', 2),
  ('/gallery', 'Gallery', 'published', 'gallery', 3),
  ('/portfolio', 'Portfolio', 'published', 'portfolio', 4),
  ('/pricing', 'Pricing', 'published', 'pricing', 5),
  ('/testimonials', 'Testimonials', 'published', 'default', 6),
  ('/faq', 'FAQ', 'published', 'default', 7),
  ('/contact', 'Contact', 'published', 'contact', 8),
  ('/booking', 'Booking', 'published', 'booking', 9),
  ('/career', 'Career', 'published', 'career', 10),
  ('/blog', 'Blog', 'published', 'blog', 11),
  ('/shop', 'Shop', 'published', 'shop', 12),
  ('/privacy-policy', 'Privacy Policy', 'published', 'legal', 13),
  ('/terms', 'Terms', 'published', 'legal', 14)
ON CONFLICT (slug) DO NOTHING;


-- ------------------------------------------------------------
-- Seed header navigation
-- ------------------------------------------------------------

INSERT INTO public.navigation_items (
  location,
  label,
  href,
  sort_order,
  is_visible
)
SELECT *
FROM (
  VALUES
    ('header', 'Home', '/', 0, true),
    ('header', 'About', '/about', 1, true),
    ('header', 'Services', '/services', 2, true),
    ('header', 'Gallery', '/gallery', 3, true),
    ('header', 'Portfolio', '/portfolio', 4, true),
    ('header', 'Pricing', '/pricing', 5, true),
    ('header', 'Contact', '/contact', 6, true)
) AS seed(location, label, href, sort_order, is_visible)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.navigation_items n
  WHERE n.location = seed.location
    AND n.href = seed.href
);


-- ------------------------------------------------------------
-- Seed global site settings
-- ------------------------------------------------------------

INSERT INTO public.site_settings (
  setting_key,
  setting_value,
  description,
  is_public
)
VALUES
  (
    'site_identity',
    '{"name":"First Look Studio","tagline":"","logo_url":""}'::jsonb,
    'Global studio identity',
    true
  ),
  (
    'contact_information',
    '{"email":"","phone":"","address":"","hours":""}'::jsonb,
    'Public contact information',
    true
  ),
  (
    'social_links',
    '{"instagram":"","facebook":"","youtube":"","tiktok":""}'::jsonb,
    'Social media links',
    true
  ),
  (
    'footer_settings',
    '{"copyright":"First Look Studio","description":""}'::jsonb,
    'Footer configuration',
    true
  ),
  (
    'general_settings',
    '{"maintenance_mode":false,"show_cookie_notice":false}'::jsonb,
    'General website settings',
    true
  )
ON CONFLICT (setting_key) DO NOTHING;


-- ------------------------------------------------------------
-- RLS
-- All CMS mutations should go through trusted server-side APIs.
-- ------------------------------------------------------------

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theme_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_activity_log ENABLE ROW LEVEL SECURITY;


-- Public read policies for explicitly public CMS content.

CREATE POLICY "public_read_site_settings"
ON public.site_settings
FOR SELECT
TO anon, authenticated
USING (is_public = true);

CREATE POLICY "public_read_active_theme"
ON public.theme_settings
FOR SELECT
TO anon, authenticated
USING (is_active = true);

CREATE POLICY "public_read_published_pages"
ON public.pages
FOR SELECT
TO anon, authenticated
USING (status = 'published');

CREATE POLICY "public_read_visible_sections"
ON public.page_sections
FOR SELECT
TO anon, authenticated
USING (
  is_visible = true
  AND EXISTS (
    SELECT 1
    FROM public.pages p
    WHERE p.id = page_sections.page_id
      AND p.status = 'published'
  )
);

CREATE POLICY "public_read_active_media"
ON public.media
FOR SELECT
TO anon, authenticated
USING (is_active = true);

CREATE POLICY "public_read_navigation"
ON public.navigation_items
FOR SELECT
TO anon, authenticated
USING (is_visible = true);

CREATE POLICY "public_read_seo"
ON public.seo_metadata
FOR SELECT
TO anon, authenticated
USING (true);


-- Service role remains the trusted mutation path.

GRANT ALL ON TABLE public.site_settings TO service_role;
GRANT ALL ON TABLE public.theme_settings TO service_role;
GRANT ALL ON TABLE public.pages TO service_role;
GRANT ALL ON TABLE public.page_sections TO service_role;
GRANT ALL ON TABLE public.media TO service_role;
GRANT ALL ON TABLE public.navigation_items TO service_role;
GRANT ALL ON TABLE public.seo_metadata TO service_role;
GRANT ALL ON TABLE public.cms_activity_log TO service_role;
