import React, { useState, useEffect } from "react";
import { menuItemService } from "../../services/menuItemService";
import MenuItemForm from "./MenuItemForm";

function MenuItemList() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);

  // Mock restaurant ID - replace with actual ID from authentication
  const MOCK_RESTAURANT_ID = "67e5a6f867431037543a038b";

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await menuItemService.getMenuItems(MOCK_RESTAURANT_ID);
      setMenuItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch menu items", error);
      setError("Failed to load menu items");
      setLoading(false);
    }
  };

  const handleDeleteMenuItem = async (menuItemId) => {
    try {
      await menuItemService.deleteMenuItem(MOCK_RESTAURANT_ID, menuItemId);
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
        MOCK_RESTAURANT_ID,
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
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600">{item.description}</p>
                <p className="text-gray-600">Price: ${item.price.toFixed(2)}</p>
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
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingMenuItem(item);
                  }}
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
