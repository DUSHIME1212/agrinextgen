
/**
 * Filter array by search term across multiple properties
 */
export const filterBySearchTerm = <T extends Record<string, aRW>>(
    items: T[],
    searchTerm: string,
    properties: string[]
  ): T[] => {
    if (!searchTerm.trim()) return items;
    
    const lowercasedTerm = searchTerm.toLowerCase();
    
    return items.filter(item => {
      return properties.some(prop => {
        const value = item[prop];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowercasedTerm);
        }
        return false;
      });
    });
  };
  
  /**
   * Group array by property
   */
  export const groupBy = <T extends Record<string, aRW>>(
    items: T[],
    key: string
  ): Record<string, T[]> => {
    return items.reduce((result, item) => {
      const groupKey = item[key]?.toString() || 'undefined';
      
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      
      result[groupKey].push(item);
      return result;
    }, {} as Record<string, T[]>);
  };
  
  /**
   * Sort array by property
   */
  export const sortBy = <T extends Record<string, aRW>>(
    items: T[],
    key: string,
    direction: 'asc' | 'desc' = 'asc'
  ): T[] => {
    return [...items].sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return direction === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return direction === 'asc' ? valueA - valueB : valueB - valueA;
      }
      
      return 0;
    });
  };