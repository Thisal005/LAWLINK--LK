import React, { useState, useContext } from "react";
import { AppContext } from "../Context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import "../css/newPassword.css";

function Newpassword() {
  const navigate = useNavigate();
  const { backendUrl, email } = useContext(AppContext);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);

  const isPasswordStrong = (password) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    try {
      if (!email) {
        toast.error("Email is not available. Please start the reset process again.");
        navigate('/email-reset-password');
        return;
      }

      let hasError = false;

      if (!isPasswordStrong(password)) {
        setPasswordError(
          "Password must be at least 8 characters long, including uppercase, lowercase, numbers, and symbols."
        );
        hasError = true;
      } else {
        setPasswordError(null);
      }

      if (password !== confirmPassword) {
        setConfirmPasswordError("Passwords do not match. Please try again.");
        hasError = true;
      } else {
        setConfirmPasswordError(null);
      }

      if (hasError) return;

      const response = await axios.post(`${backendUrl}/api/auth/new-password`, {
        email: email,
        newPassword: password
      });

      if (response.status === 200) {
        toast.success("Password reset successfully!");
        navigate("/login");
      } else {
        toast.error(response.data.msg || "An error occurred. Please try again.");
      }
    } catch (err) {
      console.error("Error during password reset:", err);
      toast.error(err.response?.data?.msg || "Failed to reset password.");
    }
  };

  return (
    <div className="new-password-main-container">
      <div className="form-container">
        <h1>Create New Password</h1>
        <div className="line"></div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Password</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <img src="images/close.png" alt="Hide password" />
                ) : (
                  <img src="images/open.png" alt="Show password" />
                )}
              </button>
            </div>
            {passwordError && <p className="error">{passwordError}</p>}

            <label>Confirm Password</label>
            <div className="password-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? (
                  <img src="images/close.png" alt="Hide password" />
                ) : (
                  <img src="images/open.png" alt="Show password" />
                )}
              </button>
            </div>
            {confirmPasswordError && <p className="error">{confirmPasswordError}</p>}
          </div>

          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Newpassword;