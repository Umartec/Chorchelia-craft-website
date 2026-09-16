import React from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Toast: React.FC = () => {
  const { toastMessage, setIsCartOpen } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-[#2C2420] text-white px-4 py-3 rounded-2xl shadow-xl border border-[#4A3E37] flex items-center gap-3 text-xs">
        <div className="w-6 h-6 rounded-full bg-[#9B86BD] flex items-center justify-center flex-shrink-0 text-white">
          <Check className="w-3.5 h-3.5" />
        </div>
        <span className="font-medium">{toastMessage}</span>
        <button
          onClick={() => setIsCartOpen(true)}
          className="ml-2 px-2.5 py-1 rounded-lg bg-[#FAF8F5]/10 hover:bg-[#FAF8F5]/20 text-[#DFCFF0] font-semibold text-[11px] transition-colors flex items-center gap-1"
        >
          <ShoppingBag className="w-3 h-3" />
          View
        </button>
      </div>
    </div>
  );
};
