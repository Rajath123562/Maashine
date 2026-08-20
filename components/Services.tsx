export default function Services({ services }: { services: any[] }) {
  if (!services || services.length === 0) {
    return (
      <section className="py-20 px-8 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12 text-teal">Our Premium Services</h2>
        <p className="text-sage font-mono">No services available at the moment.</p>
      </section>
    );
  }

  return (
    <section className="py-20 px-8 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold mb-12 text-center text-teal">Our Premium Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((svc) => (
          <div key={svc.id} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow border border-sage/20 flex flex-col h-full group">
            <h3 className="text-2xl font-bold mb-4 text-ink group-hover:text-teal transition-colors">{svc.name}</h3>
            <p className="text-sage mb-6 flex-grow">{svc.description}</p>
            <div className="flex justify-between items-center border-t border-sage/20 pt-4 mt-auto">
              <span className="text-2xl font-extrabold text-marigold">₹{svc.price}</span>
              <span className="font-mono text-sm text-sage">{svc.duration_minutes} mins</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
