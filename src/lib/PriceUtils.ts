
/**
 * Format price to currency string
 */
export const formatPrice = (
    price: number, 
    currency: string = 'USD', 
    locale: string = 'en-US'
  ): string => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(price);
  };
  
  /**
   * Calculate discount price
   */
  export const calculateDiscountPrice = (price: number, discountPercentage: number): number => {
    return price - (price * discountPercentage) / 100;
  };
  
  /**
   * Format discount price with original price
   */
  export const formatDiscountPrice = (
    price: number, 
    discountPercentage: number, 
    currency: string = 'USD',
    locale: string = 'en-US'
  ): { original: string; discounted: string } => {
    const discountedPrice = calculateDiscountPrice(price, discountPercentage);
    
    return {
      original: formatPrice(price, currency, locale),
      discounted: formatPrice(discountedPrice, currency, locale),
    };
  };
  