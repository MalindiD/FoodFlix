import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaChartPie,
  FaUtensils,
  FaCreditCard,
  FaHistory
} from "react-icons/fa";
import { HiOutlineHome } from "react-icons/hi";

const RestaurantLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const storedRestaurant = sessionStorage.getItem("restaurant");
  const restaurantName = storedRestaurant
    ? JSON.parse(storedRestaurant)?.name
    : "Restaurant";

  const handleLogout = () => {
    sessionStorage.removeItem("restaurant");
    navigate("/restaurant-management/login");
  };

  const linkClasses = (path) =>
    `flex items-center space-x-2 font-semibold px-3 py-2 rounded hover:text-orange-500 transition ${
      location.pathname === path
        ? "bg-orange-100 text-orange-600"
        : "text-gray-700"
    }`;

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-orange-500 text-white flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-bold">{restaurantName}</h1>
        <button
          onClick={handleLogout}
          className="bg-white text-orange-500 px-4 py-2 rounded hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="bg-gray-100 w-64 p-6 overflow-y-auto">
          <nav className="space-y-4">
            <Link
              to="/restaurant-management/dashboard"
              className={linkClasses("/restaurant-management/dashboard")}
            >
              <FaChartPie /> <span>Overview</span>
            </Link>

            <Link
              to="/restaurant-management/restaurants"
              className={linkClasses("/restaurant-management/restaurants")}
            >
              <HiOutlineHome /> <span>Restaurant Profile</span>
            </Link>

            <Link
              to="/restaurant-management/menu-items"
              className={linkClasses("/restaurant-management/menu-items")}
            >
              <FaUtensils /> <span>Menu Items</span>
            </Link>

            <Link
              to="/restaurant-management/handle-payments"
              className={linkClasses("/restaurant-management/handle-payments")}
            >
              <FaCreditCard /> <span>Handle Payments</span>
            </Link>

            <Link
              to="/restaurant-management/order-history"
              className={linkClasses("/restaurant-management/order-history")}
            >
              <FaHistory /> <span>Order History</span>
            </Link>
          </nav>
        </aside>

        {/* Page Content */}
        <main className="flex-1 bg-gray-50 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default RestaurantLayout;
