'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ServiceCatalogue({ services }: { services: any[] }) {
  const [activeCategory, setActiveCategory] = useState('All');
  
  const categories = ['All', 'Residential', 'Commercial', 'Specialized'];
  
  const filteredServices = activeCategory === 'All' 
    ? services 
    : services.filter(s => s.category === activeCategory);

  return (
    <div>
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal ${
              activeCategory === cat 
                ? 'bg-teal text-white shadow-md' 
                : 'bg-white text-sage hover:bg-linen border border-sage/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredServices.map(service => (
          <div
            key={service.id}
            className="bg-white p-8 rounded-3xl shadow-lg border border-sage/20 flex flex-col h-full hover:border-teal/50 hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-linen text-teal text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
                {service.category}
              </span>
              <h2 className="text-2xl font-bold text-ink mb-3">{service.name}</h2>
              <p className="text-sage text-sm mb-4 line-clamp-3">{service.description}</p>
            </div>
            
            {/* Includes List */}
            {service.includes && service.includes.length > 0 && (
              <div className="mb-6 flex-grow">
                <h4 className="text-xs font-bold text-ink mb-2 uppercase tracking-wide">Includes:</h4>
                <ul className="text-sm text-sage space-y-1 list-disc pl-4">
                  {service.includes.slice(0, 4).map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                  {service.includes.length > 4 && (
                    <li className="text-teal font-medium">+ {service.includes.length - 4} more items</li>
                  )}
                </ul>
              </div>
            )}

            <div className="flex justify-between items-end border-t border-sage/20 pt-6 mt-auto">
              <div>
                <span className="block text-xs font-bold text-sage">
                  {service.pricing_type === 'conditional' ? 'STARTS FROM' : 'PRICE'}
                </span>
                <span className={`font-extrabold text-teal ${service.pricing_type === 'quote' ? 'text-xl' : 'text-3xl'}`}>
                  {service.pricing_type === 'quote' ? 'On Request' : `₹${service.price.toLocaleString('en-IN')}`}
                </span>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <Link 
                  href={`/services/${service.slug}`}
                  className="text-slate-500 hover:text-teal font-bold text-xs hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded"
                >
                  View Full Checklist →
                </Link>
                <Link 
                  href={`/booking`}
                  className="bg-teal text-white font-bold px-6 py-2.5 rounded-full hover:bg-teal/90 transition-all shadow-md text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
                >
                  {service.pricing_type === 'quote' ? 'Get Quote' : 'Book Now'}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredServices.length === 0 && (
        <div className="text-center py-20">
          <p className="text-sage text-xl">No services found in this category.</p>
        </div>
      )}
    </div>
  );
}
