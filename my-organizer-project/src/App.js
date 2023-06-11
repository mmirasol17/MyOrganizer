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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        console.log("User is logged out" + user);
        setUser(null);
      }
      setIsLoading(false); // Set isLoading to false when authentication is complete
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Header user={user} />
      {isLoading ? (
        // Show loading screen while waiting for authentication
        <div>Loading...</div>
      ) : (
        // Render content after authentication is complete
        <Routes>
          {user ? <Route path="/" element={<DashboardPage />} /> : <Route path="/" element={<HomePage />} />}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          {user ? <Route path="/dashboard" element={<DashboardPage user={user} />} /> : <Route path="/dashboard" element={<LoginPage />} />}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      )}
      <Footer />
    </Router>
  );
}

export default App;
