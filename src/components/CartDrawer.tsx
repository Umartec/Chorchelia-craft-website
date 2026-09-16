import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ArrowLeft, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPKR } from '../utils/whatsapp';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToOrder: () => void;
  onContinueShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToOrder,
  onContinueShopping,
}) => {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col border-l border-[#EAE3DA] animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
        id="cart-drawer"
      >
        {/* Cart Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAE3DA] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#EBE1F5] text-[#745699] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#2C2420]">Your Basket</h2>
              <p className="text-xs text-[#7C6C63]">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} selected
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#6B5B52] hover:text-[#2C2420] hover:bg-[#F5F1EA] transition-colors"
            aria-label="Close Basket"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#F3EEF9] text-[#9B86BD] flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#2C2420]">
                Your basket is empty
              </h3>
              <p className="text-xs text-[#7C6C63] max-w-xs leading-relaxed">
                Explore our handmade crochet bouquets, tote bags, and accessories crafted with love.
              </p>
              <button
                onClick={onContinueShopping}
                className="mt-2 px-5 py-2.5 rounded-full bg-[#9B86BD] hover:bg-[#8063A4] text-white text-xs font-semibold uppercase tracking-wider shadow-xs transition-all"
              >
                Browse Collection
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs text-[#7C6C63] pb-1 border-b border-[#EAE3DA]">
                <span>Items</span>
                <button
                  onClick={clearCart}
                  className="text-[11px] text-red-600 hover:text-red-700 flex items-center gap-1 font-medium"
                >
                  <Trash2 className="w-3 h-3" /> Clear Basket
                </button>
              </div>

              {cart.map((item, index) => {
                const itemTotal = item.product.price * item.quantity;
                return (
                  <div
                    key={`${item.product.id}-${index}`}
                    className="p-3 bg-white rounded-2xl border border-[#EAE3DA] shadow-xs flex gap-3 items-center"
                  >
                    {/* Thumbnail */}
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover bg-[#F5F1EA] flex-shrink-0"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-sm font-semibold text-[#2C2420] truncate">
                        {item.product.name}
                      </h4>
                      <div className="text-[11px] text-[#7C6C63] space-x-2 mt-0.5">
                        {item.selectedColor && (
                          <span>Color: <strong>{item.selectedColor}</strong></span>
                        )}
                        {item.selectedSize && (
                          <span>Size: <strong>{item.selectedSize}</strong></span>
                        )}
                      </div>
                      <div className="font-semibold text-xs text-[#2C2420] mt-1">
                        {formatPKR(item.product.price)} each
                      </div>
                    </div>

                    {/* Quantity controls & delete */}
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeFromCart(index)}
                        className="text-[#A8988E] hover:text-red-600 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center border border-[#EAE3DA] rounded-lg bg-[#FAF8F5] overflow-hidden">
                        <button
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-[#4A3E37] hover:bg-[#EBE1F5]"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-semibold text-[#2C2420]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-[#4A3E37] hover:bg-[#EBE1F5]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Footer / Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border-t border-[#EAE3DA] space-y-3">
            {/* Subtotal & Delivery note */}
            <div className="space-y-1.5 text-xs text-[#6B5B52]">
              <div className="flex justify-between items-baseline">
                <span>Subtotal ({totalItems} items):</span>
                <span className="font-serif text-lg font-bold text-[#2C2420]">
                  {formatPKR(subtotal)}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-[#7C6C63] pt-1 border-t border-dashed border-[#EAE3DA]">
                <span>Delivery:</span>
                <span className="font-medium text-[#745699]">
                  Calculated & confirmed via WhatsApp
                </span>
              </div>
            </div>

            {/* Nationwide Delivery Window */}
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[#F6F1FB] border border-[#E9DFEE] text-[11px] text-[#5B3E7A]">
              <Truck className="w-3.5 h-3.5 text-[#9B86BD] flex-shrink-0" />
              <span>Standard delivery: <strong>2-4 days</strong> across Pakistan</span>
            </div>

            {/* Actions */}
            <button
              onClick={() => {
                onClose();
                onProceedToOrder();
              }}
              id="cart-proceed-order-btn"
              className="w-full py-3.5 px-4 rounded-xl bg-[#9B86BD] hover:bg-[#8063A4] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98"
            >
              <span>Proceed to Order Summary</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onContinueShopping}
              className="w-full py-2 text-xs font-medium text-[#7C6C63] hover:text-[#2C2420] flex items-center justify-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
            </button>

            <div className="flex items-center justify-center gap-1 text-[10px] text-[#A8988E] text-center pt-1">
              <ShieldCheck className="w-3 h-3 text-[#9B86BD]" />
              <span>No instant card charge • Manual order confirmation</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
