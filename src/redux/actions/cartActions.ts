
import { Dispatch } from 'redux';
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_UPDATE_QUANTITY,
  CART_CLEAR,
  CartItem
} from '../types';

// Add item to cart
export const addToCart = (item: CartItem) => (dispatch: Dispatch) => {
  dispatch({
    type: CART_ADD_ITEM,
    payload: item
  });
};

// Remove item from cart
export const removeFromCart = (itemId: string) => (dispatch: Dispatch) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: itemId
  });
};

// Update item quantity
export const updateCartItemQuantity = (itemId: string, quantity: number) => (dispatch: Dispatch) => {
  dispatch({
    type: CART_UPDATE_QUANTITY,
    payload: { id: itemId, quantity }
  });
};

// Clear cart
export const clearCart = () => (dispatch: Dispatch) => {
  dispatch({ type: CART_CLEAR });
};