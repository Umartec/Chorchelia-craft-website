import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Image, Sparkles, Check, Truck, Tag, Package } from 'lucide-react';
import { Product } from '../../types';
import { CATEGORIES } from '../../data/categories';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id'> | Product) => void;
  initialProduct?: Product | null;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProduct,
}) => {
  const isEditing = !!initialProduct;

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'flowers',
    price: 1500,
    description: '',
    images: ['https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=75'],
    colors: ['Lavender & Cream', 'Pastel Pink'],
    sizes: ['Standard'],
    materials: '100% Premium Milk Cotton Yarn',
    dimensions: '',
    availability: 'In Stock',
    deliveryTime: 'Ready to ship in 1-2 days • 3-5 days delivery across Pakistan',
    estimatedDispatchDays: 2,
    featured: false,
    popular: false,
    newArrival: true,
    stock: 10,
    sku: '',
    handmadeNote: 'Hand-stitched carefully with high-grade soft cotton yarn.',
  });

  const [newImageUrl, setNewImageUrl] = useState('');
  const [colorsInput, setColorsInput] = useState('');
  const [sizesInput, setSizesInput] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialProduct) {
      setFormData({ ...initialProduct });
      setColorsInput(initialProduct.colors ? initialProduct.colors.join(', ') : '');
      setSizesInput(initialProduct.sizes ? initialProduct.sizes.join(', ') : '');
    } else {
      setFormData({
        name: '',
        category: 'flowers',
        price: 1500,
        description: '',
        images: ['https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=75'],
        colors: ['Lavender & Cream'],
        sizes: ['Standard Size'],
        materials: '100% Milk Cotton Yarn',
        dimensions: '',
        availability: 'In Stock',
        deliveryTime: 'Ready to ship in 1-2 days • 3-5 days delivery across Pakistan',
        estimatedDispatchDays: 2,
        featured: false,
        popular: false,
        newArrival: true,
        stock: 10,
        sku: `CC-${Math.floor(100 + Math.random() * 900)}`,
        handmadeNote: 'Hand-stitched carefully with high-grade soft cotton yarn.',
      });
      setColorsInput('Lavender & Cream');
      setSizesInput('Standard Size');
    }
    setErrors({});
  }, [initialProduct, isOpen]);

  if (!isOpen) return null;

  const handleAddImage = () => {
    if (newImageUrl.trim() && newImageUrl.startsWith('http')) {
      const currentImages = formData.images || [];
      setFormData({ ...formData, images: [...currentImages, newImageUrl.trim()] });
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    const current = formData.images || [];
    if (current.length <= 1) {
      return; // keep at least 1 image
    }
    setFormData({ ...formData, images: current.filter((_, idx) => idx !== index) });
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.name?.trim()) errs.name = 'Product title is required';
    if (!formData.price || formData.price <= 0) errs.price = 'Please enter a valid price in PKR';
    if (!formData.description?.trim()) errs.description = 'Description is required';
    if (!formData.deliveryTime?.trim()) errs.deliveryTime = 'Delivery time details are required';
    if (!formData.images || formData.images.length === 0) errs.images = 'At least 1 image URL is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Parse colors and sizes
    const colors = colorsInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const sizes = sizesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const productPayload: Omit<Product, 'id'> | Product = {
      ...(initialProduct ? { id: initialProduct.id, slug: initialProduct.slug } : {}),
      name: formData.name!,
      slug: initialProduct?.slug || formData.name!.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: formData.category || 'flowers',
      price: Number(formData.price),
      description: formData.description || '',
      images: formData.images && formData.images.length > 0 ? formData.images : ['https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=75'],
      colors: colors.length > 0 ? colors : undefined,
      sizes: sizes.length > 0 ? sizes : undefined,
      materials: formData.materials || 'Soft Cotton Yarn',
      dimensions: formData.dimensions || undefined,
      availability: formData.availability as Product['availability'],
      deliveryTime: formData.deliveryTime || 'Ready to ship in 1-2 days • 3-5 days delivery across Pakistan',
      estimatedDispatchDays: Number(formData.estimatedDispatchDays) || 2,
      featured: !!formData.featured,
      popular: !!formData.popular,
      newArrival: !!formData.newArrival,
      stock: Number(formData.stock) || 1,
      sku: formData.sku || `CC-${Math.floor(100 + Math.random() * 900)}`,
      handmadeNote: formData.handmadeNote || '',
    };

    onSave(productPayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-[#EAE3DA] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        id="product-form-modal"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAE3DA] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EBE1F5] text-[#745699] flex items-center justify-center border border-[#DFCFF0]">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#2C2420]">
                {isEditing ? 'Edit Product & Pricing' : 'Add New Handcrafted Product'}
              </h2>
              <p className="text-[11px] text-[#7C6C63]">
                Changes immediately update live in the storefront catalog
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#EAE3DA] text-[#6B5B52] hover:text-[#2C2420] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-7 space-y-5">
          
          {/* Main Attributes */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            
            {/* Title */}
            <div className="sm:col-span-8">
              <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                Product Title / Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Blooming Crochet Sunflower Bouquet"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
              />
              {errors.name && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.name}</span>}
            </div>

            {/* SKU */}
            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                SKU / Code
              </label>
              <input
                type="text"
                value={formData.sku || ''}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="e.g. CC-FLW-015"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420] uppercase font-mono"
              />
            </div>

            {/* Price in PKR */}
            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                Price (PKR) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#7C6C63] font-semibold">
                  Rs.
                </span>
                <input
                  type="number"
                  min="50"
                  step="50"
                  required
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full pl-10 pr-3.5 py-2 text-xs font-bold rounded-xl border border-[#DFCFF0] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                />
              </div>
              {errors.price && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.price}</span>}
            </div>

            {/* Category */}
            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                Category
              </label>
              <select
                value={formData.category || 'flowers'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock / Availability */}
            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                Availability Status
              </label>
              <select
                value={formData.availability || 'In Stock'}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value as any })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
              >
                <option value="In Stock">In Stock (Ready to dispatch)</option>
                <option value="Made to Order">Made to Order (Crafting required)</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Delivery Time & Dispatch (Key User Requirement!) */}
          <div className="p-4 rounded-2xl bg-[#F6F0FA] border border-[#DFCFF0] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#5B3E7A]">
              <Truck className="w-4 h-4 text-[#745699]" />
              <span>Delivery Time & Dispatch Configuration</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8">
                <label className="block text-xs font-medium text-[#4A3E37] mb-1">
                  Delivery Time Display String <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.deliveryTime || ''}
                  onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                  placeholder="e.g. Ready to ship in 1-2 days • 3-5 days delivery across Pakistan"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DFCFF0] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                />
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        deliveryTime: 'Ready to ship in 1-2 days • 3-5 days delivery across Pakistan',
                        estimatedDispatchDays: 2,
                      })
                    }
                    className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-[#DFCFF0] text-[#745699] hover:bg-[#EBE1F5]"
                  >
                    Quick preset: Ready 1-2d
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        deliveryTime: 'Crafted to order: 3-5 days • 3-5 days delivery across Pakistan',
                        estimatedDispatchDays: 4,
                      })
                    }
                    className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-[#DFCFF0] text-[#745699] hover:bg-[#EBE1F5]"
                  >
                    Quick preset: Made to order 3-5d
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        deliveryTime: 'Bespoke crafting: 5-7 days • 3-5 days delivery across Pakistan',
                        estimatedDispatchDays: 6,
                      })
                    }
                    className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-[#DFCFF0] text-[#745699] hover:bg-[#EBE1F5]"
                  >
                    Quick preset: Bespoke 5-7d
                  </button>
                </div>
              </div>

              <div className="sm:col-span-4">
                <label className="block text-xs font-medium text-[#4A3E37] mb-1">
                  Est. Dispatch Days
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={formData.estimatedDispatchDays || 2}
                  onChange={(e) => setFormData({ ...formData, estimatedDispatchDays: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DFCFF0] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#2C2420] mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of stitch patterns, texture, style, usage..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
            />
          </div>

          {/* Image URLs Gallery */}
          <div>
            <label className="block text-xs font-semibold text-[#2C2420] mb-1.5">
              Product Images (URLs) <span className="text-red-500">*</span>
            </label>
            
            {/* Existing images list */}
            <div className="flex flex-wrap gap-2.5 mb-2.5">
              {(formData.images || []).map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#EAE3DA] group bg-[#F5F2EC]"
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs"
                    title="Remove image"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] text-center font-medium py-0.5">
                      Main
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Add new image input */}
            <div className="flex gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 rounded-xl bg-[#EBE1F5] hover:bg-[#DFCFF0] text-[#604284] text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Image</span>
              </button>
            </div>
          </div>

          {/* Variants: Colors & Sizes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                Color Options (comma separated)
              </label>
              <input
                type="text"
                value={colorsInput}
                onChange={(e) => setColorsInput(e.target.value)}
                placeholder="e.g. Lavender, Cream, Mint, Blush Pink"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                Size / Variant Options (comma separated)
              </label>
              <input
                type="text"
                value={sizesInput}
                onChange={(e) => setSizesInput(e.target.value)}
                placeholder="e.g. Standard, Small, Deluxe (+PKR 500)"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
              />
            </div>
          </div>

          {/* Materials & Dimensions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                Materials & Yarn
              </label>
              <input
                type="text"
                value={formData.materials || ''}
                onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                placeholder="e.g. 100% Milk Cotton Yarn, Brass Hardware"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                Dimensions
              </label>
              <input
                type="text"
                value={formData.dimensions || ''}
                onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                placeholder="e.g. 32 cm wide x 30 cm tall"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
              />
            </div>
          </div>

          {/* Visibility Badges & Switches */}
          <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3DA] flex flex-wrap gap-4 items-center">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#2C2420] font-medium">
              <input
                type="checkbox"
                checked={!!formData.newArrival}
                onChange={(e) => setFormData({ ...formData, newArrival: e.target.checked })}
                className="w-4 h-4 rounded text-[#9B86BD] focus:ring-[#9B86BD]"
              />
              <span>Mark as New Arrival</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#2C2420] font-medium">
              <input
                type="checkbox"
                checked={!!formData.popular}
                onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                className="w-4 h-4 rounded text-[#9B86BD] focus:ring-[#9B86BD]"
              />
              <span>Mark as Popular / Bestseller</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#2C2420] font-medium">
              <input
                type="checkbox"
                checked={!!formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded text-[#9B86BD] focus:ring-[#9B86BD]"
              />
              <span>Feature on Homepage</span>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-[#EAE3DA] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#EAE3DA] text-xs font-semibold text-[#5A4940] hover:bg-[#F3EFEA] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-product-submit-btn"
              className="px-6 py-2.5 rounded-xl bg-[#9B86BD] hover:bg-[#8063A4] text-white text-xs font-bold shadow-xs transition-all active:scale-98"
            >
              {isEditing ? 'Save Product Changes' : 'Publish Product to Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
