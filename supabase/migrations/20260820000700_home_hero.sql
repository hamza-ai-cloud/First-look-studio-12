INSERT INTO public.pages
  (slug, title, status, sort_order)
VALUES
  ('home', 'Home', 'published', 0)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.page_sections
  (page_id, section_key, section_type, title, content, sort_order, is_visible)
SELECT
  p.id,
  'hero',
  'hero',
  'Home Hero',
  '{
    "eyebrow": "PREMIUM PHOTOGRAPHY STUDIO",
    "heading": "Capturing Moments",
    "heading_highlight": "Worth Remembering",
    "description": "From cinematic wedding films to premium printing and custom gifts — First Look Studio brings your vision to life with artistry and precision.",
    "primary_button_text": "Book a Session",
    "primary_button_url": "/booking",
    "secondary_button_text": "View Portfolio",
    "secondary_button_url": "/portfolio",
    "stats": [
      {
        "value": "500+",
        "label": "Events Covered"
      },
      {
        "value": "12K+",
        "label": "Happy Clients"
      },
      {
        "value": "15+",
        "label": "Years Experience"
      },
      {
        "value": "50K+",
        "label": "Photos Delivered"
      }
    ],
    "show_stats": true,
    "show_scroll_indicator": true
  }'::jsonb,
  0,
  true
FROM public.pages p
WHERE p.slug = 'home'
  AND NOT EXISTS (
    SELECT 1
    FROM public.page_sections ps
    WHERE ps.page_id = p.id
      AND ps.section_key = 'hero'
  );
