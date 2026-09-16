import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { formatPKR } from '../utils/whatsapp';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProduct: (productSlug: string) => void;
  onContinueShopping: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  onOpenProduct,
  onContinueShopping,
}) => {
  const { wishlist, products, toggleWishlist, clearWishlist } = useStore();
  const { addToCart } = useCart();

  if (!isOpen) return null;

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col border-l border-[#EAE3DA] animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
        id="wishlist-drawer"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAE3DA] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <Heart className="w-4 h-4 fill-rose-500" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#2C2420]">Saved for Later</h2>
              <p className="text-xs text-[#7C6C63]">
                {wishlistProducts.length} {wishlistProducts.length === 1 ? 'handmade piece' : 'handmade pieces'} saved
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#6B5B52] hover:text-[#2C2420] hover:bg-[#F5F1EA] transition-colors"
            aria-label="Close Wishlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {wishlistProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center border border-rose-100">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#2C2420]">
                Your wishlist is empty
              </h3>
              <p className="text-xs text-[#7C6C63] max-w-xs leading-relaxed">
                Click the heart icon on any bouquet, tote bag, or coaster to save your favorites without needing an account.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onContinueShopping();
                }}
                className="mt-2 px-5 py-2.5 rounded-full bg-[#9B86BD] hover:bg-[#8063A4] text-white text-xs font-semibold uppercase tracking-wider shadow-xs transition-all"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs text-[#7C6C63] pb-1 border-b border-[#EAE3DA]">
                <span>Saved Items</span>
                <button
                  onClick={clearWishlist}
                  className="text-[11px] text-red-600 hover:text-red-700 flex items-center gap-1 font-medium"
                >
                  <Trash2 className="w-3 h-3" /> Clear All
                </button>
              </div>

              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-3 bg-white rounded-2xl border border-[#EAE3DA] shadow-xs flex gap-3 items-center group"
                >
                  {/* Thumbnail */}
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-[#F5F1EA] flex-shrink-0 cursor-pointer"
                    onClick={() => {
                      onClose();
                      onOpenProduct(product.slug || product.id);
                    }}
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 
                      onClick={() => {
                        onClose();
                        onOpenProduct(product.slug || product.id);
                      }}
                      className="font-serif text-sm font-semibold text-[#2C2420] truncate cursor-pointer hover:text-[#745699] transition-colors"
                    >
                      {product.name}
                    </h4>
                    <span className="text-[10px] text-[#745699] font-medium block">
                      {product.category}
                    </span>
                    <div className="font-semibold text-xs text-[#2C2420] mt-1">
                      {formatPKR(product.price)}
                    </div>
                  </div>

                  {/* Actions: Add to Cart & Remove */}
                  <div className="flex flex-col items-end gap-1.5">
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="text-[#A8988E] hover:text-rose-600 p-1 transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        addToCart(product, 1);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#EBE1F5] hover:bg-[#DFCFF0] text-[#604284] text-[11px] font-semibold flex items-center gap-1 transition-colors active:scale-95"
                      title="Add to basket"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        {wishlistProducts.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border-t border-[#EAE3DA] space-y-2">
            <button
              onClick={() => {
                onClose();
                onContinueShopping();
              }}
              className="w-full py-3 px-4 rounded-xl bg-[#9B86BD] hover:bg-[#8063A4] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-98"
            >
              <span>Explore More Creations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
