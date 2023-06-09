import React from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-screen h-screen" style={{ backgroundImage: "url(/images/background.png)" }}>
        <div className="absolute inset-0 bg-gray-500 bg-opacity-25 backdrop-filter backdrop-blur-md flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center w-1/3">
            <svg
              fill="#000000"
              height="100px"
              width="100px"
              version="1.1"
              id="Filled_Icons"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 24 24"
              enableBackground="new 0 0 24 24"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <g id="Status-Error-Filled">
                  <path d="M12,0C5.37,0,0,5.37,0,12s5.37,12,12,12s12-5.37,12-12S18.63,0,12,0z M18.38,16.62l-1.77,1.77L12,13.77l-4.62,4.62 l-1.77-1.77L10.23,12L5.62,7.38l1.77-1.77L12,10.23l4.62-4.62l1.77,1.77L13.77,12L18.38,16.62z"></path>{" "}
                </g>
              </g>
            </svg>
            <h1 className="text-3xl font-bold m-4">404 Page Not Found</h1>
            <p className="text-gray-600 text-center">Oops! The page you are looking for does not exist.</p>
            <Link to="/" className="mt-6 bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
