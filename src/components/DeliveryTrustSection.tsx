import React from 'react';
import { Truck, Sparkles, MessageCircle, PackageCheck, MapPin, ShieldCheck } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';

export const DeliveryTrustSection: React.FC = () => {
  const trustFeatures = [
    {
      title: '100% Handmade Products',
      description: 'Each creation is individually crocheted by hand with precision stitch tension and high-grade cotton yarn.',
      icon: Sparkles,
    },
    {
      title: 'Delivery Across Pakistan',
      description: 'Nationwide shipping to Karachi, Lahore, Islamabad, Rahim Yar Khan, Faisalabad, Multan, and all cities.',
      icon: Truck,
    },
    {
      title: 'WhatsApp Order Confirmation',
      description: 'Personal human communication before shipping. We confirm every colorway, city courier rate, and delivery timeline.',
      icon: MessageCircle,
    },
    {
      title: 'Carefully Packed Orders',
      description: 'Cushioned and wrapped in gift-worthy presentation packaging so your items arrive in pristine botanical shape.',
      icon: PackageCheck,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-t border-[#EAE3DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Box */}
        <div className="bg-[#FAF8F5] rounded-3xl border border-[#EAE3DA] p-8 sm:p-12 mb-12">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBE1F5] text-[#604284] text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-[#9B86BD]" />
              <span>Nationwide Logistics</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2420]">
              Delivery Across Pakistan
            </h2>

            <p className="text-sm text-[#5A4940] leading-relaxed">
              We dispatch carefully prepared parcels from Pakistan across all provincial cities, towns, and regions. 
              Because parcel sizes and city courier tariffs vary, delivery charges are calculated transparently and confirmed with you directly on WhatsApp before dispatch.
            </p>
          </div>
        </div>

        {/* 4 Trust Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-[#EAE3DA] shadow-xs flex flex-col items-start hover:border-[#D5C6E6] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F3EEF9] text-[#745699] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#2C2420] mb-1.5">
                  {feat.title}
                </h3>
                <p className="text-xs text-[#6B5B52] leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
