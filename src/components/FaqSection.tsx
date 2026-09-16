import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { FAQS } from '../data/faqs';
import { generateGeneralInquiryWhatsAppUrl } from '../utils/whatsapp';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleAskQuestion = () => {
    const url = generateGeneralInquiryWhatsAppUrl('a question not listed in your FAQ');
    window.open(url, '_blank');
  };

  return (
    <section className="py-16 sm:py-24 bg-white border-t border-[#EAE3DA]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-[#9B86BD] block mb-2">
            Clear Answers
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2420]">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#6B5B52] mt-2">
            Everything you need to know about our handmade process, shipping across Pakistan, and WhatsApp ordering.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#FAF8F5] rounded-2xl border border-[#EAE3DA] overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-serif font-semibold text-sm sm:text-base text-[#2C2420]">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#745699] border border-[#EAE3DA] flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-[#EBE1F5]' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#5C4D44] leading-relaxed border-t border-[#F0EBE3] pt-3 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions CTA */}
        <div className="mt-10 p-6 rounded-2xl bg-[#FAF8F5] border border-[#DFCFF0] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EBE1F5] text-[#745699] flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#2C2420]">
                Have a different question?
              </h4>
              <p className="text-xs text-[#7C6C63]">
                We are always available to help and guide you on WhatsApp.
              </p>
            </div>
          </div>

          <button
            onClick={handleAskQuestion}
            className="px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20BE5C] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-98"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </button>
        </div>

      </div>
    </section>
  );
};
