import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { restaurantService } from "../../services/restaurantService";

function RestaurantProfile() {
  const [restaurant, setRestaurant] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const storedRestaurant = sessionStorage.getItem("restaurant");
  const restaurantId = storedRestaurant
    ? JSON.parse(storedRestaurant).id
    : null;

  useEffect(() => {
    if (!restaurantId) navigate("/restaurant/login");
  }, [restaurantId, navigate]);

  useEffect(() => {
    if (restaurantId) fetchRestaurantDetails();
  }, [restaurantId]);

  const fetchRestaurantDetails = async () => {
    try {
      setLoading(true);
      const response = await restaurantService.getRestaurantDetails(
        restaurantId
      );
      setRestaurant(response.data);
      setFormData(response.data);
      setImageUrl("");
      setError(null);
    } catch (error) {
      console.error("Failed to fetch restaurant details", error);
      setError("Failed to load restaurant details");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 🚫 Prevent base64 data URLs from being used
    if (imageUrl && imageUrl.startsWith("data:image/")) {
      setError("Base64-encoded images are not allowed in the Image URL field.");
      setLoading(false);
      return;
    }

    // ✅ Optional: Ensure only valid HTTP/HTTPS URLs are accepted
    const isValidHttpUrl = (url) => {
      try {
        const u = new URL(url);
        return u.protocol === "http:" || u.protocol === "https:";
      } catch (_) {
        return false;
      }
    };

    if (imageUrl && !isValidHttpUrl(imageUrl)) {
      setError(
        "Please provide a valid image URL starting with http:// or https://"
      );
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const form = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });

      if (imageFile) {
        form.append("profileImage", imageFile);
      } else if (imageUrl) {
        form.append("imageUrl", imageUrl);
      } else if (restaurant?.profileImage) {
        form.append("existingImage", restaurant.profileImage);
      }

      await restaurantService.updateRestaurantProfile(restaurantId, form);
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
        restaurantId,
        !restaurant.isAvailable
      );
      await fetchRestaurantDetails();
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
    <div className="bg-white shadow-md rounded-lg p-6 relative">
      {/* Display Mode */}
      {!isEditing && (
        <div>
          <h2 className="text-2xl font-bold mb-4">{restaurant.name}</h2>

          {restaurant.profileImage && (
            <div className="mb-4">
              <img
                src={
                  restaurant.profileImage.startsWith("http")
                    ? restaurant.profileImage
                    : `http://localhost:5000/${restaurant.profileImage}`
                }
                alt="Profile"
                className="w-28 h-28 object-cover rounded-full border"
              />
            </div>
          )}

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
                restaurant.isAvailable ? "bg-red-500" : "bg-green-500"
              } text-white`}
            >
              {restaurant.isAvailable ? "Mark Unavailable" : "Mark Available"}
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal Popup */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Restaurant Profile</h2>

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
                />
              </div>

              <div>
                <label className="block mb-2">Upload New Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="block mb-2">Or Paste Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full border rounded p-2"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RestaurantProfile;
