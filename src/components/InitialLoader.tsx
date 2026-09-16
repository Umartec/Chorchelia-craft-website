import React, { useState, useEffect } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';

interface InitialLoaderProps {
  minDisplayTimeMs?: number;
}

export const InitialLoader: React.FC<InitialLoaderProps> = ({ minDisplayTimeMs = 650 }) => {
  const [loading, setLoading] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      const removeTimer = setTimeout(() => {
        setLoading(false);
      }, 500);
      return () => clearTimeout(removeTimer);
    }, minDisplayTimeMs);

    return () => clearTimeout(timer);
  }, [minDisplayTimeMs]);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF8F5] transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      <div className="relative flex flex-col items-center max-w-xs px-6 text-center animate-in fade-in zoom-in-95 duration-400">
        
        {/* Aesthetic Crochet Yarn & Sparkle Visual */}
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#F3EEF9] to-[#FAF8F5] border border-[#DFCFF0] shadow-xs flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-[#745699] animate-pulse" />
          </div>

          {/* Little Heart Accent */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-rose-50 shadow-xs border border-rose-200 flex items-center justify-center text-rose-500">
            <Heart className="w-3 h-3 fill-rose-400" />
          </div>
        </div>

        {/* Brand Name */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <h1 className="font-serif text-2xl font-bold text-[#2C2420] tracking-tight">
            Chorchelia Craft
          </h1>
          <span className="text-[11px] font-bold tracking-widest text-[#745699] bg-[#EBE1F5] px-2 py-0.5 rounded-md border border-[#DFCFF0] uppercase">
            ART
          </span>
        </div>

        {/* Tagline */}
        <p className="text-xs text-[#745699] font-medium tracking-wider uppercase mb-5">
          Handmade Crochet Florals & Gifts
        </p>

        {/* Decent Minimalist Loading Progress Line */}
        <div className="w-44 h-1 bg-[#EBE1F5] rounded-full overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 bg-[#9B86BD] rounded-full w-24 animate-[shimmer_1.4s_infinite_ease-in-out]" />
        </div>

        <span className="text-[11px] text-[#8C7A70] mt-3">
          Weaving warmth & love...
        </span>
      </div>
    </div>
  );
};
