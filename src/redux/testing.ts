import { userAPI } from "./api";

const testLogin = async () => {
    try {
      const response = await userAPI.login('john@example.com', 'password123', 'customer');
      console.log('Login Response:', response);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  
  const testRegister = async () => {
    try {
      const response = await userAPI.register({
        email: 'jane@example.com',
        password: 'password123',
        role: 'customer',
      });
      console.log('Register Response:', response);
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };
  
  const testGetCurrentUser = async () => {
    try {
      const response = await userAPI.getCurrentUser();
      console.log('Get Current User Response:', response);
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  };
  
  const testUpdateProfile = async () => {
    try {
      const response = await userAPI.updateProfile('1', { name: 'John Smith' });
      console.log('Updated Profile Response:', response);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  
  // Run each test individually
  // testLogin();
  testRegister();
  // testGetCurrentUser();
  // testUpdateProfile();