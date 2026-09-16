import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';

export const FloatingWhatsApp: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    const text = `Hello ${SITE_CONFIG.BUSINESS_NAME}! I'm visiting your website and would like to ask a question.`;
    const cleanPhone = SITE_CONFIG.WHATSAPP_NUMBER.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div 
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 group"
      id="floating-whatsapp-widget"
    >
      {/* Tooltip on hover */}
      <div 
        className={`hidden sm:block px-3.5 py-1.5 rounded-full bg-white text-[#2C2420] text-xs font-semibold shadow-lg border border-[#EAE3DA] transition-all duration-300 pointer-events-none ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}
      >
        Chat with us on WhatsApp
      </div>

      {/* Floating Button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20BE5C] text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 active:scale-95 focus:outline-none focus:ring-3 focus:ring-[#25D366]/40"
        aria-label="Chat with us on WhatsApp"
        title="Chat with us on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 sm:w-7.5 sm:h-7.5" />
      </button>
    </div>
  );
};
