/**
 * Application Type Definitions
 */

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number; // in PKR
  description: string;
  images: string[];
  colors?: string[];
  sizes?: string[];
  materials: string;
  dimensions?: string;
  availability: 'In Stock' | 'Made to Order' | 'Out of Stock';
  deliveryTime?: string; // Estimated craft & delivery timeframe in Pakistan (e.g. "Ready to dispatch in 1-2 days • 3-5 days delivery")
  estimatedDispatchDays?: number;
  featured?: boolean;
  newArrival?: boolean;
  popular?: boolean;
  stock?: number;
  sku: string;
  handmadeNote?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  customNotes?: string;
}

export interface CustomerOrderDetails {
  fullName: string;
  whatsappNumber: string;
  city: string;
  deliveryAddress: string;
  notes?: string;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  city: string;
  rating: number;
  comment: string;
  productBought?: string;
  date?: string;
  verifiedPurchase?: boolean;
  status?: 'Approved' | 'Pending' | 'Hidden';
  featured?: boolean;
  adminReply?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

export type CustomerActionType = 'whatsapp_order' | 'custom_quote' | 'form_inquiry' | 'review_submitted';
export type CustomerActionStatus = 'Pending' | 'Confirmed' | 'Dispatched' | 'Delivered' | 'Cancelled';

export type CraftingStage = 
  | 'Order Received'
  | 'Handcrafting'
  | 'Quality Check & Wrapped'
  | 'Dispatched'
  | 'Delivered'
  | 'Cancelled';

export interface CustomerActionItem {
  name: string;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
}

export interface CustomerAction {
  id: string;
  orderRef?: string; // e.g. CC-52194
  customerName: string;
  whatsappNumber: string;
  city: string;
  deliveryAddress?: string;
  actionType: CustomerActionType;
  items?: CustomerActionItem[];
  totalAmount?: number;
  subtotal?: number;
  shippingFee?: number;
  discountAmount?: number;
  discountCode?: string;
  giftOccasion?: string;
  giftNote?: string;
  notes?: string;
  timestamp: string; // ISO 8601 string
  status: CustomerActionStatus;
  craftingStage?: CraftingStage;
  courierPartner?: 'TCS' | 'Leopards' | 'Trax' | 'PostEx' | 'M&P' | 'Local Rider' | 'Other';
  courierTrackingNumber?: string;
  estimatedDeliveryDate?: string;
  artisanProgressNote?: string;
  internalNotes?: string;
}

export interface DiscountCode {
  id?: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 10 for 10% or 200 for Rs. 200
  minOrderAmount?: number;
  isActive: boolean;
  description: string;
  expiryDate?: string;
  usedCount?: number;
}

export interface CityShippingRate {
  cityName: string;
  province: string;
  standardDays: string;
  shippingFee: number;
  courierPartner: string;
  freeShippingThreshold?: number;
  // Aliases for component convenience
  city?: string;
  transitDays?: string;
  estimatedRate?: number;
}

export interface WhatsAppQuickReplyTemplate {
  id: string;
  title: string;
  category: 'confirmation' | 'crafting' | 'dispatch' | 'delivery' | 'custom';
  defaultText: string;
}

export interface AdminSecurityCredentials {
  email: string;
  name: string;
  passwordHash: string; // Cryptographic SHA-256 hash
  passwordSalt: string; // Cryptographic salt
  lastUpdated: string;
  securityQuestion?: string;
  securityAnswerHash?: string;
  securityAnswerSalt?: string;
}

export interface AdminUser {
  email: string;
  name: string;
  role: 'admin';
  lastLogin?: string;
  sessionToken?: string;
}

export interface StoreSettings {
  businessName: string;
  tagline: string;
  announcementText: string;
  showAnnouncement: boolean;
  whatsappNumber: string;
  phoneDisplay: string;
  email: string;
  businessAddress: string;
  storeHours: string;
  standardDeliveryDays: string;
  customDeliveryDays: string;
  deliveryPolicyNote: string;
  instagramUrl: string;
  facebookUrl: string;
}

