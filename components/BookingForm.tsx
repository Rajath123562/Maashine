"use client";

import { useState } from "react";
import { submitBooking } from "../app/actions/booking";
import { useRouter } from "next/navigation";

export default function BookingForm({ services }: { services: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const serviceId = formData.get("serviceId") as string;
    const bookingTime = formData.get("bookingTime") as string;

    const selectedService = services.find(s => s.id === serviceId);
    if (!selectedService) return;

    try {
      const res = await submitBooking(serviceId, new Date(bookingTime).toISOString(), parseFloat(selectedService.price));
      if (res.success) {
        router.push(`/booking/${res.bookingId}/payment`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="book" className="py-20 px-8 bg-ink text-linen rounded-t-[3rem]">
      <div className="max-w-xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center text-lime">Secure Your Slot</h2>
        <form onSubmit={handleSubmit} className="bg-white/10 p-8 rounded-3xl backdrop-blur-md">
          {error && <div className="bg-red-500/20 text-red-200 p-4 rounded-xl mb-6 text-sm">{error}</div>}
          
          <div className="mb-6">
            <label className="block text-sm font-mono mb-2 text-sage">Select Service</label>
            <select name="serviceId" required className="w-full bg-ink border border-sage/50 text-linen p-4 rounded-xl focus:outline-none focus:border-lime">
              <option value="">-- Choose a package --</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name} (₹{s.price})</option>
              ))}
            </select>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-mono mb-2 text-sage">Select Date & Time</label>
            <input type="datetime-local" name="bookingTime" required className="w-full bg-ink border border-sage/50 text-linen p-4 rounded-xl focus:outline-none focus:border-lime [color-scheme:dark]" />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-marigold text-ink font-bold text-lg py-4 rounded-xl hover:bg-lime transition-colors disabled:opacity-50"
          >
            {loading ? "Processing..." : "Continue to Payment"}
          </button>
        </form>
      </div>
    </section>
  );
}
