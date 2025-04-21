import React, { useState, useEffect } from "react";
import { menuItemService } from "../../services/menuItemService";
import MenuItemForm from "./MenuItemForm";

function MenuItemList() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);

  const storedRestaurant = sessionStorage.getItem("restaurant");
  const restaurantId = storedRestaurant
    ? JSON.parse(storedRestaurant).id
    : null;

  useEffect(() => {
    if (restaurantId) fetchMenuItems();
  }, [restaurantId]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await menuItemService.getMenuItems(restaurantId);
      setMenuItems(response.data);
    } catch (error) {
      console.error("Failed to fetch menu items", error);
      setError("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMenuItem = async (menuItemId) => {
    try {
      await menuItemService.deleteMenuItem(restaurantId, menuItemId);
      fetchMenuItems();
    } catch (error) {
      console.error("Failed to delete menu item", error);
      setError("Failed to delete menu item");
    }
  };

  const toggleMenuItemAvailability = async (
    menuItemId,
    currentAvailability
  ) => {
    try {
      await menuItemService.updateMenuItemAvailability(
        restaurantId,
        menuItemId,
        !currentAvailability
      );
      fetchMenuItems();
    } catch (error) {
      console.error("Failed to update menu item availability", error);
      setError("Failed to update menu item availability");
    }
  };

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-6">{error}</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Menu Items</h2>
      {menuItems.length === 0 ? (
        <p className="text-center text-gray-500">No menu items found</p>
      ) : (
        <div className="space-y-4">
          {menuItems.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center border-b pb-4"
            >
              <div className="flex items-center space-x-4">
                {/* Image preview */}
                {item.image ? (
                  <img
                    src={
                      item.image.startsWith("http")
                        ? item.image // external URL
                        : `http://localhost:5000/${item.image}` // uploaded file path
                    }
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md border"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">{item.description}</p>
                  <p className="text-gray-600">
                    Price: ${item.price.toFixed(2)}
                  </p>
                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-200 text-sm px-2 py-1 rounded-full text-gray-700"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <span
                    className={`inline-block px-2 py-1 rounded text-sm ${
                      item.isAvailable
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {item.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingMenuItem(item)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    toggleMenuItemAvailability(item._id, item.isAvailable)
                  }
                  className={`px-3 py-1 rounded ${
                    item.isAvailable
                      ? "bg-red-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {item.isAvailable ? "Mark Unavailable" : "Mark Available"}
                </button>
                <button
                  onClick={() => handleDeleteMenuItem(item._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setIsAddFormOpen(true)}
        >
          Add Menu Item
        </button>
      </div>

      {isAddFormOpen && (
        <MenuItemForm
          onClose={() => setIsAddFormOpen(false)}
          onSubmitSuccess={fetchMenuItems}
        />
      )}

      {editingMenuItem && (
        <MenuItemForm
          existingMenuItem={editingMenuItem}
          onClose={() => setEditingMenuItem(null)}
          onSubmitSuccess={fetchMenuItems}
        />
      )}
    </div>
  );
}

export default MenuItemList;
