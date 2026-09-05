import React from 'react';
import { Zap, Truck, RotateCcw, MessageCircle, Store, ArrowDown, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface HeroSectionProps {
  featuredProduct: Product;
  onExploreClick: () => void;
  onOpenAdmin: () => void;
  onBuyFeatured: (product: Product) => void;
  onOpenWhatsAppHelp: () => void;
  isAdmin?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredProduct,
  onExploreClick,
  onOpenAdmin,
  onBuyFeatured,
  onOpenWhatsAppHelp,
  isAdmin = false,
}) => {
  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-6">
      <div className="bg-[#111827] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl relative overflow-hidden border border-slate-800">
        {/* Subtle background ambient light glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Headlines, guarantees, and actions */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-6">
            {/* Top Pill Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-emerald-300 border border-white/10 backdrop-blur-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Stock Available in Dhaka Hub
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight font-['Inter',_'Hind_Siliguri',_sans-serif]">
                Zenmart BD — স্মার্ট কেনাকাটা, সহজ সমাধান
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Curated minimalist workspace essentials, aesthetic smart ambient lights & contemporary tech gadgets with verified fast Cash on Delivery across Bangladesh.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                id="hero-explore-trending-btn"
                onClick={onExploreClick}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#111827] text-sm font-bold rounded-lg hover:bg-slate-100 active:scale-95 transition-all shadow-md"
              >
                <span>Explore Trending Items</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              {isAdmin && (
                <button
                  id="hero-open-store-manager-btn"
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 text-white hover:bg-white/15 active:scale-95 border border-white/20 rounded-lg text-sm font-semibold transition-all backdrop-blur-xs"
                >
                  <Store className="w-4 h-4 text-blue-400" />
                  <span>Open Store Manager</span>
                </button>
              )}
            </div>

            {/* Feature Guarantees Bar matching screenshot */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                <div className="p-1.5 rounded-md bg-white/10 text-blue-400 flex-shrink-0">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <span>Dhaka 24h Express</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                <div className="p-1.5 rounded-md bg-white/10 text-emerald-400 flex-shrink-0">
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <span>Nationwide COD</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                <div className="p-1.5 rounded-md bg-white/10 text-amber-400 flex-shrink-0">
                  <RotateCcw className="w-3.5 h-3.5" />
                </div>
                <span>7-Day Replacement</span>
              </div>

              <div
                onClick={onOpenWhatsAppHelp}
                className="flex items-center gap-2 text-xs text-slate-300 font-medium cursor-pointer hover:text-emerald-300 transition-colors"
              >
                <div className="p-1.5 rounded-md bg-white/10 text-[#25D366] flex-shrink-0">
                  <MessageCircle className="w-3.5 h-3.5" />
                </div>
                <span>Instant WhatsApp Help</span>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Daily Special Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#1f2937]/90 rounded-2xl p-4 border border-slate-700/80 shadow-2xl relative">
              {/* Card Header Tag */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${featuredProduct.inStock ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
                  <span className="text-[11px] font-bold tracking-wider uppercase text-slate-200">
                    FEATURED DAILY SPECIAL
                  </span>
                </div>
                {featuredProduct.inStock ? (
                  <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                    Save ৳{featuredProduct.originalPrice - featuredProduct.price}
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-rose-300 bg-rose-950/70 px-2 py-0.5 rounded border border-rose-800/80">
                    স্টক শেষ (Out of Stock)
                  </span>
                )}
              </div>

              {/* Product Image Box */}
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-900 group">
                <img
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ${!featuredProduct.inStock ? 'opacity-70 grayscale-[20%]' : ''}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {!featuredProduct.inStock && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-rose-600/95 text-white font-bold text-xs px-3.5 py-1.5 rounded-full shadow-lg border border-white/30 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-white" />
                      <span>স্টক শেষ (Out of Stock)</span>
                    </div>
                  </div>
                )}

                {/* Floating Price Tag on bottom-right of image */}
                <div className="absolute bottom-3 right-3 bg-white text-[#111827] px-3 py-1.5 rounded-lg shadow-lg flex items-baseline gap-1.5 border border-slate-200">
                  <span className="text-base font-extrabold text-emerald-600 font-mono">
                    ৳{featuredProduct.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 line-through font-mono">
                    ৳{featuredProduct.originalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Bottom Info & Buy Button */}
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-white truncate">
                    {featuredProduct.name}
                  </h3>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {featuredProduct.tagline}
                  </p>
                </div>

                {featuredProduct.inStock ? (
                  <button
                    id="featured-buy-now-btn"
                    onClick={() => onBuyFeatured(featuredProduct)}
                    className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white rounded-full font-bold text-xs hover:bg-[#20bd5a] active:scale-95 transition-all shadow-[0_4px_14px_rgba(37,211,102,0.35)]"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Buy Now</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-slate-700/80 text-slate-400 rounded-full font-bold text-xs border border-slate-600 cursor-not-allowed select-none"
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>স্টক শেষ</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
