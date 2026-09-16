import React, { useState } from 'react';
import {
  Package,
  Users,
  TrendingUp,
  Clock,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  LogOut,
  Sparkles,
  ShoppingBag,
  DollarSign,
  AlertCircle,
  Truck,
  RotateCcw,
  Check,
  Eye,
  Sliders,
  Store,
  Layers,
  Phone,
  Settings,
  ShieldCheck,
  Star,
  Database,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Tag
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { formatPKR } from '../../utils/whatsapp';
import { ProductFormModal } from './ProductFormModal';
import { CustomerActionsView } from './CustomerActionsView';
import { DiscountCodesView } from './DiscountCodesView';
import { StoreSettingsView } from './StoreSettingsView';
import { ReviewsManagerView } from './ReviewsManagerView';
import { SecurityManagerView } from './SecurityManagerView';
import { BackupRestoreView } from './BackupRestoreView';
import { SITE_CONFIG } from '../../config/site';

interface AdminDashboardProps {
  onReturnToStore: () => void;
}

type TabType = 'products' | 'customer_actions' | 'vouchers' | 'settings' | 'reviews' | 'security' | 'backup' | 'overview';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onReturnToStore }) => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProductsToDefault,
    customerActions,
    adminUser,
    logoutAdmin,
    pendingActionsCount,
    reviews,
    discountCodes,
  } = useStore();

  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Products filter & search
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  // Quick Inline Price Editing
  const [inlinePriceId, setInlinePriceId] = useState<string | null>(null);
  const [inlinePriceValue, setInlinePriceValue] = useState<number>(0);

  // Bulk Price Adjuster Modal / State
  const [showBulkPriceAdjuster, setShowBulkPriceAdjuster] = useState(false);
  const [bulkPercent, setBulkPercent] = useState<number>(10);
  const [bulkDirection, setBulkDirection] = useState<'increase' | 'decrease'>('increase');
  const [bulkCategory, setBulkCategory] = useState<string>('all');
  const [bulkSuccessMessage, setBulkSuccessMessage] = useState<string | null>(null);

  // Metrics
  const totalCatalogValue = products.reduce((acc, p) => acc + p.price * (p.stock || 1), 0);
  const totalOrdersPlaced = customerActions.filter((a) => a.actionType === 'whatsapp_order').length;
  const totalRevenueLogged = customerActions
    .filter((a) => a.actionType === 'whatsapp_order' && a.status !== 'Cancelled')
    .reduce((acc, a) => acc + (a.totalAmount || 0), 0);

  // Filtered Products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      product.description.toLowerCase().includes(productSearch.toLowerCase()) ||
      (product.sku && product.sku.toLowerCase().includes(productSearch.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'in_stock' && product.availability === 'In Stock') ||
      (stockFilter === 'made_to_order' && product.availability === 'Made to Order') ||
      (stockFilter === 'out_of_stock' && product.availability === 'Out of Stock');

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (productData: Omit<Product, 'id'> | Product) => {
    if ('id' in productData && productData.id) {
      updateProduct(productData.id, productData);
    } else {
      addProduct(productData);
    }
  };

  const handleDeleteProduct = (productId: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the store catalog?`)) {
      deleteProduct(productId);
    }
  };

  const handleSaveInlinePrice = (productId: string) => {
    if (inlinePriceValue > 0) {
      updateProduct(productId, { price: inlinePriceValue });
    }
    setInlinePriceId(null);
  };

  // Bulk price adjuster handler
  const handleApplyBulkPricing = () => {
    if (bulkPercent <= 0) return;
    const factor = bulkDirection === 'increase' ? 1 + bulkPercent / 100 : 1 - bulkPercent / 100;

    let affectedCount = 0;
    products.forEach((prod) => {
      if (bulkCategory === 'all' || prod.category === bulkCategory) {
        // Round to nearest 50 PKR for clean retail prices
        const rawNewPrice = prod.price * factor;
        const roundedPrice = Math.round(rawNewPrice / 50) * 50;
        updateProduct(prod.id, { price: Math.max(100, roundedPrice) });
        affectedCount++;
      }
    });

    setBulkSuccessMessage(
      `Successfully adjusted prices for ${affectedCount} product${affectedCount === 1 ? '' : 's'} by ${bulkDirection === 'increase' ? '+' : '-'}${bulkPercent}%.`
    );
    setTimeout(() => {
      setBulkSuccessMessage(null);
      setShowBulkPriceAdjuster(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2420] flex flex-col font-sans">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#EAE3DA] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Portal Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#9B86BD] text-white font-serif font-bold text-lg flex items-center justify-center shadow-xs">
              CC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base text-[#2C2420]">
                  Chorchelia Craft
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#EBE1F5] text-[#745699] font-bold text-[10px] tracking-wide uppercase border border-[#DFCFF0]">
                  Master Admin
                </span>
              </div>
              <p className="text-[11px] text-[#7C6C63] hidden sm:block">
                Dynamic Product Pricing • Customer Tracker • Encrypted Storefront Control
              </p>
            </div>
          </div>

          {/* Admin Header Controls */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onReturnToStore}
              id="admin-view-storefront-btn"
              className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F0EBE3] text-[#2C2420] text-xs font-semibold flex items-center gap-1.5 border border-[#EAE3DA] transition-colors"
            >
              <Store className="w-4 h-4 text-[#745699]" />
              <span className="hidden sm:inline">View Storefront</span>
              <span className="sm:hidden">Store</span>
            </button>

            <button
              onClick={() => {
                logoutAdmin();
                onReturnToStore();
              }}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-red-700 hover:bg-red-50 text-xs font-semibold flex items-center gap-1.5 border border-red-200 transition-colors"
              title="Logout from Admin"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 sm:space-x-3 overflow-x-auto border-t border-[#F5F2EC] scrollbar-none">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-[#9B86BD] text-[#745699]'
                : 'border-transparent text-[#6B5B52] hover:text-[#2C2420]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products & Prices</span>
            <span className="px-1.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#EAE3DA] text-[10px] font-semibold text-[#4A3E37]">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('customer_actions')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'customer_actions'
                ? 'border-[#9B86BD] text-[#745699]'
                : 'border-transparent text-[#6B5B52] hover:text-[#2C2420]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customer Orders & Actions</span>
            {pendingActionsCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full bg-[#9B86BD] text-white text-[10px] font-bold animate-pulse">
                {pendingActionsCount}
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#EAE3DA] text-[10px] text-[#4A3E37]">
                {customerActions.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('vouchers')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'vouchers'
                ? 'border-[#9B86BD] text-[#745699]'
                : 'border-transparent text-[#6B5B52] hover:text-[#2C2420]'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Discounts & Vouchers</span>
            <span className="px-1.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#EAE3DA] text-[10px] text-[#4A3E37]">
              {discountCodes.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-[#9B86BD] text-[#745699]'
                : 'border-transparent text-[#6B5B52] hover:text-[#2C2420]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Storefront Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-[#9B86BD] text-[#745699]'
                : 'border-transparent text-[#6B5B52] hover:text-[#2C2420]'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Reviews</span>
            <span className="px-1.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#EAE3DA] text-[10px] text-[#4A3E37]">
              {reviews.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-[#9B86BD] text-[#745699]'
                : 'border-transparent text-[#6B5B52] hover:text-[#2C2420]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Encrypted Security</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'backup'
                ? 'border-[#9B86BD] text-[#745699]'
                : 'border-transparent text-[#6B5B52] hover:text-[#2C2420]'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Backup & Restore</span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#9B86BD] text-[#745699]'
                : 'border-transparent text-[#6B5B52] hover:text-[#2C2420]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Store Metrics</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* TAB 1: MANAGE PRODUCTS */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            {/* Header Action Row */}
            <div className="bg-white p-5 rounded-3xl border border-[#EAE3DA] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#2C2420]">
                  Dynamic Product Catalog & Pricing
                </h3>
                <p className="text-xs text-[#7C6C63] mt-0.5">
                  Update prices directly, edit delivery timelines, manage stock, or add new crochet designs.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setShowBulkPriceAdjuster(!showBulkPriceAdjuster)}
                  className="px-3.5 py-2.5 rounded-xl border border-[#DFCFF0] bg-[#F5EEFB] hover:bg-[#EBE1F5] text-[#604284] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Percent className="w-4 h-4 text-[#9B86BD]" />
                  <span>Bulk Price Adjuster</span>
                </button>

                <button
                  onClick={handleOpenAddModal}
                  id="admin-add-product-btn"
                  className="px-4 py-2.5 rounded-xl bg-[#9B86BD] hover:bg-[#8063A4] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all active:scale-98"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>
            </div>

            {/* Bulk Price Adjuster Panel */}
            {showBulkPriceAdjuster && (
              <div className="bg-white p-6 rounded-3xl border border-[#DFCFF0] shadow-sm space-y-4 animate-in slide-in-from-top-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#EBE1F5] text-[#745699] flex items-center justify-center">
                      <Percent className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif text-base font-bold text-[#2C2420]">
                        Quick Bulk Price Modifier
                      </h4>
                      <p className="text-[11px] text-[#7C6C63]">
                        Apply percentage price increases or seasonal discount sales across all products or by category with 1-click.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowBulkPriceAdjuster(false)}
                    className="text-xs text-[#8C7A70] hover:text-[#2C2420]"
                  >
                    Close
                  </button>
                </div>

                {bulkSuccessMessage && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                    {bulkSuccessMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-[#2C2420] mb-1">Target Category</label>
                    <select
                      value={bulkCategory}
                      onChange={(e) => setBulkCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#EAE3DA] bg-white text-xs"
                    >
                      <option value="all">All Categories ({products.length} Items)</option>
                      <option value="flowers">Bouquets & Flowers</option>
                      <option value="bags">Bags & Clutches</option>
                      <option value="home-decor">Home Decor & Coasters</option>
                      <option value="accessories">Keychains & Hair Accessories</option>
                      <option value="plushies">Plushies</option>
                      <option value="baby">Baby Items</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#2C2420] mb-1">Adjustment Type</label>
                    <div className="flex rounded-xl border border-[#EAE3DA] overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setBulkDirection('increase')}
                        className={`flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-1 ${
                          bulkDirection === 'increase' ? 'bg-[#2C2420] text-white' : 'bg-white text-[#6B5B52]'
                        }`}
                      >
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Price Increase</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setBulkDirection('decrease')}
                        className={`flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-1 ${
                          bulkDirection === 'decrease' ? 'bg-[#9B86BD] text-white' : 'bg-white text-[#6B5B52]'
                        }`}
                      >
                        <ArrowDownRight className="w-3.5 h-3.5 text-rose-300" />
                        <span>Sale Discount</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#2C2420] mb-1">Percentage (%)</label>
                    <div className="flex items-center gap-1.5">
                      {[5, 10, 15, 20].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setBulkPercent(p)}
                          className={`px-2.5 py-2 rounded-lg text-xs font-semibold border ${
                            bulkPercent === p
                              ? 'bg-[#9B86BD] text-white border-[#9B86BD]'
                              : 'bg-white text-[#6B5B52] border-[#EAE3DA]'
                          }`}
                        >
                          {p}%
                        </button>
                      ))}
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={bulkPercent}
                        onChange={(e) => setBulkPercent(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 px-2 py-1.5 rounded-lg border border-[#EAE3DA] text-center text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleApplyBulkPricing}
                      className="w-full py-2.5 rounded-xl bg-[#2C2420] hover:bg-[#433730] text-white font-semibold text-xs transition-colors"
                    >
                      Apply {bulkDirection === 'increase' ? '+' : '-'}{bulkPercent}% to Prices
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-2xl border border-[#EAE3DA] flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Search */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[#8C7A70] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products by name, description, SKU..."
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-[#EAE3DA] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                />
              </div>

              {/* Category & Stock dropdowns */}
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                >
                  <option value="all">All Categories</option>
                  <option value="flowers">Flowers & Bouquets</option>
                  <option value="bags">Bags & Clutches</option>
                  <option value="home-decor">Home Decor</option>
                  <option value="accessories">Accessories</option>
                  <option value="plushies">Plushies</option>
                  <option value="baby">Baby Items</option>
                </select>

                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                >
                  <option value="all">All Stock Statuses</option>
                  <option value="in_stock">In Stock (Ready)</option>
                  <option value="made_to_order">Made to Order</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-[#EAE3DA] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] border-b border-[#EAE3DA] text-[#6B5B52]">
                    <tr>
                      <th className="py-3.5 px-4 font-bold">Item</th>
                      <th className="py-3.5 px-4 font-bold">Category</th>
                      <th className="py-3.5 px-4 font-bold">Price (PKR)</th>
                      <th className="py-3.5 px-4 font-bold">Availability</th>
                      <th className="py-3.5 px-4 font-bold">Delivery Timeframe</th>
                      <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE3DA]">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-[#7C6C63]">
                          No products found matching your search or filters.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                          {/* Item Thumbnail & Name */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-12 h-12 rounded-xl object-cover border border-[#EAE3DA] flex-shrink-0"
                              />
                              <div>
                                <span className="font-bold text-[#2C2420] block line-clamp-1">
                                  {product.name}
                                </span>
                                <div className="flex items-center gap-1 text-[11px] text-[#7C6C63] mt-0.5">
                                  {product.sku && <span className="font-mono">{product.sku} • </span>}
                                  <span>{product.colors[0] || 'Handmade'}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3.5 px-4">
                            <span className="capitalize px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#EAE3DA] text-[#5A4940] font-medium">
                              {product.category.replace('-', ' ')}
                            </span>
                          </td>

                          {/* Dynamic Price Editor */}
                          <td className="py-3.5 px-4">
                            {inlinePriceId === product.id ? (
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="number"
                                  value={inlinePriceValue}
                                  onChange={(e) => setInlinePriceValue(Number(e.target.value))}
                                  className="w-24 px-2 py-1 rounded-lg border border-[#9B86BD] text-xs font-bold text-[#2C2420] focus:outline-none"
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleSaveInlinePrice(product.id)}
                                  className="p-1 rounded-lg bg-[#25D366] text-white hover:bg-[#1EBE5B]"
                                  title="Save price"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setInlinePriceId(product.id);
                                  setInlinePriceValue(product.price);
                                }}
                                className="font-serif font-bold text-[#2C2420] hover:text-[#745699] flex items-center gap-1 group"
                                title="Click to quickly edit price"
                              >
                                <span>{formatPKR(product.price)}</span>
                                <Edit2 className="w-3 h-3 text-[#A8988E] opacity-0 group-hover:opacity-100 transition-opacity" />
                              </button>
                            )}
                          </td>

                          {/* Availability */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                product.availability === 'In Stock'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : product.availability === 'Made to Order'
                                  ? 'bg-[#EBE1F5] text-[#604284] border border-[#DFCFF0]'
                                  : 'bg-red-50 text-red-700 border border-red-200'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  product.availability === 'In Stock'
                                    ? 'bg-emerald-500'
                                    : product.availability === 'Made to Order'
                                    ? 'bg-[#9B86BD]'
                                    : 'bg-red-500'
                                }`}
                              />
                              <span>{product.availability}</span>
                            </span>
                          </td>

                          {/* Delivery Timeframe */}
                          <td className="py-3.5 px-4 text-[#5A4940] max-w-xs">
                            <div className="flex items-center gap-1 text-[11px]">
                              <Truck className="w-3.5 h-3.5 text-[#9B86BD] flex-shrink-0" />
                              <span className="line-clamp-1">{product.deliveryTime || '1-2 days dispatch • 3-5 days delivery'}</span>
                            </div>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditModal(product)}
                                className="p-1.5 rounded-lg text-[#6B5B52] hover:text-[#2C2420] hover:bg-[#F5F2EC] transition-colors"
                                title="Edit Product"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id, product.name)}
                                className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOMER ACTIONS & ORDERS */}
        {activeTab === 'customer_actions' && <CustomerActionsView />}

        {/* TAB: DISCOUNT CODES & VOUCHERS */}
        {activeTab === 'vouchers' && <DiscountCodesView />}

        {/* TAB 3: STOREFRONT SETTINGS */}
        {activeTab === 'settings' && <StoreSettingsView />}

        {/* TAB 4: REVIEWS MANAGER */}
        {activeTab === 'reviews' && <ReviewsManagerView />}

        {/* TAB 5: CRYPTOGRAPHIC SECURITY */}
        {activeTab === 'security' && <SecurityManagerView />}

        {/* TAB 6: BACKUP & RESTORE */}
        {activeTab === 'backup' && <BackupRestoreView />}

        {/* TAB 7: OVERVIEW / STORE METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-[#EAE3DA] shadow-xs">
                <div className="flex items-center justify-between text-[#7C6C63] text-xs">
                  <span>Total Catalog Items</span>
                  <Package className="w-4 h-4 text-[#9B86BD]" />
                </div>
                <div className="font-serif text-3xl font-bold text-[#2C2420] mt-2">
                  {products.length}
                </div>
                <span className="text-[11px] text-emerald-600 mt-1 block">Active handmade listings</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#EAE3DA] shadow-xs">
                <div className="flex items-center justify-between text-[#7C6C63] text-xs">
                  <span>Customer Actions Logged</span>
                  <Users className="w-4 h-4 text-[#128C7E]" />
                </div>
                <div className="font-serif text-3xl font-bold text-[#2C2420] mt-2">
                  {customerActions.length}
                </div>
                <span className="text-[11px] text-[#745699] mt-1 block">
                  {totalOrdersPlaced} WhatsApp orders placed
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#EAE3DA] shadow-xs">
                <div className="flex items-center justify-between text-[#7C6C63] text-xs">
                  <span>Recorded Order Volume</span>
                  <ShoppingBag className="w-4 h-4 text-[#745699]" />
                </div>
                <div className="font-serif text-3xl font-bold text-[#2C2420] mt-2">
                  {formatPKR(totalRevenueLogged)}
                </div>
                <span className="text-[11px] text-[#7C6C63] mt-1 block">Customer order requests</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#EAE3DA] shadow-xs">
                <div className="flex items-center justify-between text-[#7C6C63] text-xs">
                  <span>Customer Reviews</span>
                  <Star className="w-4 h-4 text-[#F59E0B]" />
                </div>
                <div className="font-serif text-3xl font-bold text-[#2C2420] mt-2">
                  {reviews.length}
                </div>
                <span className="text-[11px] text-emerald-600 mt-1 block">4.9 ★ average rating</span>
              </div>
            </div>

            {/* Quick Operations Panel */}
            <div className="bg-white p-6 rounded-3xl border border-[#EAE3DA] space-y-4 shadow-xs">
              <h3 className="font-serif text-lg font-bold text-[#2C2420]">
                Quick Store Operations
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => {
                    setActiveTab('products');
                    handleOpenAddModal();
                  }}
                  className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3DA] hover:border-[#9B86BD] text-left transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#EBE1F5] text-[#745699] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Plus className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-xs text-[#2C2420]">Publish New Creation</h4>
                  <p className="text-[11px] text-[#7C6C63] mt-1">Upload photos, set PKR price, availability, and yarn details</p>
                </button>

                <button
                  onClick={() => setActiveTab('customer_actions')}
                  className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3DA] hover:border-[#9B86BD] text-left transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 text-[#128C7E] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-xs text-[#2C2420]">Review Orders Queue</h4>
                  <p className="text-[11px] text-[#7C6C63] mt-1">Contact customers on WhatsApp, update statuses, and print receipts</p>
                </button>

                <button
                  onClick={() => setActiveTab('security')}
                  className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3DA] hover:border-[#9B86BD] text-left transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#2C2420] text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h4 className="font-bold text-xs text-[#2C2420]">Encrypted Credentials</h4>
                  <p className="text-[11px] text-[#7C6C63] mt-1">Update SHA-256 password, examine audit logs, and brute-force defenses</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Product Form Modal (Add / Edit) */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        initialProduct={editingProduct}
      />
    </div>
  );
};
