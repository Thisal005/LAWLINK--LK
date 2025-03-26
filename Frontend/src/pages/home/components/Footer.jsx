import React from "react";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-gray-800 to-gray-700 dark:from-gray-950 dark:to-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-4">
            <a href="#">LawLinkLK</a>
          </h3>
          <p className="text-gray-400">
            Connecting clients with legal professionals.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-blue-400 mb-4">Quick Links</h4>
          <ul className="space-y-3">
            <li>
              <a href="#about" className="text-gray-400 hover:text-blue-300 transition-colors duration-200">
                About
              </a>
            </li>
            <li>
              <a href="#features" className="text-gray-400 hover:text-blue-300 transition-colors duration-200">
                Features
              </a>
            </li>
            <li>
              <a href="#how-it-works" className="text-gray-400 hover:text-blue-300 transition-colors duration-200">
                How It Works
              </a>
            </li>
            <li>
              <a href="#pricing" className="text-gray-400 hover:text-blue-300 transition-colors duration-200">
                Pricing
              </a>
            </li>
            <li>
              <a href="#faq" className="text-gray-400 hover:text-blue-300 transition-colors duration-200">
                FAQ
              </a>
            </li>
            <li>
              <a href="#contact" className="text-gray-400 hover:text-blue-300 transition-colors duration-200">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h4 className="text-lg font-semibold text-blue-400 mb-4">Legal</h4>
          <ul className="space-y-3">
            <li>
              <a href="/privacy" className="text-gray-400 hover:text-blue-300 transition-colors duration-200">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/terms" className="text-gray-400 hover:text-blue-300 transition-colors duration-200">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="text-lg font-semibold text-blue-400 mb-4">Follow Us</h4>
          <div className="flex space-x-4">
            <a
              href="https://web.facebook.com/profile.php?id=61569339604076"
              className="text-gray-400 hover:text-blue-300 transition-all duration-200 transform hover:scale-110"
            >
              <Facebook size={24} />
            </a>
            
            <a
              href="https://www.linkedin.com/company/lawlink-lk"
              className="text-gray-400 hover:text-blue-300 transition-all duration-200 transform hover:scale-110"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="https://www.instagram.com/lawlinklk/"
              className="text-gray-400 hover:text-blue-300 transition-all duration-200 transform hover:scale-110"
            >
              <Instagram size={24} />
            </a>
          </div>
        </div>
      </div>
      <div className="text-center mt-8 border-t border-gray-700/50 pt-8">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} LawLinkLK. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;