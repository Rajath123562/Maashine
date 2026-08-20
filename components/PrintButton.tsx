'use client';

import { Printer } from 'lucide-react';

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      type="button"
      className="bg-teal text-white font-bold px-8 py-3 rounded-xl shadow-md hover:bg-teal/90 transition-colors inline-flex items-center gap-2"
    >
      <Printer size={20} />
      Print / Save as PDF
    </button>
  );
}
