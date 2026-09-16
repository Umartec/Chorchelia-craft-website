import React, { useState } from 'react';
import { X, ShoppingBag, ArrowRight, MessageCircle, Sparkles, Check, ShieldCheck, Truck, Clock } from 'lucide-react';
import { Product } from '../types';
import { formatPKR, generateGeneralInquiryWhatsAppUrl } from '../utils/whatsapp';
import { useCart } from '../context/CartContext';
import { SITE_CONFIG } from '../config/site';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  const { addToCart, buyNow } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors && product.colors.length > 0 ? product.colors[0] : ''
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : ''
  );
  const [quantity, setQuantity] = useState(1);
  const [customNote, setCustomNote] = useState('');

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize, customNote);
  };

  const handleBuyNow = () => {
    buyNow(product, quantity, selectedColor, selectedSize);
    onClose();
  };

  const handleDirectWhatsAppInquiry = () => {
    const inquiryText = `Hello ${SITE_CONFIG.BUSINESS_NAME}! I'm interested in ordering "${product.name}" (${formatPKR(product.price)}). Color: ${selectedColor || 'Standard'}, Quantity: ${quantity}. Can you confirm availability?`;
    const cleanPhone = SITE_CONFIG.WHATSAPP_NUMBER.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(inquiryText)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-[#EAE3DA] overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
        id="product-details-modal"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs text-[#4A3E37] hover:text-[#2C2420] hover:bg-[#F3EFEA] border border-[#EAE3DA] flex items-center justify-center shadow-xs transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Left Column: Image Gallery (5 cols) */}
          <div className="md:col-span-6 flex flex-col gap-3">
            {/* Main Stage Image */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#F7F4EE] border border-[#EAE3DA]">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-white/90 backdrop-blur-xs text-[#745699] border border-[#DFCFF0] shadow-xs">
                  {product.availability}
                </span>
              </div>
            </div>

            {/* Thumbnail Row */}
            {product.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-[#9B86BD] ring-2 ring-[#9B86BD]/20'
                        : 'border-[#EAE3DA] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Handmade Craft Assurance Note */}
            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3DA] text-xs text-[#6B5B52] flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#9B86BD] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#2C2420] mb-0.5">Artisanal Handmade Assurance</p>
                <p>{product.handmadeNote || 'Crafted patiently stitch by stitch using premium yarn fibers.'}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Order Controls (7 cols) */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-5">
            <div>
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs text-[#7C6C63] mb-1">
                <span className="uppercase tracking-wider font-semibold text-[#8F7C9E]">
                  {product.category.replace('-', ' ')}
                </span>
                <span className="font-mono text-[11px] text-[#A8988E]">SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2420] leading-tight">
                {product.name}
              </h2>

              {/* Price */}
              <div className="mt-2 flex items-baseline gap-3">
                <span className="font-serif text-2xl font-extrabold text-[#2C2420]">
                  {formatPKR(product.price)}
                </span>
                <span className="text-xs text-[#7C6C63]">
                  (Standard courier across Pakistan)
                </span>
              </div>

              {/* Delivery Time & Dispatch Timeline Card */}
              <div className="mt-3 p-3.5 rounded-2xl bg-[#F6F0FA] border border-[#DFCFF0] flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white text-[#745699] flex items-center justify-center border border-[#DFCFF0] flex-shrink-0 shadow-xs">
                  <Truck className="w-4 h-4 text-[#745699]" />
                </div>
                <div className="text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#2C2420]">
                    <span>Estimated Delivery Timeline:</span>
                    <span className="px-2 py-0.5 rounded-full bg-white text-[#745699] text-[10px] font-semibold border border-[#EBE1F5]">
                      {product.availability}
                    </span>
                  </div>
                  <p className="text-[#5B4840] mt-0.5 font-medium leading-snug">
                    {product.deliveryTime || 'Ready to ship in 1-2 days • Delivery in 3-5 business days across Pakistan'}
                  </p>
                  <p className="text-[11px] text-[#7C6C63] mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#9B86BD]" />
                    <span>Exact dispatch tracking number sent via WhatsApp once shipped.</span>
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-[#5C4D44] mt-3 leading-relaxed border-t border-[#F0EBE3] pt-3">
                {product.description}
              </p>

              {/* Specification Grid */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs bg-[#FAF8F5] p-3 rounded-xl border border-[#EAE3DA]">
                <div>
                  <span className="text-[#8C7A70] block">Materials:</span>
                  <span className="font-medium text-[#2C2420]">{product.materials}</span>
                </div>
                {product.dimensions && (
                  <div>
                    <span className="text-[#8C7A70] block">Dimensions:</span>
                    <span className="font-medium text-[#2C2420]">{product.dimensions}</span>
                  </div>
                )}
              </div>

              {/* Color Options */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-4">
                  <label className="block text-xs font-semibold text-[#2C2420] mb-1.5">
                    Select Color / Palette: <span className="font-normal text-[#745699]">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          selectedColor === color
                            ? 'border-[#9B86BD] bg-[#F3EEF9] text-[#604284] shadow-xs'
                            : 'border-[#EAE3DA] bg-white text-[#4A3E37] hover:border-[#DFCFF0]'
                        }`}
                      >
                        {selectedColor === color && <Check className="w-3 h-3 inline mr-1 text-[#9B86BD]" />}
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Options */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-4">
                  <label className="block text-xs font-semibold text-[#2C2420] mb-1.5">
                    Select Size / Option: <span className="font-normal text-[#745699]">{selectedSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          selectedSize === size
                            ? 'border-[#9B86BD] bg-[#F3EEF9] text-[#604284] shadow-xs'
                            : 'border-[#EAE3DA] bg-white text-[#4A3E37] hover:border-[#DFCFF0]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Optional Custom Note */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                  Customization Note (Optional):
                </label>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="e.g., Specific flower stem color or gift tag name"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                />
              </div>

              {/* Quantity Counter */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-xs font-semibold text-[#2C2420]">Quantity:</span>
                <div className="flex items-center border border-[#EAE3DA] rounded-xl bg-white overflow-hidden shadow-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-sm font-semibold text-[#4A3E37] hover:bg-[#FAF8F5]"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-[#2C2420] min-w-[28px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-sm font-semibold text-[#4A3E37] hover:bg-[#FAF8F5]"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-[#8C7A70]">
                  Subtotal: <strong className="text-[#2C2420]">{formatPKR(product.price * quantity)}</strong>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#F0EBE3] space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={handleAddToCart}
                  id="modal-add-to-cart-btn"
                  className="w-full py-3 px-4 rounded-xl border border-[#9B86BD] bg-[#F8F5FB] hover:bg-[#EBE1F5] text-[#604284] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  id="modal-buy-now-btn"
                  className="w-full py-3 px-4 rounded-xl bg-[#9B86BD] hover:bg-[#8063A4] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs active:scale-98"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Direct WhatsApp Order Button */}
              <button
                onClick={handleDirectWhatsAppInquiry}
                id="modal-whatsapp-inquiry-btn"
                className="w-full py-2.5 px-4 rounded-xl border border-[#D5C6E6] bg-white hover:bg-[#FAF8F5] text-[#4A3E37] text-xs font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Ask about this item on WhatsApp</span>
              </button>

              {/* Trust Indicators */}
              <div className="pt-2 flex items-center justify-around text-[11px] text-[#7C6C63] border-t border-dashed border-[#EAE3DA]">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#9B86BD]" /> Delivery across Pakistan
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#9B86BD]" /> WhatsApp verification
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
