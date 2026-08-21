-- ============================================================
-- FIRST LOOK STUDIO
-- HOME PAGE SECTION FOUNDATION
-- ============================================================

INSERT INTO public.pages
  (slug, title, status, sort_order)
VALUES
  ('home', 'Home', 'published', 0)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  status = 'published',
  updated_at = now();

-- Hero already exists from the previous migration.
-- Create the remaining Home sections only when missing.

INSERT INTO public.page_sections
  (page_id, section_key, section_type, title, content, sort_order, is_visible)
SELECT
  p.id,
  sections.section_key,
  sections.section_type,
  sections.title,
  sections.content::jsonb,
  sections.sort_order,
  true
FROM public.pages p
CROSS JOIN (
  VALUES
    (
      'services',
      'services',
      'Our Services',
      '{}'::text,
      1
    ),
    (
      'gallery',
      'gallery',
      'Featured Gallery',
      '{}'::text,
      2
    ),
    (
      'about',
      'about',
      'About First Look Studio',
      '{}'::text,
      3
    ),
    (
      'testimonials',
      'testimonials',
      'What Our Clients Say',
      '{}'::text,
      4
    ),
    (
      'blog',
      'blog',
      'Latest From The Studio',
      '{}'::text,
      5
    ),
    (
      'cta',
      'cta',
      'Ready To Create Something Beautiful?',
      '{}'::text,
      6
    ),
    (
      'newsletter',
      'newsletter',
      'Stay In The Frame',
      '{}'::text,
      7
    )
) AS sections(
  section_key,
  section_type,
  title,
  content,
  sort_order
)
WHERE p.slug = 'home'
  AND NOT EXISTS (
    SELECT 1
    FROM public.page_sections existing
    WHERE existing.page_id = p.id
      AND existing.section_key = sections.section_key
  );
