import React from 'react';
import { MessageCircle, Sparkles, Palette, Clock, HeartHandshake } from 'lucide-react';
import { generateCustomOrderWhatsAppUrl } from '../utils/whatsapp';
import { useStore } from '../context/StoreContext';

export const CustomOrderSection: React.FC = () => {
  const { logCustomerAction } = useStore();

  const handleRequestCustom = () => {
    logCustomerAction({
      customerName: 'WhatsApp Custom Order Inquirer',
      whatsappNumber: 'Awaiting chat confirmation',
      city: 'Pakistan (Online)',
      actionType: 'custom_quote',
      notes: 'Customer initiated custom order inquiry via homepage banner.',
      status: 'Pending',
    });

    const url = generateCustomOrderWhatsAppUrl();
    window.open(url, '_blank');
  };

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-r from-[#FAF8F5] via-[#F3EEF9] to-[#FAF8F5] border-t border-[#EAE3DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#DFCFF0] p-8 sm:p-12 lg:p-14 shadow-sm relative overflow-hidden">
          
          {/* Decorative blur */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#EBE1F5]/40 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBE1F5] text-[#604284] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#9B86BD]" />
                <span>Bespoke & Personalized Handcrafted Creations</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2420]">
                Looking for something custom?
              </h2>

              <p className="text-base text-[#5A4940] max-w-2xl leading-relaxed">
                “Have a specific color, design or gift idea in mind? Talk to us about creating something specially for you.”
              </p>

              {/* Perks / options */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                <div className="flex items-center gap-2 text-xs text-[#6B5B52]">
                  <Palette className="w-4 h-4 text-[#9B86BD]" />
                  <span>Custom Color Palettes</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6B5B52]">
                  <HeartHandshake className="w-4 h-4 text-[#9B86BD]" />
                  <span>Personalized Gift Packaging</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6B5B52]">
                  <Clock className="w-4 h-4 text-[#9B86BD]" />
                  <span>Handcrafted on Schedule</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <button
                onClick={handleRequestCustom}
                id="custom-order-cta-btn"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#25D366] hover:bg-[#20BE5C] text-white text-sm font-bold flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all active:scale-98"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Request a Custom Order</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
