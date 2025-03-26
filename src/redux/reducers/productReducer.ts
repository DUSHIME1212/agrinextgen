
import {
    PRODUCTS_LOADING,
    PRODUCTS_LOAD_SUCCESS,
    PRODUCTS_LOAD_FAIL,
    ProductsState
  } from '../types';
  
  const initialState: ProductsState = {
    products: [],
    loading: false,
    error: null
  };
  
  const productReducer = (state = initialState, action: any): ProductsState => {
    switch (action.type) {
      case PRODUCTS_LOADING:
        return {
          ...state,
          loading: true,
          error: null
        };
      
      case PRODUCTS_LOAD_SUCCESS:
        return {
          ...state,
          products: action.payload,
          loading: false,
          error: null
        };
      
      case PRODUCTS_LOAD_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
      
      default:
        return state;
    }
  };
  
  export default productReducer;
  