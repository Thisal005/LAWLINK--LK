import React, { useState, useContext } from "react";
import { AppContext } from "../../../Context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

function EmailForResetPass() {
  const [email, setlocalEmail] = useState("");

  const navigate = useNavigate();
  const { backendUrl, setEmail } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    axios.defaults.withCredentials = true;

    try {
      const response = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, {
        email: email,
      });

      if (response.status === 201 || response.status === 200) {
        setEmail(email);
        toast.success("Please check your email for the OTP.");
        navigate("/password-rest");
      } else {
        console.log("Response status is not 201:", response.status);
        toast.error(response.data.msg || "An error occurred. Please try again.");
      }
    } catch (err) {
      console.error("Error during reset password:", err);
      toast.error("An error occurred while sending otp. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0022fc] text-center mb-4">
          Enter Your Email For Password Reset
        </h1>
        <div className="h-[3px] bg-[#0022fc] w-35 mx-auto mb-6"></div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#0022fc]">Email</label>
            <input
              className="w-full px-4 py-3 border-[2px] border-[#e5e7eb] rounded-[12px] text-sm focus:border-[#0022fc] focus:outline-none focus:ring-2 focus:ring-[#0022fc]/50 transition-all duration-200"
              type="email"
              value={email}
              onChange={(e) => setlocalEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-6 bg-[#0022fc] text-white font-semibold rounded-[12px] hover:bg-[#001cd8] transition-colors duration-300"
          >
            Request OTP
          </button>
        </form>
      </div>
    </div>
  );
}

export default EmailForResetPass;
