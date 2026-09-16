import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  MapPin, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  MessageCircle, 
  ArrowRight,
  ExternalLink,
  Gift,
  Copy,
  Check
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CustomerAction, CraftingStage } from '../types';
import { formatPKR } from '../utils/whatsapp';
import { SITE_CONFIG } from '../config/site';

interface TrackingViewProps {
  initialRef?: string;
  onContinueShopping?: () => void;
}

const STAGES: { stage: CraftingStage; title: string; subtitle: string; icon: any }[] = [
  {
    stage: 'Order Received',
    title: 'Order Received & Verified',
    subtitle: 'Order details reviewed; placed in artisan crafting queue',
    icon: Clock,
  },
  {
    stage: 'Handcrafting',
    title: 'Artisan Handcrafting in Progress',
    subtitle: 'Hook in hand; petals and stems crafted using soft cotton yarn',
    icon: Sparkles,
  },
  {
    stage: 'Quality Check & Wrapped',
    title: 'Quality Check & Gift Wrapping',
    subtitle: 'Inspected, wrapped in signature presentation paper with ribbon & card',
    icon: Gift,
  },
  {
    stage: 'Dispatched',
    title: 'Dispatched via Courier',
    subtitle: 'Handed over to courier partner with tracking slip',
    icon: Truck,
  },
  {
    stage: 'Delivered',
    title: 'Delivered with Love',
    subtitle: 'Parcel successfully delivered to your doorstep',
    icon: CheckCircle2,
  },
];

export const TrackingView: React.FC<TrackingViewProps> = ({ initialRef = '', onContinueShopping }) => {
  const { customerActions, findOrderByRefOrPhone } = useStore();
  const [searchQuery, setSearchQuery] = useState(initialRef);
  const [searchedOrder, setSearchedOrder] = useState<CustomerAction | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  // If initialRef is provided via URL hash e.g. #/track?ref=CC-52194
  useEffect(() => {
    if (initialRef) {
      setSearchQuery(initialRef);
      const found = findOrderByRefOrPhone(initialRef);
      if (found) {
        setSearchedOrder(found);
      }
      setHasSearched(true);
    }
  }, [initialRef, customerActions]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const found = findOrderByRefOrPhone(searchQuery);
    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  const handleCopyRef = (refText: string) => {
    navigator.clipboard.writeText(refText);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  // Determine active stage index
  const getStageIndex = (stage?: CraftingStage, status?: string): number => {
    if (stage === 'Cancelled' || status === 'Cancelled') return -1;
    if (stage === 'Delivered' || status === 'Delivered') return 4;
    if (stage === 'Dispatched' || status === 'Dispatched') return 3;
    if (stage === 'Quality Check & Wrapped') return 2;
    if (stage === 'Handcrafting') return 1;
    return 0; // Order Received
  };

  const currentStageIndex = searchedOrder ? getStageIndex(searchedOrder.craftingStage, searchedOrder.status) : 0;

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Page Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBE1F5] text-[#745699] text-xs font-semibold tracking-wide uppercase">
            <Package className="w-3.5 h-3.5" />
            <span>Order Transparency & Courier Tracking</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#2C2420] font-bold">
            Track Your Handmade Parcel
          </h1>
          <p className="text-sm text-[#7C6C63] max-w-lg mx-auto leading-relaxed">
            Every crochet flower, tote bag, and keepsake is made with care in Rahim Yar Khan.
            Enter your <strong>Order Reference #</strong> (e.g. <code>CC-52194</code>) or WhatsApp phone number to check current artisan progress.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#EAE3DA] shadow-xs">
          <form onSubmit={handleSearch} className="space-y-3">
            <label className="block text-xs font-semibold text-[#4A3E37] uppercase tracking-wider">
              Order Reference Number or WhatsApp Phone
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#A8988E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. CC-52194 or 03014589211"
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#EAE3DA] rounded-xl text-sm text-[#2C2420] placeholder-[#A8988E] focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 focus:border-[#9B86BD]"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-[#9B86BD] hover:bg-[#8063A4] text-white text-sm font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <Search className="w-4 h-4" />
                <span>Track Order</span>
              </button>
            </div>
            
            <div className="flex flex-wrap items-center justify-between text-xs text-[#7C6C63] pt-1">
              <span>Try sample references:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('CC-52194');
                    const found = findOrderByRefOrPhone('CC-52194');
                    setSearchedOrder(found || null);
                    setHasSearched(true);
                  }}
                  className="text-[#745699] font-medium hover:underline"
                >
                  CC-52194 (Gift Wrapped)
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('CC-48102');
                    const found = findOrderByRefOrPhone('CC-48102');
                    setSearchedOrder(found || null);
                    setHasSearched(true);
                  }}
                  className="text-[#745699] font-medium hover:underline"
                >
                  CC-48102 (Dispatched)
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Results Area */}
        {hasSearched && (
          searchedOrder ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Order Summary Card */}
              <div className="bg-white rounded-3xl border border-[#EAE3DA] p-5 sm:p-7 shadow-xs space-y-6">
                
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#EAE3DA]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-lg text-[#2C2420]">
                        #{searchedOrder.orderRef || searchedOrder.id}
                      </span>
                      <button
                        onClick={() => handleCopyRef(searchedOrder.orderRef || searchedOrder.id)}
                        className="p-1 rounded text-[#A8988E] hover:text-[#2C2420] transition-colors"
                        title="Copy Reference"
                      >
                        {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        searchedOrder.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : searchedOrder.status === 'Dispatched'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : searchedOrder.status === 'Confirmed'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {searchedOrder.craftingStage || searchedOrder.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#7C6C63] mt-1">
                      Ordered on {new Date(searchedOrder.timestamp).toLocaleDateString('en-PK', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-[#7C6C63] block">Total Order Value (COD):</span>
                    <span className="font-serif text-xl font-bold text-[#2C2420]">
                      {formatPKR(searchedOrder.totalAmount || searchedOrder.subtotal || 0)}
                    </span>
                  </div>
                </div>

                {/* Tracking Timeline */}
                <div className="space-y-4">
                  <h3 className="font-serif text-base font-bold text-[#2C2420] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#9B86BD]" />
                    <span>Artisan & Courier Progress Timeline</span>
                  </h3>

                  <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#EAE3DA]">
                    {STAGES.map((step, idx) => {
                      const isCompleted = idx < currentStageIndex || currentStageIndex === 4;
                      const isCurrent = idx === currentStageIndex && currentStageIndex !== 4;
                      const StepIcon = step.icon;

                      return (
                        <div key={step.stage} className="relative group">
                          {/* Node circle */}
                          <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                            isCompleted
                              ? 'bg-emerald-500 text-white shadow-xs'
                              : isCurrent
                                ? 'bg-[#9B86BD] text-white ring-4 ring-[#EBE1F5] shadow-sm animate-pulse'
                                : 'bg-[#FAF8F5] text-[#A8988E] border border-[#EAE3DA]'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            )}
                          </div>

                          <div className="pl-3">
                            <h4 className={`text-sm font-semibold flex items-center gap-2 ${
                              isCurrent ? 'text-[#745699]' : isCompleted ? 'text-[#2C2420]' : 'text-[#A8988E]'
                            }`}>
                              <span>{step.title}</span>
                              {isCurrent && (
                                <span className="px-2 py-0.5 rounded-full bg-[#EBE1F5] text-[#604284] text-[10px] font-bold">
                                  Current Stage
                                </span>
                              )}
                            </h4>
                            <p className="text-xs text-[#7C6C63] mt-0.5">
                              {step.subtitle}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Artisan Progress Note */}
                {searchedOrder.artisanProgressNote && (
                  <div className="p-4 rounded-2xl bg-[#F6F1FB] border border-[#E9DFEE] text-xs text-[#5B3E7A] space-y-1">
                    <div className="font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#9B86BD]" />
                      <span>Artisan Studio Note:</span>
                    </div>
                    <p className="italic text-[#6B5B52]">
                      "{searchedOrder.artisanProgressNote}"
                    </p>
                  </div>
                )}

                {/* Courier Dispatch Details (If Dispatched or Delivered) */}
                {(searchedOrder.courierTrackingNumber || searchedOrder.courierPartner) && (
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs space-y-2">
                    <div className="font-bold text-blue-900 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <span>Courier Transit Information</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[#4A3E37]">
                      <div>
                        <span className="text-[#7C6C63] block text-[11px]">Courier Partner:</span>
                        <strong className="text-xs text-[#2C2420]">{searchedOrder.courierPartner || 'TCS / Leopards'}</strong>
                      </div>
                      <div>
                        <span className="text-[#7C6C63] block text-[11px]">Courier Slip / Tracking #:</span>
                        <strong className="font-mono text-xs text-blue-700">{searchedOrder.courierTrackingNumber || 'Pending pickup'}</strong>
                      </div>
                      <div>
                        <span className="text-[#7C6C63] block text-[11px]">Estimated Arrival:</span>
                        <strong className="text-xs text-emerald-700">{searchedOrder.estimatedDeliveryDate || '2-4 Business Days'}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Gift Card Note (If Added) */}
                {searchedOrder.giftNote && (
                  <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[#EFE5D0] text-xs space-y-1">
                    <div className="font-bold text-[#8A6729] flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5" />
                      <span>Handwritten Gift Card Attached:</span>
                    </div>
                    <p className="italic text-[#5C461E] bg-white/70 p-2.5 rounded-xl border border-[#EFE5D0]">
                      "{searchedOrder.giftNote}"
                    </p>
                    {searchedOrder.giftOccasion && (
                      <span className="text-[11px] text-[#8A6729] block">
                        Occasion: {searchedOrder.giftOccasion}
                      </span>
                    )}
                  </div>
                )}

                {/* Ordered Items List */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-serif text-sm font-bold text-[#2C2420]">
                    Crafted Items in this Order:
                  </h4>
                  <div className="divide-y divide-[#F0EBE3] border border-[#EAE3DA] rounded-2xl overflow-hidden bg-[#FAF8F5]">
                    {searchedOrder.items && searchedOrder.items.length > 0 ? (
                      searchedOrder.items.map((item, idx) => (
                        <div key={idx} className="p-3 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-semibold text-[#2C2420]">{item.name}</span>
                            <div className="text-[11px] text-[#7C6C63] space-x-2">
                              {item.color && <span>Color: {item.color}</span>}
                              {item.size && <span>Size: {item.size}</span>}
                              <span>Qty: {item.quantity}</span>
                            </div>
                          </div>
                          <span className="font-semibold text-[#2C2420]">
                            {formatPKR(item.price * item.quantity)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-xs text-[#7C6C63] italic">
                        Custom floral creation requested via WhatsApp chat.
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery Recipient Info */}
                <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EAE3DA] text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-[#2C2420]">
                    <MapPin className="w-3.5 h-3.5 text-[#9B86BD]" />
                    <span>Delivery Destination:</span>
                  </div>
                  <div className="text-[#6B5B52] space-y-0.5">
                    <p><strong>Recipient:</strong> {searchedOrder.customerName}</p>
                    <p><strong>City:</strong> {searchedOrder.city}</p>
                    {searchedOrder.deliveryAddress && (
                      <p><strong>Address:</strong> {searchedOrder.deliveryAddress}</p>
                    )}
                  </div>
                </div>

                {/* Direct WhatsApp Support */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <span className="text-xs text-[#7C6C63]">
                    Have a question regarding this order?
                  </span>
                  <a
                    href={`https://wa.me/${SITE_CONFIG.WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Hello ${SITE_CONFIG.BUSINESS_NAME}! I'm checking in on my order #${searchedOrder.orderRef || searchedOrder.id}. Could you please share an update?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold shadow-xs transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>

              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#EAE3DA] p-8 text-center space-y-3 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2C2420]">
                No Order Found for "{searchQuery}"
              </h3>
              <p className="text-xs text-[#7C6C63] max-w-md mx-auto leading-relaxed">
                Please double check your Order Reference ID (e.g. <code>CC-52194</code>) or the exact WhatsApp number used during checkout. If you placed an order manually on WhatsApp, please text us directly for quick status.
              </p>
              <div className="pt-2">
                <a
                  href={`https://wa.me/${SITE_CONFIG.WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Hello ${SITE_CONFIG.BUSINESS_NAME}! I am looking for my order update for ${searchQuery}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#EBE1F5] text-[#745699] text-xs font-semibold hover:bg-[#DFCFF0] transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Ask Support on WhatsApp</span>
                </a>
              </div>
            </div>
          )
        )}

      </div>
    </div>
  );
};
