import React from 'react';
import { ShoppingBag, MessageCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const ProcessSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Choose',
      description: 'Browse our handmade crochet collection and pick your favorite pieces, colors and sizes.',
      icon: ShoppingBag,
    },
    {
      number: '02',
      title: 'Order',
      description: 'Add products to your cart and submit your order details seamlessly through WhatsApp.',
      icon: MessageCircle,
    },
    {
      number: '03',
      title: 'Confirm',
      description: 'Our artisan team will contact you to confirm availability, city delivery charges, and dispatch timing.',
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#F7F4EE] border-t border-[#EAE3DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase font-bold tracking-widest text-[#9B86BD] block mb-2">
            Simple & Transparent
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2420]">
            How Ordering Works
          </h2>
          <p className="text-sm text-[#6B5B52] mt-2">
            A boutique shopping experience without complicated payment gateways.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-white p-7 rounded-3xl border border-[#EAE3DA] shadow-xs flex flex-col items-start transition-all hover:shadow-md"
              >
                {/* Step badge & Icon */}
                <div className="w-full flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#EBE1F5] text-[#745699] flex items-center justify-center font-serif font-bold text-lg">
                    {step.number}
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] text-[#9B86BD] flex items-center justify-center border border-[#EAE3DA]">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#2C2420] mb-2">
                  {step.title}
                </h3>

                <p className="text-xs text-[#6B5B52] leading-relaxed">
                  {step.description}
                </p>

                {/* Subtle indicator line */}
                <div className="mt-5 pt-4 border-t border-[#F5F2EC] w-full flex items-center gap-1.5 text-[11px] font-semibold text-[#8C7A70]">
                  <span>Step {idx + 1} of 3</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
