import React, { useState, useRef } from 'react';
import { 
  Download, 
  Upload, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  ShieldCheck, 
  FileText, 
  HardDriveDownload 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const BackupRestoreView: React.FC = () => {
  const { 
    products, 
    customerActions, 
    reviews, 
    settings, 
    exportStoreBackup, 
    importStoreBackup, 
    resetProductsToDefault 
  } = useStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [restoreStatus, setRestoreStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [confirmReset, setConfirmReset] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRestoreStatus({ type: null, message: '' });
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const result = importStoreBackup(content);
        setIsProcessing(false);

        if (result.success) {
          setRestoreStatus({
            type: 'success',
            message: `Store database successfully restored! Products, customer orders, reviews, and settings are updated.`,
          });
        } else {
          setRestoreStatus({
            type: 'error',
            message: result.error || 'Failed to restore store backup.',
          });
        }
      } catch (err: any) {
        setIsProcessing(false);
        setRestoreStatus({
          type: 'error',
          message: err.message || 'Failed to read uploaded file.',
        });
      }
    };

    reader.onerror = () => {
      setIsProcessing(false);
      setRestoreStatus({ type: 'error', message: 'Error reading uploaded file.' });
    };

    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleResetCatalog = () => {
    resetProductsToDefault();
    setConfirmReset(false);
    setRestoreStatus({
      type: 'success',
      message: 'Product catalog reset to standard default collection.',
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300" id="admin-backup-restore">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3DA] shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBE1F5] text-[#604284] text-xs font-semibold mb-2">
          <Database className="w-3.5 h-3.5 text-[#9B86BD]" />
          <span>Full Store Data Portability</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2420]">
          Backup, Export & Disaster Recovery
        </h2>
        <p className="text-xs sm:text-sm text-[#7C6C63] mt-1">
          Export your complete store state (products, customer actions, reviews, and custom settings) to a standalone JSON file anytime.
        </p>
      </div>

      {restoreStatus.type && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 ${
            restoreStatus.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {restoreStatus.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <span className="font-medium">{restoreStatus.message}</span>
        </div>
      )}

      {/* Database Snapshot Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#EAE3DA]">
          <span className="text-[11px] text-[#7C6C63] block">Active Products:</span>
          <span className="font-serif text-2xl font-bold text-[#2C2420]">{products.length}</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#EAE3DA]">
          <span className="text-[11px] text-[#7C6C63] block">Logged Customer Actions:</span>
          <span className="font-serif text-2xl font-bold text-[#2C2420]">{customerActions.length}</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#EAE3DA]">
          <span className="text-[11px] text-[#7C6C63] block">Customer Reviews:</span>
          <span className="font-serif text-2xl font-bold text-[#2C2420]">{reviews.length}</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#EAE3DA]">
          <span className="text-[11px] text-[#7C6C63] block">Active Settings:</span>
          <span className="font-serif text-2xl font-bold text-emerald-600">Configured</span>
        </div>
      </div>

      {/* Main Operations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Export Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE3DA] shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#EBE1F5] text-[#745699] flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#2C2420]">
              Export Full Store Database
            </h3>
            <p className="text-xs text-[#6B5B52] leading-relaxed">
              Download an encrypted/structured JSON snapshot of all your handmade products, price configurations, customer orders log, reviews, and store details. Keep it safely on your computer.
            </p>
          </div>

          <button
            onClick={exportStoreBackup}
            className="w-full py-3 px-4 rounded-xl bg-[#9B86BD] hover:bg-[#8063A4] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98"
          >
            <HardDriveDownload className="w-4 h-4" />
            <span>Download Store Backup JSON</span>
          </button>
        </div>

        {/* Restore Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE3DA] shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#EBE1F5] text-[#745699] flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#2C2420]">
              Restore Database from JSON
            </h3>
            <p className="text-xs text-[#6B5B52] leading-relaxed">
              Import a previously downloaded Chorchelia Craft backup JSON file to restore all products, orders, settings, and reviews to this browser instantly.
            </p>
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
              id="backup-file-input"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-xl bg-[#2C2420] hover:bg-[#433730] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 disabled:opacity-60"
            >
              <Upload className="w-4 h-4" />
              <span>{isProcessing ? 'Processing File...' : 'Select Backup JSON to Restore'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Catalog Reset Section */}
      <div className="bg-white rounded-3xl p-6 border border-red-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-600">
            <RotateCcw className="w-4 h-4" />
            <h4 className="font-serif text-sm font-bold">
              Factory Reset Product Catalog
            </h4>
          </div>
          {!confirmReset && (
            <button
              onClick={() => setConfirmReset(true)}
              className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold"
            >
              Reset Products
            </button>
          )}
        </div>
        <p className="text-xs text-[#7C6C63]">
          If you want to discard your custom edits and restore the standard default collection of handmade bags, bouquets, and coasters.
        </p>

        {confirmReset && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-red-800">
            <span>Are you completely sure? Any unexported products will be replaced with default listings.</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetCatalog}
                className="px-3 py-1 rounded-lg bg-red-600 text-white font-semibold"
              >
                Confirm Reset
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-3 py-1 rounded-lg bg-white border border-gray-300 text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
