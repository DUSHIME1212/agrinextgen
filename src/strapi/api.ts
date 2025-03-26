import { ProductsResponse } from './types';

export const fetchProducts = async (): Promise<ProductsResponse> => {
  const response = await fetch('http://localhost:1337/api/products?populate=*');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  const data: ProductsResponse = await response.json();
  return data;
};

export const fetchProduct = async (productSlug:any): Promise<ProductsResponse> => {
  const response = await fetch(`http://localhost:1337/api/products?filters[slug][$eq]=${productSlug}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  const data: ProductsResponse = await response.json();
  return data;
};