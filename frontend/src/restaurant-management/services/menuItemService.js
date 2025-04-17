import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const menuItemService = {
  getMenuItems: (restaurantId) =>
    axios.get(`${BASE_URL}/restaurants/${restaurantId}/menu-items`),

  createMenuItem: (restaurantId, menuItemData) =>
    axios.post(
      `${BASE_URL}/restaurants/${restaurantId}/menu-items`,
      menuItemData,
      {
        headers: { "Content-Type": "multipart/form-data" }
      }
    ),

  updateMenuItem: (restaurantId, menuItemId, menuItemData) =>
    axios.patch(
      `${BASE_URL}/restaurants/${restaurantId}/menu-items/${menuItemId}`,
      menuItemData,
      {
        headers: { "Content-Type": "multipart/form-data" }
      }
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
