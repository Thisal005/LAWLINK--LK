import React, { useState, useContext } from "react";
import { AppContext } from "../../../Context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import showPasswordIcon from "../../../assets/images/open.png";
import hidePasswordIcon from "../../../assets/images/close.png";


function Newpassword() {
  const navigate = useNavigate();
  const { backendUrl, email } = useContext(AppContext);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;

    return strength;
  };

  // Add missing isPasswordStrong function
  const isPasswordStrong = (password) => {
    return calculatePasswordStrength(password) >= 4;
  };

  // Update password strength when password changes
  React.useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password));
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    try {
      if (!email) {
        toast.error("Email is not available. Please start the reset process again.");
        navigate('/lawyer-email-reset-password');
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

      const response = await axios.post(`${backendUrl}/api/lawyer/new-password`, {
        email: email,
        newPassword: password
      });

      if (response.status === 200) {
        toast.success("Password reset successfully!");
        navigate("/lawyer-login");
      }
    } catch (err) {
      console.error("Error during password reset:", err);
      toast.error(err.response?.data?.msg || "Failed to reset password.");
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "red";
      case 2:
      case 3:
        return "orange";
      case 4:
      case 5:
        return "green";
      default:
        return "red";
    }
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "";
    const strengthTexts = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
    return strengthTexts[passwordStrength - 1];
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div className="w-full max-w-[500px] bg-white rounded-[20px] shadow-[0_8px_25px_rgba(0,0,0,0.1)] p-8 animate-float">
      <h1 className="text-2xl font-bold text-[#0026ff] text-center mb-4">Create New Password</h1>
      <div className="h-[3px] bg-[#3652fc] w-40 mx-auto rounded-full mb-6"></div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Password Input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#02189c]">Password</label>
          <div className="relative">
            <input
              className="w-full px-4 py-3 border-2 border-[#e5e7eb] rounded-[12px] text-sm focus:border-[#3652fc] focus:outline-none focus:ring-2 focus:ring-[#3652fc]/50 transition-all duration-200"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <img src={hidePasswordIcon} alt="Hide password" className="w-5 h-5" />
              ) : (
                <img src={showPasswordIcon} alt="Show password" className="w-5 h-5" />
              )}
            </button>
          </div>
          {passwordError && <p className="text-sm text-red-500 mt-1">{passwordError}</p>}
        </div>

        {/* Confirm Password Input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#02189c]">Confirm Password</label>
          <div className="relative">
            <input
              className="w-full px-4 py-3 border-2 border-[#e5e7eb] rounded-[12px] text-sm focus:border-[#3652fc] focus:outline-none focus:ring-2 focus:ring-[#3652fc]/50 transition-all duration-200"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none cursor-pointer"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? (
                <img src={hidePasswordIcon} alt="Hide password" className="w-5 h-5" />
              ) : (
                <img src={showPasswordIcon} alt="Show password" className="w-5 h-5" />
              )}
            </button>
          </div>
          {confirmPasswordError && <p className="text-sm text-red-500 mt-1">{confirmPasswordError}</p>}
        </div>

        {/* Password Strength Indicator */}
        {password && (
          <div className="space-y-2">
            <div className="text-sm text-[#005eff] font-medium text-center">
              Password Strength: {getPasswordStrengthText()}
            </div>
            <div className="w-full h-[10px] bg-[#e0e0e0] rounded-[3px] overflow-hidden">
              <div
                className="h-full transition-all duration-300 ease-in-out"
                style={{ width: `${(passwordStrength / 5) * 100}%`, backgroundColor: getPasswordStrengthColor() }}
              ></div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 px-6 bg-[#0026ff] text-white font-semibold rounded-[12px] hover:bg-[#3452fe] hover:-translate-y-[1px] active:scale-95 transition-all duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  </div>
);
}


export default Newpassword;