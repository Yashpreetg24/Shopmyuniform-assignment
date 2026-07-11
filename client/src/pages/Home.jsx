import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-24 pb-12"
    >
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/40"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 drop-shadow-lg">
            Elevate Your <br />
            <span className="text-brand-400">Workwear</span>
          </h1>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto drop-shadow-md">
            Discover premium uniforms designed for durability, comfort, and uncompromising style. Quality that speaks for itself.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              to="/products" 
              className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105"
            >
              Shop Collection
            </Link>
            <Link 
              to="/products?category=new" 
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all hover:scale-105"
            >
              New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Shop by Category</h2>
            <p className="mt-2 text-gray-500">Find exactly what you need for your profession.</p>
          </div>
          <Link to="/products" className="text-brand-600 font-semibold hover:text-brand-800 transition-colors">
            View All Categories &rarr;
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Medical Scrubs", img: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
            { name: "Hospitality", img: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
            { name: "Corporate", img: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
          ].map((cat, i) => (
            <Link key={i} to="/products" className="group relative h-80 rounded-2xl overflow-hidden shadow-lg cursor-pointer">
              <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{cat.name}</h3>
                <span className="text-brand-400 font-medium opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 inline-block">
                  Explore Collection &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Value Proposition */}
      <section className="bg-brand-900 rounded-3xl p-12 md:p-16 text-center text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-brand-700 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-brand-600 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Built for the Modern Professional</h2>
          <p className="text-lg text-brand-100 max-w-2xl mx-auto mb-10">
            Every uniform is crafted with precision, using performance fabrics that withstand the rigors of your day while keeping you looking sharp.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="font-bold text-xl mb-2">Premium Quality</h4>
              <p className="text-brand-200 text-sm">Industrial-grade fabrics that last.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-xl mb-2">All-Day Comfort</h4>
              <p className="text-brand-200 text-sm">Breathable and flexible designs.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h4 className="font-bold text-xl mb-2">Secure Payments</h4>
              <p className="text-brand-200 text-sm">100% safe and encrypted checkout.</p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
