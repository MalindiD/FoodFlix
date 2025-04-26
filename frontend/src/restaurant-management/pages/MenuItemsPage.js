import React, { useState, useEffect } from "react";
import { menuItemService } from "../services/menuItemService";
import MenuItemForm from "../components/MenuItems/MenuItemForm";
import RestaurantLayout from "../components/Layout/RestaurantLayout";

function MenuItemsPage() {
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

  if (loading) {
    return (
      <RestaurantLayout>
        <div className="text-center p-6">Loading...</div>
      </RestaurantLayout>
    );
  }

  if (error) {
    return (
      <RestaurantLayout>
        <div className="text-red-500 text-center p-6">{error}</div>
      </RestaurantLayout>
    );
  }

  return (
    <RestaurantLayout>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Manage Menu Items</h1>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
            onClick={() => setIsAddFormOpen(true)}
          >
            + Add Item
          </button>
        </div>

        {menuItems.length === 0 ? (
          <p className="text-center text-gray-500">No menu items found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div
                key={item._id}
                className="bg-gray-50 rounded-lg p-4 shadow hover:shadow-md transition flex flex-col justify-between"
              >
                {/* Image */}
                {item.image ? (
                  <img
                    src={
                      item.image.startsWith("http")
                        ? item.image
                        : `http://localhost:5000/${item.image}`
                    }
                    alt={item.name}
                    className="h-40 w-full object-cover rounded-md mb-4"
                  />
                ) : (
                  <div className="h-40 w-full bg-gray-200 rounded-md flex items-center justify-center text-gray-400 mb-4">
                    No Image
                  </div>
                )}

                {/* Info */}
                <h3 className="text-lg font-bold">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                <p className="text-gray-800 font-semibold">
                  Price: Rs.{item.price.toFixed(2)}
                </p>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-200 text-xs px-2 py-1 rounded-full text-gray-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Status */}
                <span
                  className={`mt-4 inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    item.isAvailable
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {item.isAvailable ? "Available" : "Unavailable"}
                </span>

                {/* Action buttons */}
                <div className="flex justify-between mt-4 space-x-2">
                  <button
                    onClick={() => setEditingMenuItem(item)}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded transition w-full"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      toggleMenuItemAvailability(item._id, item.isAvailable)
                    }
                    className={`text-white text-sm px-3 py-1 rounded w-full transition ${
                      item.isAvailable
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {item.isAvailable ? "Mark Unavailable" : "Mark Available"}
                  </button>
                  <button
                    onClick={() => handleDeleteMenuItem(item._id)}
                    className="bg-gray-500 hover:bg-gray-600 text-white text-sm px-3 py-1 rounded transition w-full"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Forms */}
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
    </RestaurantLayout>
  );
}

export default MenuItemsPage;
