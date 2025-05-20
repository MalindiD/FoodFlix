import axios from "axios";

const BASE_URL =
  process.env.REACT_APP_RESTAURANT_API || "http://localhost:3003/api";

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
