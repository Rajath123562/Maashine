-- Seed data for MaaShine Services - Complete V2 Architecture

-- Clear existing dummy services (if any)
DELETE FROM public.services;

-- Insert the exactly 9 required services based on the specification
INSERT INTO public.services (id, name, slug, category, description, price, pricing_type, pricing_conditions, includes, display_order) VALUES
-- 1. Home Deep Cleaning
(
  '9f9a2f3a-7d4d-4c3e-8b6b-1c5c6e7f8d9a',
  'Home Deep Cleaning',
  'home-deep-cleaning',
  'Residential',
  'Complete and thorough cleaning of the home, covering the major accessible areas of the property to remove accumulated dust, dirt, stains, grease, and general buildup.',
  6500,
  'conditional',
  '{"20x30_new": 6500, "20x30_living": 7500, "30x40_new": 8500, "30x40_living": 9500}',
  '["Bedrooms", "Living room", "Kitchen", "Bathrooms", "Toilets", "Floors", "Doors", "Accessible windows", "Dust removal", "Surface cleaning", "General detailed cleaning"]',
  1
),
-- 2. Kitchen Cleaning
(
  '8d8c2e2f-5b4c-4d3b-9a7a-0d6e5d4f3e2b',
  'Kitchen Cleaning',
  'kitchen-cleaning',
  'Residential',
  'Deep cleaning of your kitchen to remove grease and grime.',
  2000,
  'fixed',
  'null',
  '["Platform cleaning", "Backsplash cleaning", "Sink cleaning", "Stove-area cleaning", "Cabinet exterior cleaning", "Floor cleaning", "Grease removal", "General surface cleaning"]',
  2
),
-- 3. Bathroom & Toilet Cleaning
(
  '7c7b1d1e-4a3b-4c2a-8b8a-9c5d4e3f2d1c',
  'Bathroom & Toilet Cleaning',
  'bathroom-toilet-cleaning',
  'Residential',
  'Thorough sanitization and cleaning of bathrooms and toilets.',
  850,
  'fixed',
  'null',
  '["Toilet cleaning", "Washbasin cleaning", "Floor cleaning", "Tile cleaning", "Shower-area cleaning", "Surface cleaning", "Dirt/buildup removal"]',
  3
),
-- 4. Sofa Cleaning
(
  '6b6a0c0d-3c2a-4b1a-7a7c-8b4c3d2e1c0b',
  'Sofa Cleaning',
  'sofa-cleaning',
  'Residential',
  'Deep fabric cleaning and stain removal for sofas.',
  1800,
  'fixed',
  'null',
  '["Dust removal", "Vacuum cleaning", "Fabric cleaning", "Stain treatment", "Deep cleaning", "Odour treatment"]',
  4
),
-- 5. Mattress Cleaning
(
  '5a5c9b9c-2c1c-4a0c-6c6c-7a3b2c1d0b9a',
  'Mattress Cleaning',
  'mattress-cleaning',
  'Residential',
  'Deep cleaning and sanitization for mattresses.',
  650,
  'fixed',
  'null',
  '["Dust extraction", "Vacuum cleaning", "Stain treatment", "Deep cleaning", "Odour treatment"]',
  5
),
-- 6. Office Cleaning
(
  '4c4c8a8b-1c0c-3c9c-5c5c-6c2a1b0c9a8c',
  'Office Cleaning',
  'office-cleaning',
  'Commercial',
  'Professional cleaning for commercial offices.',
  0,
  'quote',
  'null',
  '[]',
  6
),
-- 7. Apartment / Common Area Cleaning
(
  '3c3c7c7a-0c9c-2c8c-4c4c-5c1c0a9b8c7c',
  'Apartment / Common Area Cleaning',
  'apartment-common-area-cleaning',
  'Commercial',
  'Cleaning for apartment complexes and shared common areas.',
  0,
  'quote',
  'null',
  '[]',
  7
),
-- 8. Window & Glass Cleaning
(
  '2c2c6c6c-9c8c-1c7c-3c3c-4c0c9c8a7c6c',
  'Window & Glass Cleaning',
  'window-glass-cleaning',
  'Specialized',
  'Professional glass and window cleaning.',
  650,
  'conditional',
  '{"normal": 650, "large": 850}',
  '["Glass cleaning", "Window-frame cleaning", "Mesh cleaning", "Accessible track cleaning", "Dust removal", "Stain removal"]',
  8
),
-- 9. Floor Cleaning
(
  '1c1c5c5c-8c7c-0c6c-2c2c-3c9c8c7c6c5c',
  'Floor Cleaning',
  'floor-cleaning',
  'Specialized',
  'Deep floor cleaning for tiles, marble, granite, etc.',
  0,
  'quote',
  'null',
  '[]',
  9
);
