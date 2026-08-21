-- ============================================================
-- SEED SERVICES
-- Source: existing lib/data.ts service catalog.
-- Safe to re-run: slug prevents duplicates.
-- ============================================================

INSERT INTO public.services (
  title,
  slug,
  description,
  category,
  features,
  is_featured,
  is_active,
  sort_order
)
VALUES
(
  'Wedding Photography',
  'wedding-photography',
  'Cinematic wedding coverage capturing every precious moment of your special day.',
  'Photography',
  '["Full-day coverage","Cinematic editing","Drone shots","Photo album included"]'::jsonb,
  true, true, 1
),
(
  'Event Photography',
  'event-photography',
  'Professional coverage for corporate events, parties, and celebrations.',
  'Photography',
  '["Up to 8 hours","Same-day previews","300+ edited photos","Online gallery"]'::jsonb,
  false, true, 2
),
(
  'Portrait Photography',
  'portrait-photography',
  'Studio and outdoor portraits that reveal personality and elegance.',
  'Photography',
  '["1-hour session","Multiple outfits","20 edited photos","Print rights"]'::jsonb,
  false, true, 3
),
(
  'Passport Photos',
  'passport-photos',
  'Government-compliant passport and ID photos in minutes.',
  'Photography',
  '["All sizes available","Instant printing","Compliance guaranteed","Digital copy"]'::jsonb,
  false, true, 4
),
(
  'Drone Photography',
  'drone-photography',
  'Stunning aerial photography and videography for any occasion.',
  'Photography',
  '["4K aerial video","50+ aerial photos","Licensed pilot","Same-day delivery"]'::jsonb,
  false, true, 5
),
(
  'Cinematic Videography',
  'videography',
  'Story-driven cinematic films for weddings, events, and brands.',
  'Videography',
  '["4K cinema cameras","Professional editing","Color grading","Highlight reel"]'::jsonb,
  true, true, 6
),
(
  'Digital Printing',
  'digital-printing',
  'High-quality digital printing for documents, photos, and marketing materials.',
  'Printing',
  '["Up to 12x18 size","Premium paper stocks","Fast turnaround","Bulk discounts"]'::jsonb,
  false, true, 7
),
(
  'Flex Printing',
  'flex-printing',
  'Large format flex printing for banners, hoardings, and signage.',
  'Printing',
  '["Any size available","UV-resistant ink","Indoor & outdoor","Installation service"]'::jsonb,
  false, true, 8
),
(
  'Business Cards',
  'business-cards',
  'Premium business cards that make a lasting impression.',
  'Printing',
  '["Foil stamping","Embossing","Spot UV","300gsm stock"]'::jsonb,
  false, true, 9
),
(
  'Invitation Cards',
  'invitation-cards',
  'Custom-designed invitation cards for weddings and special events.',
  'Printing',
  '["Custom design","Premium finishes","Envelope included","Any quantity"]'::jsonb,
  false, true, 10
),
(
  'Mug Printing',
  'mug-printing',
  'Personalized photo mugs — perfect gifts for any occasion.',
  'Printing',
  '["Dishwasher safe","Full-color print","11oz & 15oz","Bulk orders available"]'::jsonb,
  false, true, 11
),
(
  'T-Shirt Printing',
  'tshirt-printing',
  'Custom t-shirt printing with your designs, logos, or photos.',
  'Printing',
  '["Screen & DTF printing","Any fabric color","Bulk discounts","Wash-resistant"]'::jsonb,
  false, true, 12
),
(
  'Canvas Printing',
  'canvas-printing',
  'Gallery-quality canvas prints that turn photos into art.',
  'Printing',
  '["Museum-grade canvas","Custom sizes","Stretched & framed","75-year warranty"]'::jsonb,
  false, true, 13
),
(
  'Photo Frames',
  'photo-frames',
  'Handcrafted premium frames in wood, metal, and acrylic.',
  'Printing',
  '["Custom sizing","Premium materials","Acid-free matting","Wall-ready"]'::jsonb,
  false, true, 14
),
(
  'Logo Design',
  'logo-design',
  'Distinctive logo design that defines your brand identity.',
  'Graphic Design',
  '["3 concepts","Unlimited revisions","All file formats","Brand guidelines"]'::jsonb,
  false, true, 15
),
(
  'Social Media Design',
  'social-media-design',
  'Eye-catching social media graphics that grow your audience.',
  'Graphic Design',
  '["Monthly packages","All platforms","Custom templates","Content calendar"]'::jsonb,
  false, true, 16
),
(
  'Brand Identity',
  'brand-identity',
  'Complete brand identity systems from concept to execution.',
  'Graphic Design',
  '["Logo suite","Color palette","Typography guide","Brand book"]'::jsonb,
  true, true, 17
)
ON CONFLICT DO NOTHING;
