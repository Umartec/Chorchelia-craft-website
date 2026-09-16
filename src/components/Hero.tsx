import React from 'react';
import { ArrowRight, Sparkles, Heart, ShieldCheck, Truck } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';

interface HeroProps {
  onExplore: () => void;
  onShopNow: () => void;
  onCustomOrder: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onShopNow, onCustomOrder }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:py-20 lg:py-24 bg-gradient-to-b from-[#FAF8F5] via-[#F8F4F0] to-[#FAF8F5]">
      {/* Decorative background subtle glow */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#EBE1F5]/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Brand Story & Headline */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBE1F5] text-[#604284] text-xs font-semibold tracking-wide border border-[#DFCFF0] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#9B86BD]" />
              <span>Small-Batch Artisanal Crochet • Pakistan</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#2C2420] tracking-tight leading-[1.15]">
              Handmade with patience.{' '}
              <span className="italic font-serif font-normal text-[#8063A4] block sm:inline">
                Crafted with love.
              </span>
            </h1>

            {/* Supporting Subtitle */}
            <p className="text-base sm:text-lg text-[#5A4940] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {SITE_CONFIG.SUBTITLE}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <button
                onClick={onShopNow}
                id="hero-shop-now-btn"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#9B86BD] hover:bg-[#8063A4] text-white text-sm font-semibold uppercase tracking-wider shadow-sm hover:shadow transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExplore}
                id="hero-explore-btn"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-[#D5C6E6] bg-white hover:bg-[#FAF8F5] text-[#4A3E37] text-sm font-semibold tracking-wide transition-all hover:border-[#9B86BD]"
              >
                Explore Collection
              </button>
            </div>

            {/* Trust Micro Indicators */}
            <div className="pt-6 border-t border-[#EAE3DA] grid grid-cols-3 gap-2 max-w-md mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#EBE1F5] flex items-center justify-center flex-shrink-0 text-[#745699]">
                  <Heart className="w-3.5 h-3.5" />
                </div>
                <div className="text-[11px] leading-tight">
                  <span className="font-semibold text-[#2C2420] block">100% Handmade</span>
                  <span className="text-[#7C6C63]">Zero factory production</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#EBE1F5] flex items-center justify-center flex-shrink-0 text-[#745699]">
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <div className="text-[11px] leading-tight">
                  <span className="font-semibold text-[#2C2420] block">Across Pakistan</span>
                  <span className="text-[#7C6C63]">Delivered to all cities</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#EBE1F5] flex items-center justify-center flex-shrink-0 text-[#745699]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div className="text-[11px] leading-tight">
                  <span className="font-semibold text-[#2C2420] block">Careful Packing</span>
                  <span className="text-[#7C6C63]">Gift-ready boxing</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: High-quality Crochet Visual Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Feature Image */}
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-[#F7F4EE]">
                <img
                  src="https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=750&q=80"
                  alt="Artisanal hand-crocheted pastel flowers"
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover object-center"
                />
                
                {/* Floating Bottom Card */}
                <div className="absolute bottom-4 inset-x-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#EAE3DA] shadow-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider uppercase text-[#9B86BD] block">
                      Featured Creation
                    </span>
                    <h4 className="font-serif font-bold text-sm text-[#2C2420]">
                      Eternal Flower Bouquets
                    </h4>
                    <span className="text-xs font-semibold text-[#5A4940]">
                      From PKR 2,500
                    </span>
                  </div>
                  <button
                    onClick={onShopNow}
                    className="px-3.5 py-2 rounded-xl bg-[#9B86BD] hover:bg-[#8063A4] text-white text-xs font-semibold shadow-xs"
                  >
                    View
                  </button>
                </div>
              </div>

              {/* Offset Miniature Visual Card */}
              <div className="hidden sm:block absolute -top-5 -right-5 w-40 aspect-square rounded-2xl overflow-hidden shadow-lg border-3 border-white bg-white animate-float">
                <img
                  src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=400&q=80"
                  alt="Crochet Tote Bag detail"
                  className="w-full h-full object-cover"
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
