import React, { useState } from "react";
import { menuItemService } from "../../services/menuItemService";
import axios from "axios";

// ... (imports)
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

  const [tagsInput, setTagsInput] = useState(
    existingMenuItem?.tags?.join(", ") || ""
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

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });

      // Add tags array
      const tagsArray = tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
      form.append("tags", JSON.stringify(tagsArray));

      if (imageFile) {
        form.append("image", imageFile);
      } else if (imageUrl) {
        form.append("imageUrl", imageUrl);
      } else if (existingImage) {
        form.append("existingImage", existingImage);
      }

      const axiosConfig = {
        headers: { "Content-Type": "multipart/form-data" }
      };

      if (existingMenuItem) {
        await axios.patch(
          `http://localhost:5000/api/restaurants/${restaurantId}/menu-items/${existingMenuItem._id}`,
          form,
          axiosConfig
        );
      } else {
        await axios.post(
          `http://localhost:5000/api/restaurants/${restaurantId}/menu-items`,
          form,
          axiosConfig
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">
          {existingMenuItem ? "Edit Menu Item" : "Add New Menu Item"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Existing fields */}
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
            placeholder="Name"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
            placeholder="Description"
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
            placeholder="Price"
          />
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
            placeholder="Category"
          />

          {/* New: Tags input */}
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Tags (comma separated, e.g., Spicy, Vegan)"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full border p-2"
          />
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Image URL"
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label>Available</label>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
              disabled={loading}
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
