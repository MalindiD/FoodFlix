import React, { useState } from "react";
import { menuItemService } from "../../services/menuItemService";
import axios from "axios";

function MenuItemForm({ existingMenuItem = null, onClose, onSubmitSuccess }) {
  const storedRestaurant = sessionStorage.getItem("restaurant");
  const restaurantId = storedRestaurant
    ? JSON.parse(storedRestaurant).id
    : null;

  const [formData, setFormData] = useState(
    existingMenuItem
      ? {
          name: existingMenuItem.name,
          description: existingMenuItem.description,
          price: existingMenuItem.price,
          category: existingMenuItem.category,
          isAvailable: existingMenuItem.isAvailable
        }
      : {
          name: "",
          description: "",
          price: "",
          category: "",
          isAvailable: true
        }
  );

  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [existingImage, setExistingImage] = useState(
    existingMenuItem?.image || ""
  );

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
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
      if (!formData.name || !formData.description || !formData.price) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });

      if (imageFile) {
        form.append("image", imageFile); // File uploaded
      } else if (imageUrl) {
        form.append("imageUrl", imageUrl); // URL given
      } else if (existingImage) {
        form.append("existingImage", existingImage); // Preserve old image ✅
      }

      if (existingMenuItem) {
        await axios.patch(
          `http://localhost:5000/api/restaurants/${restaurantId}/menu-items/${existingMenuItem._id}`,
          form,
          {
            headers: { "Content-Type": "multipart/form-data" }
          }
        );
      } else {
        await axios.post(
          `http://localhost:5000/api/restaurants/${restaurantId}/menu-items`,
          form,
          {
            headers: { "Content-Type": "multipart/form-data" }
          }
        );
      }

      onSubmitSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save menu item", error);
      setError(error.response?.data?.message || "Failed to save menu item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-auto z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {existingMenuItem ? "Edit Menu Item" : "Add New Menu Item"}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block mb-1 font-semibold">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-semibold">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              required
              rows="2"
            />
          </div>

          {/* Price & Category */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block mb-1 font-semibold">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="w-1/2">
              <label className="block mb-1 font-semibold">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                required
              >
                <option value="">Select</option>
                <option value="Appetizer">Appetizer</option>
                <option value="Main Course">Main Course</option>
                <option value="Dessert">Dessert</option>
                <option value="Beverage">Beverage</option>
              </select>
            </div>
          </div>

          {/* Image Preview */}
          {existingMenuItem?.image && (
            <div>
              <label className="block mb-1 font-semibold">Current Image</label>
              <img
                src={
                  existingMenuItem.image.startsWith("http")
                    ? existingMenuItem.image
                    : `http://localhost:5000/${existingMenuItem.image}`
                }
                alt="Current"
                className="w-24 h-24 object-cover rounded border mb-2"
              />
            </div>
          )}

          {/* Upload & URL Input */}
          <div>
            <label className="block mb-1 font-semibold">Upload New Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">
              Or Paste Image URL
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Availability */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label>Available</label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Saving..." : existingMenuItem ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MenuItemForm;
