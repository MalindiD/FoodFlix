import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // ✅ import useNavigate

const AdminSidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate(); // ✅ create navigate instance

  const linkClass = (path) =>
    `block px-4 py-2 rounded hover:bg-orange-100 ${
      pathname === path ? "bg-orange-200 font-semibold" : ""
    }`;

  const handleLogout = () => {
    sessionStorage.removeItem("token"); // ✅ clear token
    navigate("/restaurant-management/login"); // ✅ redirect to login page
  };

  return (
    <div className="bg-white shadow rounded p-4 space-y-2 w-64 min-h-screen flex flex-col">
      <div className="flex-grow space-y-2">
        <Link to="/admin/dashboard" className={linkClass("/admin/dashboard")}>
          Admin Overview
        </Link>
        <Link
          to="/admin/manage-customers"
          className={linkClass("/admin/manage-customers")}
        >
          Manage Customers
        </Link>
        <Link
          to="/admin/manage-deliveries"
          className={linkClass("/admin/manage-deliveries")}
        >
          Manage Deliveries
        </Link>
        <Link
          to="/admin/manage-restaurants"
          className={linkClass("/admin/manage-restaurants")}
        >
          Manage Restaurants
        </Link>
        <Link to="/admin/financials" className={linkClass("/admin/financials")}>
          Financials
        </Link>
      </div>

      <button
        onClick={handleLogout}
        className="fixed bottom-6 left-6 bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded shadow-lg z-50"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminSidebar;
