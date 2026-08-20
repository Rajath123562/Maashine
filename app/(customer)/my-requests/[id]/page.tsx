import { createClient } from '../../../lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import CancelBookingButton from '../../../../components/CancelBookingButton'
import RescheduleBookingButton from '../../../../components/RescheduleBookingButton'
import ReviewForm from '../../../../components/ReviewForm'
import ShareMaaShine from '../../../../components/ShareMaaShine'
import { CheckCircle2, Circle, Clock, CreditCard, Star, FileText } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  'Pending': 'bg-marigold/20 text-marigold',
  'Contacted': 'bg-blue-100 text-blue-700',
  'Confirmed': 'bg-lime/30 text-teal',
  'In Progress': 'bg-teal/20 text-teal',
  'Completed': 'bg-teal/30 text-teal',
  'Cancelled': 'bg-red-100 text-red-600',
  'Rejected': 'bg-red-100 text-red-600',
}

export default async function RequestDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: req } = await supabase
    .from('cleaning_requests')
    .select(`
      *, 
      services(name, description, price, pricing_type, includes),
      payments(amount, status, payment_method, transaction_reference),
      booking_status_history(old_status, new_status, created_at, note),
      reviews(id, rating, comment, created_at)
    `)
    .eq('id', id)
    .eq('customer_id', user?.id)
    .single()

  if (!req) return notFound()

  const service = req.services as any
  const payment = req.payments && req.payments.length > 0 ? req.payments[0] : null
  const history = req.booking_status_history || []
  const existingReview = req.reviews && req.reviews.length > 0 ? req.reviews[0] : null
  const isQuote = req.is_quote_request || service?.pricing_type === 'quote'
  const statusClass = STATUS_COLORS[req.status] || 'bg-sage/20 text-sage'

  // Sort history chronologically
  const sortedHistory = history.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

  return (
    <main className="min-h-screen bg-linen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard" className="text-teal font-bold hover:underline mb-8 inline-block">
          ← Back to Dashboard
        </Link>
        
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-sage/20">
          {/* Header */}
          <div className="bg-teal p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-white">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold mb-1">
                {isQuote ? 'Quote Request' : 'Booking Request'} #{req.request_number}
              </h1>
              <p className="font-mono opacity-80 text-sm">Submitted on {new Date(req.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className={`px-5 py-2 rounded-full font-bold text-sm shadow-md ${statusClass} bg-white`}>
              {req.status}
            </div>
          </div>
          
          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column: Service & Location */}
            <div className="lg:col-span-2 space-y-10">
              {/* Service Details */}
              <div>
                <h2 className="text-xl font-bold text-ink mb-6 border-b border-sage/20 pb-2">Service Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-sage text-sm font-semibold block mb-1">Service</span>
                    <span className="font-bold text-ink text-lg">{service?.name}</span>
                    {isQuote && (
                      <span className="mt-1 block bg-marigold/20 text-marigold text-xs font-bold w-max px-2 py-1 rounded-full">Quote Request</span>
                    )}
                  </div>
                  <div>
                    <span className="text-sage text-sm font-semibold block mb-1">Preferred Schedule</span>
                    <span className="text-ink font-medium">{req.preferred_date} at {req.preferred_time}</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <span className="text-sage text-xs font-bold block mb-2 uppercase tracking-wider">Estimated Price</span>
                  <span className="text-3xl font-extrabold text-marigold">
                    {isQuote ? 'Price on Request' : `₹${service?.price?.toLocaleString('en-IN')}`}
                  </span>
                </div>
              </div>

              {/* Property & Location */}
              <div>
                <h2 className="text-xl font-bold text-ink mb-6 border-b border-sage/20 pb-2">Property & Location</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-linen p-3 rounded-lg">
                    <span className="text-sage font-semibold text-sm">Property Type</span>
                    <span className="font-bold text-ink">{req.property_type}</span>
                  </div>
                  <div className="flex justify-between items-center bg-linen p-3 rounded-lg">
                    <span className="text-sage font-semibold text-sm">Rooms / Bathrooms</span>
                    <span className="font-bold text-ink">{req.rooms} / {req.bathrooms}</span>
                  </div>
                  {req.property_size && (
                    <div className="flex justify-between items-center bg-linen p-3 rounded-lg">
                      <span className="text-sage font-semibold text-sm">Property Size</span>
                      <span className="font-bold text-ink">{req.property_size}</span>
                    </div>
                  )}
                  <div className="mt-4 pt-2">
                    <span className="text-sage text-sm font-semibold block mb-2">Service Address</span>
                    <p className="text-ink leading-relaxed bg-linen/50 p-4 rounded-xl border border-slate-100">
                      {req.address}<br />
                      {req.landmark && <span className="block mt-1 text-sm text-sage">Near: {req.landmark}</span>}
                      {req.city}, {req.state} – {req.pincode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions: Invoice, Cancellation */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                {req.status === 'Completed' && (
                  <Link href={`/invoice/${req.id}`} className="inline-flex items-center gap-2 bg-slate-800 text-white font-bold px-6 py-3 rounded-xl hover:bg-slate-700 transition-colors">
                    <FileText size={18} /> View Invoice
                  </Link>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <RescheduleBookingButton 
                    requestId={req.id} 
                    currentStatus={req.status} 
                    originalDate={req.preferred_date} 
                    originalTime={req.preferred_time} 
                  />
                  <CancelBookingButton requestId={req.id} currentStatus={req.status} />
                </div>
              </div>
            </div>

            {/* Right Column: Payment, Review & Timeline */}
            <div className="space-y-10">
              {/* Review Section */}
              {req.status === 'Completed' && (
                <div>
                  <h2 className="text-xl font-bold text-ink mb-6 border-b border-sage/20 pb-2 flex items-center gap-2">
                    <Star className="text-teal" size={20} /> Feedback
                  </h2>
                  
                  {existingReview ? (
                    <div className="bg-linen p-5 rounded-xl border border-slate-200">
                      <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={16} className={existingReview.rating >= star ? 'fill-marigold text-marigold' : 'text-slate-300'} />
                        ))}
                      </div>
                      {existingReview.comment && <p className="text-sm text-ink italic mt-2">"{existingReview.comment}"</p>}
                      <p className="text-xs text-sage mt-2">Reviewed on {new Date(existingReview.created_at).toLocaleDateString('en-IN')}</p>
                    </div>
                  ) : (
                    <ReviewForm requestId={req.id} />
                  )}
                </div>
              )}
              {/* Payment Status */}
              {!isQuote && (
                <div>
                  <h2 className="text-xl font-bold text-ink mb-6 border-b border-sage/20 pb-2 flex items-center gap-2">
                    <CreditCard className="text-teal" size={20} /> Payment
                  </h2>
                  
                  {payment ? (
                    <div className="bg-linen p-5 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
                        <span className="text-sage text-sm font-semibold">Status</span>
                        <span className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full ${
                          payment.status === 'Paid' ? 'bg-teal/20 text-teal' :
                          payment.status === 'Verification Pending' ? 'bg-marigold/20 text-marigold' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {payment.status}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sage text-sm">Amount</span>
                          <span className="font-bold text-ink">₹{payment.amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sage text-sm">Method</span>
                          <span className="font-bold text-ink">{payment.payment_method}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sage text-sm">Reference</span>
                          <span className="font-mono text-sm text-ink">{payment.transaction_reference}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50 p-5 rounded-xl border border-red-100 text-center">
                      <p className="text-red-600 font-bold text-sm mb-1">No Payment Found</p>
                      <p className="text-red-500 text-xs">Payment details were not submitted for this request.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Status Timeline */}
              <div>
                <h2 className="text-xl font-bold text-ink mb-6 border-b border-sage/20 pb-2 flex items-center gap-2">
                  <Clock className="text-teal" size={20} /> Timeline
                </h2>
                
                <div className="relative pl-4 border-l-2 border-slate-200 space-y-6">
                  {/* Initial Submission */}
                  <div className="relative">
                    <CheckCircle2 size={16} className="absolute -left-[25px] bg-white text-teal" />
                    <div>
                      <p className="font-bold text-sm text-ink">Request Submitted</p>
                      <p className="text-xs text-sage">{new Date(req.created_at).toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  {/* History Items */}
                  {sortedHistory.map((event: any, idx: number) => (
                    <div key={idx} className="relative">
                      <Circle size={12} className="absolute -left-[23px] top-1 bg-white text-teal fill-teal" />
                      <div>
                        <p className="font-bold text-sm text-ink">
                          Changed to <span className="text-teal">{event.new_status}</span>
                        </p>
                        <p className="text-xs text-sage">{new Date(event.created_at).toLocaleString('en-IN')}</p>
                        {event.note && (
                          <p className="text-xs text-slate-500 mt-1 italic">{event.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Refer MaaShine to friends (Shown when completed) */}
          {req.status === 'Completed' && (
            <div className="px-6 md:px-8 pb-8">
              <ShareMaaShine
                title="MaaShine Cleaning Services | Mysore"
                text="I just used MaaShine for cleaning in Mysore and had a great experience! Highly recommend their service:"
              />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
