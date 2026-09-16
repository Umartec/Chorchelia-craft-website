import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X, Filter } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { CATEGORIES } from '../data/categories';
import { formatPKR } from '../utils/whatsapp';

interface ShopViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  initialCategory?: string;
}

export const ShopView: React.FC<ShopViewProps> = ({
  products,
  onSelectProduct,
  initialCategory = 'all',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync when initialCategory changes from parent
  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Dynamic price ceiling from data
  const highestPrice = useMemo(() => {
    return Math.max(...products.map((p) => p.price), 5000);
  }, [products]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (selectedCategory !== 'all' && selectedCategory !== '') {
          if (selectedCategory === 'new-arrivals') {
            if (!product.newArrival) return false;
          } else if (product.category !== selectedCategory) {
            return false;
          }
        }

        // Price filter
        if (product.price > maxPrice) return false;

        // Search filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(query);
          const matchDesc = product.description.toLowerCase().includes(query);
          const matchMat = product.materials.toLowerCase().includes(query);
          if (!matchName && !matchDesc && !matchMat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        // Default newest
        return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0);
      });
  }, [products, selectedCategory, maxPrice, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setMaxPrice(highestPrice);
    setSortBy('newest');
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FAF8F5] min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Heading */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-[#9B86BD] block mb-2">
            Artisanal Collection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2420]">
            The Crochet Shop
          </h1>
          <p className="text-sm text-[#6B5B52] mt-2">
            Every creation is hand-stitched with premium cotton yarn and patience.
          </p>
        </div>

        {/* Search & Top Action Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#EAE3DA] shadow-xs mb-8 flex flex-col md:flex-row items-center gap-4 justify-between">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bouquets, bags, keychains..."
              className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-[#EAE3DA] bg-[#FAF8F5] text-xs focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8988E] hover:text-[#2C2420]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Controls: Sorting & Filter Toggle */}
          <div className="w-full md:w-auto flex items-center justify-between sm:justify-end gap-3">
            
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden px-3.5 py-2 rounded-xl border border-[#EAE3DA] bg-[#FAF8F5] text-xs font-semibold text-[#4A3E37] flex items-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#8C7A70] hidden sm:inline" />
              <span className="text-[#6B5B52] hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-[#EAE3DA] bg-[#FAF8F5] text-xs font-medium text-[#2C2420] focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40"
              >
                <option value="newest">Featured & Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            <span className="text-xs text-[#7C6C63] font-medium hidden lg:inline">
              Showing <strong>{filteredProducts.length}</strong> items
            </span>
          </div>

        </div>

        {/* Main Grid + Sidebar Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Filters Sidebar (Desktop & Mobile Accordion) */}
          <aside
            className={`md:col-span-3 bg-white p-5 rounded-2xl border border-[#EAE3DA] shadow-xs space-y-6 ${
              mobileFilterOpen ? 'block' : 'hidden md:block'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE3DA]">
              <h3 className="font-serif font-bold text-sm text-[#2C2420] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#9B86BD]" /> Filter Collection
              </h3>
              {(selectedCategory !== 'all' || maxPrice < highestPrice || searchQuery) && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] font-semibold text-[#745699] hover:underline"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7C6C63] mb-2.5">
                Category
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === 'all'
                      ? 'bg-[#EBE1F5] text-[#604284] font-bold'
                      : 'text-[#5A4940] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <span>All Products</span>
                  <span className="text-[10px] text-[#8C7A70]">{products.length}</span>
                </button>
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.slug;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#EBE1F5] text-[#604284] font-bold'
                          : 'text-[#5A4940] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {cat.itemCount && (
                        <span className="text-[10px] text-[#8C7A70]">{cat.itemCount}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#7C6C63]">
                  Max Price
                </label>
                <span className="text-xs font-bold text-[#2C2420]">
                  {formatPKR(maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min={500}
                max={highestPrice}
                step={100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#9B86BD] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#A8988E] mt-1">
                <span>PKR 500</span>
                <span>{formatPKR(highestPrice)}</span>
              </div>
            </div>

            {/* Handmade Delivery Notice */}
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3DA] text-[11px] text-[#6B5B52]">
              <span className="font-bold text-[#2C2420] block mb-1">Custom Request?</span>
              <p>Looking for a specific colorway or size? You can request a custom crochet creation anytime.</p>
            </div>
          </aside>

          {/* Product Grid Area (9 Cols) */}
          <main className="md:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#EAE3DA] p-12 text-center space-y-4">
                <p className="font-serif text-lg font-semibold text-[#2C2420]">
                  No handmade pieces match your selected filters.
                </p>
                <p className="text-xs text-[#7C6C63] max-w-sm mx-auto">
                  Try adjusting your price range, searching a different term, or clearing the active category.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-full bg-[#9B86BD] hover:bg-[#8063A4] text-white text-xs font-semibold uppercase tracking-wider shadow-xs"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={onSelectProduct}
                  />
                ))}
              </div>
            )}
          </main>

        </div>

      </div>
    </div>
  );
};
