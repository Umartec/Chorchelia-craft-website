import { CityShippingRate } from '../types';

export const PAKISTAN_CITIES: CityShippingRate[] = [
  {
    cityName: 'Rahim Yar Khan',
    province: 'Punjab (Artisan Studio)',
    standardDays: '1-2 Days (Local Delivery)',
    shippingFee: 150,
    courierPartner: 'Direct Studio Rider / TCS',
    freeShippingThreshold: 3000,
  },
  {
    cityName: 'Lahore',
    province: 'Punjab',
    standardDays: '2-3 Business Days',
    shippingFee: 250,
    courierPartner: 'TCS / Leopards',
    freeShippingThreshold: 4500,
  },
  {
    cityName: 'Karachi',
    province: 'Sindh',
    standardDays: '2-4 Business Days',
    shippingFee: 280,
    courierPartner: 'Trax / Leopards / TCS',
    freeShippingThreshold: 4500,
  },
  {
    cityName: 'Islamabad',
    province: 'Federal Capital',
    standardDays: '2-3 Business Days',
    shippingFee: 250,
    courierPartner: 'TCS / Leopards',
    freeShippingThreshold: 4500,
  },
  {
    cityName: 'Rawalpindi',
    province: 'Punjab',
    standardDays: '2-3 Business Days',
    shippingFee: 250,
    courierPartner: 'TCS / Leopards',
    freeShippingThreshold: 4500,
  },
  {
    cityName: 'Faisalabad',
    province: 'Punjab',
    standardDays: '2-3 Business Days',
    shippingFee: 250,
    courierPartner: 'Leopards / TCS',
    freeShippingThreshold: 4500,
  },
  {
    cityName: 'Multan',
    province: 'Punjab',
    standardDays: '1-2 Business Days',
    shippingFee: 220,
    courierPartner: 'TCS / Leopards',
    freeShippingThreshold: 4000,
  },
  {
    cityName: 'Bahawalpur',
    province: 'Punjab',
    standardDays: '1-2 Business Days',
    shippingFee: 200,
    courierPartner: 'TCS / Leopards',
    freeShippingThreshold: 4000,
  },
  {
    cityName: 'Gujranwala',
    province: 'Punjab',
    standardDays: '2-3 Business Days',
    shippingFee: 250,
    courierPartner: 'TCS / Trax',
    freeShippingThreshold: 4500,
  },
  {
    cityName: 'Sialkot',
    province: 'Punjab',
    standardDays: '2-3 Business Days',
    shippingFee: 260,
    courierPartner: 'TCS / Leopards',
    freeShippingThreshold: 4500,
  },
  {
    cityName: 'Peshawar',
    province: 'Khyber Pakhtunkhwa',
    standardDays: '3-4 Business Days',
    shippingFee: 290,
    courierPartner: 'TCS / Trax',
    freeShippingThreshold: 4500,
  },
  {
    cityName: 'Quetta',
    province: 'Balochistan',
    standardDays: '3-5 Business Days',
    shippingFee: 350,
    courierPartner: 'TCS / Leopards Air',
    freeShippingThreshold: 5000,
  },
  {
    cityName: 'Hyderabad',
    province: 'Sindh',
    standardDays: '2-4 Business Days',
    shippingFee: 280,
    courierPartner: 'Trax / Leopards',
    freeShippingThreshold: 4500,
  },
  {
    cityName: 'Sukkur',
    province: 'Sindh',
    standardDays: '2-3 Business Days',
    shippingFee: 240,
    courierPartner: 'TCS / Leopards',
    freeShippingThreshold: 4500,
  },
  {
    cityName: 'Sargodha',
    province: 'Punjab',
    standardDays: '2-3 Business Days',
    shippingFee: 250,
    courierPartner: 'TCS / Leopards',
    freeShippingThreshold: 4500,
  },
  {
    cityName: 'Sahiwal',
    province: 'Punjab',
    standardDays: '2-3 Business Days',
    shippingFee: 240,
    courierPartner: 'TCS / Leopards',
    freeShippingThreshold: 4500,
  },
  {
    cityName: 'Abbottabad',
    province: 'Khyber Pakhtunkhwa',
    standardDays: '3-5 Business Days',
    shippingFee: 320,
    courierPartner: 'TCS / Leopards',
    freeShippingThreshold: 5000,
  },
  {
    cityName: 'Other Cities (Nationwide)',
    province: 'Pakistan All Districts',
    standardDays: '3-5 Business Days',
    shippingFee: 280,
    courierPartner: 'TCS / Leopards / Trax',
    freeShippingThreshold: 4500,
  },
].map((item) => ({
  ...item,
  city: item.cityName,
  transitDays: item.standardDays,
  estimatedRate: item.shippingFee,
}));

export function getCityShippingRate(cityName: string, orderSubtotal: number = 0): CityShippingRate {
  if (!cityName) {
    const defaultRate = PAKISTAN_CITIES[PAKISTAN_CITIES.length - 1];
    return {
      ...defaultRate,
      city: defaultRate.cityName,
      transitDays: defaultRate.standardDays,
      estimatedRate: defaultRate.shippingFee,
    };
  }

  const clean = cityName.trim().toLowerCase();
  const matched = PAKISTAN_CITIES.find(
    (c) => c.cityName.toLowerCase() === clean || clean.includes(c.cityName.toLowerCase())
  );

  const rate = matched || PAKISTAN_CITIES[PAKISTAN_CITIES.length - 1];

  // If subtotal qualifies for free shipping
  const isFree = Boolean(rate.freeShippingThreshold && orderSubtotal >= rate.freeShippingThreshold);
  const finalFee = isFree ? 0 : rate.shippingFee;

  return {
    ...rate,
    shippingFee: finalFee,
    city: rate.cityName,
    transitDays: rate.standardDays,
    estimatedRate: finalFee,
  };
}
