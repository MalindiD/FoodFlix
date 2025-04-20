import React from "react";
import RestaurantProfile from "../components/Restaurants/RestaurantProfile";

function RestaurantsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Restaurant Profile</h1>
      <RestaurantProfile />
    </div>
  );
}

export default RestaurantsPage;
