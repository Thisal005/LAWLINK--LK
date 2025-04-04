import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../../../Context/AppContext";
import axios from "axios";


import loginVideo from "../../../assets/images/gtrfe-1.mp4";
import showPasswordIcon from "../../../assets/images/open.png";
import hidePasswordIcon from "../../../assets/images/close.png";

function Clientlogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { backendUrl, setIsLoggedIn, getUserData, isLoggedIn } = useContext(AppContext);
  const [email, setEmailLocal] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn && !isLoading) {
      const redirectTo = location.state?.from || "/client-dashboard";
      navigate(redirectTo, { replace: true });
    }
  }, [isLoggedIn, isLoading, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const config = {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      };
  
      const response = await axios.post(
        `${backendUrl}/api/auth/login`,
        { email, password },
        config
      );
  
      if (response.status === 200) {
        console.log("User logged in successfully:", response.data);
        toast.success("Logged in successfully!");
        setIsLoggedIn(true); // Set immediately
        navigate("/client-dashboard", { replace: true }); // Redirect immediately
  
        // Fetch user data in the background
        getUserData().catch((error) => {
          console.error("Failed to fetch user data after login:", error);
          toast.error("Login succeeded, but failed to load user data.");
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response && err.response.data && err.response.data.msg) {
        toast.error(err.response.data.msg);
      } else {
        toast.error("An error occurred during login. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // [Your existing JSX remains unchanged]
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat p-5">
      <div className="flex flex-col md:flex-row max-w-[1000px] bg-white rounded-[12px] shadow-[0_4px_10px_rgba(0,0,0,0.1)] overflow-hidden md:animate-float">
        <div className="hidden md:flex md:w-[60%] bg-gradient-to-br from-[#0022fc] to-[#001cd8] justify-center items-center overflow-hidden p-4">
          <video
            src={loginVideo}
            autoPlay
            loop
            muted
            className="w-full h-auto rounded-[16px] shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
          ></video>
          <div className="absolute inset-0 bg-[#0022fc]/10 opacity-0 group-hover:opacity-100 rounded-[16px] transition-opacity duration-300 pointer-events-none"></div>
        </div>
        <div className="w-full md:w-[60%] p-6 md:p-8 flex flex-col justify-center items-center text-center">
          <h1 className="text-[24px] md:text-[28px] font-bold text-[#02189c] mb-4">
            Log in to your account
          </h1>
          <div className="h-[2px] bg-[#3652fc] w-[80px] mx-auto mb-6"></div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
            <div className="input-group">
              <label className="text-[14px] font-semibold text-[#827ee3] text-left mb-2">
                Email
              </label>
              <input
                className="border-[2px] border-[#eaeaec] rounded-[8px] px-4 py-3 w-full text-[14px] bg-[#f9f9f9] focus:border-[#3652fc] focus:bg-white focus:outline-none transition-all duration-200"
                type="email"
                value={email}
                onChange={(e) => setEmailLocal(e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>
            <div className="input-group">
              <label className="text-[14px] font-semibold text-[#827ee3] text-left mb-2">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  className="border-[2px] border-[#eaeaec] rounded-[8px] px-4 py-3 w-full text-[14px] bg-[#f9f9f9] focus:border-[#3652fc] focus:bg-white focus:outline-none transition-all duration-200 pr-[50px]"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 bg-transparent border-none cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <img src={hidePasswordIcon} alt="Hide password" className="w-6 h-6" />
                  ) : (
                    <img src={showPasswordIcon} alt="Show password" className="w-6 h-6" />
                  )}
                </button>
              </div>
              <p className="text-[#3652fc] text-[14px] mt-2 text-right">
                <a
                  href="#"
                  onClick={() => navigate("/email-for-password-reset")}
                  className="hover:underline"
                >
                  Forgot Password?
                </a>
              </p>
            </div>
            <button
              type="submit"
              className="text-[16px] font-bold rounded-[20px] py-3 px-6 bg-[#3652fc] text-white hover:bg-[#6277fe] transition-colors duration-300 disabled:opacity-70"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Submit"}
            </button>
          </form>
          <div className="mt-6">
            <p className="text-[14px] text-gray-600">
              Don't have an account?{" "}
              <a
                href="#"
                onClick={() => navigate("/create-account")}
                className="text-[#3652fc] font-semibold hover:underline"
              >
                Sign up now
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Clientlogin;