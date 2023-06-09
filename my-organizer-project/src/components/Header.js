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
        // go back to the login page
        window.location.href = "/login";
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
    <header className="bg-gray-800">
      <nav className="container mx-auto flex justify-between items-center p-4">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 text-white text-3xl">
          <img src="/images/favicon.ico" alt="MyOrganizer Logo" className="h-10 w-10" />
          <p>MyOrganizer</p>
        </Link>

        {user ? ( // Check if the user is logged in
          <div className="flex items-center gap-6">
            <p className="text-white">{username}</p> {/* Display the user's name */}
            <button className="text-gray-300 hover:text-white" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        ) : (
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
        )}
      </nav>
    </header>
  );
}
