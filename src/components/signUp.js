import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUpUser } from "../api/api.js"; 
import '../styles/signUp.css';

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [appName, setAppName] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password || !email || !appName) {
      setError("Please fill in all fields.");
      return;
    }

    const response = await signUpUser(username, password, email, appName);

    if (response.success) {
      setIsSuccess(true);
      setError("");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } else {
      setError(response.error || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="signup">
      <h2>Sign Up Page</h2>
      <form onSubmit={handleSubmit}>
        <div className="signup-username"> 
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="signup-password">
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <div className="signup-email">
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="signup-appname">
          <label htmlFor="appName">App Name: </label>
          <input
            type="text"
            id="appName"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            placeholder="Enter your app name"
            required
          />
        </div>
        <div className="signup-success-error">
          {error && <p>{error}</p>}
          {isSuccess && <p>Signup successful! Redirecting...</p>}
        </div>
        <div className="signup-submit">
        <button type="submit">Sign Up</button>
        </div>
      </form>

      <div className="signup-login">
        <Link to="/login">Return to Login</Link>
      </div>
    </div>
  );
};

export default SignUp;
