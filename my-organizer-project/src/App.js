// React components required
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Firebase components required
import { auth } from "./firebase/FirebaseConfig";

// Pages required
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";
import SignupPage from "./pages/Signup";
import Header from "./components/ui/Header";
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
      <div className="min-h-screen">
        <Header user={user} />
        {isLoading ? (
          // Show loading screen while waiting for authentication
          <div className="flex items-center justify-center">
            <div className="relative w-screen flex items-center justify-center bg-slate-200 h-[calc(100vh-72px)]">
              <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          </div>
        ) : (
          // Render content after authentication is complete
          <Routes>
            {/* default route -> dashboard if logged in, is -> home if not */}
            {user ? (
              <Route id="default-authenticated" path="/" element={<DashboardPage user={user} />} />
            ) : (
              <Route id="default-unauthenticated" path="/" element={<HomePage />} />
            )}

            {/* dashboard route shows the page if logged in, show login page if not */}
            {user ? (
              <Route id="dashboard-authenticated" path="/dashboard" element={<DashboardPage user={user} />} />
            ) : (
              <Route id="dashboard-unauthenticated" path="/dashboard" element={<LoginPage user={user} />} />
            )}

            {/* other routesthat  won't change */}
            <Route id="login" path="/login" element={<LoginPage user={user} />} />
            <Route id="signup" path="/signup" element={<SignupPage user={user} />} />
            <Route id="not-found" path="*" element={<NotFoundPage />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
