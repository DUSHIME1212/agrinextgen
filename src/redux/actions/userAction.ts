
import { Dispatch } from 'redux';
import { userAPI } from '../api';
import {
  USER_LOADING,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_UPDATE_PROFILE,
  User
} from '../types/index';

// Login user
export const loginUser = (email: string, password: string, role: 'customer' | 'seller') => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: USER_LOADING });
    
    const userData = await userAPI.login(email, password, role);
    
    // Save token to localStorage
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
    
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: userData
    });
    
    return userData;
  } catch (error: any) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: error.response?.data?.message || 'Login failed'
    });
    
    throw error;
  }
};

// Register user
export const registerUser = (userData: {
  email: string;
  password: string;
  name?: string;
  businessName?: string;
  contactPerson?: string;
  phone?: string;
  role: 'customer' | 'seller';
}) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: USER_LOADING });
    
    const registeredUser = await userAPI.register(userData);
    
    // Save token to localStorage
    if (registeredUser.token) {
      localStorage.setItem('token', registeredUser.token);
    }
    
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: registeredUser
    });
    
    return registeredUser;
  } catch (error: any) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: error.response?.data?.message || 'Registration failed'
    });
    
    throw error;
  }
};

// Logout user
export const logoutUser = () => (dispatch: Dispatch) => {
  localStorage.removeItem('token');
  dispatch({ type: USER_LOGOUT });
};

// Update user profile
export const updateUserProfile = (userId: string, userData: Partial<User>) => async (dispatch: Dispatch) => {
  try {
    const updatedUser = await userAPI.updateProfile(userId, userData);
    
    dispatch({
      type: USER_UPDATE_PROFILE,
      payload: updatedUser
    });
    
    return updatedUser;
  } catch (error: any) {
    throw error;
  }
};

// Load current user
export const loadCurrentUser = () => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: USER_LOADING });
    
    const userData = await userAPI.getCurrentUser();
    
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: userData
    });
    
    return userData;
  } catch (error: any) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: error.response?.data?.message || 'Failed to load user'
    });
    
    throw error;
  }
};