import { WhatsAppQuickReplyTemplate } from '../types';
import { SITE_CONFIG } from '../config/site';

export const DEFAULT_WHATSAPP_TEMPLATES: WhatsAppQuickReplyTemplate[] = [
  {
    id: 'tmpl-order-confirmed',
    title: '1. Order Confirmed & Live Tracking Link',
    category: 'confirmation',
    defaultText: 
`Assalam-o-Alaikum {customerName}! 🌸
Thank you for ordering with ${SITE_CONFIG.BUSINESS_NAME}.

Your order *#{orderRef}* has been confirmed!
*Crafting Queue:* Your handmade pieces are being scheduled with our artisan in Rahim Yar Khan.
*Items:* {itemsSummary}
*City:* {city}
*Total Payable (COD):* {totalAmount}

📍 *Live Order Tracking:*
You can track your order stage anytime on our website:
{trackingUrl}

We will notify you with courier tracking as soon as it is dispatched! 🧶✨`,
  },
  {
    id: 'tmpl-crafting-started',
    title: '2. Artisan Crafting in Progress',
    category: 'crafting',
    defaultText:
`Assalam-o-Alaikum {customerName}! 🧶
Exciting update regarding order *#{orderRef}*:

Our artisan has picked up the crochet hook and started handcrafting your pieces using milk-cotton yarn!
Every petal, leaf, and stitch is made with love and patience.

Check live status: {trackingUrl}
Expected completion: 1-2 days before parcel wrapping.`,
  },
  {
    id: 'tmpl-quality-gift-wrap',
    title: '3. Quality Check & Handwritten Gift Card Ready',
    category: 'crafting',
    defaultText:
`Hello {customerName}! 🎁
Your handmade crochet order *#{orderRef}* is finished!

We have completed the quality check and wrapped it in our signature presentation paper with ribbon{giftCardNote}.

Your parcel will be handed over to the courier today.
Track live: {trackingUrl}`,
  },
  {
    id: 'tmpl-parcel-dispatched',
    title: '4. Dispatched via Courier with Tracking Number',
    category: 'dispatch',
    defaultText:
`Assalam-o-Alaikum {customerName}! 🚚📦
Great news! Your ${SITE_CONFIG.BUSINESS_NAME} order *#{orderRef}* has been DISPATCHED!

*Courier Partner:* {courierPartner}
*Courier Tracking Number:* {courierTracking}
*Destination City:* {city}
*Cash on Delivery (COD) Amount:* {totalAmount}
*Estimated Delivery:* {deliveryDays}

Track on our website:
{trackingUrl}

Please keep the exact amount ready upon delivery. Thank you for supporting Pakistani artisans! 🇵🇰`,
  },
  {
    id: 'tmpl-delivered-review',
    title: '5. Delivered & Review Request',
    category: 'delivery',
    defaultText:
`Assalam-o-Alaikum {customerName}! 🌸
According to our courier records, your handmade parcel *#{orderRef}* has arrived!

We hope your crochet pieces bring warmth and smiles to your space.

If you loved our craft, please take 30 seconds to leave us a quick review on our website:
{reviewUrl}

Tag us on Instagram: ${SITE_CONFIG.SOCIAL_LINKS.INSTAGRAM_URL}
Have a blessed day! 💕`,
  },
  {
    id: 'tmpl-advance-token',
    title: '6. Custom Order Advance Token Request',
    category: 'custom',
    defaultText:
`Assalam-o-Alaikum {customerName}! 🌷
Regarding your custom crochet inquiry *#{orderRef}*:

To schedule custom flower crafting and reserve artisan yarn stock, we require a small advance token of Rs. {advanceAmount} via JazzCash, EasyPaisa, or Bank Alfalah:

*JazzCash / EasyPaisa:* 0327 7045677 (Umar Rasheed)
*Account Title:* Chorchelia Craft

Remaining balance can be paid on Cash on Delivery (COD). Please share a screenshot of the payment slip once transferred!`,
  },
];
