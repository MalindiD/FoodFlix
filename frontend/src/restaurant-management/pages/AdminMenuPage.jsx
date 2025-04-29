import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { menuItemService } from "../services/menuItemService";
import AdminLayout from "../components/Admin/AdminLayout";

const AdminMenuPage = () => {
  const { id } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    menuItemService
      .getMenuItems(id)
      .then((res) => {
        setMenuItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load menu items", err);
        setLoading(false);
      });
  }, [id]);

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header and Back Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Restaurant Menu</h1>
          <Link
            to="/admin/manage-restaurants"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Restaurants
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <p>Loading menu...</p>
        ) : menuItems.length === 0 ? (
          <p>No menu items found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col"
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
                    className="w-full h-40 object-cover rounded mb-4"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-200 rounded flex items-center justify-center text-gray-500 mb-4">
                    No Image
                  </div>
                )}

                {/* Main Info */}
                <h3 className="text-lg font-bold mb-1">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>

                <div className="text-sm text-gray-700 space-y-1 mt-2">
                  <p>
                    <strong>Menu ID:</strong> {item._id}
                  </p>
                  <p>
                    <strong>Restaurant ID:</strong> {item.restaurantId}
                  </p>
                  <p>
                    <strong>Price:</strong> Rs. {item.price}
                  </p>
                  <p>
                    <strong>Category:</strong> {item.category}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={
                        item.isAvailable ? "text-green-600" : "text-red-600"
                      }
                    >
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </p>
                  <p>
                    <strong>Tags:</strong>{" "}
                    {item.tags && item.tags.length > 0
                      ? item.tags.join(", ")
                      : "No Tags"}
                  </p>
                  <p>
                    <strong>Last Updated:</strong>{" "}
                    {item.updatedAt
                      ? new Date(item.updatedAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMenuPage;
