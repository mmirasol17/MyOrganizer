import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <>
      <div className="flex items-center justify-center">
        <div className="relative w-screen h-[calc(100vh-72px)]" style={{ backgroundImage: "url(/images/background.png)" }}>
          <div className="absolute inset-0 bg-gray-500 bg-opacity-25 backdrop-filter backdrop-blur-md flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-10 flex flex-col items-center w-2/5">
              <h1 className="text-3xl font-bold mb-4">Welcome to MyOrganizer!</h1>
              <p className="text-gray-600 text-center">
                MyOrganizer is a simple app to help you organize your life, whether it comes to your tasks, budget, or schedule.
              </p>
              <div className="mt-6 space-x-4">
                <Link to="/signup" className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300">
                  Get Started
                </Link>
                <Link to="/how-it-works" className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300">
                  How it Works
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
