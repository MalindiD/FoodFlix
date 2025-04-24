import React, { useState } from "react";
import axios from "axios";
import { uploadImage } from "../api"; // ✅ Cloudinary helper

const PartnerForm = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    vehicleType: "",
    address: "",
    currentLocation: { lat: "", lng: "" },
    profileImage: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "lat" || name === "lng") {
      setFormData((prev) => ({
        ...prev,
        currentLocation: { ...prev.currentLocation, [name]: value },
      }));
    } else if (name === "profileImage" && files[0]) {
      const file = files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = formData.profileImage;

      // ✅ Upload to Cloudinary if a new file was selected
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
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

      // ✅ Get token and attach to Authorization header
      const token = sessionStorage.getItem("token");

      await axios.post("http://localhost:5003/api/partners/register", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      alert("✅ Partner registered successfully!");
      setFormData({
        name: "",
        phone: "",
        vehicleType: "",
        address: "",
        profileImage: "",
        currentLocation: { lat: "", lng: "" },
      });
      setSelectedFile(null);
      setPreview(null);

      if (onRegister) onRegister(); // optional callback
    } catch (err) {
      console.error("❌ Registration failed:", err.response?.data || err.message);
      alert("❌ Registration failed. See console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <h2 className="form-title">Register Delivery Partner</h2>
        <form onSubmit={handleSubmit} className="partner-form">
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="text" name="phone" required value={formData.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Vehicle Type</label>
            <select name="vehicleType" required value={formData.vehicleType} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Bike">Bike</option>
              <option value="Car">Car</option>
              <option value="Scooter">Scooter</option>
            </select>
          </div>
          <div className="form-group">
            <label>Address</label>
            <input type="text" name="address" required value={formData.address} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Latitude</label>
            <input type="text" name="lat" required value={formData.currentLocation.lat} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Longitude</label>
            <input type="text" name="lng" required value={formData.currentLocation.lng} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Profile Image</label>
            <input type="file" name="profileImage" accept="image/*" onChange={handleChange} />
            {preview && (
              <img src={preview} alt="Preview" className="w-32 h-32 object-cover mt-2 rounded" />
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
