import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-gray-800">
      <nav className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <img src="/images/favicon.ico" alt="MyOrganizer Logo" className="h-10 w-10" />
          <Link to="/" className="text-white text-3xl">
            MyOrganizer
          </Link>
        </div>
        <ul className="flex items-center">
          <li>
            <Link to="/" className="text-gray-300 hover:text-white ml-4">
              Home
            </Link>
          </li>
          <li>
            <Link to="/login" className="text-gray-300 hover:text-white ml-4">
              Login
            </Link>
          </li>
          <li>
            <Link to="/signup" className="text-gray-300 hover:text-white ml-4">
              Signup
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
