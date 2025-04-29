import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/Admin/AdminLayout";

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchCustomers = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/admin/users?role=customer",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setCustomers(response.data);
    } catch (error) {
      console.error("Failed to fetch customers", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (userId) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/admin/users/${userId}/deactivate`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert("User deactivated.");
      fetchCustomers();
    } catch (err) {
      console.error("Failed to deactivate user", err);
      alert("Failed to deactivate user.");
    }
  };

  const filteredCustomers =
    filter === "all"
      ? customers
      : customers.filter((u) =>
          filter === "verified" ? u.isVerified : !u.isVerified
        );

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Manage Customers</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-100 text-blue-900 px-4 py-3 rounded shadow-md text-center">
            <p className="text-sm font-semibold">Total Customers</p>
            <p className="text-xl font-bold">{customers.length}</p>
          </div>
          <div className="bg-green-100 text-green-900 px-4 py-3 rounded shadow-md text-center">
            <p className="text-sm font-semibold">Verified</p>
            <p className="text-xl font-bold">
              {customers.filter((u) => u.isVerified).length}
            </p>
          </div>
          <div className="bg-red-100 text-red-900 px-4 py-3 rounded shadow-md text-center">
            <p className="text-sm font-semibold">Unverified</p>
            <p className="text-xl font-bold">
              {customers.filter((u) => !u.isVerified).length}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex items-center gap-2">
          <label className="font-medium">Filter by status:</label>
          <select
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>

        {/* Customers Table */}
        {loading ? (
          <p>Loading...</p>
        ) : filteredCustomers.length === 0 ? (
          <p className="text-gray-600">No customer accounts found.</p>
        ) : (
          <div className="overflow-x-auto rounded shadow bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">Phone</th>
                  <th className="text-left px-4 py-3">Address</th>
                  {/* <th className="text-left px-4 py-3">Orders</th> */}
                  {/* <th className="text-left px-4 py-3">Actions</th> */}
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {filteredCustomers.map((user, index) => (
                  <tr
                    key={user._id}
                    className={`border-t ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.phone || "N/A"}</td>
                    <td className="px-4 py-3">{user.address || "N/A"}</td>
                    {/* <td className="px-4 py-3">{user.orders?.length || 0}</td> */}
                    {/* 
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDeactivate(user._id)}
                        className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      >
                        Deactivate
                      </button>
                    </td> 
                    */}
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

export default AdminCustomersPage;
