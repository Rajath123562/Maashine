'use client';

import { useState } from 'react';
import { cancelBookingRequest } from '../app/actions/booking';

export default function CancelBookingButton({ requestId, currentStatus }: { requestId: string, currentStatus: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(false);

  const canCancel = ['Pending', 'Contacted'].includes(currentStatus);

  if (!canCancel) return null;

  async function handleCancel() {
    setLoading(true);
    setError('');
    try {
      await cancelBookingRequest(requestId);
    } catch (err: any) {
      setError(err.message || 'Failed to cancel booking');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 border-t border-red-100 pt-6">
      <h3 className="text-red-600 font-bold mb-2">Danger Zone</h3>
      
      {error && <div className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-lg mb-4">{error}</div>}
      
      {!confirm ? (
        <button
          onClick={() => setConfirm(true)}
          className="text-red-500 font-bold border border-red-200 bg-white hover:bg-red-50 px-6 py-2 rounded-xl transition-colors text-sm"
        >
          Cancel this request
        </button>
      ) : (
        <div className="bg-red-50 p-4 rounded-xl border border-red-200">
          <p className="text-red-700 font-bold text-sm mb-3">Are you sure you want to cancel this booking?</p>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              disabled={loading}
              className="bg-red-500 text-white font-bold px-6 py-2 rounded-xl hover:bg-red-600 disabled:opacity-50 text-sm"
            >
              {loading ? 'Cancelling...' : 'Yes, Cancel'}
            </button>
            <button
              onClick={() => setConfirm(false)}
              disabled={loading}
              className="bg-white text-slate-600 font-bold px-6 py-2 rounded-xl hover:bg-slate-100 disabled:opacity-50 text-sm border border-slate-200"
            >
              No, Keep it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
