/**
 * Chorchelia Craft - Main Application Entry
 * Handmade crochet brand & WhatsApp ordering website in Pakistan
 * Includes Dynamic Product Routing, Official 18-Section Policies, Cart Reset & Review UX, Encrypted Admin
 */

import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategorySection } from './components/CategorySection';
import { FeaturedProducts } from './components/FeaturedProducts';
import { ShopView } from './components/ShopView';
import { ProductPageView } from './components/ProductPageView';
import { PoliciesView } from './components/PoliciesView';
import { TrackingView } from './components/TrackingView';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderReceiptModal } from './components/OrderReceiptModal';
import { ProcessSection } from './components/ProcessSection';
import { CustomOrderSection } from './components/CustomOrderSection';
import { DeliveryTrustSection } from './components/DeliveryTrustSection';
import { AboutSection } from './components/AboutSection';
import { ReviewsSection } from './components/ReviewsSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Toast } from './components/Toast';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { InitialLoader } from './components/InitialLoader';
import { Product } from './types';
import { generateCustomOrderWhatsAppUrl } from './utils/whatsapp';

function MainContent() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [quickPreviewProduct, setQuickPreviewProduct] = useState<Product | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [trackingInitialRef, setTrackingInitialRef] = useState<string>('');

  const {
    products,
    isAdminAuthenticated,
    isAdminModalOpen,
    setIsAdminModalOpen,
    logCustomerAction,
  } = useStore();

  const {
    isCartOpen,
    setIsCartOpen,
    isReceiptOpen,
    setIsReceiptOpen,
  } = useCart();

  // Helper to find a product by slug, ID, or normalized name
  const findProductBySlugOrId = (slugOrId: string): Product | undefined => {
    const clean = decodeURIComponent(slugOrId).trim().toLowerCase();
    return products.find(
      (p) =>
        (p.slug && p.slug.toLowerCase() === clean) ||
        p.id.toLowerCase() === clean ||
        p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === clean
    );
  };

  // Listen to hash changes for standard dynamic routing:
  // e.g. #/product/eternal-pastel-crochet-flower-bouquet
  // e.g. #/policies
  // e.g. #/track?ref=CC-52194
  // e.g. #shop, #categories, #about, #admin
  useEffect(() => {
    const handleHash = () => {
      const rawHash = window.location.hash.replace(/^#\/?/, '');

      // 1. Dynamic Product Page: #/product/:slug
      if (rawHash.startsWith('product/')) {
        const productKey = rawHash.replace('product/', '');
        const matched = findProductBySlugOrId(productKey);
        if (matched) {
          setActiveProduct(matched);
          setCurrentTab('product');
          setIsAdminView(false);
          document.title = `${matched.name} | Chorchelia Craft Pakistan`;
          return;
        } else if (products.length > 0) {
          // If slug not found, fallback to shop
          setCurrentTab('shop');
          setIsAdminView(false);
          return;
        }
      }

      // 2. Policies Page: #/policies or #policies
      if (rawHash === 'policies' || rawHash.startsWith('policies')) {
        setIsAdminView(false);
        setCurrentTab('policies');
        document.title = 'Brand Policies & Customer Guidelines | Chorchelia Craft';
        return;
      }

      // 3. Live Order Tracking: #/track or #track?ref=...
      if (rawHash === 'track' || rawHash.startsWith('track')) {
        setIsAdminView(false);
        setCurrentTab('track');
        document.title = 'Track Your Order Live | Chorchelia Craft Pakistan';

        const match = window.location.hash.match(/[?&]ref=([^&]+)/);
        if (match && match[1]) {
          setTrackingInitialRef(decodeURIComponent(match[1]));
        }
        return;
      }

      // 4. Admin Dashboard: #admin
      if (rawHash === 'admin') {
        if (isAdminAuthenticated) {
          setIsAdminView(true);
          document.title = 'Master Admin Portal | Chorchelia Craft';
        } else {
          setIsAdminModalOpen(true);
        }
        return;
      }

      // 5. Standard Tabs: #home, #shop, #categories, etc.
      if (['home', 'shop', 'categories', 'about', 'reviews', 'contact', 'shipping', 'process', 'faqs'].includes(rawHash)) {
        setIsAdminView(false);
        setCurrentTab(rawHash);
        document.title = 'Chorchelia Craft — Handmade Crochet Flowers, Bouquets & Gifts';
        return;
      }

      // Default to home if empty
      if (!rawHash) {
        setIsAdminView(false);
        setCurrentTab('home');
        document.title = 'Chorchelia Craft — Handmade Crochet Flowers, Bouquets & Gifts';
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [products, isAdminAuthenticated]);

  // Navigate to standard tab
  const handleTabChange = (tab: string) => {
    setIsAdminView(false);
    setCurrentTab(tab);
    window.location.hash = `#/${tab}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open dynamic product page with full URL route
  const handleSelectProduct = (product: Product) => {
    setIsAdminView(false);
    setActiveProduct(product);
    setCurrentTab('product');
    const slug = product.slug || product.id;
    window.location.hash = `#/product/${slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (categorySlug: string) => {
    setIsAdminView(false);
    setActiveCategoryFilter(categorySlug);
    setCurrentTab('shop');
    window.location.hash = '#/shop';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCustomOrderClick = () => {
    logCustomerAction({
      customerName: 'Website Visitor',
      whatsappNumber: 'Pending WhatsApp connection',
      city: 'Pakistan',
      actionType: 'custom_quote',
      notes: 'Customer clicked "Request Custom Order" hero CTA.',
      status: 'Pending',
    });
    const url = generateCustomOrderWhatsAppUrl();
    window.open(url, '_blank');
  };

  const handleOpenAdmin = () => {
    if (isAdminAuthenticated) {
      setIsAdminView(true);
      window.location.hash = '#/admin';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsAdminModalOpen(true);
    }
  };

  // If Admin View is active, render full Admin Dashboard
  if (isAdminView && isAdminAuthenticated) {
    return (
      <AdminDashboard
        onReturnToStore={() => {
          setIsAdminView(false);
          window.location.hash = '#/home';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2C2420]">
      {/* Sticky Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenTracking={() => handleTabChange('track')}
      />

      {/* Main View Switching */}
      <main className="flex-1">
        
        {/* DYNAMIC PRODUCT DETAIL PAGE (PDP) */}
        {currentTab === 'product' && activeProduct && (
          <ProductPageView
            product={activeProduct}
            onBackToShop={() => handleTabChange('shop')}
            onSelectProduct={handleSelectProduct}
            onNavigateToPolicies={() => handleTabChange('policies')}
          />
        )}

        {/* POLICIES PAGE (18 Sections) */}
        {currentTab === 'policies' && (
          <PoliciesView onBackToShop={() => handleTabChange('shop')} />
        )}

        {/* LIVE ORDER TRACKING PAGE */}
        {currentTab === 'track' && (
          <TrackingView
            initialRef={trackingInitialRef}
            onContinueShopping={() => handleTabChange('shop')}
          />
        )}

        {/* HOME TAB */}
        {currentTab === 'home' && (
          <>
            <Hero
              onExplore={() => handleCategorySelect('all')}
              onShopNow={() => handleTabChange('shop')}
              onCustomOrder={handleCustomOrderClick}
            />
            <CategorySection onSelectCategory={handleCategorySelect} />
            <FeaturedProducts
              products={products}
              onSelectProduct={handleSelectProduct}
              onViewAll={() => handleTabChange('shop')}
            />
            <ProcessSection />
            <CustomOrderSection />
            <DeliveryTrustSection />
            <ReviewsSection />
            <FaqSection />
          </>
        )}

        {/* SHOP TAB (Powered by dynamic StoreContext products) */}
        {currentTab === 'shop' && (
          <ShopView
            products={products}
            onSelectProduct={handleSelectProduct}
            initialCategory={activeCategoryFilter}
          />
        )}

        {/* CATEGORIES TAB */}
        {currentTab === 'categories' && (
          <div className="py-6">
            <CategorySection onSelectCategory={handleCategorySelect} />
            <CustomOrderSection />
          </div>
        )}

        {/* ABOUT TAB */}
        {currentTab === 'about' && (
          <div className="py-4">
            <AboutSection />
            <DeliveryTrustSection />
          </div>
        )}

        {/* REVIEWS TAB */}
        {currentTab === 'reviews' && (
          <div className="py-4">
            <ReviewsSection />
            <FaqSection />
          </div>
        )}

        {/* CONTACT TAB */}
        {currentTab === 'contact' && (
          <div className="py-4">
            <ContactSection />
            <FaqSection />
          </div>
        )}

        {/* SHIPPING TAB */}
        {currentTab === 'shipping' && (
          <div className="py-4">
            <DeliveryTrustSection />
            <ProcessSection />
            <FaqSection />
          </div>
        )}

        {/* PROCESS TAB */}
        {currentTab === 'process' && (
          <div className="py-4">
            <ProcessSection />
            <FaqSection />
          </div>
        )}

        {/* FAQS TAB */}
        {currentTab === 'faqs' && (
          <div className="py-4">
            <FaqSection />
            <ContactSection />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleTabChange}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Interactive Overlays & Modals */}
      
      {/* 1. Optional Quick Preview Modal */}
      <ProductDetailsModal
        product={quickPreviewProduct}
        onClose={() => setQuickPreviewProduct(null)}
      />

      {/* 2. Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToOrder={() => setIsReceiptOpen(true)}
        onContinueShopping={() => setIsCartOpen(false)}
      />

      {/* 2b. Slide-out Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        onOpenProduct={(slug) => {
          setIsWishlistOpen(false);
          const found = findProductBySlugOrId(slug);
          if (found) {
            handleSelectProduct(found);
          } else {
            handleTabChange('shop');
          }
        }}
        onContinueShopping={() => {
          setIsWishlistOpen(false);
          handleTabChange('shop');
        }}
      />

      {/* 3. Order Summary & WhatsApp Receipt Modal (With Cart Reset & Review Prompt) */}
      <OrderReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        onBackToCart={() => {
          setIsReceiptOpen(false);
          setIsCartOpen(true);
        }}
        onNavigateToPolicies={() => {
          setIsReceiptOpen(false);
          handleTabChange('policies');
        }}
      />

      {/* 4. Floating WhatsApp CTA Widget */}
      <FloatingWhatsApp />

      {/* 5. Notification Toast */}
      <Toast />

      {/* 6. Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={() => {
          setIsAdminView(true);
          window.location.hash = '#/admin';
        }}
      />

      {/* 7. Initial Brand Loader */}
      <InitialLoader />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <CartProvider>
        <MainContent />
      </CartProvider>
    </StoreProvider>
  );
}
