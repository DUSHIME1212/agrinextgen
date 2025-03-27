
import {
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    CART_UPDATE_QUANTITY,
    CART_CLEAR,
    CartState
  } from '../types';
  
  const initialState: CartState = {
    items: [],
    total: 0
  };
  
  // Helper function to calculate cart total
  const calculateTotal = (items: aRW[]) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  const cartReducer = (state = initialState, action: aRW): CartState => {
    switch (action.type) {
      case CART_ADD_ITEM: {
        // Check if item already exists in cart
        const existingItemIndex = state.items.findIndex(
          item => item.id === action.payload.id
        );
        
        let updatedItems;
        
        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          updatedItems = state.items.map((item, index) => 
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          );
        } else {
          // Add new item to cart
          updatedItems = [...state.items, action.payload];
        }
        
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems)
        };
      }
      
      case CART_REMOVE_ITEM: {
        const updatedItems = state.items.filter(
          item => item.id !== action.payload
        );
        
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems)
        };
      }
      
      case CART_UPDATE_QUANTITY: {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        );
        
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems)
        };
      }
      
      case CART_CLEAR:
        return {
          ...state,
          items: [],
          total: 0
        };
      
      default:
        return state;
    }
  };
  
  export default cartReducer;