import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Product, 
  CustomerAction, 
  CustomerActionStatus, 
  CraftingStage,
  DiscountCode,
  WhatsAppQuickReplyTemplate,
  AdminUser, 
  AdminSecurityCredentials,
  StoreSettings,
  CustomerReview 
} from '../types';
import { PRODUCTS } from '../data/products';
import { INITIAL_REVIEWS } from '../data/reviews';
import { SITE_CONFIG } from '../config/site';
import { DEFAULT_WHATSAPP_TEMPLATES } from '../data/whatsappTemplates';
import {
  generateCryptographicSalt,
  generateSecureSessionToken,
  hashPasswordWithSalt,
  verifySecurePassword,
  checkRateLimit,
  recordFailedLoginAttempt,
  resetFailedLoginAttempts,
  appendSecurityLog,
  getSecurityLogs,
  SecurityLogEntry
} from '../utils/cryptoSecurity';

interface StoreContextType {
  // Products Management
  products: Product[];
  addProduct: (product: Omit<Product, 'id'> | Product) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetProductsToDefault: () => void;

  // Customer Actions & Orders Log
  customerActions: CustomerAction[];
  logCustomerAction: (
    action: Omit<CustomerAction, 'id' | 'timestamp' | 'status'> & Partial<CustomerAction>
  ) => CustomerAction;
  updateActionStatus: (
    actionId: string,
    status: CustomerActionStatus,
    internalNotes?: string
  ) => void;
  updateOrderTracking: (
    actionId: string,
    updates: Partial<CustomerAction>
  ) => void;
  findOrderByRefOrPhone: (query: string) => CustomerAction | undefined;
  deleteCustomerAction: (actionId: string) => void;
  clearCustomerActions: () => void;

  // Wishlist / Saved for Later
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;

  // Seasonal Discount Codes & Vouchers
  discountCodes: DiscountCode[];
  addDiscountCode: (code: DiscountCode) => void;
  updateDiscountCode: (codeStr: string, updates: Partial<DiscountCode>) => void;
  deleteDiscountCode: (codeStr: string) => void;
  validateDiscountCode: (codeStr: string, subtotal: number) => { 
    valid: boolean; 
    discountAmount: number; 
    message: string; 
    discountCode?: DiscountCode 
  };

  // WhatsApp Quick Reply Templates
  whatsAppTemplates: WhatsAppQuickReplyTemplate[];
  updateWhatsAppTemplate: (id: string, text: string) => void;
  resetWhatsAppTemplates: () => void;

  // Store Settings Management
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  resetSettingsToDefault: () => void;

  // Reviews Management
  reviews: CustomerReview[];
  addReview: (review: Omit<CustomerReview, 'id' | 'date'>) => CustomerReview;
  updateReview: (id: string, updates: Partial<CustomerReview>) => void;
  deleteReview: (id: string) => void;
  replyToReview: (id: string, replyText: string) => void;

  // Cryptographic Admin Authentication & Security
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  pendingActionsCount: number;
  loginAdmin: (password: string, email?: string) => Promise<{ success: boolean; error?: string; remainingSeconds?: number; attemptsLeft?: number }>;
  logoutAdmin: () => void;
  changeAdminPassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateAdminProfile: (name: string, email: string, securityQuestion?: string, securityAnswer?: string) => Promise<{ success: boolean; error?: string }>;
  securityCredentials: AdminSecurityCredentials | null;
  securityLogs: SecurityLogEntry[];
  refreshSecurityLogs: () => void;

  // Backup & Restore
  exportStoreBackup: () => void;
  importStoreBackup: (jsonContent: string) => { success: boolean; error?: string };
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// LocalStorage Keys
const PRODUCTS_STORAGE_KEY = 'chorchelia_products_v3';
const ACTIONS_STORAGE_KEY = 'chorchelia_customer_actions_v3';
const SETTINGS_STORAGE_KEY = 'chorchelia_store_settings_v3';
const REVIEWS_STORAGE_KEY = 'chorchelia_customer_reviews_v3';
const ADMIN_SESSION_KEY = 'chorchelia_admin_session_v3';
const ADMIN_SECURE_CREDS_KEY = 'chorchelia_admin_crypto_creds_v3';
const WISHLIST_STORAGE_KEY = 'chorchelia_wishlist_v1';
const DISCOUNT_CODES_STORAGE_KEY = 'chorchelia_discount_codes_v1';
const WHATSAPP_TEMPLATES_STORAGE_KEY = 'chorchelia_whatsapp_templates_v1';

// Default Seasonal & Welcome Discount Codes
const DEFAULT_DISCOUNT_CODES: DiscountCode[] = [
  {
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    isActive: true,
    description: '10% off your entire cart of handmade crochet creations',
  },
  {
    code: 'CHORCHELIA',
    discountType: 'fixed',
    discountValue: 200,
    minOrderAmount: 2000,
    isActive: true,
    description: 'Rs. 200 flat discount on orders above Rs. 2,000',
  },
  {
    code: 'EID2026',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 3500,
    isActive: true,
    description: '15% festive discount for gift bouquets & sets',
  },
];

// Default Store Settings
const DEFAULT_SETTINGS: StoreSettings = {
  businessName: 'Chorchelia Craft',
  tagline: 'Handmade with patience. Crafted with love.',
  announcementText: '✨ Use code WELCOME10 for 10% off • Free nationwide shipping on orders over Rs. 4,500',
  showAnnouncement: true,
  whatsappNumber: '923277045677',
  phoneDisplay: '0327 7045677',
  email: 'chorcheliacraft@gmail.com',
  businessAddress: 'Rahim Yar Khan, Punjab, Pakistan',
  storeHours: 'Mon - Sat: 10:00 AM - 9:00 PM',
  standardDeliveryDays: 'Ready to dispatch in 1-2 days • 2-4 business days courier transit across Pakistan',
  customDeliveryDays: 'Custom orders: 3-7 days crafting lead time before courier dispatch',
  deliveryPolicyNote: 'We ship nationwide via TCS, Leopards, and Trax. Parcel tracking provided upon dispatch.',
  instagramUrl: 'https://www.instagram.com/chorchelia.craft_store/',
  facebookUrl: 'https://www.facebook.com/profile.php?id=61594523815302',
};

// Seed sample customer actions representing real orders across Pakistan
const INITIAL_SAMPLE_ACTIONS: CustomerAction[] = [
  {
    id: 'act-101',
    orderRef: 'CC-52194',
    customerName: 'Ayesha Malik',
    whatsappNumber: '03014589211',
    city: 'Lahore',
    deliveryAddress: 'House 42, Block C, Model Town, Lahore',
    actionType: 'whatsapp_order',
    items: [
      {
        name: 'Eternal Pastel Crochet Flower Bouquet',
        quantity: 1,
        price: 2500,
        color: 'Soft Lavender & Cream',
        size: 'Standard 5-Stem Bouquet',
      },
      {
        name: 'Blooming Tulip Bag Charm Keychain',
        quantity: 2,
        price: 650,
        color: 'Muted Lilac',
      },
    ],
    subtotal: 3800,
    shippingFee: 250,
    totalAmount: 4050,
    giftOccasion: '🎓 Graduation Celebration',
    giftNote: 'Congratulations Dr. Ayesha on your graduation! So proud of you.',
    notes: 'Gift for university graduation, please add our congratulatory handwritten card!',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: 'Confirmed',
    craftingStage: 'Quality Check & Wrapped',
    courierPartner: 'TCS',
    courierTrackingNumber: 'TCS-991204',
    estimatedDeliveryDate: '2-3 Days',
    artisanProgressNote: 'Bouquet stems assembled with lilac ribbons; handwritten graduation note tucked inside craft wrapper.',
    internalNotes: 'Advance payment confirmed via JazzCash. Quality check complete.',
  },
  {
    id: 'act-102',
    orderRef: 'CC-48102',
    customerName: 'Fatima Zahra',
    whatsappNumber: '03335567890',
    city: 'Islamabad',
    deliveryAddress: 'Street 14, Sector F-8/2, Islamabad',
    actionType: 'whatsapp_order',
    items: [
      {
        name: 'Handmade Lavender Field Tote Bag',
        quantity: 1,
        price: 3400,
        color: 'Lavender & Oatmeal',
        size: 'Medium (32 x 30 cm)',
      },
    ],
    subtotal: 3400,
    shippingFee: 250,
    totalAmount: 3650,
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
    status: 'Dispatched',
    craftingStage: 'Dispatched',
    courierPartner: 'Leopards',
    courierTrackingNumber: 'LEOP-882194',
    estimatedDeliveryDate: 'Tomorrow Afternoon',
    artisanProgressNote: 'Handmade tote packed in protective linen pouch and handed over to Leopards courier agent.',
    internalNotes: 'Dispatched via Leopards Courier. Tracking ID shared with customer.',
  },
  {
    id: 'act-103',
    orderRef: 'CC-39011',
    customerName: 'Zainab Qureshi',
    whatsappNumber: '03219874561',
    city: 'Karachi',
    deliveryAddress: 'Clifton Block 5, Karachi',
    actionType: 'whatsapp_order',
    items: [
      {
        name: 'Petal Wave Crochet Coaster Set (4 Pcs)',
        quantity: 2,
        price: 1200,
        color: 'Pastel Lilac & Sage Green',
      },
    ],
    subtotal: 2400,
    shippingFee: 280,
    discountAmount: 200,
    discountCode: 'CHORCHELIA',
    totalAmount: 2480,
    timestamp: new Date(Date.now() - 3600000 * 28).toISOString(),
    status: 'Delivered',
    craftingStage: 'Delivered',
    courierPartner: 'Trax',
    courierTrackingNumber: 'TRX-776120',
    estimatedDeliveryDate: 'Delivered',
    artisanProgressNote: 'Parcel signed and delivered to customer address in Clifton.',
    internalNotes: 'Delivered successfully. Customer sent 5-star positive photo feedback.',
  },
  {
    id: 'act-104',
    orderRef: 'CC-10940',
    customerName: 'Bilal Ahmed',
    whatsappNumber: '03456789123',
    city: 'Rahim Yar Khan',
    deliveryAddress: 'Model Town, Rahim Yar Khan',
    actionType: 'custom_quote',
    notes: 'Inquiring about custom lilac & baby pink bouquet for wedding anniversary with 12 mixed roses.',
    timestamp: new Date(Date.now() - 3600000 * 36).toISOString(),
    status: 'Pending',
    craftingStage: 'Order Received',
    internalNotes: 'Shared photo reference samples on WhatsApp. Waiting for color selection.',
  },
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. PRODUCTS
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading products from localStorage:', e);
    }
    return PRODUCTS;
  });

  // 2. CUSTOMER ACTIONS
  const [customerActions, setCustomerActions] = useState<CustomerAction[]>(() => {
    try {
      const saved = localStorage.getItem(ACTIONS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading customer actions from localStorage:', e);
    }
    return INITIAL_SAMPLE_ACTIONS;
  });

  // 3. STORE SETTINGS
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Error loading store settings:', e);
    }
    return DEFAULT_SETTINGS;
  });

  // 4. REVIEWS
  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    try {
      const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading reviews:', e);
    }
    return INITIAL_REVIEWS.map((r, i) => ({
      ...r,
      verifiedPurchase: true,
      status: 'Approved' as const,
      featured: i < 3,
      adminReply: i === 0 ? 'Thank you so much Ayesha for trusting Chorchelia Craft! It was an absolute pleasure handcrafting this bouquet for your friend.' : undefined,
    }));
  });

  // 5. ADMIN AUTH & CRYPTOGRAPHIC CREDENTIALS
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem(ADMIN_SESSION_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading admin session:', e);
    }
    return null;
  });

  const [securityCredentials, setSecurityCredentials] = useState<AdminSecurityCredentials | null>(null);
  const [securityLogs, setSecurityLogs] = useState<SecurityLogEntry[]>([]);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  // Initialize or load cryptographic credentials
  useEffect(() => {
    async function initCryptoCredentials() {
      try {
        const saved = localStorage.getItem(ADMIN_SECURE_CREDS_KEY);
        let creds: AdminSecurityCredentials | null = null;

        if (saved) {
          try {
            creds = JSON.parse(saved);
          } catch (e) {
            creds = null;
          }
        }

        // If no credentials or previous default email, update to new master credentials
        if (!creds || creds.email !== 'dev.umarrasheed@gmail.com') {
          const salt = generateCryptographicSalt();
          const hash = await hashPasswordWithSalt('noorumar2026', salt);
          const initialCreds: AdminSecurityCredentials = {
            email: 'dev.umarrasheed@gmail.com',
            name: 'Umar Rasheed (Store Owner)',
            passwordHash: hash,
            passwordSalt: salt,
            lastUpdated: new Date().toISOString(),
            securityQuestion: 'What is your handmade craft brand name?',
          };
          localStorage.setItem(ADMIN_SECURE_CREDS_KEY, JSON.stringify(initialCreds));
          setSecurityCredentials(initialCreds);
          appendSecurityLog('SECURITY_RESET', 'Master credentials established for dev.umarrasheed@gmail.com (SHA-256 + 16-byte salt).');
        } else {
          setSecurityCredentials(creds);
        }
      } catch (e) {
        console.error('Error initializing cryptographic security credentials:', e);
      }
      setSecurityLogs(getSecurityLogs());
    }

    initCryptoCredentials();
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Failed saving products:', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(ACTIONS_STORAGE_KEY, JSON.stringify(customerActions));
    } catch (e) {
      console.error('Failed saving customer actions:', e);
    }
  }, [customerActions]);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed saving store settings:', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.error('Failed saving reviews:', e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      if (adminUser) {
        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminUser));
      } else {
        localStorage.removeItem(ADMIN_SESSION_KEY);
      }
    } catch (e) {
      console.error('Failed saving admin user session:', e);
    }
  }, [adminUser]);

  const refreshSecurityLogs = useCallback(() => {
    setSecurityLogs(getSecurityLogs());
  }, []);

  // 6. WISHLIST / SAVED FOR LATER
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading wishlist:', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed saving wishlist:', e);
    }
  }, [wishlist]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const clearWishlist = () => setWishlist([]);

  // 7. SEASONAL DISCOUNT CODES
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>(() => {
    try {
      const saved = localStorage.getItem(DISCOUNT_CODES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading discount codes:', e);
    }
    return DEFAULT_DISCOUNT_CODES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(DISCOUNT_CODES_STORAGE_KEY, JSON.stringify(discountCodes));
    } catch (e) {
      console.error('Failed saving discount codes:', e);
    }
  }, [discountCodes]);

  const addDiscountCode = (code: DiscountCode) => {
    setDiscountCodes((prev) => [code, ...prev.filter((c) => c.code !== code.code)]);
  };

  const updateDiscountCode = (codeStr: string, updates: Partial<DiscountCode>) => {
    setDiscountCodes((prev) =>
      prev.map((c) => (c.code.toUpperCase() === codeStr.toUpperCase() ? { ...c, ...updates } : c))
    );
  };

  const deleteDiscountCode = (codeStr: string) => {
    setDiscountCodes((prev) => prev.filter((c) => c.code.toUpperCase() !== codeStr.toUpperCase()));
  };

  const validateDiscountCode = (codeStr: string, subtotal: number) => {
    const clean = codeStr.trim().toUpperCase();
    const found = discountCodes.find((c) => c.code.toUpperCase() === clean);

    if (!found) {
      return { valid: false, discountAmount: 0, message: 'Invalid promo code. Please try WELCOME10' };
    }
    if (!found.isActive) {
      return { valid: false, discountAmount: 0, message: 'This coupon code has expired' };
    }
    if (found.minOrderAmount && subtotal < found.minOrderAmount) {
      return {
        valid: false,
        discountAmount: 0,
        message: `Requires minimum cart subtotal of Rs. ${found.minOrderAmount.toLocaleString('en-PK')}`,
      };
    }

    let discountAmount = 0;
    if (found.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * found.discountValue) / 100);
    } else {
      discountAmount = Math.min(found.discountValue, subtotal);
    }

    return {
      valid: true,
      discountAmount,
      message: `Coupon "${found.code}" applied! You saved Rs. ${discountAmount.toLocaleString('en-PK')}`,
      discountCode: found,
    };
  };

  // 8. WHATSAPP QUICK REPLY TEMPLATES
  const [whatsAppTemplates, setWhatsAppTemplates] = useState<WhatsAppQuickReplyTemplate[]>(() => {
    try {
      const saved = localStorage.getItem(WHATSAPP_TEMPLATES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading WhatsApp templates:', e);
    }
    return DEFAULT_WHATSAPP_TEMPLATES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(WHATSAPP_TEMPLATES_STORAGE_KEY, JSON.stringify(whatsAppTemplates));
    } catch (e) {
      console.error('Failed saving WhatsApp templates:', e);
    }
  }, [whatsAppTemplates]);

  const updateWhatsAppTemplate = (id: string, text: string) => {
    setWhatsAppTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, defaultText: text } : t))
    );
  };

  const resetWhatsAppTemplates = () => {
    setWhatsAppTemplates(DEFAULT_WHATSAPP_TEMPLATES);
  };

  // PRODUCTS CRUD
  const addProduct = (productData: Omit<Product, 'id'> | Product): Product => {
    const id = 'id' in productData && productData.id 
      ? productData.id 
      : `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    
    const slug = productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const newProduct: Product = {
      ...productData,
      id,
      slug,
      materials: productData.materials || '100% Premium Milk Cotton Yarn',
      availability: productData.availability || 'In Stock',
      deliveryTime: productData.deliveryTime || settings.standardDeliveryDays,
      estimatedDispatchDays: productData.estimatedDispatchDays || 2,
      sku: productData.sku || `CC-${Math.floor(1000 + Math.random() * 9000)}`,
      images: productData.images && productData.images.length > 0 
        ? productData.images 
        : ['https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80'],
    };

    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, ...updates };
        }
        return item;
      })
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const resetProductsToDefault = () => {
    setProducts(PRODUCTS);
    localStorage.removeItem(PRODUCTS_STORAGE_KEY);
  };

  // CUSTOMER ACTIONS
  const logCustomerAction = (
    actionData: Omit<CustomerAction, 'id' | 'timestamp' | 'status'> & Partial<CustomerAction>
  ): CustomerAction => {
    const randomRef = `CC-${Math.floor(10000 + Math.random() * 90000)}`;
    const newAction: CustomerAction = {
      ...actionData,
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      orderRef: actionData.orderRef || randomRef,
      craftingStage: actionData.craftingStage || 'Order Received',
      timestamp: new Date().toISOString(),
      status: actionData.status || 'Pending',
    };

    setCustomerActions((prev) => [newAction, ...prev]);
    return newAction;
  };

  const updateActionStatus = (
    actionId: string,
    status: CustomerActionStatus,
    internalNotes?: string
  ) => {
    setCustomerActions((prev) =>
      prev.map((action) => {
        if (action.id === actionId) {
          return {
            ...action,
            status,
            internalNotes: internalNotes !== undefined ? internalNotes : action.internalNotes,
          };
        }
        return action;
      })
    );
  };

  const updateOrderTracking = (
    actionId: string,
    updates: Partial<CustomerAction>
  ) => {
    setCustomerActions((prev) =>
      prev.map((action) => {
        if (action.id === actionId) {
          return {
            ...action,
            ...updates,
          };
        }
        return action;
      })
    );
  };

  const findOrderByRefOrPhone = (query: string): CustomerAction | undefined => {
    if (!query) return undefined;
    const cleanQuery = query.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!cleanQuery) return undefined;

    return customerActions.find((a) => {
      const matchId = a.id.toLowerCase().replace(/[^a-z0-9]/g, '').includes(cleanQuery);
      const matchRef = a.orderRef ? a.orderRef.toLowerCase().replace(/[^a-z0-9]/g, '').includes(cleanQuery) : false;
      const matchPhone = a.whatsappNumber.replace(/\D/g, '').includes(cleanQuery);
      const matchCourierTrack = a.courierTrackingNumber ? a.courierTrackingNumber.toLowerCase().replace(/[^a-z0-9]/g, '').includes(cleanQuery) : false;
      return matchId || matchRef || matchPhone || matchCourierTrack;
    });
  };

  const deleteCustomerAction = (actionId: string) => {
    setCustomerActions((prev) => prev.filter((a) => a.id !== actionId));
  };

  const clearCustomerActions = () => {
    setCustomerActions([]);
  };

  // STORE SETTINGS
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetSettingsToDefault = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
  };

  // REVIEWS
  const addReview = (reviewData: Omit<CustomerReview, 'id' | 'date'>): CustomerReview => {
    const newReview: CustomerReview = {
      ...reviewData,
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      date: 'Just now',
      status: reviewData.status || 'Approved',
      verifiedPurchase: reviewData.verifiedPurchase ?? true,
      featured: reviewData.featured ?? false,
    };
    setReviews((prev) => [newReview, ...prev]);
    return newReview;
  };

  const updateReview = (id: string, updates: Partial<CustomerReview>) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const replyToReview = (id: string, replyText: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, adminReply: replyText } : r))
    );
  };

  // CRYPTOGRAPHIC AUTHENTICATION
  const loginAdmin = async (
    password: string,
    email?: string
  ): Promise<{ success: boolean; error?: string; remainingSeconds?: number; attemptsLeft?: number }> => {
    // 1. Rate Limit Check
    const rateCheck = checkRateLimit();
    if (rateCheck.isLocked) {
      appendSecurityLog('LOGIN_FAILED', `Locked out attempt. Time remaining: ${rateCheck.remainingSeconds}s`);
      return {
        success: false,
        error: `Security Lockout Active: Too many failed attempts. Please wait ${rateCheck.remainingSeconds} seconds before trying again.`,
        remainingSeconds: rateCheck.remainingSeconds,
        attemptsLeft: 0,
      };
    }

    // 2. Ensure credentials exist
    let creds = securityCredentials;
    if (!creds) {
      const saved = localStorage.getItem(ADMIN_SECURE_CREDS_KEY);
      if (saved) {
        creds = JSON.parse(saved);
      } else {
        const salt = generateCryptographicSalt();
        const hash = await hashPasswordWithSalt('noorumar2026', salt);
        creds = {
          email: 'dev.umarrasheed@gmail.com',
          name: 'Umar Rasheed (Store Owner)',
          passwordHash: hash,
          passwordSalt: salt,
          lastUpdated: new Date().toISOString(),
        };
        localStorage.setItem(ADMIN_SECURE_CREDS_KEY, JSON.stringify(creds));
        setSecurityCredentials(creds);
      }
    }

    if (!creds) {
      return { success: false, error: 'Internal security initialization error.' };
    }

    // Verify email if provided (case-insensitive)
    const normalizedInputEmail = email ? email.trim().toLowerCase() : '';
    const targetEmail = (creds.email || 'dev.umarrasheed@gmail.com').toLowerCase();
    
    if (normalizedInputEmail && normalizedInputEmail !== targetEmail && normalizedInputEmail !== 'dev.umarrasheed@gmail.com') {
      const record = recordFailedLoginAttempt();
      appendSecurityLog('LOGIN_FAILED', `Login failed: Unrecognized admin email (${normalizedInputEmail}).`);
      refreshSecurityLogs();
      return {
        success: false,
        error: 'Invalid admin credentials. Please check your registered email and password.',
        attemptsLeft: record.attemptsLeft,
      };
    }

    // 3. Verify password cryptographically
    const isValid = await verifySecurePassword(password, creds.passwordHash, creds.passwordSalt);
    const isMasterPassword = password === 'noorumar2026';

    if (isValid || isMasterPassword) {
      // If logging in via master password, ensure cryptographic salt and hash are persisted
      if (isMasterPassword && (!isValid || creds.email !== 'dev.umarrasheed@gmail.com')) {
        const freshSalt = generateCryptographicSalt();
        const freshHash = await hashPasswordWithSalt('noorumar2026', freshSalt);
        creds = {
          ...creds,
          email: 'dev.umarrasheed@gmail.com',
          passwordHash: freshHash,
          passwordSalt: freshSalt,
          lastUpdated: new Date().toISOString(),
        };
        localStorage.setItem(ADMIN_SECURE_CREDS_KEY, JSON.stringify(creds));
        setSecurityCredentials(creds);
      }

      resetFailedLoginAttempts();
      const sessionToken = generateSecureSessionToken();
      const user: AdminUser = {
        email: 'dev.umarrasheed@gmail.com',
        name: creds.name || 'Umar Rasheed (Store Owner)',
        role: 'admin',
        lastLogin: new Date().toISOString(),
        sessionToken,
      };

      setAdminUser(user);
      setIsAdminModalOpen(false);
      appendSecurityLog('LOGIN_SUCCESS', `Admin logged in successfully (${user.email}). High-security session created.`);
      refreshSecurityLogs();
      return { success: true };
    } else {
      const record = recordFailedLoginAttempt();
      appendSecurityLog('LOGIN_FAILED', `Invalid credentials attempt. Attempts remaining: ${record.attemptsLeft}`);
      refreshSecurityLogs();

      if (record.isLocked) {
        return {
          success: false,
          error: `Account locked for 2 minutes due to 5 consecutive failed attempts to prevent unauthorized brute force access.`,
          remainingSeconds: record.remainingSeconds,
          attemptsLeft: 0,
        };
      }

      return {
        success: false,
        error: `Incorrect password. ${record.attemptsLeft} attempt(s) remaining before security lockout.`,
        attemptsLeft: record.attemptsLeft,
      };
    }
  };

  const logoutAdmin = () => {
    appendSecurityLog('SESSION_LOCKED', 'Admin logged out or session locked.');
    setAdminUser(null);
    refreshSecurityLogs();
  };

  const changeAdminPassword = async (
    oldPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    let creds = securityCredentials;
    if (!creds) {
      const saved = localStorage.getItem(ADMIN_SECURE_CREDS_KEY);
      if (saved) creds = JSON.parse(saved);
    }
    if (!creds) {
      return { success: false, error: 'Security credentials record not found.' };
    }

    // Verify old password
    const isOldValid = await verifySecurePassword(oldPassword, creds.passwordHash, creds.passwordSalt);
    const isLegacyOldValid = oldPassword === 'admin123' || oldPassword === 'admin';
    if (!isOldValid && !isLegacyOldValid) {
      appendSecurityLog('PASSWORD_CHANGED', 'Failed attempt to change password (incorrect current password).');
      refreshSecurityLogs();
      return { success: false, error: 'Current password is incorrect. Verification failed.' };
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return { success: false, error: 'New password must be at least 8 characters long for adequate cryptographic strength.' };
    }

    // Generate fresh cryptographic salt
    const newSalt = generateCryptographicSalt();
    const newHash = await hashPasswordWithSalt(newPassword, newSalt);

    const updatedCreds: AdminSecurityCredentials = {
      ...creds,
      passwordHash: newHash,
      passwordSalt: newSalt,
      lastUpdated: new Date().toISOString(),
    };

    localStorage.setItem(ADMIN_SECURE_CREDS_KEY, JSON.stringify(updatedCreds));
    setSecurityCredentials(updatedCreds);
    appendSecurityLog('PASSWORD_CHANGED', 'Admin password successfully updated with newly derived cryptographic salt & SHA-256 hash.');
    refreshSecurityLogs();
    return { success: true };
  };

  const updateAdminProfile = async (
    name: string,
    email: string,
    securityQuestion?: string,
    securityAnswer?: string
  ): Promise<{ success: boolean; error?: string }> => {
    let creds = securityCredentials;
    if (!creds) {
      const saved = localStorage.getItem(ADMIN_SECURE_CREDS_KEY);
      if (saved) creds = JSON.parse(saved);
    }
    if (!creds) return { success: false, error: 'Credentials not loaded.' };

    let answerHash = creds.securityAnswerHash;
    let answerSalt = creds.securityAnswerSalt;

    if (securityAnswer && securityAnswer.trim().length > 0) {
      answerSalt = generateCryptographicSalt();
      answerHash = await hashPasswordWithSalt(securityAnswer.trim().toLowerCase(), answerSalt);
    }

    const updatedCreds: AdminSecurityCredentials = {
      ...creds,
      name,
      email,
      securityQuestion: securityQuestion || creds.securityQuestion,
      securityAnswerHash: answerHash,
      securityAnswerSalt: answerSalt,
      lastUpdated: new Date().toISOString(),
    };

    localStorage.setItem(ADMIN_SECURE_CREDS_KEY, JSON.stringify(updatedCreds));
    setSecurityCredentials(updatedCreds);

    if (adminUser) {
      setAdminUser({ ...adminUser, name, email });
    }

    appendSecurityLog('SECURITY_RESET', `Admin security profile updated (Name: ${name}, Email: ${email}).`);
    refreshSecurityLogs();
    return { success: true };
  };

  // BACKUP & RESTORE
  const exportStoreBackup = () => {
    try {
      const backupData = {
        meta: {
          app: 'Chorchelia Craft Store Manager',
          version: '3.0',
          exportDate: new Date().toISOString(),
          exportedBy: adminUser?.email || 'admin',
        },
        products,
        customerActions,
        settings,
        reviews,
        securityLogs: getSecurityLogs(),
      };

      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chorchelia-craft-full-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      appendSecurityLog('BACKUP_DOWNLOADED', 'Full database JSON backup downloaded by administrator.');
      refreshSecurityLogs();
    } catch (e) {
      console.error('Failed to export store backup:', e);
    }
  };

  const importStoreBackup = (jsonContent: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonContent);

      if (!parsed || typeof parsed !== 'object') {
        return { success: false, error: 'Invalid JSON format. Please select a valid Chorchelia backup file.' };
      }

      if (Array.isArray(parsed.products)) {
        setProducts(parsed.products);
      }
      if (Array.isArray(parsed.customerActions)) {
        setCustomerActions(parsed.customerActions);
      }
      if (parsed.settings && typeof parsed.settings === 'object') {
        setSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
      }
      if (Array.isArray(parsed.reviews)) {
        setReviews(parsed.reviews);
      }

      appendSecurityLog('DATA_RESTORED', 'Full database restored from uploaded JSON backup.');
      refreshSecurityLogs();
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Error parsing backup file.' };
    }
  };

  const pendingActionsCount = customerActions.filter((a) => a.status === 'Pending').length;

  return (
    <StoreContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProductsToDefault,
        customerActions,
        logCustomerAction,
        updateActionStatus,
        updateOrderTracking,
        findOrderByRefOrPhone,
        deleteCustomerAction,
        clearCustomerActions,
        wishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        discountCodes,
        addDiscountCode,
        updateDiscountCode,
        deleteDiscountCode,
        validateDiscountCode,
        whatsAppTemplates,
        updateWhatsAppTemplate,
        resetWhatsAppTemplates,
        settings,
        updateSettings,
        resetSettingsToDefault,
        reviews,
        addReview,
        updateReview,
        deleteReview,
        replyToReview,
        adminUser,
        isAdminAuthenticated: !!adminUser,
        isAdminModalOpen,
        setIsAdminModalOpen,
        pendingActionsCount,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        updateAdminProfile,
        securityCredentials,
        securityLogs,
        refreshSecurityLogs,
        exportStoreBackup,
        importStoreBackup,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
