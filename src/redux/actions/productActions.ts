import { Dispatch } from 'redux';
import { productAPI } from '../api';
import {
  PRODUCTS_LOADING,
  PRODUCTS_LOAD_SUCCESS,
  PRODUCTS_LOAD_FAIL,
  Product
} from '../types';

// Get all products
export const getProducts = (category?: string) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: PRODUCTS_LOADING });
    
    const products = await productAPI.getProducts(category);
    
    dispatch({
      type: PRODUCTS_LOAD_SUCCESS,
      payload: products
    });
    
    return products;
  } catch (error: any) {
    dispatch({
      type: PRODUCTS_LOAD_FAIL,
      payload: error.response?.data?.message || 'Failed to load products'
    });
    
    throw error;
  }
};

// Get product by ID
export const getProductById = (productId: string) => async () => {
  try {
    const product = await productAPI.getProductById(productId);
    return product;
  } catch (error) {
    throw error;
  }
};

// Create new product
export const createProduct = (productData: Omit<Product, 'id'>) => async () => {
  try {
    const newProduct = await productAPI.createProduct(productData);
    return newProduct;
  } catch (error) {
    throw error;
  }
};

// Update product
export const updateProduct = (productId: string, productData: Partial<Product>) => async () => {
  try {
    const updatedProduct = await productAPI.updateProduct(productId, productData);
    return updatedProduct;
  } catch (error) {
    throw error;
  }
};

// Delete product
export const deleteProduct = (productId: string) => async () => {
  try {
    await productAPI.deleteProduct(productId);
    return { success: true };
  } catch (error) {
    throw error;
  }
};
