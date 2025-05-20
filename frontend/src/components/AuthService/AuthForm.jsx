import React, { useState } from "react";
import axios from "axios";
import "./AuthForm.css"; // optional for extra styling

const AuthForm = ({ title, submitLabel, apiEndpoint, isRegister }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(apiEndpoint, formData);
      alert("Success ✅");
      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Error ❌ " + err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-form-container" style={{ maxWidth: 400, margin: "auto", background: "#ffffff", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <h2 style={{ color: "#ec5834", textAlign: "center", marginBottom: "1.5rem" }}>{title}</h2>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <>
            <input name="name" placeholder="Full Name" onChange={handleChange} className="auth-input" />
            <select name="role" onChange={handleChange} className="auth-input">
              <option value="customer">Customer</option>
              <option value="restaurant">Restaurant</option>
              <option value="delivery">Delivery</option>
            </select>
          </>
        )}
        <input name="email" placeholder="Email" type="email" onChange={handleChange} className="auth-input" />
        <input name="password" placeholder="Password" type="password" onChange={handleChange} className="auth-input" />
        <button type="submit" className="auth-button">{submitLabel}</button>
      </form>
    </div>
  );
};

export default AuthForm;
