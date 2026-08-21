INSERT INTO public.gallery
(title, image_url, category, aspect_ratio, description, is_featured, is_active, sort_order)
SELECT * FROM (VALUES
('Wedding Reflection','https://images.pexels.com/photos/6047175/pexels-photo-6047175.jpeg?auto=compress&cs=tinysrgb&w=940&h=650','Weddings','landscape','Bride in wedding gown looking at her reflection in an ornate mirror.',true,true,1),
('Wedding Portrait','https://images.pexels.com/photos/38627016/pexels-photo-38627016.jpeg?auto=compress&cs=tinysrgb&w=940&h=650','Weddings','landscape','Black and white portrait of a joyful bride and groom.',true,true,2),
('Studio Fashion','https://images.pexels.com/photos/37233404/pexels-photo-37233404.jpeg?auto=compress&cs=tinysrgb&w=940&h=650','Fashion','landscape','Stylish studio portrait with dramatic lighting.',false,true,3),
('Live Event','https://images.pexels.com/photos/13230484/pexels-photo-13230484.jpeg?auto=compress&cs=tinysrgb&w=940&h=650','Events','landscape','Night concert scene with colorful stage lighting.',true,true,4),
('Fashion Portrait','https://images.pexels.com/photos/3626313/pexels-photo-3626313.jpeg?auto=compress&cs=tinysrgb&w=940&h=650','Fashion','landscape','Fashion portrait with a warm editorial style.',false,true,5),
('Custom Printing','https://images.pexels.com/photos/3493047/pexels-photo-3493047.jpeg?auto=compress&cs=tinysrgb&w=940&h=650','Commercial','landscape','Custom printed products and branded materials.',false,true,6),
('Photography Collection','https://images.pexels.com/photos/3024995/pexels-photo-3024995.jpeg?auto=compress&cs=tinysrgb&w=940&h=650','Commercial','landscape','Aesthetic collection of vintage-style photographs.',false,true,7),
('Premium Business Cards','https://images.pexels.com/photos/8066713/pexels-photo-8066713.png?auto=compress&cs=tinysrgb&w=940&h=650','Commercial','landscape','Premium business cards and printed branding materials.',false,true,8)
) AS seed(title,image_url,category,aspect_ratio,description,is_featured,is_active,sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM public.gallery g WHERE g.title = seed.title
);
