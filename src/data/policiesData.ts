/**
 * Chorchelia Craft - Official Brand Policies
 * Complete 18-Section Policy Data for Handmade Crochet Creations
 */

export interface PolicySection {
  id: string;
  number: number;
  title: string;
  summary: string;
  content: string[];
  keyPoints?: string[];
}

export const POLICIES_DATA: PolicySection[] = [
  {
    id: 'order-policy',
    number: 1,
    title: 'Order Policy',
    summary: 'Handmade orders confirmed and finalized through WhatsApp communication.',
    content: [
      'All Chorchelia Craft products are handmade and prepared with care. Customers are requested to review the product name, images, description, price, color, size and other available details before placing an order.',
      'Orders are considered confirmed once the order details have been reviewed and confirmed through WhatsApp.',
      'For orders placed through the website, the final order confirmation will be completed through WhatsApp.',
    ],
    keyPoints: [
      'Handmade with patience and care',
      'Review details (color, size, price) before ordering',
      'Final confirmation via WhatsApp',
    ],
  },
  {
    id: 'payment-policy',
    number: 2,
    title: 'Payment Policy',
    summary: 'Payment methods verified via WhatsApp prior to dispatch.',
    content: [
      'Payment details and available payment methods will be confirmed with the customer through WhatsApp before the order is processed.',
      'For Cash on Delivery orders, the customer may be required to confirm their order and delivery details before dispatch.',
      'Do not show any payment method on the website unless it is currently available.',
    ],
    keyPoints: [
      'Payment methods confirmed on WhatsApp before dispatch',
      'Cash on Delivery (COD) requires phone/WhatsApp confirmation before dispatch',
      'Zero unverified hidden payment methods',
    ],
  },
  {
    id: 'return-refund-policy',
    number: 3,
    title: 'Return & Refund Policy',
    summary: 'Non-refundable for change of mind; damaged or incorrect items verified & resolved.',
    content: [
      'Because our products are handmade and prepared specifically for customers, confirmed orders are generally non-refundable and cannot be returned simply because the customer has changed their mind.',
      'Please make sure you carefully review the product details before confirming your order.',
      'However, if you receive: a damaged product, the wrong product, a significantly different product from what was ordered, or a product with a clear manufacturing issue, please contact Chorchelia Craft through WhatsApp as soon as possible after receiving the order.',
      'We may request clear photos or videos of the product and packaging to verify the issue.',
      'If the issue is verified, we may offer an appropriate solution such as: replacement of the product, exchange for another available product, or refund where applicable. The final resolution will depend on the nature of the issue.',
    ],
    keyPoints: [
      'No change-of-mind returns for handmade items',
      'Damaged or incorrect products covered with evidence (photos/videos)',
      'Solutions include replacement, exchange, or refund',
    ],
  },
  {
    id: 'exchange-policy',
    number: 4,
    title: 'Exchange Policy',
    summary: 'Exchanges subject to stock availability, condition, and applicable shipping costs.',
    content: [
      'If you would like to exchange a product for another product, please contact us through WhatsApp.',
      'Exchanges are subject to: product availability, product condition, applicable price difference, and delivery/shipping costs.',
      'The original product must be unused and in its original condition where an exchange is approved.',
      'Customized or personalized products may not be eligible for exchange unless they arrive damaged, defective or incorrect.',
    ],
    keyPoints: [
      'Contact WhatsApp for exchange requests',
      'Product must be unused in original condition',
      'Customer covers courier differences unless item was defective',
    ],
  },
  {
    id: 'cancellation-policy',
    number: 5,
    title: 'Cancellation Policy',
    summary: 'Notify us immediately; orders already prepared or dispatched cannot be cancelled.',
    content: [
      'Customers should contact us as soon as possible if they want to cancel an order.',
      'Once an order has been prepared, dispatched or customized, cancellation may no longer be possible.',
      'For Cash on Delivery orders, repeated cancellations or refusal to accept confirmed orders may affect the customer\'s ability to place future orders.',
    ],
    keyPoints: [
      'Cancel before crafting or dispatch commences',
      'In-progress custom orders cannot be cancelled',
      'Refusal of COD orders impacts future ordering eligibility',
    ],
  },
  {
    id: 'custom-orders',
    number: 6,
    title: 'Custom & Personalized Orders',
    summary: 'Custom colors, sizes, and designs created to your specific requirements.',
    content: [
      'Custom crochet products may be created according to the customer\'s requested: color, size, design, quantity, personalization, or other agreed requirements.',
      'Custom orders may require additional preparation time (typically 3–7 business days).',
      'Because customized products are created specifically for the customer, they are generally not eligible for return or exchange due to a change of mind.',
      'If a custom product arrives damaged or there is an error on our part, please contact us so we can review the issue.',
    ],
    keyPoints: [
      'Tailored to your color, size, and design preferences',
      'Additional craft lead time required',
      'Strictly non-refundable for change of mind once handcrafted',
    ],
  },
  {
    id: 'product-appearance',
    number: 7,
    title: 'Product Appearance',
    summary: 'Handmade charm: small natural variations in stitches, texture, and photography lighting.',
    content: [
      'Every Chorchelia Craft product is handmade.',
      'Because of the handmade nature of our products, there may be small differences in: color, shape, size, stitching, texture, and finishing.',
      'These minor variations are part of handmade craftsmanship and should not automatically be considered defects.',
      'Product colors may also appear slightly different depending on lighting, photography and the customer\'s screen.',
    ],
    keyPoints: [
      '100% individual handcrafted uniqueness',
      'Minor yarn dye lot and stitch variations are natural',
      'Screen calibration and natural lighting may slightly shift color tones',
    ],
  },
  {
    id: 'delivery-policy',
    number: 8,
    title: 'Delivery Policy',
    summary: 'Nationwide delivery across Pakistan via reputable courier services.',
    content: [
      'We offer delivery across Pakistan where available.',
      'Delivery charges and estimated delivery time may vary depending on: customer\'s city, delivery location, order size, courier service, and product availability.',
      'Delivery details and charges will be confirmed through WhatsApp before the order is finalized.',
      'Once an order has been handed over to the courier, delivery time may depend on the courier service and destination.',
    ],
    keyPoints: [
      'Delivery to all major cities and towns in Pakistan',
      'Charges confirmed prior to order finalization',
      'Shipped via TCS, Leopards, Trax, or M&P',
    ],
  },
  {
    id: 'delivery-address',
    number: 9,
    title: 'Delivery Address',
    summary: 'Customer is responsible for complete, accurate delivery address and contact info.',
    content: [
      'Customers are responsible for providing a complete and accurate delivery address and contact number.',
      'Chorchelia Craft is not responsible for delays caused by: incorrect address, incomplete address, incorrect phone number, customer being unavailable, or failure to respond to courier calls.',
      'Additional delivery charges may apply if an order needs to be re-dispatched because of incorrect information or an unsuccessful delivery attempt.',
    ],
    keyPoints: [
      'Provide house/street number, sector/area, and landmark',
      'Keep your phone active for courier delivery calls',
      'Re-dispatch fees apply for invalid addresses',
    ],
  },
  {
    id: 'damaged-package',
    number: 10,
    title: 'Damaged Package / Product',
    summary: 'Take clear photos and unboxing videos immediately upon parcel receipt.',
    content: [
      'If your package appears damaged when received, please take clear photos or videos of the package and product and contact us through WhatsApp as soon as possible.',
      'Do not throw away the packaging until the issue has been reviewed.',
      'This helps us investigate the issue with the courier service and coordinate an appropriate solution.',
    ],
    keyPoints: [
      'Document damaged outer packaging and inner items immediately',
      'Retain original box, flyer, and tags',
      'Send evidence to WhatsApp 0327 7045677',
    ],
  },
  {
    id: 'product-availability',
    number: 11,
    title: 'Product Availability',
    summary: 'Limited handmade batch quantities; adding to cart does not hold stock.',
    content: [
      'Our products are handmade and may be available in limited quantities.',
      'Adding a product to the cart does not necessarily guarantee that the product will remain available until the order is confirmed.',
      'Product availability will be confirmed before the order is finalized on WhatsApp.',
    ],
    keyPoints: [
      'Limited artisan quantities prepared weekly',
      'Cart does not reserve stock until WhatsApp confirmation',
      'Made-to-order options available if ready-stock sells out',
    ],
  },
  {
    id: 'pricing-policy',
    number: 12,
    title: 'Pricing Policy',
    summary: 'All prices in Pakistani Rupees (PKR); delivery charges calculated separately.',
    content: [
      'All prices displayed on the website are shown in Pakistani Rupees (PKR).',
      'Prices may change without prior notice based on raw material costs and seasonal collections.',
      'The price applicable to a confirmed order will be communicated during the order confirmation process.',
      'Delivery charges may be separate from the displayed product price.',
    ],
    keyPoints: [
      'All prices displayed in PKR (Pakistani Rupees)',
      'Courier fees added based on destination city',
      'Transparent quote confirmed before dispatch',
    ],
  },
  {
    id: 'website-product-info',
    number: 13,
    title: 'Website Product Information',
    summary: 'Accurate descriptions, dimensions, and materials with handmade artisanal honesty.',
    content: [
      'We make reasonable efforts to display accurate product descriptions, images, prices and availability.',
      'However, handmade products may have minor variations from product photographs.',
      'If you have any questions about a product before ordering, please contact us through WhatsApp.',
    ],
    keyPoints: [
      'Realistic photography and detailed descriptions',
      'Direct WhatsApp inquiry available for any product questions',
      'Materials and yarn specifications listed on product pages',
    ],
  },
  {
    id: 'privacy-policy',
    number: 14,
    title: 'Privacy Policy',
    summary: 'Your personal data is strictly protected and never sold to third parties.',
    content: [
      'We may collect information such as: name, phone/WhatsApp number, email address, delivery address, order details, and messages submitted through our forms.',
      'This information is used to: respond to customer inquiries, process and confirm orders, arrange delivery, provide customer support, and improve our products and services.',
      'We do not sell customer information to third parties.',
      'Customer information may be shared with relevant delivery or service providers when necessary to fulfill an order.',
    ],
    keyPoints: [
      'Customer information is never sold or rented',
      'Shared exclusively with courier partners for order delivery',
      'Strict confidentiality of personal numbers and home addresses',
    ],
  },
  {
    id: 'whatsapp-communication',
    number: 15,
    title: 'WhatsApp Communication',
    summary: 'Official WhatsApp account used for seamless order processing & proof sharing.',
    content: [
      'When you choose to contact us through WhatsApp, your order or inquiry details may be shared with our business WhatsApp account for communication and order processing.',
      'Customers should avoid sending unnecessary sensitive or confidential information through WhatsApp or website forms.',
    ],
    keyPoints: [
      'Official WhatsApp: 0327 7045677 (+92 327 7045677)',
      'Used for real-time item photos, tracking slips, and parcel updates',
      'Never send unnecessary financial passwords or unrelated sensitive data',
    ],
  },
  {
    id: 'reviews-customer-content',
    number: 16,
    title: 'Reviews & Customer Content',
    summary: 'Authentic feedback and photo shares from genuine Pakistani customers.',
    content: [
      'Customers may be invited to submit reviews, photographs or feedback about their experience with Chorchelia Craft.',
      'By submitting content for publication, the customer confirms that the content is their own or that they have permission to share it.',
      'Chorchelia Craft may display approved reviews or customer-submitted content on its website or social media channels.',
    ],
    keyPoints: [
      'Customers can submit ratings and testimonials after ordering',
      'Approved reviews displayed on our wall of love',
      'Artisan replies and thank-you notes posted officially',
    ],
  },
  {
    id: 'contact-support',
    number: 17,
    title: 'Contact & Support',
    summary: 'Reach our artisan studio directly via WhatsApp or our official contact form.',
    content: [
      'For questions regarding an order, product, delivery, exchange or other issue, customers can contact Chorchelia Craft through our official WhatsApp or contact form.',
      'Please include your order details where applicable so we can assist you more quickly.',
    ],
    keyPoints: [
      'Direct WhatsApp: 0327 7045677',
      'Email Support: chorcheliacraft@gmail.com',
      'Studio Location: Rahim Yar Khan, Punjab, Pakistan',
    ],
  },
  {
    id: 'policy-updates',
    number: 18,
    title: 'Policy Updates',
    summary: 'Policies updated periodically as our handmade catalog grows.',
    content: [
      'Chorchelia Craft may update these policies from time to time as the business, products and services develop.',
      'The latest version published on this website will apply to future orders.',
    ],
    keyPoints: [
      'Regular updates posted on website',
      'Current version applies to all active orders',
    ],
  },
];

export const IMPORTANT_CUSTOMER_NOTICE = {
  title: 'Important Customer Notice',
  heading: 'Please review your product details, quantity, price and delivery information before confirming your order.',
  body: 'Once an order has been confirmed, it may not be possible to cancel, return or refund it unless it falls under an eligible issue described in our Return & Refund Policy.',
};
