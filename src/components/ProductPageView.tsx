import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ShoppingBag, 
  MessageCircle, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  Star, 
  Share2, 
  Copy, 
  Check, 
  Heart, 
  Clock, 
  Palette, 
  CheckCircle2, 
  ChevronRight, 
  RotateCcw,
  Gift,
  HelpCircle
} from 'lucide-react';
import { Product, CustomerReview } from '../types';
import { formatPKR, generateProductWhatsAppUrl } from '../utils/whatsapp';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { SITE_CONFIG } from '../config/site';
import { PAKISTAN_CITIES, getCityShippingRate } from '../data/pakistanCities';

interface ProductPageViewProps {
  product: Product;
  onBackToShop: () => void;
  onSelectProduct: (p: Product) => void;
  onNavigateToPolicies?: () => void;
}

export const ProductPageView: React.FC<ProductPageViewProps> = ({
  product,
  onBackToShop,
  onSelectProduct,
  onNavigateToPolicies,
}) => {
  const { addToCart, buyNow, setIsCartOpen } = useCart();
  const { products, reviews, settings, isInWishlist, toggleWishlist } = useStore();
  const isSaved = isInWishlist(product.id);

  const [selectedImage, setSelectedImage] = useState<string>(product.images[0]);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors && product.colors.length > 0 ? product.colors[0] : ''
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'delivery' | 'care' | 'policies'>('details');

  // Pakistan Courier Delivery Estimator State
  const [estimateCity, setEstimateCity] = useState<string>('Lahore');
  const cityShipping = getCityShippingRate(estimateCity, product.price * quantity);

  // Scroll to top when product changes
  useEffect(() => {
    setSelectedImage(product.images[0]);
    if (product.colors && product.colors.length > 0) setSelectedColor(product.colors[0]);
    if (product.sizes && product.sizes.length > 0) setSelectedSize(product.sizes[0]);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = `Check out this handmade ${product.name} from Chorchelia Craft:\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleWhatsAppDirectInquiry = () => {
    const url = generateProductWhatsAppUrl(product, selectedColor, selectedSize);
    window.open(url, '_blank');
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    buyNow(product, quantity, selectedColor, selectedSize);
  };

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  // Relevant reviews
  const productReviews = reviews.filter((r) => r.status !== 'Hidden');

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-6 sm:py-10 text-[#2C2420]" id="product-page-view">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Breadcrumbs & Back Navigation */}
        <nav className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8 text-xs text-[#7C6C63]">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={onBackToShop}
              className="hover:text-[#2C2420] font-medium transition-colors"
            >
              Home
            </button>
            <ChevronRight className="w-3 h-3 text-[#B8AAA2]" />
            <button
              onClick={onBackToShop}
              className="hover:text-[#2C2420] font-medium transition-colors"
            >
              Collection
            </button>
            <ChevronRight className="w-3 h-3 text-[#B8AAA2]" />
            <span className="text-[#9B86BD] font-semibold">{product.category}</span>
            <ChevronRight className="w-3 h-3 text-[#B8AAA2]" />
            <span className="text-[#2C2420] font-bold truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[11px] font-semibold transition-all shadow-2xs ${
                isSaved
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white hover:bg-rose-50/50 border-[#EAE3DA] text-[#604284]'
              }`}
              title={isSaved ? 'Saved in Wishlist' : 'Save for Later'}
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-[#9B86BD]'}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#F3EEF9] border border-[#EAE3DA] hover:border-[#DFCFF0] text-[11px] font-semibold text-[#604284] transition-all shadow-2xs"
              title="Copy link to product"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#9B86BD]" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8F8EE] hover:bg-[#D4F3DE] border border-[#BDEAC8] text-[11px] font-semibold text-[#1E7E34] transition-all shadow-2xs"
              title="Share on WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5 text-[#25D366]" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </nav>

        {/* Product Showcase Grid (2 columns: Gallery on Left, Details on Right) */}
        <div className="bg-white rounded-3xl border border-[#EAE3DA] shadow-xs p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* LEFT COLUMN: Gallery Showcase (5 cols on lg) */}
            <div className="lg:col-span-6 space-y-4">
              {/* Main Zoomed Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#EAE3DA] shadow-xs group">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-xs bg-[#2C2420] text-white">
                    {product.category}
                  </span>
                  {product.availability === 'In Stock' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F8EE] text-[#1E7E34] border border-[#BDEAC8]">
                      ✓ In Stock (Ready to Ship)
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EBE1F5] text-[#604284] border border-[#DFCFF0]">
                      ✦ Made to Order
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#EBE1F5]" />
                  <span>100% Handcrafted</span>
                </div>
              </div>

              {/* Thumbnail Strip */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                        selectedImage === img
                          ? 'border-[#9B86BD] shadow-sm scale-105'
                          : 'border-[#EAE3DA] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Studio Assurance Bar */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#F5F1EA] text-xs">
                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE3DA] flex items-center gap-2.5">
                  <Gift className="w-4 h-4 text-[#9B86BD] flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-[#2C2420] block text-[11px]">Gift Packaging</span>
                    <span className="text-[10px] text-[#7C6C63]">Free ribbon wrap & card</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE3DA] flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-[#9B86BD] flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-[#2C2420] block text-[11px]">Nationwide Dispatch</span>
                    <span className="text-[10px] text-[#7C6C63]">TCS / Leopards / Trax</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Product Info & Order Configuration (6 cols on lg) */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Heading & SKU */}
              <div>
                <div className="flex items-center justify-between text-xs text-[#7C6C63] mb-1.5">
                  <span className="font-medium">SKU: {product.sku}</span>
                  <span className="text-[#9B86BD] font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Artisan Original
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2C2420] leading-tight flex-1">
                    {product.name}
                  </h1>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-center shadow-xs flex-shrink-0 active:scale-95 ${
                      isSaved
                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                        : 'bg-white border-[#EAE3DA] text-[#6B5B52] hover:text-rose-600 hover:border-rose-200'
                    }`}
                    title={isSaved ? 'Remove from Saved' : 'Save for Later'}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Rating & Reviews Link */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#2C2420]">5.0</span>
                  <span className="text-xs text-[#7C6C63]">• 100% Recommended in Pakistan</span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-[#F5F2EC] border border-[#EAE3DA] flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7C6C63] block">
                    Price in Pakistani Rupees
                  </span>
                  <span className="font-serif text-3xl font-bold text-[#2C2420]">
                    {formatPKR(product.price)}
                  </span>
                </div>
                <span className="text-xs text-[#5C4D44] font-medium">
                  Delivery charges confirmed on WhatsApp
                </span>
              </div>

              {/* Delivery Timeline & City Estimator Box */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE3DA] space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#604284] font-bold">
                    <Truck className="w-4 h-4 text-[#9B86BD]" />
                    <span>Courier Delivery Estimator by City:</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    COD Across Pakistan
                  </span>
                </div>

                {/* City Selector */}
                <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                  <select
                    value={estimateCity}
                    onChange={(e) => setEstimateCity(e.target.value)}
                    className="flex-1 bg-white border border-[#EAE3DA] rounded-xl px-3 py-2 text-xs text-[#2C2420] font-medium focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40"
                  >
                    {PAKISTAN_CITIES.map((c) => (
                      <option key={c.city} value={c.city}>
                        {c.city} ({c.transitDays}) — {c.estimatedRate === 0 ? 'FREE' : formatPKR(c.estimatedRate)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Estimated Rate & Courier Partner details */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#EAE3DA] text-[11px]">
                  <div>
                    <span className="text-[#7C6C63] block">Estimated Transit:</span>
                    <strong className="text-[#2C2420] font-semibold">{cityShipping.transitDays}</strong>
                  </div>
                  <div>
                    <span className="text-[#7C6C63] block">Courier Fee:</span>
                    <strong className={cityShipping.estimatedRate === 0 ? 'text-emerald-700 font-bold' : 'text-[#2C2420] font-semibold'}>
                      {cityShipping.estimatedRate === 0 ? 'FREE Delivery' : formatPKR(cityShipping.estimatedRate)}
                    </strong>
                  </div>
                </div>

                <div className="text-[10px] text-[#7C6C63] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                  <span>Dispatched with care from Rahim Yar Khan via {cityShipping.courierPartner}.</span>
                </div>
              </div>

              {/* Color Options */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-[#2C2420] mb-2">
                    Select Color Palette: <span className="text-[#9B86BD] font-medium">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                          selectedColor === c
                            ? 'bg-[#EBE1F5] text-[#604284] border-[#9B86BD] shadow-2xs font-bold'
                            : 'bg-white text-[#4A3E37] border-[#EAE3DA] hover:border-[#DFCFF0]'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Options */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-[#2C2420] mb-2">
                    Select Size / Stems: <span className="text-[#9B86BD] font-medium">{selectedSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                          selectedSize === s
                            ? 'bg-[#EBE1F5] text-[#604284] border-[#9B86BD] shadow-2xs font-bold'
                            : 'bg-white text-[#4A3E37] border-[#EAE3DA] hover:border-[#DFCFF0]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div>
                <label className="block text-xs font-bold text-[#2C2420] mb-2">Quantity:</label>
                <div className="inline-flex items-center border border-[#EAE3DA] rounded-xl bg-white overflow-hidden shadow-2xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-sm font-semibold text-[#4A3E37] hover:bg-[#FAF8F5] transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-[#2C2420]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-sm font-semibold text-[#4A3E37] hover:bg-[#FAF8F5] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Add to Basket */}
                  <button
                    onClick={handleAddToCart}
                    id="product-page-add-to-cart-btn"
                    className="w-full py-3.5 px-5 rounded-2xl bg-[#9B86BD] hover:bg-[#8063A4] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-98"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Basket</span>
                  </button>

                  {/* Buy Now */}
                  <button
                    onClick={handleBuyNow}
                    id="product-page-buy-now-btn"
                    className="w-full py-3.5 px-5 rounded-2xl bg-[#2C2420] hover:bg-[#4A3E37] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
                  >
                    <span>Instant Buy Now</span>
                  </button>
                </div>

                {/* Direct WhatsApp Order CTA */}
                <button
                  onClick={handleWhatsAppDirectInquiry}
                  id="product-page-whatsapp-inquiry-btn"
                  className="w-full py-3.5 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20BE5C] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order Directly on WhatsApp ({SITE_CONFIG.CONTACT.PHONE_DISPLAY})</span>
                </button>
              </div>

              {/* Important Policy Note */}
              <div className="p-3 rounded-xl bg-[#F5F2EC] text-[11px] text-[#5C4D44] flex items-center justify-between">
                <span>Handmade products are crafted specifically for you.</span>
                {onNavigateToPolicies && (
                  <button
                    onClick={onNavigateToPolicies}
                    className="font-semibold text-[#745699] hover:underline whitespace-nowrap ml-2"
                  >
                    View Store Policies
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Product Specifications & Details Tabs */}
          <div className="mt-12 pt-8 border-t border-[#EAE3DA]">
            <div className="flex border-b border-[#EAE3DA] overflow-x-auto gap-2">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === 'details'
                    ? 'border-[#9B86BD] text-[#604284]'
                    : 'border-transparent text-[#7C6C63] hover:text-[#2C2420]'
                }`}
              >
                Craftsmanship & Description
              </button>
              <button
                onClick={() => setActiveTab('delivery')}
                className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === 'delivery'
                    ? 'border-[#9B86BD] text-[#604284]'
                    : 'border-transparent text-[#7C6C63] hover:text-[#2C2420]'
                }`}
              >
                Delivery In Pakistan
              </button>
              <button
                onClick={() => setActiveTab('care')}
                className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === 'care'
                    ? 'border-[#9B86BD] text-[#604284]'
                    : 'border-transparent text-[#7C6C63] hover:text-[#2C2420]'
                }`}
              >
                Yarn Care Instructions
              </button>
              <button
                onClick={() => setActiveTab('policies')}
                className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === 'policies'
                    ? 'border-[#9B86BD] text-[#604284]'
                    : 'border-transparent text-[#7C6C63] hover:text-[#2C2420]'
                }`}
              >
                Return & Refund Policy
              </button>
            </div>

            <div className="py-6 text-xs text-[#5C4D44] leading-relaxed max-w-4xl space-y-4">
              {activeTab === 'details' && (
                <div className="space-y-3">
                  <p className="text-sm text-[#2C2420]">{product.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                    <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3DA]">
                      <span className="font-bold text-[#2C2420] block mb-1">Materials:</span>
                      <span>{product.materials || '100% Premium Milk Cotton Yarn, Hypoallergenic Polyester Fill, Wire Stems'}</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3DA]">
                      <span className="font-bold text-[#2C2420] block mb-1">Craft Origin:</span>
                      <span>Handmade with patience by Chorchelia Craft artisans in Rahim Yar Khan, Punjab, Pakistan.</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'delivery' && (
                <div className="space-y-3">
                  <p>
                    We deliver across all cities in Pakistan through TCS, Leopards, Trax, and M&P.
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li><strong>Ready to Dispatch Items:</strong> Shipped within 1–2 business days.</li>
                    <li><strong>Custom / Made to Order:</strong> Prepared within 3–7 business days.</li>
                    <li><strong>Delivery Charges:</strong> Quoted transparently on WhatsApp based on your destination city.</li>
                    <li><strong>Tracking:</strong> Tracking number shared on WhatsApp once handed over to the courier.</li>
                  </ul>
                </div>
              )}

              {activeTab === 'care' && (
                <div className="space-y-3">
                  <p>
                    Handmade crochet pieces are durable but appreciate gentle care to maintain their shape and vibrant colors:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>Gently dust flower petals and leaves with a soft makeup brush or blow dryer on cool mode.</li>
                    <li>For bags and wearable items, hand wash in cold water using a mild wool detergent.</li>
                    <li>Do not twist or wring; roll in a towel to remove excess moisture and dry flat in the shade.</li>
                    <li>Keep away from open flames and high-heat drying machines.</li>
                  </ul>
                </div>
              )}

              {activeTab === 'policies' && (
                <div className="space-y-3">
                  <p>
                    Because each item is handcrafted and prepared specifically for you, <strong>confirmed orders are generally non-refundable and cannot be returned for change of mind.</strong>
                  </p>
                  <p>
                    If an item arrives damaged or incorrect, send photos/videos to WhatsApp <strong>0327 7045677</strong> immediately for replacement or exchange.
                  </p>
                  {onNavigateToPolicies && (
                    <button
                      onClick={onNavigateToPolicies}
                      className="text-[#604284] font-bold hover:underline block pt-2"
                    >
                      Read all 18 official policies →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products from same category */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#9B86BD] block">
                  More From {product.category}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#2C2420]">
                  You May Also Love
                </h3>
              </div>
              <button
                onClick={onBackToShop}
                className="text-xs font-semibold text-[#745699] hover:underline"
              >
                Browse All Pieces →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectProduct(rel)}
                  className="bg-white rounded-2xl border border-[#EAE3DA] overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="aspect-square relative overflow-hidden bg-[#FAF8F5]">
                    <img
                      src={rel.images[0]}
                      alt={rel.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#2C2420] text-white">
                        {rel.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="font-serif font-bold text-sm text-[#2C2420] group-hover:text-[#604284] transition-colors">
                      {rel.name}
                    </h4>
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-serif font-bold text-[#2C2420] text-sm">
                        {formatPKR(rel.price)}
                      </span>
                      <span className="text-[11px] font-semibold text-[#745699]">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
