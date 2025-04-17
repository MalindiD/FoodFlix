// src/components/RestaurantProfileEditForm.jsx
import React from "react";

const RestaurantProfileEditForm = ({
  formData,
  imageUrl,
  setImageUrl,
  setImageFile,
  handleInputChange,
  handleSubmit,
  setIsEditing
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2">Restaurant Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block mb-2">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block mb-2">Contact Number</label>
        <input
          type="tel"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleInputChange}
          className="w-full border rounded p-2"
          required
          pattern="[0-9]{10}"
          title="Please enter a 10-digit phone number"
        />
      </div>

      <div>
        <label className="block mb-2">Cuisine Type</label>
        <input
          type="text"
          name="cuisineType"
          value={formData.cuisineType}
          onChange={handleInputChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block mb-2">Opening Hours</label>
        <input
          type="text"
          name="openingHours"
          value={formData.openingHours}
          onChange={handleInputChange}
          className="w-full border rounded p-2"
          required
          placeholder="e.g., 9 AM - 10 PM"
        />
      </div>

      <div>
        <label className="block mb-2">Upload New Profile Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block mb-2">Or Paste Image URL</label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full border rounded p-2"
          placeholder="https://example.com/image.jpg (no base64)"
        />
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default RestaurantProfileEditForm;
