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

  // * set the user when the Firebase authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // * the root page UI of MyOrganizer
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
            {/* default route is dashboard (logged in) / home page (not logged in) */}
            {user ? (
              <Route key="default-authenticated" path="/" element={<DashboardPage user={user} />} />
            ) : (
              <Route key="default-unauthenticated" path="/" element={<HomePage />} />
            )}

            {/* dashboard route is dashboard (logged in) / login page (not logged in) */}
            {user ? (
              <Route key="dashboard-authenticated" path="/dashboard" element={<DashboardPage user={user} />} />
            ) : (
              <Route key="dashboard-unauthenticated" path="/dashboard" element={<LoginPage user={user} />} />
            )}

            {/* other routes that  won't change */}
            <Route key="login" path="/login" element={<LoginPage user={user} />} />
            <Route key="signup" path="/signup" element={<SignupPage user={user} />} />
            <Route key="not-found" path="*" element={<NotFoundPage />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
