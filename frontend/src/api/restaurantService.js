import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create an axios instance with default config
const restaurantApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token in all requests
restaurantApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Restaurant service methods
const restaurantService = {
  // Get all restaurants
  getAllRestaurants: async () => {
    try {
      const response = await restaurantApi.get('/restaurants');
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      throw error;
    }
  },

  // Get restaurant by ID
  getRestaurantById: async (id) => {
    try {
      const response = await restaurantApi.get(`/restaurants/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching restaurant with ID ${id}:`, error);
      throw error;
    }
  },

  // Get menu items for a restaurant
  getMenuItems: async (restaurantId) => {
    try {
      const response = await restaurantApi.get(`/restaurants/${restaurantId}/menu`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching menu items for restaurant ${restaurantId}:`, error);
      throw error;
    }
  },

  // Search restaurants by query
  searchRestaurants: async (query) => {
    try {
      const response = await restaurantApi.get(`/restaurants/search?q=${query}`);
      return response.data;
    } catch (error) {
      console.error('Error searching restaurants:', error);
      throw error;
    }
  },

  // Filter restaurants by category
  filterByCategory: async (category) => {
    try {
      const response = await restaurantApi.get(`/restaurants/category/${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error filtering restaurants by category ${category}:`, error);
      throw error;
    }
  },

  // ✅ Get unique menu categories
  getUniqueMenuCategories: async () => {
    try {
      const response = await restaurantApi.get('/restaurants/menu-items/all-categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching menu categories:', error);
      throw error;
    }
  }
};


export default restaurantService;
