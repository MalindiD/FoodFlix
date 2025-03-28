import React from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Restaurant Management Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Link
          to="/restaurant-management/restaurants"
          className="bg-blue-500 text-white p-6 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          <h2 className="text-xl font-semibold">Restaurant Profile</h2>
          <p>View and edit restaurant details</p>
        </Link>

        <Link
          to="/restaurant-management/menu-items"
          className="bg-green-500 text-white p-6 rounded-lg shadow-md hover:bg-green-600 transition"
        >
          <h2 className="text-xl font-semibold">Menu Items</h2>
          <p>Manage your restaurant's menu</p>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
