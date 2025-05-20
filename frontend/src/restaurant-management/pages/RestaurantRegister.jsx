import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const RestaurantRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    address: "",
    cuisineType: "",
    openingHours: "",
    profileImage: null
  });

  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();

      for (let key in formData) {
        if (key !== "profileImage") {
          form.append(key, formData[key]);
        }
      }

      if (formData.profileImage) {
        form.append("profileImage", formData.profileImage);
      } else if (imageUrl) {
        form.append("imageUrl", imageUrl);
      }

      const res = await axios.post(
        "http://localhost:3003/api/auth/restaurantregister",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setMessage("Registration successful!");
      navigate("/restaurant-management/login");
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Restaurant Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {[
          "name",
          "email",
          "password",
          "contactNumber",
          "address",
          "cuisineType",
          "openingHours"
        ].map((field) => (
          <input
            key={field}
            name={field}
            type={field === "password" ? "password" : "text"}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="w-full border p-2 rounded"
            value={formData[field]}
            onChange={handleChange}
            required
          />
        ))}

        <div>
          <label className="block font-semibold mb-1">
            Upload Profile Image
          </label>
          <input
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Or Paste Image URL</label>
          <input
            type="text"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Register
        </button>
      </form>

      {message && <p className="mt-3 text-center text-sm">{message}</p>}

      <p className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link
          to="/restaurant-management/login"
          className="text-blue-600 hover:underline"
        >
          Login here
        </Link>
      </p>
    </div>
  );
};

export default RestaurantRegister;
