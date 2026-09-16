import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface FeaturedProductsProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onViewAll: () => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  onSelectProduct,
  onViewAll,
}) => {
  const [filter, setFilter] = useState<'all' | 'popular' | 'new'>('all');

  const displayedProducts = products
    .filter((p) => {
      if (filter === 'popular') return p.popular;
      if (filter === 'new') return p.newArrival;
      return p.featured || p.popular;
    })
    .slice(0, 6);

  return (
    <section className="py-16 sm:py-20 bg-white border-t border-[#EAE3DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with category toggle tabs */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-[#9B86BD] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handcrafted Favorites</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2420]">
              Featured Creations
            </h2>
            <p className="text-sm text-[#6B5B52] mt-1.5">
              Carefully chosen pieces that bring warmth, color and charm into your day.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1 rounded-full border border-[#EAE3DA]">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-[#9B86BD] text-white shadow-xs'
                  : 'text-[#5A4940] hover:text-[#2C2420]'
              }`}
            >
              All Featured
            </button>
            <button
              onClick={() => setFilter('popular')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filter === 'popular'
                  ? 'bg-[#9B86BD] text-white shadow-xs'
                  : 'text-[#5A4940] hover:text-[#2C2420]'
              }`}
            >
              Popular
            </button>
            <button
              onClick={() => setFilter('new')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filter === 'new'
                  ? 'bg-[#9B86BD] text-white shadow-xs'
                  : 'text-[#5A4940] hover:text-[#2C2420]'
              }`}
            >
              New Arrivals
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <button
            onClick={onViewAll}
            id="featured-view-all-btn"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-[#9B86BD] bg-[#F8F5FB] hover:bg-[#EBE1F5] text-[#604284] text-xs font-semibold uppercase tracking-wider transition-all shadow-xs"
          >
            <span>View All Products in Shop</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
