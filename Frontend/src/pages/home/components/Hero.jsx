import React from "react";
import { Link } from "react-router-dom";
import homeImage from "../../../assets/landing/home.jpg";

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
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#042cc7]/70 via-[#0136fc]/70 to-[#008bff]/70"></div>

      {/* Subtle Background Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)]"></div>

      {/* Content */}
      <div className="relative text-center max-w-2xl px-8 text-white z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight animate-slideInFromTop">
          Connecting You to the Right Legal Expertise!
        </h1>

        {/* Subtext with Fade-In Animation */}
        <p className="text-lg sm:text-xl text-gray-100 mb-8 opacity-90 animate-fadeIn">
          Find all the legal help you need at your fingertips.
        </p>

        {/* Buttons with Staggered Fade-In Animation */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-md mx-auto">
          <Link
            to="/create-account"
            className="bg-white/95 text-[#042cc7] px-8 py-3 rounded-full text-base font-medium shadow-lg hover:bg-white hover:text-[#0136fc] hover:shadow-xl focus:ring-2 focus:ring-[#0136fc] focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 animate-slideInFromBottom backdrop-blur-sm"
            aria-label="Join as a Client"
          >
            Join as a Client
          </Link>
          <Link
            to="/lawyer-create-account"
            className="bg-transparent border-2 border-white/95 text-white px-8 py-3 rounded-full text-base font-medium shadow-lg hover:bg-white/20 hover:border-white focus:ring-2 focus:ring-white focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 animate-slideInFromBottomDelay backdrop-blur-sm"
            aria-label="Join as a Lawyer"
          >
            Join as a Lawyer
          </Link>
        </div>
      </div>

      {/* Floating Animation Elements */}
      <div className="absolute top-20 left-20 w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm animate-float1 transition-all duration-300 hover:bg-white/20"></div>
      <div className="absolute bottom-20 right-20 w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm animate-float2 transition-all duration-300 hover:bg-white/20"></div>
      <div className="absolute top-1/3 left-1/4 w-12 h-12 bg-white/10 rounded-full backdrop-blur-sm animate-float3 transition-all duration-300 hover:bg-white/20"></div>
      <div className="absolute top-1/4 left-3/4 w-12 h-12 bg-white/10 rounded-full backdrop-blur-sm animate-float1 transition-all duration-300 hover:bg-white/20"></div>
      <div className="absolute bottom-20 right-[180px] w-8 h-8 bg-white/10 rounded-full backdrop-blur-sm animate-float2 transition-all duration-300 hover:bg-white/20"></div>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes slideInFromTop {
          0% {
            opacity: 0;
            transform: translateY(-30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 0.9;
          }
        }

        @keyframes slideInFromBottom {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float1 {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
          100% {
            transform: translateY(0);
          }
        }

        @keyframes float2 {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0);
          }
        }

        @keyframes float3 {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0);
          }
        }

        .animate-slideInFromTop {
          animation: slideInFromTop 0.8s ease-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
          animation-delay: 0.3s;
        }

        .animate-slideInFromBottom {
          animation: slideInFromBottom 0.8s ease-out forwards;
          animation-delay: 0.6s;
        }

        .animate-slideInFromBottomDelay {
          animation: slideInFromBottom 0.8s ease-out forwards;
          animation-delay: 0.9s;
        }

        .animate-float1 {
          animation: float1 3s ease-in-out infinite;
        }

        .animate-float2 {
          animation: float2 4s ease-in-out infinite;
        }

        .animate-float3 {
          animation: float3 3.5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;