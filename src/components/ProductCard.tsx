import React from 'react';
import { ShoppingBag, Eye, ArrowRight, Sparkles, Truck, Heart } from 'lucide-react';
import { Product } from '../types';
import { formatPKR } from '../utils/whatsapp';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart, buyNow } = useCart();
  const { isInWishlist, toggleWishlist } = useStore();
  const isSaved = isInWishlist(product.id);

  return (
    <div 
      className="group bg-white rounded-2xl border border-[#EAE3DA] hover:border-[#D5C6E6] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden"
      id={`product-card-${product.id}`}
    >
      {/* Product Image Stage */}
      <div 
        className="relative aspect-square w-full bg-[#F5F2EC] overflow-hidden cursor-pointer"
        onClick={() => onSelect(product)}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.newArrival && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-[#FAF8F5]/90 backdrop-blur-xs text-[#745699] border border-[#EBE1F5] shadow-xs">
              New
            </span>
          )}
          {product.popular && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-[#745699] text-white shadow-xs">
              Popular
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-xs z-10 transition-all shadow-xs active:scale-90 ${
            isSaved
              ? 'bg-white text-rose-500 hover:bg-rose-50'
              : 'bg-white/80 hover:bg-white text-[#8C7A70] hover:text-rose-500'
          }`}
          title={isSaved ? 'Remove from Saved' : 'Save to Wishlist'}
          aria-label="Save for later"
        >
          <Heart className={`w-4 h-4 transition-transform duration-200 ${isSaved ? 'fill-rose-500 scale-110' : ''}`} />
        </button>

        {/* Quick Details overlay button on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(product);
          }}
          className="absolute inset-x-4 bottom-3 py-2 rounded-xl bg-white/95 backdrop-blur-xs text-[#2C2420] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[#FAF8F5]"
        >
          <Eye className="w-3.5 h-3.5 text-[#745699]" />
          Quick View
        </button>
      </div>

      {/* Product Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Availability & Category */}
          <div className="flex items-center justify-between text-xs text-[#7C6C63] mb-1.5">
            <span className="capitalize tracking-wider uppercase text-[10px] font-medium text-[#8F7C9E]">
              {product.category.replace('-', ' ')}
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              product.availability === 'In Stock' 
                ? 'bg-emerald-50 text-emerald-700' 
                : 'bg-amber-50 text-amber-700'
            }`}>
              {product.availability}
            </span>
          </div>

          {/* Product Name */}
          <h3 
            onClick={() => onSelect(product)}
            className="font-serif text-lg font-semibold text-[#2C2420] hover:text-[#745699] transition-colors line-clamp-1 cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-[#6B5B52] line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>

          {/* Delivery & Dispatch Time */}
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium text-[#5B3E7A] bg-[#F6F1FB] px-2.5 py-1 rounded-lg border border-[#E9DFEE]">
            <Truck className="w-3.5 h-3.5 text-[#9B86BD] flex-shrink-0" />
            <span className="truncate">{product.deliveryTime || 'Ready to dispatch: 1-2 days • 3-5 days delivery'}</span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 pt-3 border-t border-[#F5F1EA]">
          <div className="flex items-baseline justify-between mb-3">
            <div className="font-serif text-lg font-bold text-[#2C2420]">
              {formatPKR(product.price)}
            </div>
            {product.colors && product.colors.length > 0 && (
              <span className="text-[11px] text-[#8C7A70]">
                {product.colors.length} {product.colors.length === 1 ? 'color' : 'colors'}
              </span>
            )}
          </div>

          {/* Actions: Add to Cart + Buy Now */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => addToCart(product, 1)}
              id={`add-to-cart-${product.id}`}
              className="w-full py-2 px-2.5 rounded-xl border border-[#DFCFF0] bg-[#F8F5FB] hover:bg-[#EBE1F5] text-[#604284] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors active:scale-98"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={() => buyNow(product, 1)}
              id={`buy-now-${product.id}`}
              className="w-full py-2 px-2.5 rounded-xl bg-[#9B86BD] hover:bg-[#8063A4] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs active:scale-98"
            >
              <span>Buy Now</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
