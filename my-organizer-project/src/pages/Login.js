import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth, signInWithEmailAndPassword } from "../firebase/FirebaseConfig";

function LoginPage({ user }) {
  // * variables needed for this page
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  // * redirect to dashboard if user is logged in
  if (user) {
    window.location.href = "/dashboard";
  }

  // * toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // * handle login
  const handleSubmit = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User logged in:", user);
        setError(""); // Clear any previous error
        window.location.href = "/dashboard"; // Redirect to the dashboard page
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.error("Login error:", errorMessage);
        setError("Invalid email or password."); // Set error message
      });
  };

  // * return the login page
  return (
    <>
      {!user && (
        <div className="flex items-center justify-center">
          <div className="relative w-screen h-[calc(100vh-72px)]" style={{ backgroundImage: "url(/images/background.png)" }}>
            <div className="absolute inset-0 bg-gray-500 bg-opacity-25 backdrop-filter backdrop-blur-md flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
                <h1 className="text-3xl font-bold mb-6">Welcome back to MyOrganizer!</h1>
                <form className="w-full" onSubmit={handleSubmit}>
                  {error !== "" && (
                    <div className="flex justify-center gap-2 bg-red-200 rounded-md p-2 text-red-700 mb-4">
                      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="rgb(185 28 28 / var(--tw-text-opacity))">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                          <path d="M520.741 163.801a10.234 10.234 0 00-3.406-3.406c-4.827-2.946-11.129-1.421-14.075 3.406L80.258 856.874a10.236 10.236 0 00-1.499 5.335c0 5.655 4.585 10.24 10.24 10.24h846.004c1.882 0 3.728-.519 5.335-1.499 4.827-2.946 6.352-9.248 3.406-14.075L520.742 163.802zm43.703-26.674L987.446 830.2c17.678 28.964 8.528 66.774-20.436 84.452a61.445 61.445 0 01-32.008 8.996H88.998c-33.932 0-61.44-27.508-61.44-61.44a61.445 61.445 0 018.996-32.008l423.002-693.073c17.678-28.964 55.488-38.113 84.452-20.436a61.438 61.438 0 0120.436 20.436zM512 778.24c22.622 0 40.96-18.338 40.96-40.96s-18.338-40.96-40.96-40.96-40.96 18.338-40.96 40.96 18.338 40.96 40.96 40.96zm0-440.32c-22.622 0-40.96 18.338-40.96 40.96v225.28c0 22.622 18.338 40.96 40.96 40.96s40.96-18.338 40.96-40.96V378.88c0-22.622-18.338-40.96-40.96-40.96z"></path>
                        </g>
                      </svg>
                      {error}
                    </div>
                  )}
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className={`shadow-md hover:shadow-lg bg-slate-100 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 ${
                        error !== "" && "border-red-500"
                      }`}
                    />
                  </div>
                  <div className="mb-6 relative">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={passwordVisible ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className={`shadow-md hover:shadow-lg bg-slate-100 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10 focus:border-blue-500 ${
                          error !== "" && "border-red-500"
                        }`}
                      />
                      <button
                        type="button"
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={togglePasswordVisibility}
                      >
                        {passwordVisible ? (
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M6.30147 15.5771C4.77832 14.2684 3.6904 12.7726 3.18002 12C3.6904 11.2274 4.77832 9.73158 6.30147 8.42294C7.87402 7.07185 9.81574 6 12 6C14.1843 6 16.1261 7.07185 17.6986 8.42294C19.2218 9.73158 20.3097 11.2274 20.8201 12C20.3097 12.7726 19.2218 14.2684 17.6986 15.5771C16.1261 16.9282 14.1843 18 12 18C9.81574 18 7.87402 16.9282 6.30147 15.5771ZM12 4C9.14754 4 6.75717 5.39462 4.99812 6.90595C3.23268 8.42276 2.00757 10.1376 1.46387 10.9698C1.05306 11.5985 1.05306 12.4015 1.46387 13.0302C2.00757 13.8624 3.23268 15.5772 4.99812 17.0941C6.75717 18.6054 9.14754 20 12 20C14.8525 20 17.2429 18.6054 19.002 17.0941C20.7674 15.5772 21.9925 13.8624 22.5362 13.0302C22.947 12.4015 22.947 11.5985 22.5362 10.9698C21.9925 10.1376 20.7674 8.42276 19.002 6.90595C17.2429 5.39462 14.8525 4 12 4ZM10 12C10 10.8954 10.8955 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8955 14 10 13.1046 10 12ZM12 8C9.7909 8 8.00004 9.79086 8.00004 12C8.00004 14.2091 9.7909 16 12 16C14.2092 16 16 14.2091 16 12C16 9.79086 14.2092 8 12 8Z"
                                fill="#000000"
                              ></path>
                            </g>
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M19.7071 5.70711C20.0976 5.31658 20.0976 4.68342 19.7071 4.29289C19.3166 3.90237 18.6834 3.90237 18.2929 4.29289L14.032 8.55382C13.4365 8.20193 12.7418 8 12 8C9.79086 8 8 9.79086 8 12C8 12.7418 8.20193 13.4365 8.55382 14.032L4.29289 18.2929C3.90237 18.6834 3.90237 19.3166 4.29289 19.7071C4.68342 20.0976 5.31658 20.0976 5.70711 19.7071L9.96803 15.4462C10.5635 15.7981 11.2582 16 12 16C14.2091 16 16 14.2091 16 12C16 11.2582 15.7981 10.5635 15.4462 9.96803L19.7071 5.70711ZM12.518 10.0677C12.3528 10.0236 12.1792 10 12 10C10.8954 10 10 10.8954 10 12C10 12.1792 10.0236 12.3528 10.0677 12.518L12.518 10.0677ZM11.482 13.9323L13.9323 11.482C13.9764 11.6472 14 11.8208 14 12C14 13.1046 13.1046 14 12 14C11.8208 14 11.6472 13.9764 11.482 13.9323ZM15.7651 4.8207C14.6287 4.32049 13.3675 4 12 4C9.14754 4 6.75717 5.39462 4.99812 6.90595C3.23268 8.42276 2.00757 10.1376 1.46387 10.9698C1.05306 11.5985 1.05306 12.4015 1.46387 13.0302C1.92276 13.7326 2.86706 15.0637 4.21194 16.3739L5.62626 14.9596C4.4555 13.8229 3.61144 12.6531 3.18002 12C3.6904 11.2274 4.77832 9.73158 6.30147 8.42294C7.87402 7.07185 9.81574 6 12 6C12.7719 6 13.5135 6.13385 14.2193 6.36658L15.7651 4.8207ZM12 18C11.2282 18 10.4866 17.8661 9.78083 17.6334L8.23496 19.1793C9.37136 19.6795 10.6326 20 12 20C14.8525 20 17.2429 18.6054 19.002 17.0941C20.7674 15.5772 21.9925 13.8624 22.5362 13.0302C22.947 12.4015 22.947 11.5985 22.5362 10.9698C22.0773 10.2674 21.133 8.93627 19.7881 7.62611L18.3738 9.04043C19.5446 10.1771 20.3887 11.3469 20.8201 12C20.3097 12.7726 19.2218 14.2684 17.6986 15.5771C16.1261 16.9282 14.1843 18 12 18Z"
                                fill="#000000"
                              ></path>
                            </g>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <button className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded transition-colors duration-300">Login</button>
                    <Link to="/signup" className="text-gray-700 hover:underline">
                      Don't have an account? Signup
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LoginPage;
