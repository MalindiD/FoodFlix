import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  getIdToken
} from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import api from "../../api/axios";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [name, setName] = useState("");

  // ✅ Send new user to backend with Firebase token
  const sendUserToBackend = async (user, token, provider = "email") => {
    const userData = {
        name, 
        email: user.email,
        role: "customer",
        address: "N/A",
        phone: "N/A",
        provider
      };
      

    await api.post("/auth/firebase-register", userData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      withCredentials: true
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const token = await getIdToken(userCred.user);
      await sendUserToBackend(userCred.user, token, "email");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await getIdToken(result.user);
      await sendUserToBackend(result.user, token, "google");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Create your FoodFlix account
        </h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
            
<input
  type="text"
  placeholder="Full Name"
  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#ec5834]"
  value={name}
  onChange={(e) => setName(e.target.value)}
  required
/>
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#ec5834]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#ec5834]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-[#ec5834] text-white font-semibold py-2 rounded-lg hover:bg-[#d94c2d]"
          >
            Sign Up
          </button>
        </form>

        <div className="flex items-center gap-2 my-4">
          <div className="h-px bg-gray-300 flex-1" />
          <span className="text-gray-500 text-sm">OR</span>
          <div className="h-px bg-gray-300 flex-1" />
        </div>

        <button
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-100"
        >
          <FcGoogle size={20} />
          <span className="font-medium text-gray-700">Continue with Google</span>
        </button>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#ec5834] font-medium cursor-pointer hover:underline"
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
}
