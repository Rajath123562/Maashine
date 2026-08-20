'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { submitReview } from '../app/actions/reviews';

export default function ReviewForm({ requestId }: { requestId: string }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('request_id', requestId);
      formData.append('rating', rating.toString());
      formData.append('comment', comment);
      
      await submitReview(formData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-lime/20 border border-lime p-6 rounded-2xl text-center">
        <h3 className="font-bold text-teal text-lg mb-1">Thank You!</h3>
        <p className="text-sage text-sm">Your feedback helps us maintain our high standards.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-linen p-6 rounded-2xl border border-slate-200">
      <h3 className="font-extrabold text-ink text-lg mb-4">Rate Your Service</h3>
      
      {error && <div className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-lg mb-4">{error}</div>}
      
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none transition-transform hover:scale-110"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
          >
            <Star 
              size={32} 
              className={`${(hoverRating || rating) >= star ? 'fill-marigold text-marigold' : 'text-slate-300'}`} 
            />
          </button>
        ))}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold text-sage mb-2">Additional Comments (Optional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal bg-white"
          placeholder="How did we do? Tell us about your experience..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-teal text-white font-bold py-3 px-6 rounded-xl shadow-md hover:bg-teal/90 transition-colors disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
