import React, { useState } from 'react';
import { Instagram, Facebook, Linkedin, MessageCircle, Heart, X, Sparkles, MapPin } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin }) => {
  const [careModalOpen, setCareModalOpen] = useState(false);

  return (
    <footer className="bg-[#241D1A] text-[#E9E3DC] pt-16 pb-12 border-t border-[#3A2E28]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#3A2E28]">
          
          {/* Brand & Mission (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Chorchelia Craft
              </span>
              <span className="text-[11px] font-bold tracking-widest text-[#DFCFF0] bg-[#423157] px-2 py-0.5 rounded-md uppercase border border-[#584175]">
                ART
              </span>
            </div>
            
            <p className="text-xs text-[#A8988E] leading-relaxed max-w-sm">
              Thoughtfully handmade crochet pieces crafted with patience and love in Pakistan. Adding warmth, gentle charm and personality to everyday life.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#C5B7AE]">
              <MapPin className="w-3.5 h-3.5 text-[#9B86BD]" />
              <span>{SITE_CONFIG.CONTACT.BUSINESS_ADDRESS}</span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href={SITE_CONFIG.SOCIAL_LINKS.INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#342A24] hover:bg-[#9B86BD] text-[#E9E3DC] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONFIG.SOCIAL_LINKS.FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#342A24] hover:bg-[#9B86BD] text-[#E9E3DC] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONFIG.SOCIAL_LINKS.LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#342A24] hover:bg-[#9B86BD] text-[#E9E3DC] hover:text-white flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONFIG.SOCIAL_LINKS.WHATSAPP_CHAT}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#342A24] hover:bg-[#25D366] text-[#E9E3DC] hover:text-white flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif font-semibold text-sm text-white tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-[#A8988E]">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop')}
                  className="hover:text-white transition-colors"
                >
                  Shop Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('categories')}
                  className="hover:text-white transition-colors"
                >
                  All Categories
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  About Our Brand
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('reviews')}
                  className="hover:text-white transition-colors"
                >
                  Customer Reviews
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact & Support
                </button>
              </li>
              {onOpenAdmin && (
                <li className="pt-1">
                  <button
                    onClick={onOpenAdmin}
                    className="text-[#B9A3D6] hover:text-white transition-colors flex items-center gap-1 font-medium"
                  >
                    <span>Owner / Admin Portal</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Customer Care (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif font-semibold text-sm text-white tracking-wide">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-[#A8988E]">
              <li>
                <button
                  onClick={() => onNavigate('shipping')}
                  className="hover:text-white transition-colors"
                >
                  Shipping & Delivery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('process')}
                  className="hover:text-white transition-colors"
                >
                  Order Process
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faqs')}
                  className="hover:text-white transition-colors"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('policies')}
                  className="hover:text-white transition-colors text-[#DFCFF0] font-medium"
                >
                  Official Brand Policies (18 Sections)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCareModalOpen(true)}
                  className="hover:text-white transition-colors"
                >
                  Crochet Care Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Direct WhatsApp Ordering (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-semibold text-sm text-white tracking-wide">
              Nationwide Delivery
            </h4>
            <p className="text-xs text-[#A8988E] leading-relaxed">
              We deliver parcels to Karachi, Lahore, Islamabad, Rahim Yar Khan, and all Pakistani towns.
            </p>
            <a
              href={SITE_CONFIG.SOCIAL_LINKS.WHATSAPP_CHAT}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#342A24] hover:bg-[#25D366] hover:text-white text-xs text-[#DFCFF0] font-medium transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp: {SITE_CONFIG.CONTACT.PHONE_DISPLAY}</span>
            </a>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8C7A70] gap-4">
          <p>© 2026 {SITE_CONFIG.BUSINESS_NAME}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('policies')}
              className="text-[#DFCFF0] hover:underline"
            >
              Order & Return Policies
            </button>
            <div className="flex items-center gap-1">
              <span>Handmade with</span>
              <Heart className="w-3 h-3 text-[#9B86BD] fill-[#9B86BD]" />
              <span>in Pakistan</span>
            </div>
          </div>
        </div>

      </div>

      {/* Crochet Care Guide Modal */}
      {careModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-[#2C2420] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#EAE3DA] relative">
            <button
              onClick={() => setCareModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-[#6B5B52] hover:bg-[#FAF8F5]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#EBE1F5] text-[#745699] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-xl font-bold">
                Crochet Care Guide
              </h3>
            </div>

            <p className="text-xs text-[#6B5B52] mb-5 leading-relaxed">
              Because all our items are hand-stitched from natural cotton and delicate fiber blends, treating them gently will keep them fresh for years:
            </p>

            <div className="space-y-3 text-xs text-[#5C4D44]">
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3DA]">
                <strong className="text-[#2C2420] block mb-0.5">1. Gentle Hand Wash Only</strong>
                <span>Submerge gently in cool or lukewarm water with mild liquid detergent. Avoid harsh wringing or twisting.</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3DA]">
                <strong className="text-[#2C2420] block mb-0.5">2. Reshape and Dry Flat</strong>
                <span>Press out excess water in a clean dry towel. Lay flat on a clean surface in shade to preserve original shape.</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3DA]">
                <strong className="text-[#2C2420] block mb-0.5">3. Flower Bouquets & Decor</strong>
                <span>Do not wash flower stems or wire-structured blooms. Gently dust with a soft makeup brush or cool hairdryer on lowest fan.</span>
              </div>
            </div>

            <button
              onClick={() => setCareModalOpen(false)}
              className="mt-6 w-full py-2.5 rounded-xl bg-[#9B86BD] text-white text-xs font-semibold"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
