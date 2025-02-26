import { AuthContext, AuthContextProps } from "@/Provider/AuthProvider";
import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useContext(AuthContext) as AuthContextProps;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 fixed w-full z-20 top-0 start-0 shadow-lg">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <NavLink
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <svg
            className="w-8 h-8 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.91c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
          </svg>
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
            MFS Wallet
          </span>
        </NavLink>

        <div className="flex md:order-2 items-center">
          {user ? (
            <div className="flex items-center space-x-4">
              <NavLink
                to="/dashboard"
                className="text-white hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                Dashboard
              </NavLink>
              <div className="hidden md:block text-white bg-blue-700 px-4 py-2 rounded-lg">
                {user.email}
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <NavLink
                to="/"
                className="text-white hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors hidden md:block"
              >
                Home
              </NavLink>
              <NavLink
                to="/register"
                className="bg-white text-blue-700 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Register
              </NavLink>
            </div>
          )}
          <button
            onClick={toggleMenu}
            className="md:hidden ml-4 text-white hover:bg-blue-700 p-2 rounded-lg"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-16 6h16"
              />
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="w-full md:hidden mt-4">
            <div className="flex flex-col space-y-2 bg-blue-700 rounded-lg p-4">
              <NavLink
                to="/"
                className="text-white hover:bg-blue-600 px-4 py-2 rounded"
              >
                Home
              </NavLink>
              {user && <div className="text-white px-4 py-2">{user.email}</div>}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
