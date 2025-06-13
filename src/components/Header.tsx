import React from "react";
import { useNavigate } from "react-router-dom";
import { HomeIcon } from "@heroicons/react/24/outline";

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-lg">
                <HomeIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900 font-sans">
                Purple<span className="text-purple-600">Pg</span>
              </span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="text-gray-600 hover:text-purple-600 px-4 py-2 rounded-lg font-medium transition-colors duration-200 hover:bg-purple-50 font-sans"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white px-6 py-2.5 rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 font-sans text-sm h-10 flex items-center justify-center"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
