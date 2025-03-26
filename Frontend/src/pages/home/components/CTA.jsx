import React from "react";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section
      id="CTA"
      className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 dark:from-gray-800 dark:via-gray-900 dark:to-black relative overflow-hidden"
    >
      {/* Subtle Background Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)]"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-semibold text-white mb-5 tracking-tight animate-fade-in">
          Elevate Your Legal Experience
        </h2>
        <p className="text-lg md:text-xl text-gray-100 mb-12 max-w-2xl mx-auto opacity-90 animate-fade-in-delay">
          Join LawLinkLK and connect effortlessly with top-tier legal solutions.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link
            to="/auth/client-login"
            className="bg-white/90 text-blue-700 px-8 py-3 rounded-full text-base font-medium shadow-lg hover:bg-white hover:shadow-xl hover:text-blue-800 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
          >
            Join as a Client
          </Link>
          <Link
            to="/auth/lawyer-login"
            className="bg-transparent border-2 border-white/90 text-white px-8 py-3 rounded-full text-base font-medium shadow-lg hover:bg-white/10 hover:border-white hover:text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
          >
            Join as a Lawyer
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;