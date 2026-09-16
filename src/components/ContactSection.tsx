import React from 'react';
import { MessageCircle, Mail, MapPin, Instagram, Facebook, Truck, Clock, ShieldCheck, Sparkles, PhoneCall } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';
import { GHLFormContainer } from './GHLFormContainer';

export const ContactSection: React.FC = () => {
  return (
    <section className="py-12 sm:py-20 bg-[#FAF8F5] border-t border-[#EAE3DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading with clean, high-legibility typography */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBE1F5] text-[#604284] text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#9B86BD]" />
            <span>Connect Directly With Our Artisan Studio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2C2420] tracking-tight">
            Get in Touch with Chorchelia Craft
          </h2>
          <p className="text-sm sm:text-base text-[#5C4D44] mt-3 leading-relaxed">
            Have questions about a crochet piece, custom color palette, or nationwide parcel delivery? 
            Reach out via WhatsApp or submit our official inquiry form below.
          </p>
        </div>

        {/* 2-Column Responsive Layout: Left side rich contacts, Right side GHL embed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Direct WhatsApp, Socials & Studio Logistics (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Primary WhatsApp Card (High Visual Priority) */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-[#25D366]/30 shadow-sm relative overflow-hidden">
              <div className="flex items-start justify-between gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F8EE] text-[#25D366] flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 fill-[#25D366] text-white" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#E8F8EE] text-[#1E7E34] text-[11px] font-bold tracking-wide">
                  Fastest Response
                </span>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-bold text-[#2C2420]">
                  WhatsApp Direct Chat
                </h3>
                <p className="text-xs text-[#6B5B52] mt-1 leading-relaxed">
                  Connect directly with us to discuss color customization, delivery dates, or verify immediate stock.
                </p>
                
                <div className="mt-3 p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE3DA] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#2C2420]">
                    <PhoneCall className="w-4 h-4 text-[#25D366]" />
                    <span>{SITE_CONFIG.CONTACT.PHONE_DISPLAY}</span>
                  </div>
                  <span className="text-[10px] text-[#7C6C63]">Pakistan</span>
                </div>
              </div>

              <a
                href={SITE_CONFIG.SOCIAL_LINKS.WHATSAPP_CHAT}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full py-3.5 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20BE5C] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-98"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp Now</span>
              </a>
            </div>

            {/* Official Social Media Card */}
            <div className="bg-white p-6 rounded-3xl border border-[#EAE3DA] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#2C2420]">
                  Official Social Channels
                </h4>
                <span className="text-[11px] text-[#745699] font-semibold">@chorchelia.craft_store</span>
              </div>
              
              <p className="text-xs text-[#6B5B52] leading-relaxed">
                Watch behind-the-scenes stitch reels, customer unboxing videos, and new seasonal collections:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <a
                  href={SITE_CONFIG.SOCIAL_LINKS.INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl border border-[#EAE3DA] hover:border-[#9B86BD] bg-[#FAF8F5] hover:bg-[#F3EEF9] flex items-center gap-2.5 font-semibold text-[#2C2420] transition-all group"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xs">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs group-hover:text-[#604284]">Instagram</span>
                    <span className="text-[10px] text-[#8C7A70] font-normal">Follow our page</span>
                  </div>
                </a>

                <a
                  href={SITE_CONFIG.SOCIAL_LINKS.FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl border border-[#EAE3DA] hover:border-[#1877F2] bg-[#FAF8F5] hover:bg-[#EEF4FF] flex items-center gap-2.5 font-semibold text-[#2C2420] transition-all group"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shadow-xs">
                    <Facebook className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs group-hover:text-[#1877F2]">Facebook</span>
                    <span className="text-[10px] text-[#8C7A70] font-normal">Chorchelia Craft</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Studio Logistics & Hours */}
            <div className="bg-white p-6 rounded-3xl border border-[#EAE3DA] shadow-xs space-y-4 text-xs">
              <h4 className="font-bold text-sm text-[#2C2420]">
                Studio & Delivery Coverage
              </h4>

              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#FAF8F5] text-[#9B86BD] flex items-center justify-center border border-[#EAE3DA] flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-[#2C2420] block">Studio Location</span>
                  <span className="text-[#6B5B52] block">{SITE_CONFIG.CONTACT.BUSINESS_ADDRESS}</span>
                  <span className="text-[11px] font-semibold text-[#745699] flex items-center gap-1 mt-1">
                    <Truck className="w-3.5 h-3.5" /> Nationwide delivery across all Pakistani cities
                  </span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3 pt-3 border-t border-[#F5F1EA]">
                <div className="w-8 h-8 rounded-xl bg-[#FAF8F5] text-[#9B86BD] flex items-center justify-center border border-[#EAE3DA] flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-[#2C2420] block">Email Support</span>
                  <a href={`mailto:${SITE_CONFIG.CONTACT.EMAIL}`} className="text-[#6B5B52] hover:text-[#745699]">
                    {SITE_CONFIG.CONTACT.EMAIL}
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3 pt-3 border-t border-[#F5F1EA]">
                <div className="w-8 h-8 rounded-xl bg-[#FAF8F5] text-[#9B86BD] flex items-center justify-center border border-[#EAE3DA] flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-[#2C2420] block">Customer Service Hours</span>
                  <span className="text-[#6B5B52]">{SITE_CONFIG.CONTACT.HOURS}</span>
                </div>
              </div>
            </div>

            {/* Reassurance Guarantee */}
            <div className="p-4 rounded-2xl bg-[#EBE1F5]/40 border border-[#DFCFF0] flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#745699] flex-shrink-0 mt-0.5" />
              <div className="text-xs text-[#523377] leading-relaxed">
                <span className="font-bold block">100% Genuine Artisan Studio</span>
                Every piece is stitched by hand in Pakistan. We personally inspect every order before sending dispatch tracking details.
              </div>
            </div>

          </div>

          {/* Right Column: GoHighLevel Embed Form (7 cols) */}
          <div className="lg:col-span-7">
            <GHLFormContainer />
          </div>

        </div>

      </div>
    </section>
  );
};
