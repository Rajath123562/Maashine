import { createClient } from '../../../lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import PrintButton from '../../../../components/PrintButton'

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }
  
  // Try to find the invoice
  const { data: invoice } = await supabase
    .from('invoices')
    .select('*, cleaning_requests(*, services(name, price), profiles(full_name, email, phone, address, city, state, pincode))')
    .eq('request_id', id)
    .eq('customer_id', user.id)
    .single()

  if (!invoice) {
    // Check if request exists and is completed to auto-generate one
    const { data: request } = await supabase
      .from('cleaning_requests')
      .select('*, services(name, price), profiles(*)')
      .eq('id', id)
      .eq('customer_id', user.id)
      .single()
      
    if (!request || request.status !== 'Completed') {
      return notFound()
    }
    
    // Auto-generate invoice
    const newInvoiceNumber = `INV-${new Date().getFullYear()}${String(new Date().getMonth()+1).padStart(2, '0')}-${Math.floor(Math.random() * 10000)}`
    
    const { error } = await supabase.from('invoices').insert({
      request_id: request.id,
      customer_id: request.customer_id,
      invoice_number: newInvoiceNumber,
      amount: request.services?.price || 0,
      status: 'issued'
    })
    
    if (error) throw new Error(error.message)
    
    // Refresh to get the new invoice
    redirect(`/invoice/${id}`)
  }

  const req = invoice.cleaning_requests as any
  const profile = req.profiles as any
  const service = req.services as any

  return (
    <div className="bg-white min-h-screen p-8 text-ink print:p-0 font-sans">
      <div className="max-w-3xl mx-auto border border-slate-200 rounded-2xl shadow-sm p-10 print:border-none print:shadow-none print:rounded-none">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-teal tracking-tight">MaaShine Services</h1>
            <p className="text-sage text-sm mt-1">Professional Cleaning Solutions</p>
            <p className="text-slate-500 text-sm mt-4">
              contact@maashineservices.com<br />
              +91 81056 99620
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-extrabold text-slate-200 mb-2">INVOICE</h2>
            <p className="font-bold"># {invoice.invoice_number}</p>
            <p className="text-sm text-sage">Date: {new Date(invoice.created_at).toLocaleDateString('en-IN')}</p>
            <p className="text-sm text-sage">Status: <span className="text-teal font-bold uppercase">{invoice.status}</span></p>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-8">
          <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider mb-3">Bill To</h3>
          <p className="font-bold text-lg">{profile.full_name}</p>
          <p className="text-slate-600">{profile.email}</p>
          <p className="text-slate-600">{profile.phone}</p>
          <p className="text-slate-600 mt-2">
            {req.address}<br/>
            {req.city}, {req.state} {req.pincode}
          </p>
        </div>

        {/* Line Items */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b-2 border-slate-200 text-left">
              <th className="py-3 text-sm font-extrabold text-slate-400 uppercase tracking-wider">Description</th>
              <th className="py-3 text-sm font-extrabold text-slate-400 uppercase tracking-wider text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="py-4">
                <div className="font-bold">{service.name}</div>
                <div className="text-sm text-sage mt-1">
                  Booking #{req.request_number} • {req.preferred_date} • {req.property_type}
                </div>
              </td>
              <td className="py-4 text-right font-bold text-lg">
                ₹{invoice.amount.toLocaleString('en-IN')}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 bg-slate-50 p-6 rounded-xl border border-slate-100">
            <div className="flex justify-between items-center mb-3 text-sm">
              <span className="text-sage font-bold">Subtotal</span>
              <span className="font-bold">₹{invoice.amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center mb-3 text-sm">
              <span className="text-sage font-bold">Tax (0%)</span>
              <span className="font-bold">₹0</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
              <span className="font-extrabold text-teal">Total</span>
              <span className="text-xl font-extrabold text-teal">₹{invoice.amount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-200 text-center text-sage text-sm">
          <p>Thank you for choosing MaaShine Services!</p>
          <p className="mt-1">For any queries regarding this invoice, please contact support.</p>
        </div>

        {/* Print Button (Hidden when printing) */}
        <div className="mt-10 text-center print:hidden">
          <PrintButton />
        </div>
      </div>
    </div>
  )
}
