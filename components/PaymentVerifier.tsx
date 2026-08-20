'use client';

import { useState } from 'react';
import { reviewPayment } from '../app/actions/payment';

export default function PaymentVerifier({ paymentId, status, expectedAmount }: { paymentId: string, status: string, expectedAmount: number }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (status !== 'Verification Pending') {
    return (
      <div className={`text-sm font-bold mt-4 p-3 rounded-lg text-center ${status === 'Paid' ? 'bg-teal/10 text-teal' : 'bg-red-50 text-red-600'}`}>
        Status: {status}
      </div>
    );
  }

  async function handleVerify() {
    if (!isConfirmed) {
      setError('You must explicitly confirm the expected amount was received in the bank.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await reviewPayment({ payment_id: paymentId, action: 'verify' });
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleReject() {
    if (!rejectionReason.trim()) {
      setError('Please provide a rejection reason');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await reviewPayment({ payment_id: paymentId, action: 'reject', rejection_reason: rejectionReason });
      setIsRejecting(false);
    } catch (err: any) {
      setError(err.message || 'Rejection failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 border-t border-slate-100 pt-4">
      {error && <div className="text-red-500 text-xs mb-3 font-bold bg-red-50 p-2 rounded">{error}</div>}
      
      {!isRejecting ? (
        <div className="space-y-4">
          <div className="flex items-start gap-3 bg-marigold/10 p-3 rounded-lg border border-marigold/30">
            <input 
              type="checkbox" 
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="mt-1 w-4 h-4 text-teal" 
            />
            <p className="text-xs text-ink leading-snug">
              I confirm that exactly <span className="font-extrabold text-marigold">₹{expectedAmount}</span> has been received in the business bank/UPI account for this transaction reference.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleVerify}
              disabled={loading || !isConfirmed}
              className="flex-1 bg-teal text-white font-bold py-2 px-4 rounded-lg hover:bg-teal/90 disabled:opacity-50 text-sm transition-colors"
            >
              {loading ? 'Processing...' : 'Verify Payment'}
            </button>
            <button
              onClick={() => setIsRejecting(true)}
              disabled={loading}
              className="flex-1 bg-white text-red-500 border border-red-200 font-bold py-2 px-4 rounded-lg hover:bg-red-50 disabled:opacity-50 text-sm transition-colors"
            >
              Reject
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Reason for rejection (e.g. Invalid UTR, Amount mismatch)"
            className="w-full text-sm p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-red-300"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              onClick={handleReject}
              disabled={loading}
              className="flex-1 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 disabled:opacity-50 text-sm"
            >
              Confirm Reject
            </button>
            <button
              onClick={() => setIsRejecting(false)}
              disabled={loading}
              className="flex-1 bg-slate-100 text-slate-600 font-bold py-2 px-4 rounded-lg hover:bg-slate-200 disabled:opacity-50 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
