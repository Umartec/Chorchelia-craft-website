import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Category } from '../types';
import { CATEGORIES } from '../data/categories';

interface CategorySectionProps {
  onSelectCategory: (categorySlug: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ onSelectCategory }) => {
  return (
    <section className="py-14 sm:py-20 bg-[#FAF8F5] border-t border-[#EAE3DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-[#9B86BD] block mb-2">
            Curated Creations
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2420]">
            Explore by Category
          </h2>
          <p className="text-sm text-[#6B5B52] mt-2 leading-relaxed">
            From everyday bags and home cozies to eternal blooms that stay fresh forever.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className="group bg-white rounded-2xl border border-[#EAE3DA] hover:border-[#DFCFF0] shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
              id={`category-card-${cat.id}`}
            >
              {/* Category Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F5F2EC]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                
                {/* Category name tag on image */}
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="font-serif text-lg font-bold drop-shadow-sm">
                    {cat.name}
                  </h3>
                </div>
              </div>

              {/* Category Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <p className="text-xs text-[#6B5B52] leading-relaxed line-clamp-2">
                  {cat.description}
                </p>

                <div className="mt-4 pt-3 border-t border-[#F5F1EA] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#745699] group-hover:text-[#5B3E80] transition-colors flex items-center gap-1">
                    View Collection
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-[11px] text-[#A8988E]">
                    {cat.itemCount ? `${cat.itemCount} items` : 'Explore'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
