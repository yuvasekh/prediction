import React, { useState } from "react";
import { FaUserCircle, FaSignOutAlt, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const userId = JSON.parse(localStorage.getItem("user"))?.userId;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="bg-blue-600 text-white py-4 shadow-md fixed top-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Title */}
        <h1 className="text-2xl font-bold">E-Commerce Sentiment Analysis</h1>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-3xl" onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars />
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {/* Profile Dropdown */}
          <div className="relative">
            <FaUserCircle
              className="text-3xl cursor-pointer hover:text-gray-300"
              title="Profile"
              onClick={() => setShowDropdown(!showDropdown)}
            />

            {showDropdown && (
              <div className="absolute right-0 top-10 bg-white text-black shadow-md p-2 rounded-md w-40 z-50">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                  onClick={() => navigate(`/profile/${userId}`)}
                >
                  Profile
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                  onClick={() => navigate(`/reviews/${userId}`)}
                >
                  Review History
                </button>
              </div>
            )}
          </div>

          {/* Logout Icon */}
          <FaSignOutAlt
            className="text-3xl cursor-pointer hover:text-gray-300"
            title="Logout"
            onClick={handleLogout}
          />
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-700 p-4 text-center">
          <button
            className="block w-full py-2 text-white hover:bg-blue-800 rounded"
            onClick={() => navigate(`/profile/${userId}`)}
          >
            Profile
          </button>
          <button
            className="block w-full py-2 text-white hover:bg-blue-800 rounded"
            onClick={() => navigate(`/reviews/${userId}`)}
          >
            Review History
          </button>
          <button
            className="block w-full py-2 text-white hover:bg-red-600 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
