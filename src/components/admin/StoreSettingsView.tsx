import React, { useState } from 'react';
import { 
  Store, 
  Phone, 
  Sparkles, 
  MapPin, 
  Mail, 
  Clock, 
  Truck, 
  Instagram, 
  Facebook, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { StoreSettings } from '../../types';

export const StoreSettingsView: React.FC = () => {
  const { settings, updateSettings, resetSettingsToDefault } = useStore();
  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleChange = (field: keyof StoreSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaveSuccess(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleReset = () => {
    resetSettingsToDefault();
    setConfirmReset(false);
    setSaveSuccess(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300" id="admin-store-settings">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3DA] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBE1F5] text-[#604284] text-xs font-semibold mb-2">
              <Store className="w-3.5 h-3.5 text-[#9B86BD]" />
              <span>Live Storefront Configuration</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2420]">
              Store Settings & Content Parameters
            </h2>
            <p className="text-xs sm:text-sm text-[#7C6C63] mt-1">
              Changes updated here immediately take effect across the entire website without any code rebuilds.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="px-4 py-2.5 rounded-xl border border-[#EAE3DA] text-[#6B5B52] hover:text-[#2C2420] hover:bg-[#FAF8F5] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="font-medium">
            Store settings saved successfully! All navbar banners, WhatsApp chat routing, delivery notes, and contact blocks have been updated.
          </span>
        </div>
      )}

      {/* Confirmation modal for reset */}
      {confirmReset && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>Are you sure you want to reset all store settings back to original factory defaults?</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-semibold text-xs"
            >
              Yes, Reset
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-800 text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Section 1: Top Announcement Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE3DA] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#9B86BD]" />
              <h3 className="font-serif text-lg font-bold text-[#2C2420]">
                Top Announcement Bar
              </h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.showAnnouncement}
                onChange={(e) => handleChange('showAnnouncement', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9B86BD]"></div>
              <span className="ml-2 text-xs font-medium text-[#5A4940]">
                {formData.showAnnouncement ? 'Visible' : 'Hidden'}
              </span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2C2420] mb-1">
              Banner Announcement Text
            </label>
            <input
              type="text"
              required
              value={formData.announcementText}
              onChange={(e) => handleChange('announcementText', e.target.value)}
              placeholder="e.g. Nationwide Delivery Across Pakistan • WhatsApp Orders: 0327 7045677"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
            />
            <p className="text-[11px] text-[#7C6C63] mt-1">
              Displayed prominently at the very top of all pages above the main menu bar.
            </p>
          </div>
        </div>

        {/* Section 2: WhatsApp & Direct Contact Channels */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE3DA] shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#25D366]" />
            <h3 className="font-serif text-lg font-bold text-[#2C2420]">
              WhatsApp Business & Communication Routing
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                WhatsApp Phone (Country Code Format without + or spaces)
              </label>
              <input
                type="text"
                required
                value={formData.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', e.target.value.replace(/\D/g, ''))}
                placeholder="923277045677"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
              />
              <p className="text-[11px] text-[#7C6C63] mt-1">
                Used in all automated wa.me direct chat links and checkout buttons.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                Display Phone Number (Formatted for Pakistani Customers)
              </label>
              <input
                type="text"
                required
                value={formData.phoneDisplay}
                onChange={(e) => handleChange('phoneDisplay', e.target.value)}
                placeholder="0327 7045677"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
              />
              <p className="text-[11px] text-[#7C6C63] mt-1">
                Shown as readable text in header, contact blocks, and footer.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                Official Business Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8C7A70] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                Business Working Hours
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-[#8C7A70] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.storeHours}
                  onChange={(e) => handleChange('storeHours', e.target.value)}
                  placeholder="Mon - Sat: 10:00 AM - 9:00 PM"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2C2420] mb-1">
              Workshop / Business Location
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#8C7A70] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.businessAddress}
                onChange={(e) => handleChange('businessAddress', e.target.value)}
                placeholder="Rahim Yar Khan, Punjab, Pakistan"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Delivery Timelines & Lead Times */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE3DA] shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#9B86BD]" />
            <h3 className="font-serif text-lg font-bold text-[#2C2420]">
              Delivery Lead Times & Courier Policies
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2C2420] mb-1">
              Standard In-Stock Delivery Headline
            </label>
            <input
              type="text"
              required
              value={formData.standardDeliveryDays}
              onChange={(e) => handleChange('standardDeliveryDays', e.target.value)}
              placeholder="Ready to dispatch in 1-2 days • 3-5 days delivery across Pakistan"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2C2420] mb-1">
              Custom Orders Crafting Lead Time Note
            </label>
            <input
              type="text"
              required
              value={formData.customDeliveryDays}
              onChange={(e) => handleChange('customDeliveryDays', e.target.value)}
              placeholder="Custom orders: 3-7 days crafting lead time before courier dispatch"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2C2420] mb-1">
              Delivery & Courier Explanatory Policy
            </label>
            <textarea
              rows={3}
              value={formData.deliveryPolicyNote}
              onChange={(e) => handleChange('deliveryPolicyNote', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
            />
          </div>
        </div>

        {/* Section 4: Social Media Links */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE3DA] shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Instagram className="w-5 h-5 text-[#E1306C]" />
            <h3 className="font-serif text-lg font-bold text-[#2C2420]">
              Social Media Accounts
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                Instagram Profile Link
              </label>
              <input
                type="url"
                required
                value={formData.instagramUrl}
                onChange={(e) => handleChange('instagramUrl', e.target.value)}
                placeholder="https://www.instagram.com/chorchelia.craft_store/"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                Facebook Page Link
              </label>
              <input
                type="url"
                required
                value={formData.facebookUrl}
                onChange={(e) => handleChange('facebookUrl', e.target.value)}
                placeholder="https://www.facebook.com/profile.php?id=61594523815302"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="sticky bottom-6 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#DFCFF0] shadow-lg flex items-center justify-between">
          <span className="text-xs text-[#6B5B52]">
            Ready to update live store settings?
          </span>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#9B86BD] hover:bg-[#8063A4] text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>Save All Store Changes</span>
          </button>
        </div>

      </form>
    </div>
  );
};
