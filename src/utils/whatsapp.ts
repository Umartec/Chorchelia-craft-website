import { SITE_CONFIG } from '../config/site';
import { CartItem, CustomerOrderDetails, Product } from '../types';

/**
 * Formats PKR currency with standard comma separators
 */
export function formatPKR(amount: number): string {
  return `${SITE_CONFIG.CURRENCY} ${amount.toLocaleString('en-PK')}`;
}

export interface OrderWhatsAppOptions {
  orderRefId?: string;
  orderRef?: string;
  giftOccasion?: string;
  giftNote?: string;
  discountCode?: string;
  discountAmount?: number;
  shippingFee?: number;
  finalTotal?: number;
  trackingUrl?: string;
}

/**
 * Generates the pre-filled WhatsApp click-to-chat URL for an order
 */
export function generateOrderWhatsAppUrl(
  items: CartItem[],
  customer: CustomerOrderDetails,
  subtotal: number,
  options?: OrderWhatsAppOptions
): string {
  const lines: string[] = [];

  const refNumber = options?.orderRef || options?.orderRefId || `CC-${Math.floor(10000 + Math.random() * 90000)}`;

  lines.push(`Hello ${SITE_CONFIG.BUSINESS_NAME}! 🌸`);
  lines.push(`I would like to place an order *#${refNumber}*.`);
  lines.push('');
  lines.push('📦 *Order Details:*');

  items.forEach((item, index) => {
    const itemSubtotal = item.product.price * item.quantity;
    lines.push(`${index + 1}. *${item.product.name}*`);
    if (item.selectedColor) {
      lines.push(`   Color: ${item.selectedColor}`);
    }
    if (item.selectedSize) {
      lines.push(`   Size: ${item.selectedSize}`);
    }
    lines.push(`   Quantity: ${item.quantity}`);
    lines.push(`   Price: ${formatPKR(item.product.price)} each`);
    lines.push(`   Subtotal: ${formatPKR(itemSubtotal)}`);
    lines.push('');
  });

  lines.push(`Subtotal: ${formatPKR(subtotal)}`);

  if (options?.discountAmount && options.discountAmount > 0) {
    lines.push(`Discount Voucher (${options.discountCode || 'Applied'}): -${formatPKR(options.discountAmount)}`);
  }

  if (options?.shippingFee !== undefined) {
    if (options.shippingFee === 0) {
      lines.push('Nationwide Courier Delivery: FREE (Threshold Met)');
    } else {
      lines.push(`Nationwide Courier Delivery: ${formatPKR(options.shippingFee)} (Estimated)`);
    }
  } else {
    lines.push('Delivery: To be confirmed for my city');
  }

  const grandTotal = options?.finalTotal !== undefined ? options.finalTotal : subtotal;
  lines.push(`*Estimated Total Payable:* ${formatPKR(grandTotal)}`);
  lines.push('');

  // Gift Card Note
  if (options?.giftOccasion && options.giftOccasion !== 'None (Regular Order)') {
    lines.push(`🎁 *Gift Occasion:* ${options.giftOccasion}`);
  }
  if (options?.giftNote && options.giftNote.trim()) {
    lines.push(`✍️ *Handwritten Gift Note (Tuck in Parcel):* "${options.giftNote.trim()}"`);
    lines.push('');
  }

  lines.push('📍 *Customer Delivery Details (Pakistan):*');
  lines.push(`Name: ${customer.fullName}`);
  lines.push(`WhatsApp: ${customer.whatsappNumber}`);
  lines.push(`City: ${customer.city}`);
  lines.push(`Address: ${customer.deliveryAddress}`);
  if (customer.notes && customer.notes.trim()) {
    lines.push(`Special Notes: ${customer.notes.trim()}`);
  }

  if (options?.trackingUrl) {
    lines.push('');
    lines.push(`🔗 Tracking Link: ${options.trackingUrl}`);
  }

  lines.push('');
  lines.push('Please confirm availability, dispatch timeframe, and payment details. Thank you!');

  const fullText = lines.join('\n');
  const encodedText = encodeURIComponent(fullText);

  // Clean phone number (digits only)
  const cleanPhone = SITE_CONFIG.WHATSAPP_NUMBER.replace(/\D/g, '');

  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Generates an outbound WhatsApp link for Admin to text a customer directly with pre-filled message
 */
export function generateCustomerReplyWhatsAppUrl(
  customerPhone: string,
  message: string
): string {
  const digits = customerPhone.replace(/\D/g, '');
  const cleanPhone = digits.startsWith('92') 
    ? digits 
    : digits.startsWith('0') 
      ? `92${digits.slice(1)}` 
      : `92${digits}`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates a pre-filled WhatsApp inquiry URL for a specific product
 */
export function generateProductWhatsAppUrl(
  product: Product,
  selectedColor?: string,
  selectedSize?: string
): string {
  const lines: string[] = [
    `Hello ${SITE_CONFIG.BUSINESS_NAME}! I am interested in ordering:`,
    `*${product.name}*`,
    `Price: ${formatPKR(product.price)}`,
  ];
  if (selectedColor) lines.push(`Color: ${selectedColor}`);
  if (selectedSize) lines.push(`Size: ${selectedSize}`);
  lines.push('');
  lines.push('Could you please let me know availability and estimated delivery timeline for my city?');

  const cleanPhone = SITE_CONFIG.WHATSAPP_NUMBER.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(lines.join('\n'))}`;
}

/**
 * Generates a WhatsApp URL for custom design requests
 */
export function generateCustomOrderWhatsAppUrl(details?: string): string {
  const text = details 
    ? `Hello ${SITE_CONFIG.BUSINESS_NAME}! I am interested in a custom crochet piece: ${details}. Could you please guide me through the custom design options and quote?`
    : `Hello ${SITE_CONFIG.BUSINESS_NAME}! I would like to request a custom crochet order. I have a specific design / color idea in mind. Please guide me through the possibilities and turnaround time!`;
    
  const cleanPhone = SITE_CONFIG.WHATSAPP_NUMBER.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Generates a general support / question WhatsApp link
 */
export function generateGeneralInquiryWhatsAppUrl(topic?: string): string {
  const text = topic 
    ? `Hello ${SITE_CONFIG.BUSINESS_NAME}! I have a question about ${topic}.`
    : `Hello ${SITE_CONFIG.BUSINESS_NAME}! I'm visiting your website and have an inquiry.`;

  const cleanPhone = SITE_CONFIG.WHATSAPP_NUMBER.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
