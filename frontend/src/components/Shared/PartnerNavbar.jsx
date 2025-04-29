import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

const PartnerNavbar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login-partner");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/partner-dashboard" className="text-2xl font-bold text-[#ec5834]">
          FoodFlix Partner
        </Link>

        {/* Links */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogout}
            className="bg-[#ec5834] text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default PartnerNavbar;
