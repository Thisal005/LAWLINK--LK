import React, { useState, useEffect } from "react";
import { Menu, X, Moon, Sun, Home, Info, Settings, HelpCircle, Phone, LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../../assets/landing/navimage.png";

const Navbar = ({ isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Hide Navbar if loading
  if (isLoading) return null;
  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white dark:bg-darkBackground shadow-lg rounded-lg mx-4 mt-4"
          : "bg-transparent"
      }`}
      style={{
        width: isScrolled ? "calc(100% - 2rem)" : "100%",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="#" className="flex items-center space-x-2">
            <img src={logo} alt="LawLinkLK Logo" className="h-10 w-50" /> {/* Logo image */}
          </Link>
  
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection("about")} className="text-textPrimary dark:text-darkTextPrimary hover:text-[#042cc7] dark:hover:text-[#008bff] transition duration-300">
              About
            </button>
            <button onClick={() => scrollToSection("features")} className="text-textPrimary dark:text-darkTextPrimary hover:text-[#042cc7] dark:hover:text-[#008bff] transition duration-300">
              Features
            </button>
            <button onClick={() => scrollToSection("HowItWorks")} className="text-textPrimary dark:text-darkTextPrimary hover:text-[#042cc7] dark:hover:text-[#008bff] transition duration-300">
              How It Works
            </button>
            <button onClick={() => scrollToSection("pricing")} className="text-textPrimary dark:text-darkTextPrimary hover:text-[#042cc7] dark:hover:text-[#008bff] transition duration-300">
              Pricing
            </button>
            <button onClick={() => scrollToSection("faq")} className="text-textPrimary dark:text-darkTextPrimary hover:text-[#042cc7] dark:hover:text-[#008bff] transition duration-300">
              FAQ
            </button>
            <button onClick={() => scrollToSection("contact")} className="text-textPrimary dark:text-darkTextPrimary hover:text-[#042cc7] dark:hover:text-[#008bff] transition duration-300">
              Contact
            </button>
            <div className="flex space-x-4">
            <Link
                to="/login"
                className="relative bg-transparent text-[#042cc7] px-6 py-2 rounded-lg text-sm font-medium border-2 border-[#0136fc] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden group"
              >
                {/* Hover effect */}
                <span className="absolute inset-0 bg-[#042cc7] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 group-hover:text-white">Login</span>
              </Link>
              <Link
                to="/create-account"
                className="relative bg-transparent text-[#042cc7] px-6 py-2 rounded-lg text-sm font-medium border-2 border-[#0136fc] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden group"
              >
                {/* Hover effect */}
                <span className="absolute inset-0 bg-[#042cc7] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 group-hover:text-white">Register</span>
              </Link>
            </div>
            {/* Dark Mode Toggle Button (Desktop) */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
  
          {/* Mobile Menu Button and Dark Mode Toggle */}
          <div className="flex items-center space-x-4 md:hidden">
            {/* Dark Mode Toggle Button (Mobile) */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={toggleMenu} className="text-textPrimary dark:text-darkTextPrimary focus:outline-none">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
  
        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40" onClick={toggleMenu}>
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg mx-4 mt-16 p-6 transform transition-all duration-300">
              <div className="space-y-4">
                <button
                  onClick={() => {
                    scrollToSection("about");
                    toggleMenu();
                  }}
                  className="flex items-center space-x-3 text-textPrimary dark:text-darkTextPrimary hover:text-[#042cc7] dark:hover:text-[#008bff]"
                >
                  <Info size={20} />
                  <span>About</span>
                </button>
                <button
                  onClick={() => {
                    scrollToSection("features");
                    toggleMenu();
                  }}
                  className="flex items-center space-x-3 text-textPrimary dark:text-darkTextPrimary hover:text-[#042cc7] dark:hover:text-[#008bff]"
                >
                  <Settings size={20} />
                  <span>Features</span>
                </button>
                <button
                  onClick={() => {
                    scrollToSection("HowItWorks");
                    toggleMenu();
                  }}
                  className="flex items-center space-x-3 text-textPrimary dark:text-darkTextPrimary hover:text-[#042cc7] dark:hover:text-[#008bff]"
                >
                  <Home size={20} />
                  <span>How It Works</span>
                </button>
                <button
                  onClick={() => {
                    scrollToSection("pricing");
                    toggleMenu();
                  }}
                  className="flex items-center space-x-3 text-textPrimary dark:text-darkTextPrimary hover:text-[#042cc7] dark:hover:text-[#008bff]"
                >
                  <HelpCircle size={20} />
                  <span>Pricing</span>
                </button>
                <button
                  onClick={() => {
                    scrollToSection("faq");
                    toggleMenu();
                  }}
                  className="flex items-center space-x-3 text-textPrimary dark:text-darkTextPrimary hover:text-[#042cc7] dark:hover:text-[#008bff]"
                >
                  <HelpCircle size={20} />
                  <span>FAQ</span>
                </button>
                <button
                  onClick={() => {
                    scrollToSection("contact");
                    toggleMenu();
                  }}
                  className="flex items-center space-x-3 text-textPrimary dark:text-darkTextPrimary hover:text-[#042cc7] dark:hover:text-[#008bff]"
                >
                  <Phone size={20} />
                  <span>Contact</span>
                </button>
                <Link
                  to="/login"
                  className="flex items-center space-x-3 text-[#042cc7] dark:text-[#008bff] hover:text-[#042cc7] dark:hover:text-[#008bff]"
                >
                  <LogIn size={20} />
                  <span>Login</span>
                </Link>
                <Link
                  to="/create-account"
                  className="flex items-center space-x-3 text-[#042cc7] dark:text-[#008bff]"
                >
                  <UserPlus size={20} />
                  <span>Register</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;