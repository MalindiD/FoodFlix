import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const restaurantService = {
  getRestaurantDetails: (restaurantId) =>
    axios.get(`${BASE_URL}/restaurants/${restaurantId}`),

  updateRestaurantProfile: (restaurantId, data) =>
    axios.put(`${BASE_URL}/restaurants/${restaurantId}`, data),

  updateRestaurantAvailability: (restaurantId, isAvailable) =>
    axios.patch(`${BASE_URL}/restaurants/${restaurantId}/availability`, {
      isAvailable
    })
};
