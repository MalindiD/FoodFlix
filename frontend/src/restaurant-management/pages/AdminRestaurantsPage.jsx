import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AdminLayout from "../components/Admin/AdminLayout";

const AdminRestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // ✅ Define fetchRestaurants at the top
  const fetchRestaurants = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/admin/restaurants",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setRestaurants(res.data);
    } catch (err) {
      console.error("Failed to fetch restaurants", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants(); // ✅ Call it inside useEffect
  }, []);

  const handleToggleVerify = async (restaurantId) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/admin/restaurants/${restaurantId}/verify`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchRestaurants(); // ✅ Now no error!
    } catch (err) {
      console.error("Failed to toggle verification", err);
    }
  };

  const filteredRestaurants =
    filter === "all"
      ? restaurants
      : restaurants.filter((r) =>
          filter === "verified" ? r.isVerified : !r.isVerified
        );

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Manage Restaurants
        </h1>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-4 mb-6">
          <label className="font-medium text-gray-700">Filter by:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2"
          >
            <option value="all">All</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>

        {/* Restaurants Table */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="text-gray-500">Loading restaurants...</div>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No restaurants found.
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left font-semibold">Logo</th>
                  <th className="p-4 text-left font-semibold">Name</th>
                  <th className="p-4 text-left font-semibold">Email</th>
                  <th className="p-4 text-left font-semibold">Phone</th>
                  <th className="p-4 text-left font-semibold">Status</th>
                  <th className="p-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRestaurants.map((restaurant) => (
                  <tr
                    key={restaurant._id}
                    className="border-t hover:bg-gray-50 transition-all"
                  >
                    {/* Logo */}
                    <td className="p-4">
                      <img
                        src={restaurant.profileImage}
                        alt={restaurant.name}
                        className="w-14 h-14 object-cover rounded-full border"
                      />
                    </td>

                    {/* Name */}
                    <td className="p-4 font-semibold text-blue-600">
                      <Link to={`/admin/restaurants/${restaurant._id}/menu`}>
                        {restaurant.name}
                      </Link>
                    </td>

                    {/* Email */}
                    <td className="p-4">{restaurant.email}</td>

                    {/* Phone */}
                    <td className="p-4">{restaurant.contactNumber || "N/A"}</td>

                    {/* Status Badges */}
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
                            restaurant.isVerified
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {restaurant.isVerified ? "Verified" : "Unverified"}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
                            restaurant.isAvailable
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {restaurant.isAvailable ? "Open" : "Closed"}
                        </span>
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td className="p-4 flex flex-col md:flex-row gap-2">
                      {/* Verify / Unverify Button */}
                      <button
                        onClick={() => handleToggleVerify(restaurant._id)}
                        className="text-xs px-3 py-2 rounded bg-indigo-500 text-white hover:bg-indigo-600 transition"
                      >
                        {restaurant.isVerified ? "Unverify" : "Verify"}
                      </button>

                      {/* View Orders Button */}
                      <Link
                        to={`/admin/restaurants/${restaurant._id}/orders`}
                        className="text-xs px-3 py-2 rounded bg-green-500 text-white hover:bg-green-600 text-center"
                      >
                        View Orders
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminRestaurantsPage;
