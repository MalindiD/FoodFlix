import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const menuItemService = {
  getMenuItems: (restaurantId) =>
    axios.get(`${BASE_URL}/restaurants/${restaurantId}/menu-items`),

  createMenuItem: (restaurantId, menuItemData) =>
    axios.post(
      `${BASE_URL}/restaurants/${restaurantId}/menu-items`,
      menuItemData
    ),

  updateMenuItem: (restaurantId, menuItemId, menuItemData) =>
    axios.put(
      `${BASE_URL}/restaurants/${restaurantId}/menu-items/${menuItemId}`,
      menuItemData
    ),

  deleteMenuItem: (restaurantId, menuItemId) =>
    axios.delete(
      `${BASE_URL}/restaurants/${restaurantId}/menu-items/${menuItemId}`
    ),

  updateMenuItemAvailability: (restaurantId, menuItemId, isAvailable) =>
    axios.patch(
      `${BASE_URL}/restaurants/${restaurantId}/menu-items/${menuItemId}/availability`,
      { isAvailable }
    )
};
