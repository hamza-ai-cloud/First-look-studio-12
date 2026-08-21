INSERT INTO public.branches
  (name, address, phone, email, hours, sort_order, is_active)
VALUES
(
  'First Look Studio',
  '36 Sector 2-C-II, Butt Chowk, College Rd, Near NADRA Office, Block 2, Township Sector C-2, Lahore 54600, Pakistan',
  '+923218282444',
  'helplinestudio@gmail.com',
  NULL,
  0,
  true
),
(
  'First Look Studio 2',
  'Flat No.149, N, model, Model Town Extension Block N Central Flats town, Lahore, 54770, Pakistan',
  '+923052288884',
  'helplinestudio@gmail.com',
  NULL,
  1,
  true
),
(
  'First Look Studio 3',
  '7-B, Faisal Garden, University of Management & Technology Rd, Block C2 Block C 2 Phase 1 Johar Town, Lahore, 54000, Pakistan',
  '+923222549513',
  'firstlookkashif@gmail.com',
  NULL,
  2,
  true
)
ON CONFLICT DO NOTHING;
