import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

// Media imports
import welcomeVideo from "../../../assets/images/gtrfe.mp4";
import logo from "../../../assets/images/logo.png";
import showPasswordIcon from "../../../assets/images/open.png";
import hidePasswordIcon from "../../../assets/images/close.png";

function ClientCreateAcc() {
  const navigate = useNavigate();
  const { backendUrl, setEmail } = useContext(AppContext);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
    document: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;

    return strength;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.contact.trim()) newErrors.contact = "Contact number is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm password is required.";
    if (!formData.document) newErrors.document = "Document is required.";

    if (formData.password && !calculatePasswordStrength(formData.password)) {
      newErrors.password = "Password must be at least 8 characters long, including uppercase, lowercase, numbers, and symbols.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
  
    try {
      let hasError = false;
  
      if (!calculatePasswordStrength(formData.password)) {
        setErrors(prev => ({
          ...prev,
          password: "Password must be at least 8 characters long, including uppercase, lowercase, numbers, and symbols."
        }));
        hasError = true;
      }
  
      if (formData.password !== formData.confirmPassword) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: "Passwords do not match. Please try again."
        }));
        hasError = true;
      }
  
      if (hasError) return;
  
      const response = await axios.post(`${backendUrl}/api/auth/signup`, {
        fullName: formData.fullName,
        email: formData.email,
        contact: formData.contact,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
  
      if (response.status === 201) {
        setEmail(formData.email);
        toast.success("Account created successfully! Please check your email for the OTP.");
        navigate("/verify-email");
      } else {
        toast.error(response.data.msg || "An error occurred. Please try again.");
      }
    } catch (err) {
      console.error("Error during signup:", err);
      toast.error("An error occurred while creating your account. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "password") {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

    <div className="grid grid-cols-1 md:grid-cols-[42%_58%] w-full max-w-[1100px] h-auto md:h-[660px] bg-white rounded-[28px] shadow-[0px_0px_1px_rgba(0,0,0,0.04),_0px_2px_6px_rgba(0,0,0,0.04),_0px_16px_24px_rgba(0,0,0,0.06)] overflow-hidden relative hover:shadow-[0px_0px_1px_rgba(0,0,0,0.08),_0px_8px_16px_rgba(0,0,0,0.08),_0px_24px_32px_rgba(0,0,0,0.12)] transition-shadow duration-300 ">
      {/* Left Section - Animation Container (Hidden on Mobile) */}
      <div className="hidden md:block bg-gradient-to-br from-[#0022fc] to-[#001cd8] p-8 flex flex-col items-center justify-between relative overflow-hidden">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold text-white mb-2 relative">Welcome to LawLink LK</h2>
          <p className="text-base text-white/90 mt-2 relative">Your One-Stop Solution for Legal Services</p>
        </div>
  
        <div className="w-full max-w-[380px] my-10 mx-auto relative z-10 group">
          <video
            src={welcomeVideo}
            autoPlay
            loop
            muted
            className="w-full h-auto rounded-[16px] shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_25px_50px_rgba(0,0,0,0.25)] cursor-pointer"
          ></video>
          <div className="absolute inset-0 bg-[#0022fc]/10 opacity-0 group-hover:opacity-100 rounded-[16px] transition-opacity duration-300 pointer-events-none"></div>
        </div>
  
        <div className="logo-container flex justify-center w-full">
          <a href="https://www.lawlinklk.com/" target="_blank" rel="noopener noreferrer" className="transition-transform duration-300 hover:scale-110 inline-block">
            <img
              className="w-[130px] h-auto mt-2 mb-8 filter brightness-0 invert opacity-90 hover:opacity-100 transition-opacity duration-300"
              src={logo}
              alt="Logo"
            />
          </a>
        </div>
      </div>
  
      {/* Right Section - Form Container */}
      <div className="form-container p-4 md:p-8 md:px-14 bg-white">
        <h1 className="text-lg md:text-[1.875rem] font-bold text-[#0022fc] mt-px tracking-tighter">Create Account</h1>
        <div className="h-[3px] bg-[#0022fc] w-20 rounded-full my-4 transition-all duration-300 hover:w-32 hover:bg-[#0015d1]"></div>
  
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Full Name Input */}
          <div className="input-group flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#81a8e8]">Full Name</label>
            <input
              className="w-full px-4 py-3 border-[2px] border-[#e5e7eb] rounded-[12px] text-sm focus:border-[#0022fc] focus:outline-none focus:ring-2 focus:ring-[#0022fc]/50 transition-all duration-200 hover:border-[#0022fc]/30"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
            {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
          </div>
  
          {/* Email and Contact Number Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="input-group flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#81a8e8]">Email</label>
              <input
                className="w-full px-4 py-3 border-[2px] border-[#e5e7eb] rounded-[12px] text-sm focus:border-[#0022fc] focus:outline-none focus:ring-2 focus:ring-[#0022fc]/50 transition-all duration-200 hover:border-[#0022fc]/30"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>
  
            <div className="input-group flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#81a8e8]">Contact Number</label>
              <input
                className="w-full px-4 py-3 border-[2px] border-[#e5e7eb] rounded-[12px] text-sm focus:border-[#0022fc] focus:outline-none focus:ring-2 focus:ring-[#0022fc]/50 transition-all duration-200 hover:border-[#0022fc]/30"
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Enter your contact number"
                required
              />
              {errors.contact && <p className="text-sm text-red-500 mt-1">{errors.contact}</p>}
            </div>
          </div>
  
          {/* Password and Confirm Password Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="input-group flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#81a8e8]">Password</label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 border-[2px] border-[#e5e7eb] rounded-[12px] text-sm focus:border-[#0022fc] focus:outline-none focus:ring-2 focus:ring-[#0022fc]/50 transition-all duration-200 pr-12 hover:border-[#0022fc]/30"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none cursor-pointer transition-transform duration-200 hover:scale-110"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <img src={showPasswordIcon} alt="Hide" className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity duration-200" />
                  ) : (
                    <img src={hidePasswordIcon} alt="Show" className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity duration-200" />
                  )}
                </button>
              </div>
            </div>
  
            <div className="input-group flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#81a8e8]">Confirm Password</label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 border-[2px] border-[#e5e7eb] rounded-[12px] text-sm focus:border-[#0022fc] focus:outline-none focus:ring-2 focus:ring-[#0022fc]/50 transition-all duration-200 pr-12 hover:border-[#0022fc]/30"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none cursor-pointer transition-transform duration-200 hover:scale-110"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <img src={showPasswordIcon} alt="Hide" className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity duration-200" />
                  ) : (
                    <img src={hidePasswordIcon} alt="Show" className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity duration-200" />
                  )}
                </button>
              </div>
            </div>
          </div>
  
          {/* Password Strength Indicator */}
          {(isPasswordFocused || formData.password) && (
            <div className="mt-3">
              <div className="text-xs text-[#005eff] font-medium text-center">
                Password Strength: {["Weak", "Fair", "Good", "Strong", "Very Strong"][passwordStrength - 1]}
              </div>
              <div className="w-full h-[10px] bg-[#e0e0e0] rounded-[3px] mt-1 overflow-hidden">
                <div
                  className="h-full transition-all duration-300 ease-in-out"
                  style={{ 
                    width: `${(passwordStrength / 5) * 100}%`, 
                    backgroundColor: getPasswordStrengthColor() 
                  }}
                ></div>
              </div>
            </div>
          )}
  
          {/* Password Match Error */}
          {formData.password !== formData.confirmPassword && formData.confirmPassword && (
            <p className="text-xs text-red-500 mt-2 text-center">Passwords do not match.</p>
          )}
  
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-6 bg-[#0022fc] text-white font-semibold rounded-[12px] hover:bg-[#001cd8] hover:-translate-y-[1px] hover:shadow-lg active:scale-95 transition-all duration-300 mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
  
        {/* Login Link */}
        <div className="mt-6 text-sm text-[#02189c] text-center">
          <p>
            Already have an account?{" "}
            <a
              href="#"
              onClick={() => navigate("/login")}
              className="text-[#007bff] font-semibold hover:underline hover:text-[#0022fc] transition-colors duration-200"
            >
              Login
            </a>
          </p>
        </div>
  
        {/* Disclaimer */}
        <p className="text-sm text-[#81a8e8] mt-6 text-center">
          By creating an account, you agree to our{" "}
          <a href="#" className="text-[#0022fc] font-semibold hover:underline hover:text-[#001cd8] transition-colors duration-200">
            Terms of Use
          </a>{" "}
          and{" "}
          <a href="#" className="text-[#0022fc] font-semibold hover:underline hover:text-[#001cd8] transition-colors duration-200">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
    </div>
  );
}

export default ClientCreateAcc;