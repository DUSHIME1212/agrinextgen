
import axios from 'axios';
import { User, Product } from './types';

// Create axios instance with base configurations
const api = axios.create({
  baseURL: process.env.BackendURL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// User related API calls
export const userAPI = {
  login: async (email: string, password: string, role: 'customer' | 'seller') => {
    try {
      // This would be an actual API call in a real app
      const response = await api.post('/auth/login', { email, password, role });
      return response.data;
      
      // Simulated response for now
      return {
        id: '1',
        name: 'DUSHIME Aime',
        email,
        avatar: 'https://example.com/avatar.png',
        role,
        token: 'fake-jwt-token',
      };
    } catch (error) {
      throw error;
    }
  },
  
  register: async (userData: { 
    email: string; 
    password: string; 
    name?: string;
    businessName?: string;
    contactPerson?: string;
    phone?: string;
    role: 'customer' | 'seller';
  }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
      
      // Simulated response
      return {
        id: '1',
        name: userData.name || userData.businessName,
        email: userData.email,
        role: userData.role,
        token: 'fake-jwt-token',
      };
    } catch (error) {
      throw error;
    }
  },
  
  updateProfile: async (userId: string, userData: Partial<User>) => {
    try {
      // const response = await api.put(`/users/${userId}`, userData);
      // return response.data;
      
      // Simulated response
      return {
        ...userData,
        id: userId,
      };
    } catch (error) {
      throw error;
    }
  },
  
  getCurrentUser: async () => {
    try {
      // const response = await api.get('/users/me');
      // return response.data;
      
      // Simulated response
      return {
        id: '1',
        name: 'DUSHIME Aime',
        email: 'john@example.com',
        role: 'customer' as const,
      };
    } catch (error) {
      throw error;
    }
  },
};

// Product related API calls
export const productAPI = {
  getProducts: async (category?: string) => {
    try {
      // const url = category ? `/products?category=${category}` : '/products';
      // const response = await api.get(url);
      // return response.data;
      
      // Simulated response
      return [
        {
          id: '1',
          name: 'Organic Seeds',
          description: 'High-quality organic seeds',
          price: 9.99,
          image: 'https://example.com/seeds.jpg',
          category: 'seeds',
          seller: 'Farm Fresh Inc',
          stock: 50,
          rating: 4.5,
          numReviews: 12,
        },
        // More products would be here
      ];
    } catch (error) {
      throw error;
    }
  },
  
  getProductById: async (productId: string) => {
    try {
      // const response = await api.get(`/products/${productId}`);
      // return response.data;
      
      // Simulated response
      return {
        id: productId,
        name: 'Organic Seeds',
        description: 'High-quality organic seeds',
        price: 9.99,
        image: 'https://example.com/seeds.jpg',
        category: 'seeds',
        seller: 'Farm Fresh Inc',
        stock: 50,
        rating: 4.5,
        numReviews: 12,
      };
    } catch (error) {
      throw error;
    }
  },
  
  createProduct: async (productData: Omit<Product, 'id'>) => {
    try {
      // const response = await api.post('/products', productData);
      // return response.data;
      
      // Simulated response
      return {
        ...productData,
        id: Math.random().toString(36).substring(7),
      };
    } catch (error) {
      throw error;
    }
  },
  
  updateProduct: async (productId: string, productData: Partial<Product>) => {
    try {
      // const response = await api.put(`/products/${productId}`, productData);
      // return response.data;
      
      // Simulated response
      return {
        ...productData,
        id: productId,
      };
    } catch (error) {
      throw error;
    }
  },
  
  deleteProduct: async (productId: string) => {
    try {
      // await api.delete(`/products/${productId}`);
      return { success: true };
    } catch (error) {
      throw error;
    }
  },
};

// Order related API calls
export const orderAPI = {
  createOrder: async (orderData: {
    items: { productId: string; quantity: number }[];
    shippingAddress: {
      address: string;
      city: string;
      postalCode: string;
      country: string;
    };
    paymentMethod: string;
  }) => {
    try {
      // const response = await api.post('/orders', orderData);
      // return response.data;
      
      // Simulated response
      return {
        id: Math.random().toString(36).substring(7),
        items: orderData.items,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        totalPrice: 99.99,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      throw error;
    }
  },
  
  getOrderById: async (orderId: string) => {
    try {
      // const response = await api.get(`/orders/${orderId}`);
      // return response.data;
      
      // Simulated response
      return {
        id: orderId,
        items: [
          { productId: '1', quantity: 2, name: 'Organic Seeds', price: 9.99 }
        ],
        shippingAddress: {
          address: '123 Farm St',
          city: 'Agriville',
          postalCode: '12345',
          country: 'USA',
        },
        paymentMethod: 'PayPal',
        totalPrice: 19.98,
        status: 'paid',
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      throw error;
    }
  },
  
  getUserOrders: async () => {
    try {
      // const response = await api.get('/orders/myorders');
      // return response.data;
      
      // Simulated response
      return [
        {
          id: '1',
          totalPrice: 19.98,
          status: 'paid',
          createdAt: new Date().toISOString(),
        },
        // More orders would be here
      ];
    } catch (error) {
      throw error;
    }
  },
  
  getSellerOrders: async () => {
    try {
      // const response = await api.get('/orders/sellerorders');
      // return response.data;
      
      // Simulated response
      return [
        {
          id: '1',
          totalPrice: 19.98,
          status: 'paid',
          createdAt: new Date().toISOString(),
          buyer: {
            id: '2',
            name: 'Jane Doe',
          },
        },
        // More orders would be here
      ];
    } catch (error) {
      throw error;
    }
  },
};

export default api;