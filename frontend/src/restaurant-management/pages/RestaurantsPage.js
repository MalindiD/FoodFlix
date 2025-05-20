import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { restaurantService } from "../services/restaurantService";
import RestaurantLayout from "../components/Layout/RestaurantLayout";
import RestaurantProfileEditForm from "../components/Restaurants/RestaurantProfileEditForm";

function RestaurantsPage() {
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
    if (imageUrl && imageUrl.startsWith("data:image/")) {
      setError("Base64-encoded images are not allowed in the Image URL field.");
      setLoading(false);
      return;
    }

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

  if (loading) {
    return (
      <RestaurantLayout>
        <div className="text-center p-8">Loading...</div>
      </RestaurantLayout>
    );
  }

  if (error) {
    return (
      <RestaurantLayout>
        <div className="text-center p-8 text-red-500">{error}</div>
      </RestaurantLayout>
    );
  }

  if (!restaurant) {
    return (
      <RestaurantLayout>
        <div className="text-center p-8">No restaurant found</div>
      </RestaurantLayout>
    );
  }

  return (
    <RestaurantLayout>
      <div className="bg-white shadow-lg rounded-lg p-8 relative">
        {!isEditing ? (
          <>
            <div className="flex flex-col items-center space-y-6 mb-8">
              {restaurant.profileImage && (
                <img
                  src={
                    restaurant.profileImage.startsWith("http")
                      ? restaurant.profileImage
                      : `http://localhost:5000/${restaurant.profileImage}`
                  }
                  alt="Restaurant Banner"
                  className="w-full h-60 object-cover rounded-m mb-6"
                />
              )}

              <div className="text-center">
                <h2 className="text-3xl font-bold">{restaurant.name}</h2>
                <div className="flex justify-center items-center mt-2">
                  <span className="font-semibold">Status:</span>
                  <span
                    className={`ml-2 px-3 py-1 rounded-full text-sm ${
                      restaurant.isAvailable
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {restaurant.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
              <div>
                <p>
                  <strong>Address:</strong> {restaurant.address}
                </p>
                <p className="mt-2">
                  <strong>Contact Number:</strong> {restaurant.contactNumber}
                </p>
              </div>
              <div>
                <p>
                  <strong>Cuisine Type:</strong> {restaurant.cuisineType}
                </p>
                <p className="mt-2">
                  <strong>Opening Hours:</strong> {restaurant.openingHours}
                </p>
              </div>
            </div>

            <div className="mt-10 flex justify-center space-x-6">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
              >
                Edit Profile
              </button>
              <button
                onClick={toggleAvailability}
                className={`px-6 py-2 rounded ${
                  restaurant.isAvailable ? "bg-red-500" : "bg-green-500"
                } text-white hover:opacity-90 transition`}
              >
                {restaurant.isAvailable ? "Mark Unavailable" : "Mark Available"}
              </button>
            </div>
          </>
        ) : (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg w-full max-w-lg shadow-lg overflow-y-auto max-h-[90vh]">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Edit Restaurant Profile
              </h2>

              <RestaurantProfileEditForm
                formData={formData}
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
                setImageFile={setImageFile}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                setIsEditing={setIsEditing}
              />
            </div>
          </div>
        )}
      </div>
    </RestaurantLayout>
  );
}

export default RestaurantsPage;
