import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowLeft, 
  MessageCircle, 
  Printer, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Truck, 
  Star, 
  ShoppingBag, 
  ExternalLink,
  Heart,
  Gift,
  Tag,
  Copy,
  Check,
  Package
} from 'lucide-react';
import { SITE_CONFIG } from '../config/site';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { CustomerOrderDetails, CartItem, DiscountCode } from '../types';
import { formatPKR, generateOrderWhatsAppUrl } from '../utils/whatsapp';
import { PAKISTAN_CITIES, getCityShippingRate } from '../data/pakistanCities';

interface OrderReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToCart: () => void;
  onNavigateToPolicies?: () => void;
  onNavigateToTracking?: (ref?: string) => void;
}

const OCCASIONS = [
  'Standard Parcel (No Occasion)',
  '🎂 Birthday Surprise',
  '💍 Anniversary / Romantic Gift',
  '🎓 Graduation Celebration',
  '🌙 Eid Mubarak',
  '🎉 Congratulations',
  '👰 Wedding / Nikkah',
  '💖 Thinking of You / Love Note',
];

export const OrderReceiptModal: React.FC<OrderReceiptModalProps> = ({
  isOpen,
  onClose,
  onBackToCart,
  onNavigateToPolicies,
  onNavigateToTracking,
}) => {
  const { cart, subtotal, totalItems, clearCart } = useCart();
  const { logCustomerAction, addReview, validateDiscountCode } = useStore();

  const [customer, setCustomer] = useState<CustomerOrderDetails>({
    fullName: '',
    whatsappNumber: '',
    city: 'Lahore',
    deliveryAddress: '',
    notes: '',
  });

  // Gift Card State
  const [isGiftOrder, setIsGiftOrder] = useState<boolean>(false);
  const [giftOccasion, setGiftOccasion] = useState<string>(OCCASIONS[0]);
  const [giftNote, setGiftNote] = useState<string>('');

  // Discount Code State
  const [couponInput, setCouponInput] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<DiscountCode | null>(null);
  const [couponDiscountAmount, setCouponDiscountAmount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState(false);
  const [orderRefId, setOrderRefId] = useState<string>('');
  const [lastOrderItems, setLastOrderItems] = useState<CartItem[]>([]);
  const [lastSubtotal, setLastSubtotal] = useState<number>(0);
  const [lastTotal, setLastTotal] = useState<number>(0);
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState<string>('');
  const [copiedRef, setCopiedRef] = useState(false);

  // Review state after order placement
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  // Shipping calculation
  const shippingInfo = getCityShippingRate(customer.city || 'Other Cities', subtotal);
  const calculatedShippingFee = shippingInfo.estimatedRate;
  const grandTotal = Math.max(0, subtotal - couponDiscountAmount + calculatedShippingFee);

  if (!isOpen) return null;

  const handleApplyCoupon = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!couponInput.trim()) return;

    const res = validateDiscountCode(couponInput.trim(), subtotal);
    if (res.valid && res.discountCode) {
      setAppliedCoupon(res.discountCode);
      setCouponDiscountAmount(res.discountAmount);
      setCouponMessage({
        type: 'success',
        text: `Coupon "${res.discountCode.code}" applied! Saved ${formatPKR(res.discountAmount)}`,
      });
    } else {
      setAppliedCoupon(null);
      setCouponDiscountAmount(0);
      setCouponMessage({
        type: 'error',
        text: res.message || 'Invalid coupon code. Try WELCOME10',
      });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscountAmount(0);
    setCouponInput('');
    setCouponMessage(null);
  };

  const validateForm = () => {
    const errs: { [key: string]: string } = {};
    if (!customer.fullName.trim()) errs.fullName = 'Please enter your full name';
    if (!customer.whatsappNumber.trim()) {
      errs.whatsappNumber = 'Please enter your active WhatsApp number';
    } else if (customer.whatsappNumber.trim().length < 9) {
      errs.whatsappNumber = 'Please enter a valid active phone number (e.g. 0327 7045677)';
    }
    if (!customer.city.trim()) errs.city = 'Please select or enter your city in Pakistan';
    if (!customer.deliveryAddress.trim()) errs.deliveryAddress = 'Please enter complete delivery address';
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinueToWhatsApp = () => {
    if (!validateForm()) {
      return;
    }

    const ref = `CC-${Math.floor(10000 + Math.random() * 90000)}`;
    setOrderRefId(ref);
    setLastOrderItems([...cart]);
    setLastSubtotal(subtotal);
    setLastTotal(grandTotal);

    const actualGiftOccasion = isGiftOrder && giftOccasion !== OCCASIONS[0] ? giftOccasion : undefined;
    const actualGiftNote = isGiftOrder && giftNote.trim() ? giftNote.trim() : undefined;

    // Log the action into StoreContext for the Admin Dashboard
    logCustomerAction({
      orderRef: ref,
      customerName: customer.fullName,
      whatsappNumber: customer.whatsappNumber,
      city: customer.city,
      deliveryAddress: customer.deliveryAddress,
      actionType: 'whatsapp_order',
      items: cart.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        color: item.selectedColor,
        size: item.selectedSize,
      })),
      subtotal: subtotal,
      shippingFee: calculatedShippingFee,
      discountCode: appliedCoupon ? appliedCoupon.code : undefined,
      discountAmount: couponDiscountAmount > 0 ? couponDiscountAmount : undefined,
      totalAmount: grandTotal,
      giftOccasion: actualGiftOccasion,
      giftNote: actualGiftNote,
      courierPartner: shippingInfo.courierPartner,
      craftingStage: 'Order Received',
      notes: `${customer.notes ? customer.notes + ' • ' : ''}Ref: ${ref}`,
      status: 'Pending',
    });

    const whatsappUrl = generateOrderWhatsAppUrl(cart, customer, subtotal, {
      orderRef: ref,
      discountCode: appliedCoupon ? appliedCoupon.code : undefined,
      discountAmount: couponDiscountAmount > 0 ? couponDiscountAmount : undefined,
      shippingFee: calculatedShippingFee,
      giftOccasion: actualGiftOccasion,
      giftNote: actualGiftNote,
    });
    setLastWhatsAppUrl(whatsappUrl);

    // Clear the cart as requested by user!
    clearCart();

    // Transition to order completion state
    setOrderPlacedSuccess(true);
    
    // Open WhatsApp in new window/tab
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 450);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const boughtItemNames = lastOrderItems.map(i => i.product.name).join(', ') || 'Handmade Crochet Creation';

    addReview({
      customerName: customer.fullName || 'Happy Client',
      city: customer.city || 'Pakistan',
      rating: reviewRating,
      comment: reviewComment.trim(),
      productBought: boughtItemNames,
      verifiedPurchase: true,
      status: 'Approved',
      featured: true,
    });

    setReviewSubmitted(true);
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(orderRefId);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCloseAndReset = () => {
    setOrderPlacedSuccess(false);
    setReviewSubmitted(false);
    setReviewComment('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#EAE3DA] overflow-hidden my-auto max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        id="order-receipt-modal"
      >
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-[#EAE3DA] bg-[#FAF8F5] flex items-center justify-between">
          {!orderPlacedSuccess ? (
            <button
              onClick={onBackToCart}
              className="text-xs font-semibold text-[#6B5B52] hover:text-[#2C2420] flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Basket
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Order Dispatched & Basket Reset</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            {!orderPlacedSuccess && (
              <button
                onClick={handlePrint}
                className="p-2 rounded-full text-[#6B5B52] hover:text-[#2C2420] hover:bg-[#F0EBE3] transition-colors"
                title="Print Receipt"
              >
                <Printer className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleCloseAndReset}
              className="p-2 rounded-full text-[#6B5B52] hover:text-[#2C2420] hover:bg-[#F0EBE3] transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-8 space-y-6">

          {/* SCREEN A: SUCCESS & REVIEW PROMPT (When order is submitted) */}
          {orderPlacedSuccess ? (
            <div className="space-y-6 text-center animate-in zoom-in-95 duration-200">
              {/* Success Badge */}
              <div className="w-16 h-16 rounded-full bg-[#E8F8EE] text-[#25D366] flex items-center justify-center mx-auto border border-[#BDEAC8] shadow-sm">
                <CheckCircle2 className="w-9 h-9 fill-[#25D366] text-white" />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 bg-[#F3EEF9] px-3.5 py-1 rounded-full border border-[#DFCFF0]">
                  <span className="text-xs font-mono font-bold text-[#604284]">
                    Order #{orderRefId}
                  </span>
                  <button
                    onClick={handleCopyRef}
                    className="p-1 rounded text-[#745699] hover:text-[#2C2420] transition-colors"
                    title="Copy Order Reference"
                  >
                    {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2420] mt-3">
                  Thank You for Your Order!
                </h3>
                <p className="text-xs sm:text-sm text-[#6B5B52] max-w-md mx-auto mt-2 leading-relaxed">
                  Your order details have been forwarded to our WhatsApp desk. <strong>Your basket has been cleared.</strong>
                </p>
              </div>

              {/* Order Quick Summary Box */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE3DA] text-left text-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-[#EAE3DA]">
                  <span className="font-semibold text-[#2C2420]">Recipient:</span>
                  <span className="text-[#4A3E37] font-medium">{customer.fullName} ({customer.city})</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#EAE3DA]">
                  <span className="font-semibold text-[#2C2420]">Total Amount (COD):</span>
                  <span className="font-bold text-[#745699] text-sm">{formatPKR(lastTotal || lastSubtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#7C6C63]">
                  <span>Courier Partner:</span>
                  <span>{shippingInfo.courierPartner} ({shippingInfo.transitDays})</span>
                </div>
                {isGiftOrder && giftNote && (
                  <div className="pt-2 border-t border-[#EAE3DA] text-[11px] text-[#7C6C63]">
                    <span className="font-semibold text-[#2C2420]">Handwritten Card: </span>
                    <span className="italic">"{giftNote}"</span>
                  </div>
                )}
              </div>

              {/* WhatsApp Re-open & Live Tracking Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lastWhatsAppUrl && (
                  <a
                    href={lastWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BE5C] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Re-open WhatsApp Chat</span>
                  </a>
                )}

                {onNavigateToTracking && (
                  <button
                    onClick={() => {
                      handleCloseAndReset();
                      onNavigateToTracking(orderRefId);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-[#9B86BD] hover:bg-[#8063A4] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <Package className="w-4 h-4" />
                    <span>Track Order Progress Live</span>
                  </button>
                )}
              </div>

              {/* REVIEW PROMPT SECTION */}
              <div className="p-6 rounded-3xl bg-white border-2 border-[#DFCFF0] shadow-sm text-left space-y-4 relative overflow-hidden">
                <div className="flex items-center gap-2 text-xs font-bold text-[#604284]">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span>Your Feedback Means the World to Us</span>
                </div>

                <h4 className="font-serif text-lg font-bold text-[#2C2420]">
                  Leave a Review for Chorchelia Craft
                </h4>
                <p className="text-xs text-[#6B5B52]">
                  How was your experience exploring our handmade collection and placing your order? Your kind words support our small artisan studio!
                </p>

                {reviewSubmitted ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <div>
                      <span className="font-bold block">Review Submitted!</span>
                      <span className="text-[11px]">Thank you {customer.fullName}! Your kind review has been published on our customer feedback wall.</span>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-3 pt-1">
                    {/* Interactive Star Rating */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#2C2420] mb-1">
                        Select Rating:
                      </label>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className="p-1 text-amber-400 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= reviewRating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'fill-gray-200 text-gray-200'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-[#2C2420] ml-2">
                          {reviewRating}.0 Stars
                        </span>
                      </div>
                    </div>

                    {/* Review text */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#2C2420] mb-1">
                        Your Feedback / Message:
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="e.g. Beautiful crochet bouquet! Fast response on WhatsApp and loving the pastel colors..."
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#EAE3DA] focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-[#9B86BD] hover:bg-[#8063A4] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
                    >
                      Post Review to Store
                    </button>
                  </form>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                {onNavigateToPolicies && (
                  <button
                    onClick={() => {
                      handleCloseAndReset();
                      onNavigateToPolicies();
                    }}
                    className="text-xs text-[#745699] hover:underline font-semibold"
                  >
                    View Official Order & Delivery Policies
                  </button>
                )}

                <button
                  onClick={handleCloseAndReset}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2C2420] hover:bg-[#4A3E37] text-white text-xs font-bold uppercase tracking-wider transition-colors ml-auto"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* SCREEN B: INVOICE & CUSTOMER FORM (Before submitting order) */
            <>
              {/* Digital Invoice Header */}
              <div className="text-center pb-5 border-b border-dashed border-[#DFCFF0]">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#EBE1F5] text-[#745699] font-serif font-bold text-xl mb-2">
                  C
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2420]">
                  {SITE_CONFIG.BUSINESS_NAME}
                </h2>
                <p className="text-xs text-[#7C6C63] mt-0.5">
                  Handmade Crochet Artisans • Pakistan
                </p>
                <div className="inline-block mt-2 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#F5F2EC] text-[#5A4940] border border-[#EAE3DA]">
                  Receipt & Order Summary
                </div>
              </div>

              {/* Order Items Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-[#2C2420] border-b border-[#EAE3DA] pb-2">
                  <span>Selected Handmade Pieces ({totalItems})</span>
                  <span>Amount</span>
                </div>

                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {cart.map((item, idx) => {
                    const itemTotal = item.product.price * item.quantity;
                    return (
                      <div
                        key={`${item.product.id}-${idx}`}
                        className="flex items-start justify-between gap-3 text-xs py-2 border-b border-[#F5F1EA] last:border-b-0"
                      >
                        <div className="flex gap-3">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-12 h-12 rounded-lg object-cover bg-[#F5F1EA] flex-shrink-0"
                          />
                          <div>
                            <span className="font-serif font-semibold text-[#2C2420] block">
                              {item.product.name}
                            </span>
                            <span className="text-[11px] text-[#7C6C63]">
                              Qty: {item.quantity} × {formatPKR(item.product.price)}
                            </span>
                            {(item.selectedColor || item.selectedSize) && (
                              <div className="text-[10px] text-[#8C7A70] mt-0.5">
                                {item.selectedColor && <span>Color: {item.selectedColor} </span>}
                                {item.selectedSize && <span>• Size: {item.selectedSize}</span>}
                              </div>
                            )}
                          </div>
                        </div>

                        <span className="font-semibold text-[#2C2420] whitespace-nowrap">
                          {formatPKR(itemTotal)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Voucher Discount Code Section */}
                <div className="pt-2 border-t border-[#EAE3DA]">
                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 text-[#A8988E] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          placeholder="Discount Code (e.g. WELCOME10)"
                          className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-xl text-xs text-[#2C2420] font-mono focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 uppercase"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon()}
                        className="px-4 py-2 bg-[#FAF8F5] hover:bg-[#EBE1F5] text-[#604284] border border-[#DFCFF0] text-xs font-semibold rounded-xl transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-mono font-bold text-emerald-800">{appliedCoupon.code}</span>
                        <span className="text-emerald-700">(-{formatPKR(couponDiscountAmount)})</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-xs text-red-600 hover:underline font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {couponMessage && !appliedCoupon && (
                    <p className={`text-[11px] mt-1 ${couponMessage.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {couponMessage.text}
                    </p>
                  )}
                </div>

                {/* Subtotal & Breakdown Calculation */}
                <div className="pt-3 border-t border-[#EAE3DA] space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#6B5B52]">
                    <span>Items Subtotal:</span>
                    <span className="font-semibold text-[#2C2420]">{formatPKR(subtotal)}</span>
                  </div>

                  {couponDiscountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Voucher Discount:</span>
                      <span className="font-semibold">-{formatPKR(couponDiscountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#6B5B52]">
                    <div className="flex items-center gap-1">
                      <span>Delivery ({customer.city}):</span>
                      <span className="text-[10px] text-[#745699] font-medium">({shippingInfo.transitDays})</span>
                    </div>
                    <span className={calculatedShippingFee === 0 ? 'text-emerald-700 font-bold' : 'font-semibold text-[#2C2420]'}>
                      {calculatedShippingFee === 0 ? 'FREE' : formatPKR(calculatedShippingFee)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm font-bold text-[#2C2420] pt-2 border-t border-[#EAE3DA]">
                    <span>Estimated Total (Cash on Delivery):</span>
                    <span className="text-[#745699] text-base">{formatPKR(grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Customer Information Form */}
              <div className="pt-2 border-t border-[#EAE3DA]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#2C2420] mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-[#9B86BD]" />
                  <span>Delivery Details (Pakistan)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customer.fullName}
                      onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                      placeholder="e.g. Ayesha Malik"
                      className={`w-full px-3.5 py-2 text-xs rounded-xl border ${
                        errors.fullName ? 'border-red-400 bg-red-50/20' : 'border-[#EAE3DA] bg-white'
                      } focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]`}
                    />
                    {errors.fullName && (
                      <span className="text-[10px] text-red-600 mt-1 block">{errors.fullName}</span>
                    )}
                  </div>

                  {/* WhatsApp Number */}
                  <div>
                    <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                      WhatsApp Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={customer.whatsappNumber}
                      onChange={(e) => setCustomer({ ...customer, whatsappNumber: e.target.value })}
                      placeholder="e.g. 0327 7045677"
                      className={`w-full px-3.5 py-2 text-xs rounded-xl border ${
                        errors.whatsappNumber ? 'border-red-400 bg-red-50/20' : 'border-[#EAE3DA] bg-white'
                      } focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]`}
                    />
                    {errors.whatsappNumber && (
                      <span className="text-[10px] text-red-600 mt-1 block">{errors.whatsappNumber}</span>
                    )}
                  </div>

                  {/* City Selector with Pakistan Courier Estimator */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                      Delivery City (Pakistan) <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <select
                        value={customer.city}
                        onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420] font-medium"
                      >
                        {PAKISTAN_CITIES.map((c) => (
                          <option key={c.city} value={c.city}>
                            {c.city} ({c.transitDays}) — {c.estimatedRate === 0 ? 'FREE' : formatPKR(c.estimatedRate)}
                          </option>
                        ))}
                        <option value="Other Town / Village">Other Town / Village</option>
                      </select>

                      <input
                        type="text"
                        value={customer.city}
                        onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                        placeholder="Or enter custom town/district"
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                      />
                    </div>
                    <span className="text-[11px] text-[#7C6C63] mt-1 block">
                      Dispatched from Rahim Yar Khan via <strong>{shippingInfo.courierPartner}</strong> ({shippingInfo.transitDays}).
                    </span>
                  </div>

                  {/* Complete Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                      Complete Delivery Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customer.deliveryAddress}
                      onChange={(e) => setCustomer({ ...customer, deliveryAddress: e.target.value })}
                      placeholder="House/Street #, Sector/Area, Landmark"
                      className={`w-full px-3.5 py-2 text-xs rounded-xl border ${
                        errors.deliveryAddress ? 'border-red-400 bg-red-50/20' : 'border-[#EAE3DA] bg-white'
                      } focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]`}
                    />
                    {errors.deliveryAddress && (
                      <span className="text-[10px] text-red-600 mt-1 block">{errors.deliveryAddress}</span>
                    )}
                  </div>

                  {/* Handwritten Gift Card & Occasion Selector */}
                  <div className="sm:col-span-2 pt-2 border-t border-[#EAE3DA]">
                    <div className="flex items-center justify-between mb-2">
                      <button
                        type="button"
                        onClick={() => setIsGiftOrder(!isGiftOrder)}
                        className="flex items-center gap-2 text-xs font-bold text-[#604284] hover:text-[#2C2420] transition-colors"
                      >
                        <Gift className="w-4 h-4 text-[#9B86BD]" />
                        <span>Include Handwritten Gift Note & Ribbon?</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EBE1F5] text-[#604284] font-semibold">
                          {isGiftOrder ? 'Enabled' : 'Click to Add'}
                        </span>
                      </button>
                    </div>

                    {isGiftOrder && (
                      <div className="p-3.5 rounded-2xl bg-[#FAF6EE] border border-[#EFE5D0] space-y-3 animate-in fade-in duration-200">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#8A6729] mb-1">
                            Select Occasion:
                          </label>
                          <select
                            value={giftOccasion}
                            onChange={(e) => setGiftOccasion(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#EFE5D0] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                          >
                            {OCCASIONS.map((occ) => (
                              <option key={occ} value={occ}>
                                {occ}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-[11px] font-semibold text-[#8A6729]">
                              Handwritten Note for Parcel:
                            </label>
                            <span className="text-[10px] text-[#A8988E]">
                              {giftNote.length}/150 chars
                            </span>
                          </div>
                          <textarea
                            rows={2}
                            maxLength={150}
                            value={giftNote}
                            onChange={(e) => setGiftNote(e.target.value)}
                            placeholder="e.g. Wishing you the happiest birthday! May this crochet bouquet bring you perpetual joy..."
                            className="w-full px-3 py-2 text-xs rounded-xl border border-[#EFE5D0] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                          />
                          <p className="text-[10px] text-[#8A6729] mt-0.5 italic">
                            Written by hand on premium cardstock and tucked inside your parcel ribbon.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Optional Notes */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                      Order Notes / Custom Requests (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={customer.notes}
                      onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                      placeholder="Special instructions, e.g. color adjustments, custom stem length, or preferred delivery timing"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Note & Policies Notice */}
              <div className="p-3.5 rounded-2xl bg-[#F5F1EA] border border-[#EAE3DA] text-xs text-[#5A4940] flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#9B86BD] flex-shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <span className="font-semibold text-[#2C2420]">How your order will be confirmed:</span>
                  <p className="mt-0.5">
                    Clicking below formats your order with your chosen delivery city and gift note, clears your basket, and opens WhatsApp with your <strong>Order Ref #{orderRefId || 'CC-XXXXX'}</strong>.
                  </p>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Action Button Bar (Only shown on Form Screen) */}
        {!orderPlacedSuccess && (
          <div className="p-4 sm:p-6 bg-[#FAF8F5] border-t border-[#EAE3DA] flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onBackToCart}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-[#EAE3DA] bg-white hover:bg-[#F3EFEA] text-xs font-semibold text-[#4A3E37] transition-colors order-2 sm:order-1"
            >
              Review Basket
            </button>

            <button
              onClick={handleContinueToWhatsApp}
              id="continue-whatsapp-order-btn"
              className="w-full flex-1 py-3.5 px-6 rounded-xl bg-[#25D366] hover:bg-[#20BE5C] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 order-1 sm:order-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Confirm & Send on WhatsApp</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
