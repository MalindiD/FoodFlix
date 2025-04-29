import React from "react";
import { Link } from "react-router-dom";

const AdminRestaurantCard = ({
  restaurant,
  onToggleAvailability,
  onVerify
}) => {
  const {
    _id,
    name,
    email,
    cuisineType,
    contactNumber,
    isAvailable,
    profileImage,
    isVerified
  } = restaurant;

  return (
    <div className="p-4 border rounded shadow bg-white flex flex-col items-center text-center">
      {profileImage ? (
        <img
          src={
            profileImage.startsWith("http")
              ? profileImage
              : `http://localhost:5000/${profileImage}`
          }
          alt={`${name} profile`}
          className="w-24 h-24 object-cover rounded-full mb-4"
        />
      ) : (
        <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}

      <h2 className="text-xl font-bold">{name}</h2>
      <p>{email}</p>
      <p>Cuisine: {cuisineType}</p>
      <p>Contact: {contactNumber}</p>
      <p>
        Status:{" "}
        <span className="ml-1">
          {isAvailable ? " Available" : " Unavailable"}
        </span>
      </p>
      <p>
        Verification:{" "}
        <span className="ml-1">
          {isVerified ? " Verified" : " Not Verified"}
        </span>
      </p>

      <div className="mt-4 flex gap-2 flex-wrap justify-center">
        <Link
          to={`/admin/restaurants/${_id}/menu`}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          View Menu
        </Link>
        <Link
          to={`/admin/restaurants/${_id}/orders`}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          View Orders
        </Link>
        <button
          onClick={() => onToggleAvailability(_id, isAvailable)}
          className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600"
        >
          Toggle Availability
        </button>

        {!isVerified && (
          <button
            onClick={() => onVerify(_id)}
            className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
          >
            Verify
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminRestaurantCard;
