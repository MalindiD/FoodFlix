import React, { useState } from "react";
import axios from "axios";
import { uploadImage } from "../api"; // Cloudinary helper
import './style.css';

const PartnerForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "", // Added email field
    phone: "",
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
          vehicleType: "",
          address: "",
          currentLocation: { lat: "", lng: "" },
          profileImage: null,
        });
        setPreview(null); // Reset preview

        // Optionally trigger parent callback if provided
        if (onRegister) onRegister();
      }
    } catch (err) {
      console.error("❌ Registration failed:", err.response?.data || err.message);
      setError("❌ Registration failed. Please check your inputs.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <h2 className="form-title">Register Delivery Partner</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="partner-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Vehicle Type</label>
            <select
              name="vehicleType"
              required
              value={formData.vehicleType}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Bike">Bike</option>
              <option value="Car">Car</option>
              <option value="Scooter">Scooter</option>
            </select>
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Latitude</label>
            <input
              type="text"
              name="lat"
              required
              value={formData.currentLocation.lat}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Longitude</label>
            <input
              type="text"
              name="lng"
              required
              value={formData.currentLocation.lng}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Profile Image</label>
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleChange}
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover mt-2 rounded"
              />
            )}
          </div>
          <button type="submit" className="submit-button" disabled={uploading}>
            {uploading ? "Uploading..." : "Register Partner"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PartnerForm;
