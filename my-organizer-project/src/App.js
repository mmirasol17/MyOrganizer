import React, { useEffect, useState } from "react";

import { auth } from "./firebase/FirebaseConfig";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";
import SignupPage from "./pages/Signup";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NotFoundPage from "./pages/NotFound";
import DashboardPage from "./pages/Dashboard";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is logged in
        console.log(user);
        setUser(user);
      } else {
        // User is logged out
        console.log("User is logged out" + user);
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Header user={user} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {user ? <Route path="/dashboard" element={<DashboardPage user={user} />} /> : <Route path="/dashboard" element={<LoginPage />} />}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
