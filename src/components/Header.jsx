import React from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="bg-blue-600 text-white py-4 shadow-md fixed top-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Title */}
        <h1 className="text-2xl font-bold">E-Commerce Sentiment Analysis</h1>

        {/* Icons */}
        <div className="flex items-center gap-6">
          {/* User Profile Icon */}
          <FaUserCircle className="text-3xl cursor-pointer hover:text-gray-300" title="Profile" />
          
          {/* Logout Icon */}
          <FaSignOutAlt
            className="text-3xl cursor-pointer hover:text-gray-300"
            title="Logout"
            onClick={handleLogout}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
