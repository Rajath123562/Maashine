import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  if (!supabaseKey || !supabaseUrl) {
    return NextResponse.json({ error: 'Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL in .env.local' }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  // Step 1: Verify if the services table exists by attempting a query
  const { error: tableCheck } = await supabase.from('services').select('id').limit(1)

  if (tableCheck && tableCheck.message.includes('does not exist')) {
    return NextResponse.json({
      success: false,
      error: 'The "services" table does not exist yet.',
      instructions: [
        'Go to your Supabase Dashboard → SQL Editor',
        'Copy the ENTIRE contents of supabase/migrations/20260817000000_schema.sql',
        'Paste it into the SQL Editor and click "Run"',
        'Then come back and visit /api/seed again'
      ]
    }, { status: 400 })
  }

  // Step 2: Clear existing services
  const { error: deleteError } = await supabase.from('services').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (deleteError) {
    return NextResponse.json({ success: false, error: 'Failed to clear existing services', details: deleteError }, { status: 500 })
  }

  // Step 3: Insert the exact 9 MaaShine services
  const servicesToSeed = [
    {
      name: 'Home Deep Cleaning',
      slug: 'home-deep-cleaning',
      category: 'Residential',
      description: 'A complete and thorough cleaning service covering major accessible areas of the home. Removes accumulated dust, dirt, stains, grease, and general buildup.',
      price: 6500,
      pricing_type: 'conditional',
      pricing_conditions: {"20x30_new": 6500, "20x30_living": 7500, "30x40_new": 8500, "30x40_living": 9500},
      includes: ["Bedrooms", "Living room", "Kitchen", "Bathrooms", "Toilets", "Floors", "Doors", "Accessible windows", "Dust removal", "Surface cleaning", "General detailed cleaning"],
      active: true,
      display_order: 1
    },
    {
      name: 'Kitchen Cleaning',
      slug: 'kitchen-cleaning',
      category: 'Residential',
      description: 'Deep cleaning of your kitchen to remove grease, grime, and buildup from all surfaces.',
      price: 2000,
      pricing_type: 'fixed',
      pricing_conditions: null,
      includes: ["Platform cleaning", "Backsplash cleaning", "Sink cleaning", "Stove-area cleaning", "Cabinet exterior cleaning", "Floor cleaning", "Grease removal", "General surface cleaning"],
      active: true,
      display_order: 2
    },
    {
      name: 'Bathroom & Toilet Cleaning',
      slug: 'bathroom-toilet-cleaning',
      category: 'Residential',
      description: 'Thorough sanitization and cleaning of bathrooms and toilets.',
      price: 850,
      pricing_type: 'fixed',
      pricing_conditions: null,
      includes: ["Toilet cleaning", "Washbasin cleaning", "Floor cleaning", "Tile cleaning", "Shower-area cleaning", "Surface cleaning", "Dirt/buildup removal"],
      active: true,
      display_order: 3
    },
    {
      name: 'Sofa Cleaning',
      slug: 'sofa-cleaning',
      category: 'Residential',
      description: 'Deep fabric cleaning and stain removal for sofas.',
      price: 1800,
      pricing_type: 'fixed',
      pricing_conditions: null,
      includes: ["Dust removal", "Vacuum cleaning", "Fabric cleaning", "Stain treatment", "Deep cleaning", "Odour treatment"],
      active: true,
      display_order: 4
    },
    {
      name: 'Mattress Cleaning',
      slug: 'mattress-cleaning',
      category: 'Residential',
      description: 'Deep cleaning and sanitization for mattresses.',
      price: 650,
      pricing_type: 'fixed',
      pricing_conditions: null,
      includes: ["Dust extraction", "Vacuum cleaning", "Stain treatment", "Deep cleaning", "Odour treatment"],
      active: true,
      display_order: 5
    },
    {
      name: 'Office Cleaning',
      slug: 'office-cleaning',
      category: 'Commercial',
      description: 'Professional cleaning for commercial offices. Depends on site size, number of areas, cleaning requirements, and frequency.',
      price: 0,
      pricing_type: 'quote',
      pricing_conditions: null,
      includes: [],
      active: true,
      display_order: 6
    },
    {
      name: 'Apartment / Common Area Cleaning',
      slug: 'apartment-common-area-cleaning',
      category: 'Commercial',
      description: 'Cleaning for apartment complexes and shared common areas. Depends on site size and cleaning requirements.',
      price: 0,
      pricing_type: 'quote',
      pricing_conditions: null,
      includes: [],
      active: true,
      display_order: 7
    },
    {
      name: 'Window & Glass Cleaning',
      slug: 'window-glass-cleaning',
      category: 'Specialized',
      description: 'Professional glass and window cleaning. Mesh cleaning is included.',
      price: 650,
      pricing_type: 'conditional',
      pricing_conditions: {"normal": 650, "large": 850},
      includes: ["Glass cleaning", "Window-frame cleaning", "Mesh cleaning", "Accessible track cleaning", "Dust removal", "Stain removal"],
      active: true,
      display_order: 8
    },
    {
      name: 'Floor Cleaning',
      slug: 'floor-cleaning',
      category: 'Specialized',
      description: 'Deep floor cleaning suitable for tiles, marble, granite, and other hard flooring. Depends on floor area, flooring type, and cleaning requirements.',
      price: 0,
      pricing_type: 'quote',
      pricing_conditions: null,
      includes: [],
      active: true,
      display_order: 9
    }
  ]

  const { data, error: insertError } = await supabase.from('services').insert(servicesToSeed).select('id, name')

  if (insertError) {
    return NextResponse.json({ success: false, error: 'Failed to insert services', details: insertError }, { status: 500 })
  }

  return NextResponse.json({ 
    success: true, 
    message: `Successfully seeded ${data.length} MaaShine services!`,
    services: data.map(s => s.name)
  })
}
