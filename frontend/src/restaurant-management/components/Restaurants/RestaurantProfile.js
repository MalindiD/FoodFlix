import React, { useState, useEffect } from "react";
import { restaurantService } from "../../services/restaurantService";

function RestaurantProfile() {
  const [restaurant, setRestaurant] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock restaurant ID - replace with actual ID from authentication
  const MOCK_RESTAURANT_ID = "67e5a6f867431037543a038b";

  useEffect(() => {
    fetchRestaurantDetails();
  }, []);

  const fetchRestaurantDetails = async () => {
    try {
      setLoading(true);
      const response = await restaurantService.getRestaurantDetails(
        MOCK_RESTAURANT_ID
      );
      setRestaurant(response.data);
      setFormData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch restaurant details", error);
      setError("Failed to load restaurant details");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await restaurantService.updateRestaurantProfile(
        MOCK_RESTAURANT_ID,
        formData
      );
      await fetchRestaurantDetails();
      setIsEditing(false);
      setError(null);
    } catch (error) {
      console.error("Failed to update restaurant", error);
      setError("Failed to update restaurant details");
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async () => {
    try {
      setLoading(true);
      await restaurantService.updateRestaurantAvailability(
        MOCK_RESTAURANT_ID,
        !restaurant.isAvailable
      );
      await fetchRestaurantDetails();
      setError(null);
    } catch (error) {
      console.error("Failed to update availability", error);
      setError("Failed to update restaurant availability");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-6">{error}</div>;
  if (!restaurant)
    return <div className="text-center p-6">No restaurant found</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {!isEditing ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">{restaurant.name}</h2>
          <div className="space-y-2">
            <p>
              <strong>Address:</strong> {restaurant.address}
            </p>
            <p>
              <strong>Contact Number:</strong> {restaurant.contactNumber}
            </p>
            <p>
              <strong>Cuisine Type:</strong> {restaurant.cuisineType}
            </p>
            <p>
              <strong>Opening Hours:</strong> {restaurant.openingHours}
            </p>
            <div className="flex items-center">
              <strong>Status:</strong>
              <span
                className={`ml-2 px-3 py-1 rounded ${
                  restaurant.isAvailable
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {restaurant.isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>
          </div>
          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit Profile
            </button>
            <button
              onClick={toggleAvailability}
              className={`px-4 py-2 rounded ${
                restaurant.isAvailable
                  ? "bg-red-500 text-white"
                  : "bg-green-500 text-white"
              }`}
            >
              {restaurant.isAvailable ? "Mark Unavailable" : "Mark Available"}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Restaurant Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              required
              pattern="[0-9]{10}"
              title="Please enter a 10-digit phone number"
            />
          </div>

          <div>
            <label className="block mb-2">Cuisine Type</label>
            <input
              type="text"
              name="cuisineType"
              value={formData.cuisineType}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Opening Hours</label>
            <input
              type="text"
              name="openingHours"
              value={formData.openingHours}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              required
              placeholder="e.g., 9 AM - 10 PM"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default RestaurantProfile;
