import React, { useState } from "react";
import { menuItemService } from "../../services/menuItemService";

function MenuItemForm({ existingMenuItem = null, onClose, onSubmitSuccess }) {
  // Mock restaurant ID - replace with actual ID from authentication
  const MOCK_RESTAURANT_ID = "67e5a6f867431037543a038b";

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
      // Validate form data
      if (!formData.name || !formData.description || !formData.price) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Convert price to number
      const menuItemData = {
        ...formData,
        price: parseFloat(formData.price)
      };

      if (existingMenuItem) {
        // Update existing menu item
        await menuItemService.updateMenuItem(
          MOCK_RESTAURANT_ID,
          existingMenuItem._id,
          menuItemData
        );
      } else {
        // Create new menu item
        await menuItemService.createMenuItem(MOCK_RESTAURANT_ID, menuItemData);
      }

      // Success callback
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
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 font-semibold">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              required
              placeholder="Enter menu item name"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              required
              placeholder="Describe the menu item"
              rows="3"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              required
              min="0"
              step="0.01"
              placeholder="Enter price"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              required
            >
              <option value="">Select Category</option>
              <option value="Appetizer">Appetizer</option>
              <option value="Main Course">Main Course</option>
              <option value="Dessert">Dessert</option>
              <option value="Beverage">Beverage</option>
            </select>
          </div>

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

          <div className="flex justify-end space-x-4 mt-6">
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
