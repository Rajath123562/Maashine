"use client";

export default function Hero() {
  return (
    <section className="bg-teal text-linen py-20 px-8 rounded-b-[3rem] shadow-xl relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight text-linen">
          A Cleaner Space. <span className="text-marigold">A Better Life.</span>
        </h1>
        <p className="text-xl md:text-2xl mb-10 font-mono text-linen/90">
          Professional cleaning services for homes, offices, and spaces that deserve the MaaShine touch.
        </p>
        <div className="space-x-4">
          <a 
            href="/booking" 
            className="inline-block bg-lime text-ink font-bold py-4 px-8 rounded-full text-lg hover:bg-marigold hover:scale-105 transition-all shadow-lg"
          >
            Book a Cleaning
          </a>
          <a 
            href="/services" 
            className="inline-block bg-transparent border-2 border-linen text-linen font-bold py-4 px-8 rounded-full text-lg hover:bg-linen/10 hover:scale-105 transition-all shadow-lg"
          >
            Explore Services
          </a>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
         <div className="absolute top-10 left-10 w-64 h-64 bg-marigold rounded-full mix-blend-multiply filter blur-3xl"></div>
         <div className="absolute bottom-10 right-10 w-64 h-64 bg-lime rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>
    </section>
  );
}
