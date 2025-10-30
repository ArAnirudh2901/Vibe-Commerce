import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Zap, ShieldCheck, Truck } from 'lucide-react';

function Landing({ onShop }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-black text-white"
    >
      {/* Single viewport section containing hero + features */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(90vh-4rem)] flex flex-col justify-center gap-6">
          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-extrabold leading-tight">Elevate Your Everyday Essentials</h2>
            <p className="mt-5 text-gray-300 text-base md:text-lg">
              Clean aesthetics, curated products, and fair prices — tailored for a minimal, modern vibe.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={onShop}
                className="px-6 py-3 bg-white text-black rounded-[6px] hover:bg-gray-200 transition-colors font-semibold"
              >
                Shop Now
              </button>
              <button
                disabled
                className="px-6 py-3 bg-black text-white border border-gray-900 rounded-[6px] opacity-60 cursor-not-allowed"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="border-t border-gray-900 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-black rounded-xl border border-gray-900 p-4">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-white" />
                  <div>
                    <p className="font-semibold">Fast Checkout</p>
                    <p className="text-gray-400 text-sm">Smooth and secure payments.</p>
                  </div>
                </div>
              </div>
              <div className="bg-black rounded-xl border border-gray-900 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-white" />
                  <div>
                    <p className="font-semibold">Secure Auth</p>
                    <p className="text-gray-400 text-sm">JWT-protected routes.</p>
                  </div>
                </div>
              </div>
              <div className="bg-black rounded-xl border border-gray-900 p-4">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-white" />
                  <div>
                    <p className="font-semibold">Free Shipping</p>
                    <p className="text-gray-400 text-sm">On all domestic orders.</p>
                  </div>
                </div>
              </div>
              <div className="bg-black rounded-xl border border-gray-900 p-4">
                <div className="flex items-start gap-3">
                  <ShoppingBag className="h-5 w-5 text-white" />
                  <div>
                    <p className="font-semibold">Curated Catalog</p>
                    <p className="text-gray-400 text-sm">Powered by Fake Store API.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export default Landing;