import React, { useState } from "react";
import axios from "axios";
import { uploadImage } from "../api"; // Cloudinary helper

const PartnerForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    vehicleType: "",
    address: "",
    currentLocation: { lat: "", lng: "" },
    profileImage: null,
  });

  const [preview, setPreview] = useState(null);

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

    try {
      let imageUrl = "";

      if (formData.profileImage) {
        imageUrl = await uploadImage(formData.profileImage);
      }

      const payload = {
        name: formData.name,
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

      await axios.post("http://localhost:5003/api/partners/register", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Partner registered successfully!");

      setFormData({
        name: "",
        phone: "",
        vehicleType: "",
        address: "",
        currentLocation: { lat: "", lng: "" },
        profileImage: null,
      });
      setPreview(null);
    } catch (err) {
      console.error("❌ Registration failed:", err.response?.data || err.message);
      alert("❌ Registration failed!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input name="name" placeholder="Name" onChange={handleChange} required />
      <input name="phone" placeholder="Phone" onChange={handleChange} required />
      <select name="vehicleType" onChange={handleChange} required>
        <option value="">Select Vehicle Type</option>
        <option value="Bike">Bike</option>
        <option value="Car">Car</option>
        <option value="Scooter">Scooter</option>
      </select>
      <input name="address" placeholder="Address" onChange={handleChange} required />
      <input name="lat" placeholder="Latitude" onChange={handleChange} required />
      <input name="lng" placeholder="Longitude" onChange={handleChange} required />

      <input
        type="file"
        name="profileImage"
        accept="image/*"
        onChange={handleChange}
      />
      {preview && <img src={preview} alt="Preview" width={120} className="mt-2" />}

      <button type="submit">Register Partner</button>
    </form>
  );
};

export default PartnerForm;
