import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Search, 
  MessageCircle, 
  ArrowLeft, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Clock, 
  Truck, 
  RotateCcw, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { POLICIES_DATA, IMPORTANT_CUSTOMER_NOTICE, PolicySection } from '../data/policiesData';
import { SITE_CONFIG } from '../config/site';

interface PoliciesViewProps {
  onBackToShop: () => void;
}

export const PoliciesView: React.FC<PoliciesViewProps> = ({ onBackToShop }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activePolicyId, setActivePolicyId] = useState<string>('order-policy');

  const filteredPolicies = useMemo(() => {
    if (!searchQuery.trim()) return POLICIES_DATA;
    const q = searchQuery.toLowerCase();
    return POLICIES_DATA.filter((p) => {
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchSummary = p.summary.toLowerCase().includes(q);
      const matchContent = p.content.some((c) => c.toLowerCase().includes(q));
      const matchKeyPoints = p.keyPoints?.some((k) => k.toLowerCase().includes(q));
      return matchTitle || matchSummary || matchContent || matchKeyPoints;
    });
  }, [searchQuery]);

  const scrollToPolicy = (id: string) => {
    setActivePolicyId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleWhatsAppContact = () => {
    const text = 'Assalam o Alaikum! I have a question regarding Chorchelia Craft policies.';
    window.open(`https://wa.me/${SITE_CONFIG.CONTACT.PHONE_INTL}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-12 text-[#2C2420]" id="policies-view">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={onBackToShop}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#6B5B52] hover:text-[#2C2420] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Collection</span>
          </button>

          <div className="text-xs text-[#7C6C63]">
            <span>Last Updated: January 2025 • Official Store Terms</span>
          </div>
        </div>

        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EBE1F5] text-[#604284] text-xs font-bold mb-3 border border-[#DFCFF0]">
            <ShieldCheck className="w-4 h-4" />
            <span>Artisan Studio Guidelines & Trust</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C2420] tracking-tight">
            Chorchelia Craft — Policies
          </h1>

          <p className="text-xs sm:text-sm text-[#6B5B52] mt-3 leading-relaxed">
            Every piece is handmade in Pakistan with care and devotion. Please review our comprehensive store policies for orders, payments, dispatch, custom crafting, and returns.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto mt-6">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#8C7A70]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search policy (e.g. returns, delivery, custom orders, refund)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#EAE3DA] bg-white text-xs text-[#2C2420] placeholder-[#8C7A70] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] text-[#7C6C63] hover:text-[#2C2420] font-semibold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Highlighted Customer Notice Box */}
        <div className="mb-10 p-5 sm:p-6 rounded-3xl bg-amber-50/70 border border-amber-200/80 shadow-xs max-w-5xl mx-auto">
          <div className="flex items-start gap-3.5">
            <AlertCircle className="w-6 h-6 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                {IMPORTANT_CUSTOMER_NOTICE.title}
              </span>
              <h3 className="font-serif text-base sm:text-lg font-bold text-amber-950 mt-1">
                {IMPORTANT_CUSTOMER_NOTICE.heading}
              </h3>
              <p className="text-xs text-amber-900/90 mt-1.5 leading-relaxed">
                {IMPORTANT_CUSTOMER_NOTICE.body}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Sticky Table of Contents on Desktop + Policies List on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          
          {/* LEFT: Quick Jump Navigation (4 cols) */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24 bg-white rounded-3xl border border-[#EAE3DA] p-5 shadow-xs space-y-3 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE3DA]">
                <span className="text-xs font-bold text-[#2C2420] uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#9B86BD]" />
                  <span>Table of Policies ({POLICIES_DATA.length})</span>
                </span>
              </div>

              <div className="space-y-1">
                {POLICIES_DATA.map((policy) => (
                  <button
                    key={policy.id}
                    onClick={() => scrollToPolicy(policy.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between ${
                      activePolicyId === policy.id
                        ? 'bg-[#EBE1F5] text-[#604284] font-bold shadow-2xs'
                        : 'text-[#5C4D44] hover:bg-[#FAF8F5] hover:text-[#2C2420]'
                    }`}
                  >
                    <span className="truncate">
                      {policy.number}. {policy.title}
                    </span>
                    <ChevronRight className="w-3 h-3 text-[#B8AAA2] flex-shrink-0" />
                  </button>
                ))}
              </div>

              {/* Quick WhatsApp Help */}
              <div className="pt-4 border-t border-[#EAE3DA]">
                <button
                  onClick={handleWhatsAppContact}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20BE5C] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Ask a Policy Question</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Policy Content Sections (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {filteredPolicies.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#EAE3DA] p-8 text-center space-y-3">
                <HelpCircle className="w-10 h-10 text-[#9B86BD] mx-auto" />
                <h3 className="font-serif text-lg font-bold text-[#2C2420]">
                  No matching policies found
                </h3>
                <p className="text-xs text-[#6B5B52]">
                  We could not find any policy section matching "{searchQuery}". Try searching for terms like "delivery", "order", "whatsapp", or "return".
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 rounded-xl bg-[#2C2420] text-white text-xs font-semibold"
                >
                  Reset Search
                </button>
              </div>
            ) : (
              filteredPolicies.map((policy) => (
                <div
                  key={policy.id}
                  id={policy.id}
                  className="bg-white rounded-3xl border border-[#EAE3DA] p-6 sm:p-8 shadow-xs space-y-4 scroll-mt-24 transition-shadow hover:shadow-sm"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#F5F1EA]">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B86BD] bg-[#F5EEF9] px-2.5 py-0.5 rounded-full border border-[#DFCFF0]">
                        Policy Section {policy.number}
                      </span>
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2C2420] mt-1.5">
                        {policy.number}. {policy.title}
                      </h2>
                    </div>

                    <span className="text-xs font-medium text-[#7C6C63] bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#EAE3DA] hidden sm:inline">
                      Official Guideline
                    </span>
                  </div>

                  {/* Summary */}
                  <p className="text-xs font-semibold text-[#604284] bg-[#FAF8F5] p-3 rounded-xl border border-[#EAE3DA]">
                    {policy.summary}
                  </p>

                  {/* Paragraphs */}
                  <div className="space-y-3 text-xs sm:text-sm text-[#4A3E37] leading-relaxed">
                    {policy.content.map((paragraph, pIdx) => (
                      <p key={pIdx}>{paragraph}</p>
                    ))}
                  </div>

                  {/* Key Highlights / Bullet Points */}
                  {policy.keyPoints && policy.keyPoints.length > 0 && (
                    <div className="pt-2 border-t border-[#F5F1EA]">
                      <span className="text-[11px] font-bold text-[#2C2420] uppercase tracking-wider block mb-2">
                        Key Points:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {policy.keyPoints.map((point, kIdx) => (
                          <div
                            key={kIdx}
                            className="flex items-center gap-2 text-xs text-[#5C4D44] bg-[#FAF8F5] p-2 rounded-xl"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#9B86BD] flex-shrink-0" />
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}

            {/* Bottom Support Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#EBE1F5] border border-[#DFCFF0] text-center space-y-3">
              <h3 className="font-serif text-xl font-bold text-[#2C2420]">
                Need Clarification Before Ordering?
              </h3>
              <p className="text-xs text-[#5C4D44] max-w-md mx-auto leading-relaxed">
                Our artisan team in Rahim Yar Khan is always available on WhatsApp to answer any questions regarding custom sizing, color changes, and delivery timelines.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleWhatsAppContact}
                  className="py-3 px-6 rounded-xl bg-[#25D366] hover:bg-[#20BE5C] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat with Artisan Desk (0327 7045677)</span>
                </button>
                <button
                  onClick={onBackToShop}
                  className="py-3 px-6 rounded-xl bg-[#2C2420] hover:bg-[#4A3E37] text-white text-xs font-bold transition-colors"
                >
                  Return to Collection
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
