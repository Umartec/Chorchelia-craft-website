import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, MessageCircle, ShieldCheck, Loader2, RefreshCw } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';

export const GHLFormContainer: React.FC = () => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Dynamically load and re-trigger GoHighLevel form embed script
  useEffect(() => {
    // Check if script is already present
    const existingScript = document.querySelector('script[src="https://link.jvgenius.com/js/form_embed.js"]');
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://link.jvgenius.com/js/form_embed.js';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        // Trigger resize if GHL window handler exists
        if ((window as any).leadConnectorFormEmbed) {
          try {
            (window as any).leadConnectorFormEmbed();
          } catch (e) {
            // silent catch
          }
        }
      };
      document.body.appendChild(script);
    }

    // Safety timeout in case iframe takes long or is blocked
    const timer = setTimeout(() => {
      setIframeLoaded(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppRedirect = () => {
    const text = `Hello ${SITE_CONFIG.BUSINESS_NAME}! I'm visiting your website and would like to place an order or ask a question.`;
    const cleanPhone = SITE_CONFIG.WHATSAPP_NUMBER.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div 
      className="bg-white rounded-3xl border border-[#DFCFF0] shadow-sm p-4 sm:p-7 md:p-8 relative overflow-hidden transition-all"
      id="ghl-form-wrapper"
    >
      {/* Decorative subtle ambient tint */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#F3EEF9]/50 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Form Card Header */}
      <div className="mb-6 pb-5 border-b border-[#F0EBE3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBE1F5] text-[#604284] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#9B86BD]" />
            <span>Official Inquiry & Order Request</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#2C2420] tracking-tight">
            Send Us Your Details
          </h3>
          <p className="text-xs sm:text-sm text-[#6B5B52] mt-1">
            Fill out the form below for custom pieces, order inquiries, or quick quotes.
          </p>
        </div>

        {/* Quick WhatsApp Badge */}
        <button
          onClick={handleWhatsAppRedirect}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#E8F8EE] hover:bg-[#D4F3DE] text-[#1E7E34] text-xs font-semibold border border-[#BDEAC8] transition-colors"
          title="Chat directly on WhatsApp"
        >
          <MessageCircle className="w-4 h-4 text-[#25D366]" />
          <span>Prefer WhatsApp? ({SITE_CONFIG.CONTACT.PHONE_DISPLAY})</span>
        </button>
      </div>

      {/* Form Container with Smooth Loading State */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-[#FAF8F5]/60 min-h-[892px]">
        
        {/* Loading Spinner Skeleton */}
        {!iframeLoaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 bg-white/90 backdrop-blur-xs text-center">
            <Loader2 className="w-8 h-8 text-[#9B86BD] animate-spin mb-3" />
            <p className="text-sm font-semibold text-[#2C2420]">Loading inquiry form...</p>
            <p className="text-xs text-[#7C6C63] max-w-xs mt-1">
              Connecting securely with our artisan inquiry desk in Pakistan.
            </p>
          </div>
        )}

        {/* The Exact GoHighLevel Iframe */}
        <iframe
          ref={iframeRef}
          src="https://link.jvgenius.com/widget/form/6KuLapCHMRb1j6WSXrkc"
          style={{
            width: '100%',
            height: '100%',
            minHeight: '892px',
            border: 'none',
            borderRadius: '12px',
            backgroundColor: '#ffffff',
          }}
          id="inline-6KuLapCHMRb1j6WSXrkc"
          data-layout="{'id':'INLINE'}"
          data-trigger-type="alwaysShow"
          data-trigger-value=""
          data-activation-type="alwaysActivated"
          data-activation-value=""
          data-deactivation-type="neverDeactivate"
          data-deactivation-value=""
          data-form-name="Contact Form - Umar 2"
          data-height="892"
          data-layout-iframe-id="inline-6KuLapCHMRb1j6WSXrkc"
          data-form-id="6KuLapCHMRb1j6WSXrkc"
          data-cookie-consent="true"
          data-cookie-consent-provider="auto"
          title="Contact Form - Umar 2"
          loading="lazy"
          onLoad={() => {
            setIframeLoaded(true);
          }}
          onError={() => {
            setLoadError(true);
            setIframeLoaded(true);
          }}
        />
      </div>

      {/* Trust & Guarantee Footer Note */}
      <div className="mt-5 pt-4 border-t border-[#F0EBE3] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7C6C63]">
        <div className="flex items-center gap-1.5 text-[#5C4D44]">
          <ShieldCheck className="w-4 h-4 text-[#9B86BD]" />
          <span>Your information is kept private and used only to respond to your inquiry.</span>
        </div>
        
        <button
          onClick={handleWhatsAppRedirect}
          className="text-[#604284] hover:text-[#2C2420] font-semibold text-xs flex items-center gap-1 hover:underline"
        >
          <span>Instant WhatsApp Chat: {SITE_CONFIG.CONTACT.PHONE_DISPLAY}</span>
        </button>
      </div>

    </div>
  );
};
