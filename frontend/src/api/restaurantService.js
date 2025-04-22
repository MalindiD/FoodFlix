import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create an axios instance
const restaurantApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token if available
restaurantApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const restaurantService = {
  // ✅ Get all restaurants
  getAllRestaurants: async () => {
    const res = await restaurantApi.get('/restaurants');
    return res.data;
  },

  // ✅ Get restaurant by ID
  getRestaurantById: async (id) => {
    const res = await restaurantApi.get(`/restaurants/${id}`);
    return res.data;
  },

  // ✅ Get menu items of a restaurant
  getMenuItems: async (restaurantId) => {
    const res = await restaurantApi.get(`/restaurants/${restaurantId}/menu-items`);
    return res.data;
  },

  // ✅ Search restaurants by query
  searchRestaurants: async (query) => {
    const res = await restaurantApi.get(`/restaurants/search?q=${query}`);
    return res.data;
  },

  // ✅ Filter by category or tag (merged into one)
  filterByCategoryOrTag: async (keyword) => {
    const res = await restaurantApi.get(`/restaurants/filter?keyword=${keyword}`);
    return res.data;
  },

  // ✅ Get unique menu categories
  getUniqueMenuCategories: async () => {
    const res = await restaurantApi.get('/restaurants/menu-items/all-categories');
    return res.data;
  },

  // ✅ Get unique tags
  getUniqueTags: async () => {
    const res = await restaurantApi.get('/restaurants/menu-items/tags/unique');
    return res.data;
  },

  filterRestaurantsByCategoryOrTag: async (keyword) => {
    const res = await restaurantApi.get(`/restaurants/filter?keyword=${keyword}`);
    return res.data;
  },
};

export default restaurantService;
