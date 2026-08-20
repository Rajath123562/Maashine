import { createClient } from '../../../lib/supabase/server'
import Link from 'next/link'
import { requireAdmin } from '../../../../lib/requireAdmin'
import PaymentVerifier from '../../../../components/PaymentVerifier'
import { IndianRupee, Image as ImageIcon } from 'lucide-react'

export default async function AdminPaymentsPage() {
  await requireAdmin()
  const supabase = await createClient()
  
  // Fetch payments with their associated cleaning requests and customer details
  const { data: payments } = await supabase
    .from('payments')
    .select('*, cleaning_requests(request_number, status, services(name)), profiles(full_name, phone)')
    .order('created_at', { ascending: false })

  // Generate signed URLs for screenshots
  const paymentsWithUrls = await Promise.all((payments || []).map(async (payment) => {
    let screenshotUrl = null
    if (payment.screenshot_path) {
      const { data } = await supabase.storage.from('payment_screenshots').createSignedUrl(payment.screenshot_path, 3600)
      screenshotUrl = data?.signedUrl
    }
    return { ...payment, screenshotUrl }
  }))

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-4xl font-extrabold text-ink mb-2">Payment Verification</h1>
        <p className="text-sage mb-8">Review and verify manual UPI/GPay payments submitted by customers.</p>

        {(!payments || payments.length === 0) && (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <p className="text-sage text-xl">No payments have been submitted yet.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paymentsWithUrls.map(payment => {
            const customer = payment.profiles as any
            const request = payment.cleaning_requests as any
            const serviceName = request?.services?.name || 'Unknown Service'
            const isPending = payment.status === 'Verification Pending'
            const screenshotUrl = payment.screenshotUrl

            return (
              <div key={payment.id} className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${isPending ? 'border-marigold/50' : 'border-slate-200'}`}>
                
                {/* Header */}
                <div className={`px-5 py-3 flex items-center justify-between ${isPending ? 'bg-marigold/10' : 'bg-slate-50'} border-b border-slate-100`}>
                  <div className="font-bold text-ink">#{request?.request_number || 'N/A'}</div>
                  <span className={`text-[10px] px-3 py-1 rounded-full uppercase tracking-wider font-extrabold ${
                    isPending ? 'bg-marigold/20 text-marigold' : 
                    payment.status === 'Paid' ? 'bg-teal/20 text-teal' : 'bg-red-100 text-red-600'
                  }`}>
                    {payment.status}
                  </span>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-ink">{customer?.full_name || 'Unknown Customer'}</h3>
                    <p className="text-sm text-sage">{customer?.phone || 'No phone'}</p>
                    <p className="text-sm font-semibold text-teal mt-1">{serviceName}</p>
                  </div>

                  <div className="bg-linen/50 p-4 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-sage font-semibold">Amount</span>
                      <span className="text-lg font-extrabold text-ink flex items-center">
                        <IndianRupee size={16} className="mr-1"/>
                        {payment.amount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-sage font-semibold">Method</span>
                      <span className="text-sm font-bold text-ink">{payment.payment_method}</span>
                    </div>
                    <div className="flex justify-between items-start border-t border-slate-200 pt-2 mt-2">
                      <span className="text-sm text-sage font-semibold">UTR/Ref</span>
                      <span className="text-sm font-mono font-bold text-ink text-right break-all ml-4">
                        {payment.transaction_reference}
                      </span>
                    </div>
                  </div>

                  {screenshotUrl && (
                    <div className="mt-2">
                      <a href={screenshotUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 text-sm font-bold text-teal bg-teal/5 p-2 rounded-lg hover:bg-teal/10 transition-colors">
                        <ImageIcon size={16} />
                        View Screenshot
                      </a>
                    </div>
                  )}

                  <PaymentVerifier paymentId={payment.id} status={payment.status} expectedAmount={payment.amount} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
  )
}
