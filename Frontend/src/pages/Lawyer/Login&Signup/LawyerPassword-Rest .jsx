import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../Context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

function LawyerRestPasswordOtp() {
  const navigate = useNavigate();
  const { email, backendUrl } = useContext(AppContext);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, ""); 
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      if (value && index < otp.length - 1) {
        e.target.nextSibling?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      e.target.previousSibling?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
  
    try {
      const response = await axios.post(`${backendUrl}/api/lawyer/send-reset-otp`, {
        email: email,
      });
      


  
      if (response.status === 200 || response.status === 201) {
        toast.success("OTP verified successfully!");
        navigate("/lawyer-create-new-password");
      } else {
        toast.error(response.data.msg || "An error occurred. Please try again.");
      }
      
    } catch (err) {
      console.error("Error during OTP verification:", err);
      toast.error(err.response?.data?.msg || "Invalid OTP. Please try again.");
    }
  };

  const startResendTimer = () => {
    setIsResendDisabled(true);
    setResendTimer(120); 
    
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (isResendDisabled) return;
    
    try {
      const response = await axios.post(`${backendUrl}/api/lawyer/send-reset-otp`, {
        email: email,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("New OTP sent! Please check your email.");
        setOtp(new Array(6).fill("")); 
        startResendTimer();
      } else {
        toast.error(response.data.msg || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error("Error resending OTP:", err);
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-[20px] shadow-[0_8px_25px_rgba(0,0,0,0.1)] p-8 animate-float text-center">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-bold text-[#0026ff] mb-4">
          Verify Your Email Reset Password OTP
        </h1>

        {/* Divider Line */}
        <div className="h-[3px] bg-[#0026ff] w-60 mx-auto rounded-full"></div>

        {/* OTP Instructions */}
        <label htmlFor="otp" className="block text-sm text-[#02189c] font-medium ">
          Enter the One Time Password sent to your email:{" "}
          <span className="font-semibold text-[#0026ff]">{email}</span>
        </label>

        {/* OTP Input Boxes */}
        <div className="otp-container flex justify-center gap-3">
          {otp.map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={otp[index]}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-10 h-10 text-[1.5rem] text-center border border-[#cccccc] rounded-[6px] focus:outline-none focus:border-[#007bff] focus:ring-2 focus:ring-[#007bff]/50 transition-all duration-200"
            />
          ))}
        </div>

        {/* Resend OTP Button */}
        <button
          type="button"
          onClick={handleResend}
          className={`w-full text-sm text-[#1e90ff] underline hover:text-[#0066cc] transition-colors duration-200 ${
            isResendDisabled ? "text-[#999] cursor-not-allowed no-underline" : ""
          }`}
          disabled={isResendDisabled}
        >
          {isResendDisabled
            ? `Resend OTP in ${resendTimer}s`
            : "Resend OTP"}
        </button>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 px-6 bg-[#0026ff] text-white font-semibold rounded-[12px] hover:bg-[#3452fe] hover:-translate-y-[1px] active:scale-95 transition-all duration-300"
        >
          Submit
        </button>
      </form>

      {/* Back to Login Link */}
      <div className="mt-6 text-sm text-[#02189c]">
        <p
          className="cursor-pointer hover:text-[#0026ff] transition-colors duration-200"
          onClick={() => navigate("/lawyer-login")}
        >
          Back to{" "}
          <u className="text-[#007bff] no-underline hover:underline">
            <b>Login</b>
          </u>
        </p>
      </div>
    </div>
);
}

export default LawyerRestPasswordOtp;