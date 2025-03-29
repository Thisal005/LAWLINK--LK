import React from "react";
import { Link } from "react-router-dom";
import homeImage from "../../../assets/landing/home.jpg"; // Import the image

const Hero = () => {
  return (
    <section
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${homeImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark Mode Overlay */}
      <div className="absolute inset-0 bg-gray-900/60 dark:block hidden"></div>

      {/* Content */}
      <div className="relative text-center max-w-2xl px-8 text-white dark:text-gray-100 z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-[textReveal_1s_ease-out_forwards,fadeUp_1s_ease-out] tracking-tight leading-tight">
          Connecting You to the Right Legal Expertise!
        </h1>
        <p className="text-lg sm:text-xl text-gray-100 dark:text-gray-200 mb-8 opacity-90 animate-fade-in">
          Find all the legal help you need at your fingertips.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-md mx-auto">
          <Link
            to="/create-account"
            className="bg-white/95 text-[#042cc7] dark:text-blue-700 px-8 py-3 rounded-full text-base font-medium shadow-lg hover:bg-white hover:text-[#0136fc] dark:hover:text-blue-800 hover:shadow-xl focus:ring-2 focus:ring-[#0136fc] focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 animate-[fadeUp_1.4s_ease-out] backdrop-blur-sm"
            aria-label="Join as a Client"
          >
            Join as a Client
          </Link>
          <Link
            to="/lawyer-create-account"
            className="bg-transparent border-2 border-white/95 text-white dark:text-gray-100 px-8 py-3 rounded-full text-base font-medium shadow-lg hover:bg-white/20 dark:hover:bg-gray-800/20 hover:border-white focus:ring-2 focus:ring-white focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 animate-[fadeUp_1.6s_ease-out] backdrop-blur-sm"
            aria-label="Join as a Lawyer"
          >
            Join as a Lawyer
          </Link>
        </div>
      </div>

      {/* Floating Animation Elements */}
      <div className="absolute top-20 left-20 w-16 h-16 bg-white/10 dark:bg-gray-200/20 rounded-full backdrop-blur-sm animate-[float-1_6s_infinite_ease-in-out]"></div>
      <div className="absolute bottom-20 right-20 w-20 h-20 bg-white/10 dark:bg-gray-200/20 rounded-full backdrop-blur-sm animate-[float-2_8s_infinite_ease-in-out]"></div>
      <div className="absolute top-1/3 left-1/4 w-12 h-12 bg-white/10 dark:bg-gray-200/20 rounded-full backdrop-blur-sm animate-[float-3_7s_infinite_ease-in-out]"></div>
      <div className="absolute top-1/4 left-3/4 w-12 h-12 bg-white/10 dark:bg-gray-200/20 rounded-full backdrop-blur-sm animate-[float-3_7s_infinite_ease-in-out]"></div>
      <div className="absolute bottom-20 right-[180px] w-8 h-8 bg-white/10 dark:bg-gray-200/20 rounded-full backdrop-blur-sm animate-[float-3_7s_infinite_ease-in-out]"></div>
    </section>
  );
};

export default Hero;