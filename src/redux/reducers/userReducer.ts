
import {
    USER_LOADING,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_UPDATE_PROFILE,
    UserState
  } from '../types';
  
  const initialState: UserState = {
    currentUser: null,
    isAuthenticated: false,
    loading: false,
    error: null
  };
  
  const userReducer = (state = initialState, action: aRW): UserState => {
    switch (action.type) {
      case USER_LOADING:
        return {
          ...state,
          loading: true,
          error: null
        };
      
      case USER_LOGIN_SUCCESS:
        return {
          ...state,
          currentUser: action.payload,
          isAuthenticated: true,
          loading: false,
          error: null
        };
      
      case USER_LOGIN_FAIL:
        return {
          ...state,
          currentUser: null,
          isAuthenticated: false,
          loading: false,
          error: action.payload
        };
      
      case USER_LOGOUT:
        return {
          ...state,
          currentUser: null,
          isAuthenticated: false,
          loading: false,
          error: null
        };
      
      case USER_UPDATE_PROFILE:
        return {
          ...state,
          currentUser: {
            ...state.currentUser,
            ...action.payload
          }
        };
      
      default:
        return state;
    }
  };
  
  export default userReducer;