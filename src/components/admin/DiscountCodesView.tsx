import React, { useState } from 'react';
import { Tag, Plus, Trash2, Edit2, Check, X, Percent, Calendar, DollarSign, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { DiscountCode } from '../../types';
import { formatPKR } from '../../utils/whatsapp';

export const DiscountCodesView: React.FC = () => {
  const { discountCodes, addDiscountCode, updateDiscountCode, deleteDiscountCode } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const resetForm = () => {
    setCode('');
    setDiscountType('percentage');
    setDiscountValue(10);
    setMinOrderAmount(0);
    setDescription('');
    setExpiryDate('');
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: DiscountCode) => {
    setEditingId(item.id || item.code);
    setCode(item.code);
    setDiscountType(item.discountType);
    setDiscountValue(item.discountValue);
    setMinOrderAmount(item.minOrderAmount || 0);
    setDescription(item.description || '');
    setExpiryDate(item.expiryDate ? item.expiryDate.split('T')[0] : '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const payload = {
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount) || undefined,
      description: description.trim() || undefined,
      expiryDate: expiryDate ? new Date(expiryDate).toISOString() : undefined,
      isActive: true,
    };

    if (editingId) {
      updateDiscountCode(editingId, payload);
    } else {
      addDiscountCode(payload);
    }

    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EAE3DA]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-xl font-bold text-[#2C2420]">
              Seasonal Discount Codes & Vouchers
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-[#EBE1F5] text-[#745699] text-[10px] font-bold">
              {discountCodes.length} Codes
            </span>
          </div>
          <p className="text-xs text-[#7C6C63] mt-0.5">
            Create promotional coupons (e.g. WELCOME10, EID2026) for checkout and top announcement banner
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-[#9B86BD] hover:bg-[#8063A4] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Discount Code</span>
        </button>
      </div>

      {/* Codes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {discountCodes.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl border transition-all bg-white relative flex flex-col justify-between ${
              item.isActive ? 'border-[#EAE3DA] hover:border-[#DFCFF0]' : 'border-gray-200 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono font-bold text-sm tracking-wider px-2.5 py-1 rounded-lg bg-[#F3EEF9] text-[#604284] border border-[#DFCFF0]">
                  {item.code}
                </span>

                <button
                  onClick={() => updateDiscountCode(item.id, { isActive: !item.isActive })}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                    item.isActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-gray-100 text-gray-600 border-gray-200'
                  }`}
                >
                  {item.isActive ? 'Active' : 'Disabled'}
                </button>
              </div>

              <div className="text-xl font-bold font-serif text-[#2C2420] mt-1">
                {item.discountType === 'percentage'
                  ? `${item.discountValue}% OFF`
                  : `${formatPKR(item.discountValue)} OFF`}
              </div>

              {item.description && (
                <p className="text-xs text-[#6B5B52] mt-1">{item.description}</p>
              )}

              <div className="mt-3 pt-3 border-t border-[#F5F1EA] text-[11px] text-[#7C6C63] space-y-1">
                {item.minOrderAmount && item.minOrderAmount > 0 ? (
                  <div>Min. Spend: <strong>{formatPKR(item.minOrderAmount)}</strong></div>
                ) : (
                  <div>No minimum spend</div>
                )}
                {item.expiryDate && (
                  <div>Expires: {new Date(item.expiryDate).toLocaleDateString()}</div>
                )}
                <div>Times Used: {item.usedCount || 0}</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-[#F5F1EA]">
              <button
                onClick={() => handleOpenEdit(item)}
                className="p-1.5 text-xs text-[#745699] hover:bg-[#F3EEF9] rounded-lg transition-colors flex items-center gap-1 font-semibold"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => deleteDiscountCode(item.id)}
                className="p-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md border border-[#EAE3DA] shadow-xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE3DA]">
              <h4 className="font-serif text-lg font-bold text-[#2C2420]">
                {editingId ? 'Edit Discount Code' : 'Create New Discount Code'}
              </h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[#7C6C63] hover:text-[#2C2420] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                  Coupon Code (e.g. WELCOME10, EID2026) *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="WELCOME10"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#EAE3DA] focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 font-mono uppercase text-[#2C2420]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (PKR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                    Value {discountType === 'percentage' ? '(%)' : '(PKR)'} *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={discountType === 'percentage' ? 100 : 50000}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#EAE3DA] focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                  Minimum Order Spend (PKR) (0 for no limit)
                </label>
                <input
                  type="number"
                  min={0}
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#EAE3DA] focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                  Description / Note
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 10% off for first-time website visitors"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#EAE3DA] focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#EAE3DA] focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#EAE3DA] text-xs font-semibold text-[#6B5B52] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#9B86BD] hover:bg-[#8063A4] text-white text-xs font-bold transition-colors"
                >
                  {editingId ? 'Save Changes' : 'Create Voucher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
