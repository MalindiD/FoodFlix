import React, { useState } from "react";
import axios from "axios";
import { uploadImage } from "../api";  
import './style.css';

const PartnerForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "", // Added email field
    phone: "",
    password: "", // Added password field
    vehicleType: "",
    address: "",
    currentLocation: { lat: "", lng: "" },
    profileImage: null,
  });

  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(""); // For error messages

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "lat" || name === "lng") {
      setFormData((prev) => ({
        ...prev,
        currentLocation: { ...prev.currentLocation, [name]: value },
      }));
    } else if (name === "profileImage" && files && files.length > 0) {
      setFormData((prev) => ({ ...prev, profileImage: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError(""); // Reset error message

    try {
      let imageUrl = formData.profileImage;

      // ✅ Upload to Cloudinary if a new file was selected
      if (formData.profileImage) {
        imageUrl = await uploadImage(formData.profileImage);

      }

      const payload = {
        name: formData.name,
        email: formData.email, // Send email
        phone: formData.phone,
        password: formData.password, // Send password
        vehicleType: formData.vehicleType,
        address: formData.address,
        profileImage: imageUrl,
        currentLocation: {
          lat: parseFloat(formData.currentLocation.lat),
          lng: parseFloat(formData.currentLocation.lng),
        },
      };

      const token = sessionStorage.getItem("token");

      // Send POST request to backend API
      const response = await axios.post("http://localhost:5003/api/partners/register", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        alert("✅ Partner registered successfully!");
        setFormData({
          name: "",
          email: "", // Reset email
          phone: "",
          password: "", // Reset password
          vehicleType: "",
          address: "",
          currentLocation: { lat: "", lng: "" },
          profileImage: null,
        });
        setPreview(null); // Reset preview
      }
    } catch (err) {
      console.error("❌ Registration failed:", err.response?.data || err.message);
      setError("❌ Registration failed. Please check your inputs.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        placeholder="Email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        placeholder="Password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <select
        name="vehicleType"
        value={formData.vehicleType}
        onChange={handleChange}
        required
      >
        <option value="">Select Vehicle Type</option>
        <option value="Bike">Bike</option>
        <option value="Car">Car</option>
        <option value="Scooter">Scooter</option>
      </select>
      <input
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
        required
      />
      <input
        name="lat"
        placeholder="Latitude"
        value={formData.currentLocation.lat}
        onChange={handleChange}
        required
      />
      <input
        name="lng"
        placeholder="Longitude"
        value={formData.currentLocation.lng}
        onChange={handleChange}
        required
      />

      <input
        type="file"
        name="profileImage"
        accept="image/*"
        onChange={handleChange}
      />
      {preview && <img src={preview} alt="Preview" width={120} className="mt-2" />}

      <button type="submit">{uploading ? "Uploading..." : "Register Partner"}</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default PartnerForm;
