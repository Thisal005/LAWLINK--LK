import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";


function LawyerCreateAcc() {
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
    if (!validateForm()) return;
  
    setIsSubmitting(true);
    axios.defaults.withCredentials = true;
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("contact", formData.contact);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("confirmPassword", formData.confirmPassword);
      formDataToSend.append("documentForVerification", formData.document);
  
      const response = await axios.post(`${backendUrl}/api/lawyer/signup`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.status === 201) {
        setEmail(formData.email);
        toast.success("Account created successfully! Please check your email for the OTP.");
        navigate("/lawyer-verify-email");
      } else {
        toast.error(response.data.msg || "An error occurred. Please try again.");
      }
    } catch (err) {
      console.error("Error during signup:", err);
      toast.error("An error occurred while creating your account. Please try again.");
    } finally {
      setIsSubmitting(false);
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
      {/* Main Container */}
      <div className="grid grid-cols-1 md:grid-cols-[42%_58%] w-full max-w-[1100px] h-auto md:h-[660px] bg-white rounded-[28px] shadow-[0px_0px_1px_rgba(0,0,0,0.04),_0px_2px_6px_rgba(0,0,0,0.04),_0px_16px_24px_rgba(0,0,0,0.06)] overflow-hidden relative">
        {/* Left Section - Animation Container (Hidden on Mobile) */}
        <div className="hidden md:block bg-gradient-to-br from-[#0022fc] to-[#001cd8] p-8 flex flex-col items-center justify-between relative overflow-hidden">
          <div className="text-white text-center">
            <h2 className="text-2xl font-bold text-white mb-2 relative">Welcome to LawLink LK</h2>
            <p className="text-base text-white/90 mt-2 relative">Your One-Stop Solution for Legal Services</p>
          </div>
          <div className="w-full max-w-[380px] my-10 mx-auto relative z-10 group">
            <video
              src="images/gtrfe.mp4"
              autoPlay
              loop
              muted
              className="w-full h-auto rounded-[16px] shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_25px_50px_rgba(0,0,0,0.25)] cursor-pointer"
            ></video>
            <div className="absolute inset-0 bg-[#0022fc]/10 opacity-0 group-hover:opacity-100 rounded-[16px] transition-opacity duration-300 pointer-events-none"></div>
          </div>
          {/* Centered Logo */}
          <div className="logo-container flex justify-center w-full">
            <a href="https://www.lawlinklk.com/" target="_blank" rel="noopener noreferrer" className="transition-transform duration-300 hover:scale-110 inline-block">
              <img
                className="w-[130px] h-auto mt-2 mb-8 filter brightness-0 invert opacity-90 hover:opacity-100 transition-opacity duration-300"
                src="images/logo.png"
                alt="Logo"
              />
            </a>
          </div>
        </div>
        {/* Right Section - Form Container */}
        <div className="form-container p-4 md:p-8 md:px-14 bg-white">
          <h1 className="text-[1.5rem] md:text-[1.875rem] font-bold text-[#0022fc] mt-px tracking-tighter">Create Account</h1>
          <div className="line flex h-[3px] rounded-[10px] mb-[20px] md:mb-[30px]"></div>
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
            <div className="input-group flex flex-col gap-1 w-full">
              <label>Full Name</label>
              <input
                className="w-full h-10 p-3 border-2 border-[#eaeaec] rounded-lg text-[#2c06ac] text-sm bg-[#f9f9f9] transition-colors duration-300 ease-out focus:outline-none focus:border-[#0022fc] focus:ring-4 focus:ring-[rgba(0,34,252,0.08)]"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
              {errors.fullName && <p className="error">{errors.fullName}</p>}
              <div className="contacts grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div>
                  <label>Email</label>
                  <input
                    className="w-full h-10 p-3 border-2 border-[#eaeaec] rounded-lg text-[#2c06ac] text-sm bg-[#f9f9f9] transition-colors duration-300 ease-out focus:outline-none focus:border-[#0022fc] focus:ring-4 focus:ring-[rgba(0,34,252,0.08)]"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    required
                  />
                  {errors.email && <p className="error">{errors.email}</p>}
                </div>
                <div>
                  <label>Contact Number</label>
                  <input
                    className="w-full h-10 p-3 border-2 border-[#eaeaec] rounded-lg text-[#2c06ac] text-sm bg-[#f9f9f9] transition-colors duration-300 ease-out focus:outline-none focus:border-[#0022fc] focus:ring-4 focus:ring-[rgba(0,34,252,0.08)]"
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="Enter your contact number"
                    required
                  />
                  {errors.contact && <p className="error">{errors.contact}</p>}
                </div>
              </div>
              <div className="file-input-wrapper w-full">
                <label className="file-upload-label flex flex-col items-center gap-2 cursor-pointer">Document For Verification</label>
                <div className="file-upload-container border-2 border-dashed border-[#e5e7eb] rounded-[12px] p-4 md:p-6 w-full text-center bg-[#f9fafb] transition-colors duration-300 ease-in-out hover:border-[#0022fc]">
                  <input
                    type="file"
                    name="document"
                    id="document"
                    accept=".pdf, .jpg, .jpeg, .png"
                    onChange={handleChange}
                    className="file-input hidden"
                    required
                  />
                  <label htmlFor="document" className="file-upload-label">
                    <span className="file-upload-text text-[0.875rem] text-[#0080ff]">
                      {formData.document ? formData.document.name : "Upload your document (PDF, JPG, PNG)"}
                    </span>
                  </label>
                </div>
                <p style={{ color: "rgb(0, 21, 255)", fontSize: "10px", marginTop: "4px" }}>Please Upload Your Lawyer ID or Bar Association Certificate</p>
                {errors.document && <p className="error">{errors.document}</p>}
              </div>
              <div className="passwords grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="password-input-wrapper w-full">
                  <label>Password</label>
                  <div className="password-input-container relative flex items-center w-full">
                    <input
                      className="w-full h-10 p-3 border-2 border-[#eaeaec] rounded-lg text-[#2c06ac] text-sm bg-[#f9f9f9] transition-colors duration-300 ease-out pr-[70px] focus:outline-none focus:border-[#0022fc] focus:ring-4 focus:ring-[rgba(0,34,252,0.08)]"
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
                      className="password-toggle-btn absolute right-[10px] bg-transparent border-none text-[#888] cursor-pointer flex items-center justify-center hover:text-[#333]"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <img src="images/close.png" alt="Hide" className="w-5 h-5"/> : <img src="images/open.png" alt="Show" className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="password-input-wrapper w-full">
                  <label>Confirm Password</label>
                  <div className="password-input-container relative flex items-center w-full">
                    <input
                      className="w-full h-10 p-3 border-2 border-[#eaeaec] rounded-lg text-[#2c06ac] text-sm bg-[#f9f9f9] transition-colors duration-300 ease-out pr-[70px] focus:outline-none focus:border-[#0022fc] focus:ring-4 focus:ring-[rgba(0,34,252,0.08)]"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn absolute right-[10px] bg-transparent border-none text-[#888] cursor-pointer flex items-center justify-center hover:text-[#333]"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <img src="images/close.png" alt="Hide" className="w-5 h-5"/> : <img src="images/open.png" alt="Show" className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
              {(isPasswordFocused || formData.password) && (
                <>
                  <div className="password-strength-text text-[0.75rem] mt-1 text-[#005eff] font-medium text-center">
                    Password Strength: {["Weak", "Fair", "Good", "Strong", "Very Strong"][passwordStrength - 1]}
                  </div>
                  <div className="password-strength-container w-full md:w-[400px] h-[10px] bg-[#e0e0e0] rounded-[3px] mt-2 overflow-hidden self-center">
                    <div
                      className="password-strength-bar h-full w-[50px] transition-all duration-300 ease-in-out"
                      style={{ width: `${(passwordStrength / 5) * 100}%`, backgroundColor: getPasswordStrengthColor() }}
                    ></div>
                  </div>
                </>
              )}
              {formData.password !== formData.confirmPassword && formData.confirmPassword && (
                <p className="error text-[0.75rem] text-[#0015ff] mt-0.5 mb-0 text-center">Passwords do not match.</p>
              )}
            </div>
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
                onClick={() => navigate("/lawyer-login")}
                className="text-[#007bff] font-semibold hover:underline"
              >
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LawyerCreateAcc;