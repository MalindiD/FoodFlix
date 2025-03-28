import React from "react";
import RestaurantProfile from "../components/Restaurants/RestaurantProfile";

function RestaurantsPage() {
  // In a real app, this would come from authentication context
  const MOCK_RESTAURANT_ID = "actual-restaurant-id-from-backend";

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Restaurant Profile</h1>
      <RestaurantProfile restaurantId={MOCK_RESTAURANT_ID} />
    </div>
  );
}

export default RestaurantsPage;
