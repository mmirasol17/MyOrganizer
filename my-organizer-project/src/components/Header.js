import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { auth, db, doc, getDoc, signOut } from "../firebase/FirebaseConfig";

export default function Header({ user }) {
  // * variables needed for this header
  const [username, setUsername] = useState("");

  // * handle sign out
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("Sign-out successful.");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  // * try to get the user's username every time the user changes
  useEffect(() => {
    if (user) {
      const getUserDoc = async () => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          setUsername(docSnap.data().username);
        } else {
          console.log("No such document!");
        }
      };
      getUserDoc();
    }
  }, [user]);

  return (
    <header className="bg-gray-800 h-18">
      <nav className="container mx-auto flex justify-between items-center p-4">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 text-white text-3xl">
          <img src="/images/favicon.ico" alt="MyOrganizer Logo" className="h-10 w-10" />
          <p>MyOrganizer</p>
        </Link>

        {user ? ( // Check if the user is logged in
          <div className="flex items-center gap-5">
            <p className="text-white">{username}</p> {/* Display the user's name */}
            <button className="text-gray-300 hover:text-white" onClick={handleSignOut}>
              Sign Out
            </button>
            <Link to="/how-it-works" className="h-7 w-7">
              <svg
                className="fill-gray-300 hover:fill-white"
                fill="#d1d5db"
                viewBox="-1.92 -1.92 35.84 35.84"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#d1d5db"
                strokeWidth="0"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M16 0c-8.836 0-16 7.163-16 16s7.163 16 16 16c8.837 0 16.001-7.163 16.001-16s-7.163-16-16.001-16zM16 30.032c-7.72 0-14-6.312-14-14.032s6.28-14 14-14 14.001 6.28 14.001 14-6.281 14.032-14.001 14.032zM14.53 25.015h2.516v-2.539h-2.516zM15.97 6.985c-1.465 0-2.672 0.395-3.62 1.184s-1.409 2.37-1.386 3.68l0.037 0.073h2.295c0-0.781 0.261-1.904 0.781-2.308s1.152-0.604 1.893-0.604c0.854 0 1.511 0.232 1.971 0.696s0.689 1.127 0.689 1.989c0 0.725-0.17 1.343-0.512 1.855-0.343 0.512-0.916 1.245-1.721 2.198-0.831 0.749-1.344 1.351-1.538 1.806s-0.297 1.274-0.305 2.454h2.405c0-0.74 0.047-1.285 0.14-1.636s0.36-0.744 0.799-1.184c0.945-0.911 1.703-1.802 2.277-2.674 0.573-0.87 0.86-1.831 0.86-2.881 0-1.465-0.443-2.607-1.331-3.424s-2.134-1.226-3.736-1.226z"></path>
                </g>
              </svg>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/" className="text-gray-300 hover:text-white ml-4">
              Home
            </Link>

            <Link to="/login" className="text-gray-300 hover:text-white ml-4">
              Login
            </Link>

            <Link to="/signup" className="text-gray-300 hover:text-white ml-4">
              Signup
            </Link>

            <Link to="/how-it-works" className="h-7 w-7 ml-2">
              <svg
                className="fill-gray-300 hover:fill-white"
                fill="#d1d5db"
                viewBox="-1.92 -1.92 35.84 35.84"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#d1d5db"
                strokeWidth="0"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M16 0c-8.836 0-16 7.163-16 16s7.163 16 16 16c8.837 0 16.001-7.163 16.001-16s-7.163-16-16.001-16zM16 30.032c-7.72 0-14-6.312-14-14.032s6.28-14 14-14 14.001 6.28 14.001 14-6.281 14.032-14.001 14.032zM14.53 25.015h2.516v-2.539h-2.516zM15.97 6.985c-1.465 0-2.672 0.395-3.62 1.184s-1.409 2.37-1.386 3.68l0.037 0.073h2.295c0-0.781 0.261-1.904 0.781-2.308s1.152-0.604 1.893-0.604c0.854 0 1.511 0.232 1.971 0.696s0.689 1.127 0.689 1.989c0 0.725-0.17 1.343-0.512 1.855-0.343 0.512-0.916 1.245-1.721 2.198-0.831 0.749-1.344 1.351-1.538 1.806s-0.297 1.274-0.305 2.454h2.405c0-0.74 0.047-1.285 0.14-1.636s0.36-0.744 0.799-1.184c0.945-0.911 1.703-1.802 2.277-2.674 0.573-0.87 0.86-1.831 0.86-2.881 0-1.465-0.443-2.607-1.331-3.424s-2.134-1.226-3.736-1.226z"></path>
                </g>
              </svg>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
