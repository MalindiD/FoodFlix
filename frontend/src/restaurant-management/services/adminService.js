import axios from "axios";

export const adminService = {
  getAllRestaurants: () => axios.get("http://localhost:5000/api/restaurants"),
  toggleAvailability: (id, isAvailable) =>
    axios.patch(`http://localhost:5000/api/restaurants/${id}/availability`, {
      isAvailable
    }),
  verifyRestaurant: (id) =>
    axios.patch(`http://localhost:5000/api/restaurants/${id}/verify`)
};
