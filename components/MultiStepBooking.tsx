'use client'
import { useState } from 'react';
import { submitBookingRequest } from '../app/actions/booking';
import { useRouter } from 'next/navigation';
import { calculatePrice } from '../lib/pricing';
import { createClient } from '../app/lib/supabase/client';

export default function MultiStepBooking({ services, profile, businessSettings }: { services: any[], profile: any, businessSettings: any }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    service_id: '',
    property_type: 'Apartment',
    rooms: '1',
    bathrooms: '1',
    property_size: '20x30',
    property_condition: 'New / Unoccupied House',
    preferred_date: '',
    preferred_time: '',
    alternative_date: '',
    alternative_time: '',
    address: profile?.address || '',
    city: profile?.city || '',
    state: profile?.state || '',
    pincode: profile?.pincode || '',
    landmark: '',
    additional_notes: '',
    transaction_reference: ''
  });
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);

  const updateForm = (key: string, value: string) => setFormData(prev => ({ ...prev, [key]: value }));
  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const selectedService = services.find(s => s.id === formData.service_id);
  const isQuoteService = selectedService?.pricing_type === 'quote';
  
  // Calculate Dynamic Price using centralized engine
  const priceResult = calculatePrice(selectedService as any || { pricing_type: 'fixed', price: 0 }, {
    property_size: formData.property_size,
    property_condition: formData.property_condition
  });
  
  const currentPrice = priceResult.amount !== null ? priceResult.amount : 'Price on Request';
  const needsQuote = priceResult.isQuote;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!needsQuote && !formData.transaction_reference) {
        throw new Error('Please enter the UPI Transaction or UTR number.');
      }

      let screenshot_path = null;
      if (screenshotFile) {
        const supabase = createClient();
        const fileExt = screenshotFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('payment_screenshots')
          .upload(`public/${fileName}`, screenshotFile);
          
        if (uploadError) {
          throw new Error('Failed to upload screenshot. Please try again.');
        }
        screenshot_path = data.path;
      }

      const submissionData = {
        ...formData,
        is_quote_request: needsQuote,
        screenshot_path
      };
      
      const result = await submitBookingRequest(submissionData);
      if (result.success) {
        router.push(`/my-requests/${result.requestId}`);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-sage/20">
      {/* Progress Bar */}
      <div className="flex border-b border-sage/20 bg-linen/50">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className={`flex-1 h-2 ${step >= i ? 'bg-teal' : 'bg-sage/20'} transition-colors`} />
        ))}
      </div>

      <div className="p-8">
        {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6">{error}</div>}

        <form onSubmit={(e) => { e.preventDefault(); if(step === 6) handleSubmit(e); else nextStep(); }}>
          
          {/* STEP 1: SERVICE */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h2 className="text-2xl font-bold text-ink mb-6">Step 1: Choose Service</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map(s => (
                  <label key={s.id} className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${formData.service_id === s.id ? 'border-teal bg-teal/5' : 'border-sage/30 hover:border-teal/50'}`}>
                    <input type="radio" name="service" value={s.id} className="hidden" required checked={formData.service_id === s.id} onChange={(e) => updateForm('service_id', e.target.value)} />
                    <h3 className="font-bold text-ink">{s.name}</h3>
                    <p className="text-sm text-sage mb-2 line-clamp-2">{s.description}</p>
                    <span className="font-extrabold text-marigold">
                      {s.pricing_type === 'quote' ? 'Price on Request' : 
                       s.pricing_type === 'conditional' ? `Starts from ₹${s.price}` : `₹${s.price}`}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: PROPERTY */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h2 className="text-2xl font-bold text-ink mb-6">Step 2: Property Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Property Type</label>
                  <select required className="w-full border border-sage/40 rounded-xl p-3" value={formData.property_type} onChange={e => updateForm('property_type', e.target.value)}>
                    <option>Apartment</option><option>House</option><option>Villa</option><option>Office</option>
                  </select>
                </div>
                {selectedService?.slug === 'home-deep-cleaning' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Property Size</label>
                      <select required className="w-full border border-sage/40 rounded-xl p-3" value={formData.property_size} onChange={e => updateForm('property_size', e.target.value)}>
                        <option value="20x30">20 × 30</option>
                        <option value="30x40">30 × 40</option>
                        <option value="Other">Other / Custom Size</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold mb-2">Property Condition</label>
                      <select required className="w-full border border-sage/40 rounded-xl p-3" value={formData.property_condition} onChange={e => updateForm('property_condition', e.target.value)}>
                        <option>New / Unoccupied House</option>
                        <option>Living / Occupied House</option>
                      </select>
                    </div>
                  </>
                )}
                <div className={selectedService?.slug === 'home-deep-cleaning' ? 'hidden' : 'block'}>
                  <label className="block text-sm font-semibold mb-2">Approx. Area / Size</label>
                  <input type="text" className="w-full border border-sage/40 rounded-xl p-3 placeholder:text-sage/50" placeholder="e.g. 1000 sq ft" value={formData.property_size} onChange={e => updateForm('property_size', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Bedrooms/Rooms</label>
                  <input type="number" required min="1" className="w-full border border-sage/40 rounded-xl p-3" value={formData.rooms} onChange={e => updateForm('rooms', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Bathrooms</label>
                  <input type="number" required min="0" className="w-full border border-sage/40 rounded-xl p-3" value={formData.bathrooms} onChange={e => updateForm('bathrooms', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SCHEDULE */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h2 className="text-2xl font-bold text-ink mb-2">Step 3: Schedule</h2>
              <p className="text-sm text-sage mb-6">Please note that dates are a preference and subject to confirmation.</p>
              
              <div className="bg-linen p-6 rounded-2xl border border-sage/20 space-y-4">
                <h3 className="font-bold text-teal border-b border-sage/20 pb-2">Preferred Schedule</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Date</label>
                    <input type="date" required className="w-full border border-sage/40 rounded-xl p-3" value={formData.preferred_date} onChange={e => updateForm('preferred_date', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Time</label>
                    <input type="time" required className="w-full border border-sage/40 rounded-xl p-3" value={formData.preferred_time} onChange={e => updateForm('preferred_time', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-sage/20 space-y-4">
                <h3 className="font-bold text-sage border-b border-sage/20 pb-2">Alternative Schedule (Optional)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Date</label>
                    <input type="date" className="w-full border border-sage/40 rounded-xl p-3" value={formData.alternative_date} onChange={e => updateForm('alternative_date', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Time</label>
                    <input type="time" className="w-full border border-sage/40 rounded-xl p-3" value={formData.alternative_time} onChange={e => updateForm('alternative_time', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ADDRESS */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h2 className="text-2xl font-bold text-ink mb-6">Step 4: Location</h2>
              <div>
                <label className="block text-sm font-semibold mb-2">Street Address</label>
                <textarea required rows={3} className="w-full border border-sage/40 rounded-xl p-3" value={formData.address} onChange={e => updateForm('address', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">City</label>
                  <input required className="w-full border border-sage/40 rounded-xl p-3" value={formData.city} onChange={e => updateForm('city', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">State</label>
                  <input required className="w-full border border-sage/40 rounded-xl p-3" value={formData.state} onChange={e => updateForm('state', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Pincode</label>
                  <input required className="w-full border border-sage/40 rounded-xl p-3" value={formData.pincode} onChange={e => updateForm('pincode', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Landmark</label>
                  <input className="w-full border border-sage/40 rounded-xl p-3" value={formData.landmark} onChange={e => updateForm('landmark', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: NOTES */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h2 className="text-2xl font-bold text-ink mb-6">Step 5: Additional Details</h2>
              <div>
                <label className="block text-sm font-semibold mb-2">Special Instructions or Requirements</label>
                <textarea rows={5} className="w-full border border-sage/40 rounded-xl p-3 placeholder:text-sage/60" placeholder="e.g. Please bring eco-friendly supplies, key is under the mat, specific stains to remove..." value={formData.additional_notes} onChange={e => updateForm('additional_notes', e.target.value)} />
              </div>
            </div>
          )}

          {/* STEP 6: REVIEW */}
          {step === 6 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h2 className="text-2xl font-bold text-ink mb-6">
                {needsQuote ? 'Step 6: Review Quote Request' : 'Step 6: Review & Payment'}
              </h2>
              
              <div className="bg-linen p-6 rounded-2xl border border-sage/20 space-y-4">
                <div className="flex justify-between border-b border-sage/20 pb-2">
                  <span className="font-semibold text-sage">Service</span>
                  <span className="font-bold text-ink">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between border-b border-sage/20 pb-2">
                  <span className="font-semibold text-sage">Estimated Price</span>
                  <span className="font-extrabold text-marigold text-lg">
                    {currentPrice === 'Price on Request' ? 'Price on Request' : `₹${currentPrice}`}
                  </span>
                </div>
                {selectedService?.slug === 'home-deep-cleaning' && currentPrice === 9500 && (
                  <div className="text-xs text-right text-sage -mt-2 pb-2 border-b border-sage/20">
                    *Negotiable based on site requirements
                  </div>
                )}
                <div className="flex justify-between border-b border-sage/20 pb-2">
                  <span className="font-semibold text-sage">Property</span>
                  <span className="font-bold text-ink text-right">
                    {formData.property_type} <br/> 
                    {selectedService?.slug === 'home-deep-cleaning' ? `${formData.property_size}, ${formData.property_condition}` : formData.property_size}
                  </span>
                </div>
                <div className="flex justify-between border-b border-sage/20 pb-2">
                  <span className="font-semibold text-sage">Schedule</span>
                  <span className="font-bold text-ink">{formData.preferred_date} at {formData.preferred_time}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="font-semibold text-sage">Location</span>
                  <span className="font-bold text-ink text-right">{formData.address}, {formData.city}</span>
                </div>
              </div>

              {/* Conditional Payment Section */}
              {!needsQuote ? (
                <div className="bg-white p-6 rounded-2xl border border-teal/30 space-y-6 text-center">
                  <div>
                    <h3 className="font-bold text-ink text-xl">Complete Payment</h3>
                    <p className="text-sm text-sage mt-1">Amount Payable: <span className="font-extrabold text-marigold text-lg">₹{currentPrice}</span></p>
                  </div>

                  <p className="text-sm text-sage">Scan the QR code using Google Pay, PhonePe, Paytm or another UPI app.</p>
                  
                  <div className="flex justify-center">
                    <div className="w-56 h-56 rounded-2xl border-2 border-sage/20 overflow-hidden relative shadow-inner">
                      <img 
                        src="/gpay-qr.jpg" 
                        alt="GPay QR Code" 
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[125%] max-w-none h-auto" 
                      />
                    </div>
                  </div>
                  
                  <div className="text-sm font-semibold text-ink">UPI ID: {businessSettings?.upi_id || 'yourbusiness@upi'}</div>

                  <div className="border-t border-sage/20 pt-6 space-y-4 text-left">
                    <h4 className="font-bold text-ink text-center">After completing payment:</h4>
                    
                    <div>
                      <label className="block text-sm font-semibold mb-2">Transaction / UTR Number <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        required 
                        className="w-full border border-sage/40 rounded-xl p-3" 
                        placeholder="e.g. 123456789012"
                        value={formData.transaction_reference} 
                        onChange={e => updateForm('transaction_reference', e.target.value)} 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Payment Screenshot (Optional)</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        className="w-full border border-sage/40 rounded-xl p-2 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-teal/10 file:text-teal hover:file:bg-teal/20" 
                        onChange={e => setScreenshotFile(e.target.files?.[0] || null)}
                      />
                    </div>

                    <div className="flex items-start gap-3 bg-linen/50 p-4 rounded-xl border border-sage/20">
                      <input type="checkbox" required className="mt-1 w-4 h-4 rounded text-teal" />
                      <p className="text-sm text-ink leading-tight">I confirm that I have completed the payment of ₹{currentPrice} using the above UPI details.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-2xl border border-sage/20 text-center">
                  <h3 className="font-bold text-ink text-lg mb-2">Requesting a Custom Quote</h3>
                  <p className="text-sm text-sage">Because of the specific requirements of your request, our team will review the details and contact you with a customized quotation.</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-10 pt-6 border-t border-sage/20">
            {step > 1 ? (
              <button type="button" onClick={prevStep} className="px-6 py-3 font-bold text-sage hover:text-ink transition-colors">
                &larr; Back
              </button>
            ) : <div />}
            
            {step < 6 ? (
              <button type="submit" className="bg-teal text-white font-bold py-3 px-8 rounded-xl hover:bg-teal/90 transition-colors shadow-md">
                Next Step
              </button>
            ) : (
              <button type="submit" disabled={loading} className="bg-marigold text-ink font-bold py-3 px-8 rounded-xl hover:bg-lime transition-colors shadow-md disabled:opacity-50">
                {loading ? 'Submitting...' : needsQuote ? 'Request Quote' : 'Submit Request'}
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
