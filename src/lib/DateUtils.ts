
import { format, parseISO } from 'date-fns';

/**
 * Format a date string to a human-readable format
 */
export const formatDate = (dateString: string, formatStr: string = 'MMMM dd, yyyy'): string => {
  try {
    const date = parseISO(dateString);
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format a date with time
 */
export const formatDateTime = (dateString: string): string => {
  return formatDate(dateString, 'MMMM dd, yyyy hh:mm a');
};

/**
 * Get relative time (e.g., "2 days ago")
 */
export const getRelativeTime = (dateString: string): string => {
  
  
  return formatDate(dateString);
};
