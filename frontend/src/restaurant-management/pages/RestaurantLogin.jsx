import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const RestaurantLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/restaurantlogin",
        {
          email,
          password
        }
      );

      const token = res.data.token;
      const restaurant = res.data.restaurant;

      // ✅ Use sessionStorage for full tab/window isolation
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("restaurant", JSON.stringify(restaurant));

      alert("Login successful!");
      navigate("/restaurant-management/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Restaurant Login</h2>
      <form onSubmit={handleLogin} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600">
          Login
        </button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* 🔗 Register link */}
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link
          to="/restaurant-management/register"
          className="text-orange-600 hover:underline font-medium"
        >
          Register here
        </Link>
      </p>
    </div>
  );
};

export default RestaurantLogin;
