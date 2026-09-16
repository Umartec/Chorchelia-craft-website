import React, { useState } from 'react';
import {
  MessageCircle,
  Search,
  Filter,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  Phone,
  MapPin,
  FileText,
  Calendar,
  AlertCircle,
  ShoppingBag,
  ExternalLink,
  Save,
  Plus,
  Copy,
  Check,
  Edit2,
  Gift,
  Tag,
  Package,
  Sparkles,
  Send,
  X
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CustomerAction, CustomerActionStatus, CraftingStage } from '../../types';
import { formatPKR } from '../../utils/whatsapp';

const CRAFTING_STAGES: CraftingStage[] = [
  'Order Received',
  'Handcrafting',
  'Quality Check & Wrapped',
  'Dispatched',
  'Delivered',
];

const COURIER_PARTNERS = [
  'TCS Express',
  'Leopards Courier',
  'Trax Logistics',
  'PostEx',
  'M&P Express',
  'Local Hand-Delivery (Rahim Yar Khan)',
];

export const CustomerActionsView: React.FC = () => {
  const {
    customerActions,
    updateActionStatus,
    updateOrderTracking,
    deleteCustomerAction,
    logCustomerAction,
    whatsAppTemplates,
    updateWhatsAppTemplate,
    resetWhatsAppTemplates,
    renderWhatsAppTemplate,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  // WhatsApp Quick Reply Modal State
  const [quickReplyAction, setQuickReplyAction] = useState<CustomerAction | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('order_confirmation');
  const [renderedMessage, setRenderedMessage] = useState<string>('');
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [isEditingTemplateDefaults, setIsEditingTemplateDefaults] = useState(false);

  // Tracking Progress Modal State
  const [trackingModalAction, setTrackingModalAction] = useState<CustomerAction | null>(null);
  const [trackingStage, setTrackingStage] = useState<CraftingStage>('Order Received');
  const [courierPartner, setCourierPartner] = useState<string>('TCS Express');
  const [courierTrackNo, setCourierTrackNo] = useState<string>('');
  const [estimatedDelivery, setEstimatedDelivery] = useState<string>('');
  const [artisanNote, setArtisanNote] = useState<string>('');

  // Filter actions
  const filteredActions = customerActions.filter((action) => {
    const matchesSearch =
      action.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.whatsappNumber.includes(searchQuery) ||
      action.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (action.orderRef && action.orderRef.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (action.courierTrackingNumber && action.courierTrackingNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (action.items && action.items.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesStatus = statusFilter === 'all' || action.status === statusFilter;
    const matchesType = typeFilter === 'all' || action.actionType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const totalRevenueInFiltered = filteredActions
    .filter((a) => a.actionType === 'whatsapp_order' && a.status !== 'Cancelled')
    .reduce((sum, a) => sum + (a.totalAmount || 0), 0);

  const handleStatusChange = (actionId: string, newStatus: CustomerActionStatus) => {
    updateActionStatus(actionId, newStatus);
  };

  const handleSaveNotes = (actionId: string) => {
    updateActionStatus(actionId, customerActions.find((a) => a.id === actionId)?.status || 'Pending', noteText);
    setEditingNotesId(null);
  };

  // Open Quick Reply Modal
  const handleOpenQuickReply = (action: CustomerAction) => {
    setQuickReplyAction(action);
    const template = whatsAppTemplates.find((t) => t.id === selectedTemplateId) || whatsAppTemplates[0];
    const trackingLink = `${window.location.origin}${window.location.pathname}#/track?ref=${action.orderRef || action.id}`;
    const itemsList = (action.items || []).map((i) => `• ${i.quantity}x ${i.name} (${formatPKR(i.price)})`).join('\n');
    
    const rendered = renderWhatsAppTemplate(template.defaultText, {
      customerName: action.customerName,
      orderRef: action.orderRef || action.id,
      itemsList: itemsList || 'Handmade Crochet Order',
      totalAmount: formatPKR(action.totalAmount || 0),
      trackingLink: trackingLink,
      courierPartner: action.courierPartner || 'TCS Express',
      courierTrackingNumber: action.courierTrackingNumber || 'Pending dispatch',
      bankDetails: 'JazzCash: 0327-7045677 (Umar Rasheed) • EasyPaisa: 0327-7045677',
    });

    setRenderedMessage(rendered);
    setCopiedMessage(false);
  };

  // Change Template in Quick Reply
  const handleSelectTemplate = (tmplId: string) => {
    setSelectedTemplateId(tmplId);
    if (!quickReplyAction) return;

    const template = whatsAppTemplates.find((t) => t.id === tmplId);
    if (!template) return;

    const trackingLink = `${window.location.origin}${window.location.pathname}#/track?ref=${quickReplyAction.orderRef || quickReplyAction.id}`;
    const itemsList = (quickReplyAction.items || []).map((i) => `• ${i.quantity}x ${i.name} (${formatPKR(i.price)})`).join('\n');

    const rendered = renderWhatsAppTemplate(template.defaultText, {
      customerName: quickReplyAction.customerName,
      orderRef: quickReplyAction.orderRef || quickReplyAction.id,
      itemsList: itemsList || 'Handmade Crochet Order',
      totalAmount: formatPKR(quickReplyAction.totalAmount || 0),
      trackingLink: trackingLink,
      courierPartner: quickReplyAction.courierPartner || 'TCS Express',
      courierTrackingNumber: quickReplyAction.courierTrackingNumber || 'Pending dispatch',
      bankDetails: 'JazzCash: 0327-7045677 (Umar Rasheed) • EasyPaisa: 0327-7045677',
    });

    setRenderedMessage(rendered);
    setCopiedMessage(false);
  };

  const handleCopyQuickReply = () => {
    navigator.clipboard.writeText(renderedMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  const handleSendViaWhatsApp = () => {
    if (!quickReplyAction) return;
    const cleanPhone = quickReplyAction.whatsappNumber.replace(/\D/g, '');
    const fullPhone = cleanPhone.startsWith('92') ? cleanPhone : `92${cleanPhone.replace(/^0/, '')}`;
    const url = `https://wa.me/${fullPhone}?text=${encodeURIComponent(renderedMessage)}`;
    window.open(url, '_blank');
  };

  // Open Tracking Manager Modal
  const handleOpenTrackingModal = (action: CustomerAction) => {
    setTrackingModalAction(action);
    setTrackingStage(action.craftingStage || 'Order Received');
    setCourierPartner(action.courierPartner || 'TCS Express');
    setCourierTrackNo(action.courierTrackingNumber || '');
    setEstimatedDelivery(action.estimatedDeliveryDate || '2-3 Business Days');
    setArtisanNote(action.artisanProgressNote || '');
  };

  const handleSaveTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingModalAction) return;

    let newStatus = trackingModalAction.status;
    if (trackingStage === 'Dispatched') newStatus = 'Dispatched';
    if (trackingStage === 'Delivered') newStatus = 'Delivered';
    if (trackingStage === 'Handcrafting' || trackingStage === 'Quality Check & Wrapped') newStatus = 'Confirmed';

    updateOrderTracking(trackingModalAction.id, {
      craftingStage: trackingStage,
      courierPartner: courierPartner.trim(),
      courierTrackingNumber: courierTrackNo.trim() || undefined,
      estimatedDeliveryDate: estimatedDelivery.trim() || undefined,
      artisanProgressNote: artisanNote.trim() || undefined,
      status: newStatus,
    });

    setTrackingModalAction(null);
  };

  // One-Click Courier Manifest Export (CSV)
  const handleExportCourierCSV = () => {
    if (customerActions.length === 0) return;

    const headers = [
      'Order Ref',
      'Consignee Name',
      'Consignee Phone',
      'Destination City',
      'Complete Delivery Address',
      'COD Amount (PKR)',
      'Courier Partner',
      'Courier Tracking #',
      'Crafting Stage',
      'Gift Occasion',
      'Handwritten Gift Note',
      'Pieces Description',
    ];

    const rows = customerActions.map((a) => [
      `"${a.orderRef || a.id}"`,
      `"${a.customerName.replace(/"/g, '""')}"`,
      `"${a.whatsappNumber}"`,
      `"${a.city}"`,
      `"${(a.deliveryAddress || '').replace(/"/g, '""')}"`,
      a.totalAmount || 0,
      `"${a.courierPartner || 'TCS'}"`,
      `"${a.courierTrackingNumber || ''}"`,
      `"${a.craftingStage || 'Order Received'}"`,
      `"${(a.giftOccasion || '').replace(/"/g, '""')}"`,
      `"${(a.giftNote || '').replace(/"/g, '""')}"`,
      `"${(a.items || []).map((i) => `${i.quantity}x ${i.name}`).join('; ').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `chorchelia_courier_manifest_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateTestOrder = () => {
    const testRef = `CC-${Math.floor(10000 + Math.random() * 90000)}`;
    logCustomerAction({
      orderRef: testRef,
      customerName: 'Samina Khan',
      whatsappNumber: '03027891234',
      city: 'Rawalpindi',
      deliveryAddress: 'House 88, Satellite Town, Rawalpindi',
      actionType: 'whatsapp_order',
      items: [
        {
          name: 'Eternal Pastel Crochet Flower Bouquet',
          quantity: 1,
          price: 2500,
          color: 'Sunflower Yellow',
        },
      ],
      subtotal: 2500,
      shippingFee: 250,
      totalAmount: 2750,
      giftOccasion: '🎂 Birthday Surprise',
      giftNote: 'Happy Birthday dearest Sister! With lots of love, Samina.',
      craftingStage: 'Order Received',
      courierPartner: 'TCS Express',
      notes: 'Please dispatch early for weekend birthday surprise!',
      status: 'Pending',
    });
  };

  const getStatusBadgeClass = (status: CustomerActionStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Confirmed':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Dispatched':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const getCraftingStageColor = (stage?: CraftingStage) => {
    switch (stage) {
      case 'Order Received':
        return 'bg-amber-100 text-amber-800';
      case 'Handcrafting':
        return 'bg-indigo-100 text-indigo-800';
      case 'Quality Check & Wrapped':
        return 'bg-purple-100 text-purple-800';
      case 'Dispatched':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getActionTypeLabel = (type: CustomerAction['actionType']) => {
    switch (type) {
      case 'whatsapp_order':
        return { label: 'WhatsApp Order', color: 'bg-[#25D366]/10 text-[#128C7E] border-[#25D366]/30' };
      case 'custom_quote':
        return { label: 'Custom Quote Request', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'form_inquiry':
        return { label: 'Form Contact Inquiry', color: 'bg-sky-50 text-sky-700 border-sky-200' };
      case 'review_submitted':
        return { label: 'Customer Review', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      default:
        return { label: 'General Activity', color: 'bg-gray-50 text-gray-700 border-gray-200' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EAE3DA]">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#2C2420]">
            Customer Activity, Orders & Live Tracking Feed
          </h3>
          <p className="text-xs text-[#7C6C63] mt-0.5">
            Real-time feed of customers who placed WhatsApp orders, requested quotes, or sent inquiries
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCreateTestOrder}
            className="px-3 py-2 rounded-xl bg-[#F6F1FB] hover:bg-[#EBE1F5] text-[#745699] text-xs font-semibold flex items-center gap-1.5 border border-[#DFCFF0] transition-colors"
            title="Simulate a new incoming customer order with gift card"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Simulate Order</span>
          </button>

          <button
            onClick={handleExportCourierCSV}
            disabled={customerActions.length === 0}
            className="px-3.5 py-2 rounded-xl bg-[#9B86BD] hover:bg-[#8063A4] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
            title="Export CSV formatted for TCS, Leopards & Trax bookings"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Courier Export (CSV)</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAE3DA] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9E8E84]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order Ref (CC-XXXXX), name, phone, city, courier tracking #..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['all', 'Pending', 'Confirmed', 'Dispatched', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-[#9B86BD] text-white shadow-xs font-semibold'
                  : 'bg-[#FAF8F5] text-[#6B5B52] hover:bg-[#EBE1F5] hover:text-[#604284]'
              }`}
            >
              {st === 'all' ? 'All Status' : st}
            </button>
          ))}
        </div>

        {/* Action Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
        >
          <option value="all">All Action Types</option>
          <option value="whatsapp_order">WhatsApp Orders</option>
          <option value="custom_quote">Custom Quotes</option>
          <option value="form_inquiry">Contact Inquiries</option>
        </select>
      </div>

      {/* Quick Summary Pill */}
      <div className="flex items-center justify-between text-xs text-[#7C6C63] px-1">
        <span>
          Showing <strong>{filteredActions.length}</strong> of {customerActions.length} total customer actions
        </span>
        {totalRevenueInFiltered > 0 && (
          <span className="font-medium text-[#2C2420]">
            Filtered Orders Value: <strong className="text-[#745699] font-serif text-sm">{formatPKR(totalRevenueInFiltered)}</strong>
          </span>
        )}
      </div>

      {/* Customer Action Feed Cards */}
      {filteredActions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#EAE3DA] p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-[#FAF8F5] text-[#9E8E84] flex items-center justify-center mx-auto mb-3">
            <Search className="w-5 h-5" />
          </div>
          <h4 className="font-serif text-base font-semibold text-[#2C2420]">
            No customer actions found
          </h4>
          <p className="text-xs text-[#7C6C63] mt-1">
            Try adjusting your search query or filter tags.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredActions.map((action) => {
            const typeBadge = getActionTypeLabel(action.actionType);
            const cleanPhone = action.whatsappNumber.replace(/\D/g, '');
            const whatsappChatUrl = `https://wa.me/${cleanPhone.startsWith('92') ? cleanPhone : `92${cleanPhone.replace(/^0/, '')}`}`;

            return (
              <div
                key={action.id}
                className="bg-white rounded-2xl border border-[#EAE3DA] hover:border-[#DFCFF0] p-5 sm:p-6 shadow-2xs transition-all flex flex-col space-y-4"
                id={`customer-action-${action.id}`}
              >
                {/* Header Row: Customer, Time, Type & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F5F2EC]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#EBE1F5] text-[#745699] font-bold text-sm flex items-center justify-center border border-[#DFCFF0] flex-shrink-0">
                      {action.customerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-sm text-[#2C2420]">
                          {action.customerName}
                        </h4>
                        {action.orderRef && (
                          <span className="font-mono text-xs font-bold text-[#604284] bg-[#F3EEF9] px-2 py-0.5 rounded-md border border-[#DFCFF0]">
                            #{action.orderRef}
                          </span>
                        )}
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${typeBadge.color}`}>
                          {typeBadge.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#7C6C63] mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#9B86BD]" /> {action.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#9B86BD]" />{' '}
                          {new Date(action.timestamp).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Dropdown, Quick Reply & Tracking Buttons */}
                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                    
                    {/* WhatsApp Quick Reply Button */}
                    <button
                      onClick={() => handleOpenQuickReply(action)}
                      className="px-3 py-1.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] text-xs font-bold flex items-center gap-1.5 border border-[#25D366]/30 transition-colors"
                      title="Send pre-formatted order confirmation, tracking link, or payment details"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Quick Reply</span>
                    </button>

                    {/* Update Tracking Progress Button */}
                    <button
                      onClick={() => handleOpenTrackingModal(action)}
                      className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EEF9] text-[#604284] text-xs font-semibold flex items-center gap-1.5 border border-[#DFCFF0] transition-colors"
                      title="Update crafting stage and courier tracking ID"
                    >
                      <Package className="w-3.5 h-3.5 text-[#9B86BD]" />
                      <span>Tracking</span>
                    </button>

                    {/* Status Dropdown */}
                    <div className="relative">
                      <select
                        value={action.status}
                        onChange={(e) => handleStatusChange(action.id, e.target.value as CustomerActionStatus)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border appearance-none pr-7 focus:outline-none cursor-pointer ${getStatusBadgeClass(
                          action.status
                        )}`}
                      >
                        <option value="Pending">🟡 Pending</option>
                        <option value="Confirmed">🔵 Confirmed</option>
                        <option value="Dispatched">🟣 Dispatched</option>
                        <option value="Delivered">🟢 Delivered</option>
                        <option value="Cancelled">🔴 Cancelled</option>
                      </select>
                      <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-current text-[10px]">
                        ▼
                      </div>
                    </div>

                    <button
                      onClick={() => deleteCustomerAction(action.id)}
                      className="p-1.5 rounded-lg text-[#A8988E] hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete customer record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Crafting Stage Progress Strip */}
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#EAE3DA] flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-[#7C6C63]">Crafting Progress:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getCraftingStageColor(action.craftingStage)}`}>
                      {action.craftingStage || 'Order Received'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-[#7C6C63]">
                    {action.courierPartner && (
                      <span>Courier: <strong>{action.courierPartner}</strong></span>
                    )}
                    {action.courierTrackingNumber ? (
                      <span className="font-mono font-bold text-[#604284]">
                        Track: {action.courierTrackingNumber}
                      </span>
                    ) : (
                      <span className="italic text-[#A8988E]">No courier tracking added</span>
                    )}
                  </div>
                </div>

                {/* Body Row: Order Items & Delivery Address */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                  
                  {/* Left (7 cols): Ordered Items */}
                  <div className="md:col-span-7 bg-[#FAF8F5] p-3.5 rounded-xl border border-[#EAE3DA] space-y-2">
                    <div className="font-semibold text-[#4A3E37] flex items-center justify-between border-b border-[#EAE3DA] pb-1.5">
                      <span className="flex items-center gap-1.5">
                        <ShoppingBag className="w-3.5 h-3.5 text-[#9B86BD]" /> Items Requested:
                      </span>
                      {action.totalAmount !== undefined && (
                        <span className="font-serif text-sm font-bold text-[#2C2420]">
                          Total: {formatPKR(action.totalAmount)}
                        </span>
                      )}
                    </div>

                    {action.items && action.items.length > 0 ? (
                      <div className="space-y-1.5 pt-1">
                        {action.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <div>
                              <span className="font-medium text-[#2C2420]">{item.name}</span>
                              {(item.color || item.size) && (
                                <span className="text-[11px] text-[#7C6C63] ml-1.5">
                                  ({[item.color, item.size].filter(Boolean).join(', ')})
                                </span>
                              )}
                            </div>
                            <div className="text-right font-medium text-[#5B4840]">
                              <span>{item.quantity} × {formatPKR(item.price)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[#7C6C63] italic">Custom / general request with no itemized cart</p>
                    )}

                    {/* Breakdown pill if present */}
                    {(action.shippingFee !== undefined || action.discountAmount !== undefined) && (
                      <div className="pt-2 border-t border-[#EAE3DA] flex flex-wrap items-center gap-3 text-[11px] text-[#7C6C63]">
                        {action.subtotal && <span>Subtotal: {formatPKR(action.subtotal)}</span>}
                        {action.discountAmount ? (
                          <span className="text-emerald-700 font-semibold">
                            Coupon ({action.discountCode}): -{formatPKR(action.discountAmount)}
                          </span>
                        ) : null}
                        {action.shippingFee !== undefined && (
                          <span>Shipping: {action.shippingFee === 0 ? 'FREE' : formatPKR(action.shippingFee)}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right (5 cols): Delivery Address & Gift Note */}
                  <div className="md:col-span-5 bg-white p-3.5 rounded-xl border border-[#EAE3DA] space-y-2">
                    {action.deliveryAddress && (
                      <div>
                        <span className="text-[11px] font-semibold text-[#7C6C63] block">
                          Delivery Address:
                        </span>
                        <p className="text-[#2C2420] font-medium mt-0.5">
                          {action.deliveryAddress}, {action.city}
                        </p>
                      </div>
                    )}

                    {/* Gift Occasion & Note Badge */}
                    {action.giftOccasion && (
                      <div className="p-2.5 rounded-xl bg-[#FAF6EE] border border-[#EFE5D0] text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-[#8A6729]">
                          <Gift className="w-3.5 h-3.5 text-[#9B86BD]" />
                          <span>Handwritten Gift Order: {action.giftOccasion}</span>
                        </div>
                        {action.giftNote && (
                          <p className="text-[11px] text-[#5A4940] italic">
                            "{action.giftNote}"
                          </p>
                        )}
                      </div>
                    )}

                    {action.notes && (
                      <div className="pt-1.5 border-t border-[#F5F2EC]">
                        <span className="text-[11px] font-semibold text-[#7C6C63] block">
                          Customer Note:
                        </span>
                        <p className="text-[#5B4840] italic mt-0.5">
                          "{action.notes}"
                        </p>
                      </div>
                    )}

                    {action.artisanProgressNote && (
                      <div className="pt-1.5 border-t border-[#F5F2EC]">
                        <span className="text-[11px] font-semibold text-[#745699] block">
                          Artisan Crafting Memo:
                        </span>
                        <p className="text-[#4A3E37] text-[11px] mt-0.5">
                          {action.artisanProgressNote}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer: Admin Internal Working Notes */}
                <div className="bg-[#F8F5FB] p-3 rounded-xl border border-[#DFCFF0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex-1 flex items-center gap-2">
                    <span className="font-semibold text-[#604284] flex-shrink-0">
                      Internal Admin Notes:
                    </span>
                    {editingNotesId === action.id ? (
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="e.g. Advance paid via JazzCash, Tracking # LEOP-1234"
                          className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-[#9B86BD] bg-white focus:outline-none text-[#2C2420]"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveNotes(action.id)}
                          className="px-2.5 py-1 rounded-lg bg-[#9B86BD] text-white text-[11px] font-semibold flex items-center gap-1"
                        >
                          <Save className="w-3 h-3" /> Save
                        </button>
                      </div>
                    ) : (
                      <span className="text-[#4A3E37] flex-1 italic">
                        {action.internalNotes || 'No notes added yet (e.g. advance payment confirmation, custom ribbon colors).'}
                      </span>
                    )}
                  </div>

                  {editingNotesId !== action.id && (
                    <button
                      onClick={() => {
                        setEditingNotesId(action.id);
                        setNoteText(action.internalNotes || '');
                      }}
                      className="text-[11px] font-semibold text-[#745699] hover:underline flex-shrink-0"
                    >
                      {action.internalNotes ? 'Edit Notes' : '+ Add Note'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: WHATSAPP QUICK-REPLY SHORTCUTS */}
      {quickReplyAction && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xl border border-[#EAE3DA] shadow-2xl animate-in zoom-in-95 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE3DA]">
              <div>
                <h4 className="font-serif text-lg font-bold text-[#2C2420] flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  <span>WhatsApp Quick-Reply Shortcuts</span>
                </h4>
                <p className="text-xs text-[#7C6C63] mt-0.5">
                  Pre-formatted message for <strong>{quickReplyAction.customerName}</strong> ({quickReplyAction.whatsappNumber})
                </p>
              </div>

              <button
                onClick={() => setQuickReplyAction(null)}
                className="p-1.5 text-[#7C6C63] hover:text-[#2C2420] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template Selector Pills */}
            <div className="pt-4 space-y-2">
              <label className="block text-xs font-semibold text-[#2C2420]">
                Choose Message Template:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {whatsAppTemplates.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectTemplate(t.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      selectedTemplateId === t.id
                        ? 'border-[#9B86BD] bg-[#F6EEFA] text-[#604284] font-bold shadow-2xs'
                        : 'border-[#EAE3DA] bg-white text-[#4A3E37] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <span className="block truncate">{t.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Rendered & Editable Message Box */}
            <div className="pt-4 flex-1 overflow-y-auto space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold text-[#2C2420]">
                  Message Preview & Edit:
                </label>
                <span className="text-[10px] text-[#7C6C63]">
                  Includes Live Tracking Link & Order Ref
                </span>
              </div>

              <textarea
                rows={7}
                value={renderedMessage}
                onChange={(e) => setRenderedMessage(e.target.value)}
                className="w-full p-3.5 text-xs rounded-2xl border border-[#EAE3DA] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420] font-sans leading-relaxed"
              />
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-[#EAE3DA] flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={handleCopyQuickReply}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#EAE3DA] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-[#4A3E37] flex items-center justify-center gap-2 transition-colors"
              >
                {copiedMessage ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedMessage ? 'Copied to Clipboard!' : 'Copy Message'}</span>
              </button>

              <button
                type="button"
                onClick={handleSendViaWhatsApp}
                className="w-full flex-1 py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BE5C] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Open in WhatsApp Web / App</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ORDER TRACKING & CRAFTING STAGE MANAGER */}
      {trackingModalAction && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg border border-[#EAE3DA] shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE3DA]">
              <div>
                <h4 className="font-serif text-lg font-bold text-[#2C2420] flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#9B86BD]" />
                  <span>Update Order Tracking Progress</span>
                </h4>
                <p className="text-xs text-[#7C6C63] mt-0.5">
                  Order Ref: <strong>{trackingModalAction.orderRef || trackingModalAction.id}</strong> • Customer: {trackingModalAction.customerName}
                </p>
              </div>

              <button
                onClick={() => setTrackingModalAction(null)}
                className="p-1.5 text-[#7C6C63] hover:text-[#2C2420] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTracking} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                  Crafting & Logistics Stage:
                </label>
                <select
                  value={trackingStage}
                  onChange={(e) => setTrackingStage(e.target.value as CraftingStage)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420] font-semibold"
                >
                  {CRAFTING_STAGES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-[#7C6C63] mt-0.5 block">
                  Customers will see this real-time stage on their live Tracking page.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                    Courier Partner:
                  </label>
                  <select
                    value={courierPartner}
                    onChange={(e) => setCourierPartner(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                  >
                    {COURIER_PARTNERS.map((cp) => (
                      <option key={cp} value={cp}>
                        {cp}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                    Courier Tracking #:
                  </label>
                  <input
                    type="text"
                    value={courierTrackNo}
                    onChange={(e) => setCourierTrackNo(e.target.value)}
                    placeholder="e.g. TCS-991204"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#EAE3DA] focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 font-mono text-[#2C2420]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                  Estimated Delivery Timing:
                </label>
                <input
                  type="text"
                  value={estimatedDelivery}
                  onChange={(e) => setEstimatedDelivery(e.target.value)}
                  placeholder="e.g. Tomorrow Afternoon / 2-3 Business Days"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#EAE3DA] focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                  Artisan Progress Note (Public to Customer):
                </label>
                <textarea
                  rows={2}
                  value={artisanNote}
                  onChange={(e) => setArtisanNote(e.target.value)}
                  placeholder="e.g. Yarn selected and petals assembled with lavender fragrance card tucked inside."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#EAE3DA] focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTrackingModalAction(null)}
                  className="flex-1 py-2.5 rounded-xl border border-[#EAE3DA] text-xs font-semibold text-[#6B5B52] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#9B86BD] hover:bg-[#8063A4] text-white text-xs font-bold transition-colors"
                >
                  Save Tracking Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
