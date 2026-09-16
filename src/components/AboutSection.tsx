import React from 'react';
import { Heart, Sparkles, Scissors, Gift, Palette } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';

export const AboutSection: React.FC = () => {
  const whyPoints = [
    {
      title: 'Handmade with Patience',
      desc: 'No mass production or robotic machines. Every single loop and stitch is created by human hands with quiet dedication.',
      icon: Scissors,
    },
    {
      title: 'Thoughtfully Designed',
      desc: 'Inspired by soft botanicals, pastel nostalgia, and timeless earthy palettes that fit modern aesthetics.',
      icon: Sparkles,
    },
    {
      title: 'Small-Batch Craftsmanship',
      desc: 'We prioritize quality and stitch perfection over hurried volume, ensuring every piece feels truly special.',
      icon: Heart,
    },
    {
      title: 'Gift-Friendly Presentation',
      desc: 'Arrives thoughtfully wrapped with artisanal packaging, ribbons, and handwritten cards ready to delight your loved ones.',
      icon: Gift,
    },
    {
      title: 'Bespoke Custom Options',
      desc: 'We welcome personalized requests—from favorite colorways to special floral arrangements tailored to your taste.',
      icon: Palette,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#FAF8F5] border-t border-[#EAE3DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16 sm:mb-20">
          
          {/* Left Column: Authentic Photography */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-[#F5F1EA]">
                <img
                  src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80"
                  alt="Crochet crafting hands in Pakistan"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Founder quote badge */}
              <div className="absolute -bottom-5 sm:-bottom-6 -right-2 sm:-right-4 bg-white p-4 sm:p-5 rounded-2xl shadow-lg border border-[#EAE3DA] max-w-xs">
                <p className="font-serif italic text-xs text-[#5A4940] leading-relaxed">
                  “Crochet taught me that the prettiest things in life take time, calm hands, and a sincere heart.”
                </p>
                <div className="mt-2 text-right">
                  <span className="text-[11px] font-bold text-[#745699] uppercase tracking-wider block">
                    — Founder, {SITE_CONFIG.BUSINESS_NAME}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Founder / Brand Story */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBE1F5] text-[#604284] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#9B86BD]" />
              <span>Our Story & Heart</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2420] leading-tight">
              A gentle craft rooted in love, one stitch at a time.
            </h2>

            <div className="space-y-4 text-sm text-[#5C4D44] leading-relaxed">
              <p>
                Welcome to <strong>{SITE_CONFIG.BUSINESS_NAME}</strong>. What began as a personal love for colorful skeins of yarn and the rhythmic flow of a crochet hook has blossomed into an artisan studio dedicated to creating heirloom-worthy pieces in Pakistan.
              </p>
              <p>
                In a fast-paced world of disposable goods and synthetic factory items, we believe there is something truly magical about holding an item made patiently by hand. From eternal floral bouquets that never wilt on your study desk, to sturdy hand-woven tote bags and delicate key charms, each creation brings a little gentle joy into everyday living.
              </p>
              <p className="text-xs italic text-[#7C6C63] bg-[#F7F4EE] p-4 rounded-xl border border-[#EAE3DA]">
                Note for business owner: This founder story section is completely customizable in your site configuration and content files to reflect your personal journey whenever you wish.
              </p>
            </div>
          </div>

        </div>

        {/* Why Chorchelia Craft Section */}
        <div className="pt-12 border-t border-[#EAE3DA]">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2420]">
              Why {SITE_CONFIG.BUSINESS_NAME}?
            </h3>
            <p className="text-xs sm:text-sm text-[#6B5B52] mt-2">
              Our core values that guide every thread we weave.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyPoints.map((pt, idx) => {
              const Icon = pt.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-[#EAE3DA] shadow-xs flex flex-col items-start hover:border-[#DFCFF0] transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F3EEF9] text-[#745699] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#2C2420] mb-2">
                    {pt.title}
                  </h4>
                  <p className="text-xs text-[#6B5B52] leading-relaxed">
                    {pt.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
