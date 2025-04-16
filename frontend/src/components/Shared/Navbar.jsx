// src/components/Shared/Navbar.jsx
import React, { useContext, useState, useEffect } from "react";
import {
  Menu,
  Search,
  ShoppingBag,
  MapPin,
  User,
  Heart,
  Wallet,
  HelpCircle,
  Gift,
  LogOut,
  Bookmark,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import LocationPickerModal from "./LocationPickerModal";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location, setLocation] = useState("141/6 Vauxhall St");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) setLocation(savedLocation);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Top Navbar */}
      <header className="bg-white shadow-md px-4 py-2 flex items-center justify-between sticky top-0 z-50">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6 text-[#ec5834]" />
          </button>
          <h1 className="text-xl font-bold text-[#ec5834]">FoodFlix</h1>
        </div>

        {/* Center */}
        <div className="flex items-center gap-4">
          <div
            className="hidden md:flex items-center gap-1 text-sm text-gray-600 cursor-pointer"
            onClick={() => setModalOpen(true)}
          >
            <MapPin className="h-4 w-4" />
            <span>{location} • Now ▼</span>
          </div>
          <div className="bg-gray-100 px-3 py-1 rounded-full flex items-center text-sm text-gray-600 w-48 sm:w-64">
            <Search className="h-4 w-4 mr-2 text-gray-500" />
            <input
              type="text"
              placeholder="Search FoodFlix"
              className="bg-transparent outline-none w-full"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4 text-sm">
          <div className="relative">
            <ShoppingBag className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full px-1">
              0
            </span>
          </div>
          {user ? (
            <button
              onClick={handleLogout}
              className="text-[#ec5834] hover:underline font-medium"
            >
              Logout
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="text-gray-700 hover:text-[#ec5834]"
              >
                Log in
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-gray-100 px-4 py-1 rounded-full font-medium text-gray-700 hover:text-[#ec5834]"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </header>

      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={(newLoc) => {
          setLocation(newLoc);
          localStorage.setItem("userLocation", newLoc);
        }}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 flex flex-col h-full">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2">
                <User className="h-6 w-6 text-gray-600" />
                <span className="text-lg font-semibold text-gray-900">
                  {user?.name || "Guest"}
                </span>
              </div>
              <p className="text-sm text-green-600 font-medium ml-7 mt-1">
                Manage account
              </p>
            </div>
            <button
              className="text-gray-500 text-xl font-bold hover:text-black"
              onClick={() => setSidebarOpen(false)}
            >
              ×
            </button>
          </div>

          {/* Menu Items */}
          <ul className="space-y-5 text-gray-800 text-[15px] font-medium">
            <li className="flex items-center gap-3 hover:text-[#ec5834] cursor-pointer">
              <Bookmark className="h-5 w-5" /> Orders
            </li>
            <li className="flex items-center gap-3 hover:text-[#ec5834] cursor-pointer">
              <Heart className="h-5 w-5" /> Favorites
            </li>
            <li className="flex items-center gap-3 hover:text-[#ec5834] cursor-pointer">
              <Wallet className="h-5 w-5" /> Wallet
            </li>
            <li className="flex items-center gap-3 hover:text-[#ec5834] cursor-pointer">
              <HelpCircle className="h-5 w-5" /> Help
            </li>
            <li className="flex items-center gap-3 hover:text-[#ec5834] cursor-pointer">
              <Gift className="h-5 w-5" /> Invite Friends
            </li>
          </ul>

          {/* Signout */}
          <div className="border-t my-6 pt-4">
            <div
              onClick={handleLogout}
              className="flex items-center gap-3 text-gray-800 hover:text-red-500 cursor-pointer"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-[15px] font-medium">Sign out</span>
            </div>
          </div>

          {/* Business Links */}
          <div className="border-t pt-4 text-[15px] space-y-3 text-gray-800 font-medium">
            <p className="hover:text-[#ec5834] cursor-pointer">
              Create a business account
            </p>
            <p className="hover:text-[#ec5834] cursor-pointer">
              Add your restaurant
            </p>
            <p className="hover:text-[#ec5834] cursor-pointer">
              Sign up to deliver
            </p>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
