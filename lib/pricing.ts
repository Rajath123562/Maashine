import { z } from 'zod';

export type Service = {
  id: string;
  slug: string;
  price: number;
  pricing_type: 'fixed' | 'conditional' | 'quote';
  pricing_conditions?: Record<string, number | 'quote'> | null;
};

export type PricingInput = {
  property_size?: string;
  property_condition?: string;
};

export type PricingResult = {
  amount: number | null; // null means 'Price on Request'
  isQuote: boolean;
};

export function calculatePrice(service: Service, input: PricingInput): PricingResult {
  if (service.pricing_type === 'quote') {
    return { amount: null, isQuote: true };
  }

  if (service.pricing_type === 'fixed') {
    return { amount: service.price, isQuote: false };
  }

  // Handle conditional pricing
  if (service.pricing_type === 'conditional' && service.pricing_conditions) {
    if (service.slug === 'home-deep-cleaning') {
      if (input.property_size === 'Other' || !input.property_size || !input.property_condition) {
        return { amount: null, isQuote: true };
      }
      
      const conditionKey = `${input.property_size}_${input.property_condition === 'New / Unoccupied House' ? 'new' : 'living'}`;
      const conditionValue = service.pricing_conditions[conditionKey];
      
      if (conditionValue === 'quote' || typeof conditionValue !== 'number') {
        return { amount: null, isQuote: true };
      }
      
      return { amount: conditionValue, isQuote: false };
    }

    if (service.slug === 'window-glass-cleaning') {
      const conditionValue = service.pricing_conditions['normal'];
      if (typeof conditionValue === 'number') {
        return { amount: conditionValue, isQuote: false };
      }
      return { amount: service.price, isQuote: false };
    }
  }

  // Fallback to base price
  return { amount: service.price, isQuote: false };
}

// Zod schemas for booking validation
export const BookingSchema = z.object({
  service_id: z.string().uuid(),
  property_type: z.string().min(1),
  rooms: z.coerce.number().min(0).default(0),
  bathrooms: z.coerce.number().min(0).default(0),
  property_size: z.string().optional(),
  property_condition: z.string().optional(),
  preferred_date: z.string().min(10), // YYYY-MM-DD
  preferred_time: z.string().min(4), // HH:MM
  alternative_date: z.string().optional(),
  alternative_time: z.string().optional(),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().min(5),
  landmark: z.string().optional(),
  additional_notes: z.string().optional(),
  is_quote_request: z.boolean().default(false)
});
