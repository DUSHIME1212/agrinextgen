/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validate phone number format
   */
  export const isValidPhone = (phone: string): boolean => {
    // This is a simple validation, can be adjusted based on region
    const phoneRegex = /^\+?[0-9]{10,14}$/;
    return phoneRegex.test(phone);
  };
  
  /**
   * Validate if a string has minimum length
   */
  export const hasMinLength = (value: string, minLength: number): boolean => {
    return value.length >= minLength;
  };
  
  /**
   * Validate if a string has maximum length
   */
  export const hasMaxLength = (value: string, maxLength: number): boolean => {
    return value.length <= maxLength;
  };
  