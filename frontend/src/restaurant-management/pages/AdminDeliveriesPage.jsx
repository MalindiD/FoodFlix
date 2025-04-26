import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/Admin/AdminLayout";

const AdminDeliveriesPage = () => {
  const [deliveryUsers, setDeliveryUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchDeliveryUsers = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/admin/users?role=delivery",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setDeliveryUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch delivery personnel", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVerify = async (userId) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/admin/users/${userId}/verify`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchDeliveryUsers();
    } catch (err) {
      console.error("Failed to toggle verification", err);
    }
  };

  const filteredDeliveryUsers =
    filter === "all"
      ? deliveryUsers
      : deliveryUsers.filter((user) =>
          filter === "verified" ? user.isVerified : !user.isVerified
        );

  useEffect(() => {
    fetchDeliveryUsers();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Manage Delivery Personnel</h1>

        {/* 🔍 Filter Dropdown */}
        <div className="mb-6 flex items-center gap-2">
          <label className="font-medium">Filter:</label>
          <select
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>

        {/* 📦 Data Table */}
        {loading ? (
          <p>Loading...</p>
        ) : filteredDeliveryUsers.length === 0 ? (
          <p className="text-gray-600">No delivery personnel found.</p>
        ) : (
          <div className="overflow-x-auto rounded shadow bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">Phone</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {filteredDeliveryUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className={`border-t ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.phone}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
                          user.isVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleVerify(user._id)}
                        className="text-xs px-3 py-1 rounded bg-indigo-500 text-white hover:bg-indigo-600"
                      >
                        {user.isVerified ? "Unverify" : "Verify"}
                      </button>
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

export default AdminDeliveriesPage;
