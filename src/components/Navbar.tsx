import React, { useState } from 'react';
import { ShoppingBag, Menu, X, Sparkles, MessageCircle, Lock, Heart, Package, Tag } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenWishlist?: () => void;
  onOpenTracking?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenCart,
  onOpenAdmin,
  onOpenWishlist,
  onOpenTracking,
}) => {
  const { totalItems } = useCart();
  const { isAdminAuthenticated, pendingActionsCount, wishlist } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'categories', label: 'Categories' },
    { id: 'track', label: 'Track Order' },
    { id: 'policies', label: 'Policies' },
    { id: 'about', label: 'About' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    if (id === 'track' && onOpenTracking) {
      onOpenTracking();
    } else {
      setCurrentTab(id);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EAE3DA] transition-all">
      {/* Top announcement bar with seasonal discount offer */}
      <div className="bg-[#8E73B5] text-white text-xs py-1.5 px-4 text-center tracking-wide flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <div className="flex items-center gap-1 font-medium">
          <Tag className="w-3 h-3 text-[#F6EEFA]" />
          <span>Use code <strong className="bg-white/20 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider text-white">WELCOME10</strong> for 10% OFF</span>
        </div>
        <span className="hidden sm:inline text-white/50">•</span>
        <div className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#F6EEFA]" />
          <span>Free Courier Delivery on Orders Over Rs. 4,500 across Pakistan</span>
        </div>
        <span className="hidden md:inline text-white/50">•</span>
        <a 
          href={SITE_CONFIG.SOCIAL_LINKS.WHATSAPP_CHAT} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="font-bold underline hover:text-[#FAF8F5] transition-colors inline-flex items-center gap-1"
        >
          <span>WhatsApp: {SITE_CONFIG.CONTACT.PHONE_DISPLAY}</span>
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Name Typography with ART Badge */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex flex-col text-left group focus:outline-none flex-shrink-0 pr-3 sm:pr-6"
            id="nav-brand-logo"
          >
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#2C2420] block leading-tight group-hover:text-[#745699] transition-colors whitespace-nowrap">
                Chorchelia Craft
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#745699] bg-[#EBE1F5] px-1.5 sm:px-2 py-0.5 rounded-md border border-[#DFCFF0] uppercase shadow-2xs whitespace-nowrap">
                ART
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] tracking-widest text-[#8C7A70] font-medium uppercase mt-0.5 block whitespace-nowrap">
              Artisan Crochet Studio • Pakistan
            </span>
          </button>

          {/* Desktop Navigation Links (>= lg screens) */}
          <nav className="hidden lg:flex items-center space-x-1 flex-shrink-0">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  id={`nav-link-${link.id}`}
                  className={`h-9 sm:h-10 inline-flex items-center justify-center px-3 xl:px-3.5 rounded-full text-xs xl:text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                    isActive
                      ? 'bg-[#EBE1F5] text-[#604284] shadow-xs font-semibold'
                      : 'text-[#4A3E37] hover:text-[#2C2420] hover:bg-[#F3EFEA]'
                  }`}
                >
                  {link.id === 'track' && <Package className="w-3.5 h-3.5 mr-1.5 text-[#9B86BD] flex-shrink-0" />}
                  <span className="whitespace-nowrap">{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            
            {/* Wishlist Button */}
            {onOpenWishlist && (
              <button
                onClick={onOpenWishlist}
                id="nav-wishlist-btn"
                className="h-9 w-9 sm:h-10 sm:w-10 inline-flex items-center justify-center rounded-full bg-white/90 border border-[#EAE3DA] text-[#2C2420] hover:bg-white hover:border-[#DFCFF0] shadow-2xs transition-all relative focus:outline-none active:scale-95 flex-shrink-0"
                aria-label="View Saved Items"
                title="Wishlist / Saved for Later"
              >
                <Heart className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-50' : 'text-[#3A2E28]'}`} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4.5 h-4.5 sm:w-5 sm:h-5 bg-rose-500 text-white text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs animate-in zoom-in">
                    {wishlist.length}
                  </span>
                )}
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              id="nav-cart-btn"
              className="h-9 w-9 sm:h-10 sm:w-10 inline-flex items-center justify-center rounded-full bg-white/90 border border-[#EAE3DA] text-[#2C2420] hover:bg-white hover:border-[#DFCFF0] shadow-2xs transition-all relative focus:outline-none active:scale-95 flex-shrink-0"
              aria-label="View Shopping Basket"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#3A2E28]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 sm:w-5 sm:h-5 bg-[#9B86BD] text-white text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs animate-in zoom-in">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Shop Now CTA Button (hidden on narrow screens, visible on md+) */}
            <button
              onClick={() => handleNavClick('shop')}
              id="nav-shop-now-btn"
              className="h-9 sm:h-10 hidden sm:inline-flex items-center gap-1.5 px-3.5 sm:px-4 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#9B86BD] hover:bg-[#8063A4] text-white shadow-xs transition-all hover:shadow-sm active:scale-98 flex-shrink-0 whitespace-nowrap"
            >
              <span className="whitespace-nowrap">Shop</span>
              <Sparkles className="w-3 h-3 text-[#F6EEFA]" />
            </button>

            {/* Admin / Store Owner Portal Access Button (Responsive: icon on mid, pill on xl) */}
            <button
              onClick={onOpenAdmin}
              id="nav-admin-portal-btn"
              className={`h-9 sm:h-10 hidden md:inline-flex items-center justify-center gap-1.5 px-3 rounded-full text-xs font-semibold border transition-all flex-shrink-0 whitespace-nowrap ${
                isAdminAuthenticated
                  ? 'bg-[#EBE1F5] text-[#604284] border-[#DFCFF0] hover:bg-[#DFCFF0]'
                  : 'bg-white text-[#7C6C63] border-[#EAE3DA] hover:text-[#2C2420] hover:border-[#DFCFF0]'
              }`}
              title="Store Owner & Admin Portal"
            >
              <Lock className="w-3.5 h-3.5 text-[#9B86BD]" />
              <span className="hidden xl:inline whitespace-nowrap">{isAdminAuthenticated ? 'Admin' : 'Owner'}</span>
              {pendingActionsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
              )}
            </button>

            {/* Mobile / Tablet Hamburger Menu Toggle Button (< lg) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="nav-mobile-toggle-btn"
              className="h-9 w-9 sm:h-10 sm:w-10 lg:hidden inline-flex items-center justify-center rounded-xl bg-white border border-[#EAE3DA] text-[#3A2E28] hover:bg-[#F3EFEA] focus:outline-none transition-colors shadow-2xs flex-shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#EAE3DA] bg-[#FAF8F5] px-4 pt-3 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`flex items-center gap-2.5 w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#EBE1F5] text-[#604284] font-semibold'
                    : 'text-[#4A3E37] hover:bg-[#F3EFEA]'
                }`}
              >
                {link.id === 'track' && <Package className="w-4 h-4 text-[#9B86BD]" />}
                <span>{link.label}</span>
              </button>
            );
          })}
          
          <div className="pt-3 border-t border-[#EAE3DA] flex flex-col gap-2">
            {onOpenWishlist && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenWishlist();
                }}
                className="w-full py-2.5 rounded-xl text-center text-xs sm:text-sm font-semibold bg-white border border-[#EAE3DA] text-rose-600 flex items-center justify-center gap-2 shadow-2xs"
              >
                <Heart className="w-4 h-4 fill-rose-100" />
                <span>Saved for Later ({wishlist.length})</span>
              </button>
            )}

            <button
              onClick={() => handleNavClick('shop')}
              className="w-full py-2.5 rounded-xl text-center text-xs sm:text-sm font-semibold uppercase tracking-wider bg-[#9B86BD] text-white shadow-xs flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Explore Collection</span>
              <Sparkles className="w-3.5 h-3.5 text-[#F6EEFA]" />
            </button>

            <a
              href={`https://wa.me/${SITE_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello Chorchelia Craft ART! I would like to inquire about your crochet collection.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl text-center text-xs sm:text-sm font-medium text-[#604284] bg-[#EBE1F5] flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp ({SITE_CONFIG.CONTACT.PHONE_DISPLAY})</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2 rounded-xl text-center text-xs font-semibold text-[#5A4940] hover:text-[#2C2420] bg-white border border-[#EAE3DA] flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Lock className="w-3.5 h-3.5 text-[#9B86BD]" />
              <span>{isAdminAuthenticated ? 'Admin Dashboard (Active)' : 'Store Owner / Admin Portal'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
