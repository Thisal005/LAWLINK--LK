import React, { useState, useEffect } from "react";
import { Menu, X, Moon, Sun, Home, Info, Settings, HelpCircle, Phone, LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../../assets/landing/navimage.png"; // Logo image path

const Navbar = ({ isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
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
      setIsOpen(false);
    }
  };

  if (isLoading) return null;

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
<<<<<<< HEAD
          ? "bg-white  shadow-lg rounded-lg mx-4 mt-4"
=======
          ? "bg-white dark:bg-gray-800 shadow-lg rounded-lg mx-4 mt-4"
>>>>>>> dd0139464caf2351fc1d96709eb5d06f648c478a
          : "bg-transparent"
      }`}
      style={{ width: isScrolled ? "calc(100% - 2rem)" : "100%" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="LawLinkLK Logo" className="h-10 w-auto" />
          </Link>

          {/* Desktop Menu */}
<<<<<<< HEAD
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection("about")} className="text-textPrimary  hover:text-[#042cc7]  0 transition duration-300">
              About
            </button>
            <button onClick={() => scrollToSection("features")} className="text-textPrimary  hover:text-[#042cc7]  0 transition duration-300">
              Features
            </button>
            <button onClick={() => scrollToSection("HowItWorks")} className="text-textPrimary  hover:text-[#042cc7]  0 transition duration-300">
              How It Works
            </button>
            <button onClick={() => scrollToSection("pricing")} className="text-textPrimary   hover:text-[#042cc7]  0 transition duration-300">
              Pricing
            </button>
            <button onClick={() => scrollToSection("faq")} className="text-textPrimary   hover:text-[#042cc7]  0 transition duration-300">
              FAQ
            </button>
            <button onClick={() => scrollToSection("contact")} className="text-textPrimary   hover:text-[#042cc7]  0 transition duration-300">
=======
          <div className="hidden md:flex items-center justify-center flex-1 space-x-6">
            <button
              onClick={() => scrollToSection("about")}
              className="text-gray-700 dark:text-gray-200 hover:text-[#042cc7] dark:hover:text-[#008bff] transition duration-300"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="text-gray-700 dark:text-gray-200 hover:text-[#042cc7] dark:hover:text-[#008bff] transition duration-300"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("HowItWorks")}
              className="text-gray-700 dark:text-gray-200 hover:text-[#042cc7] dark:hover:text-[#008bff] transition duration-300"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-gray-700 dark:text-gray-200 hover:text-[#042cc7] dark:hover:text-[#008bff] transition duration-300"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-gray-700 dark:text-gray-200 hover:text-[#042cc7] dark:hover:text-[#008bff] transition duration-300"
            >
              FAQ
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-gray-700 dark:text-gray-200 hover:text-[#042cc7] dark:hover:text-[#008bff] transition duration-300"
            >
>>>>>>> dd0139464caf2351fc1d96709eb5d06f648c478a
              Contact
            </button>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="relative bg-transparent text-[#042cc7] dark:text-[#008bff] px-6 py-2 rounded-lg text-sm font-medium border-2 border-[#0136fc] dark:border-[#008bff] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden group"
              >
                <span className="absolute inset-0 bg-[#042cc7] dark:bg-[#008bff] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 group-hover:text-white">Login</span>
              </Link>
              <Link
                to="/create-account"
                className="relative bg-transparent text-[#042cc7] dark:text-[#008bff] px-6 py-2 rounded-lg text-sm font-medium border-2 border-[#0136fc] dark:border-[#008bff] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden group"
              >
                <span className="absolute inset-0 bg-[#042cc7] dark:bg-[#008bff] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 group-hover:text-white">Register</span>
              </Link>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
<<<<<<< HEAD
           
=======
>>>>>>> dd0139464caf2351fc1d96709eb5d06f648c478a
          </div>

          {/* Mobile Menu Button and Dark Mode Toggle */}
          <div className="flex items-center space-x-4 md:hidden">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
<<<<<<< HEAD
            <button onClick={toggleMenu} className="text-textPrimary   focus:outline-none">
=======
            <button
              onClick={toggleMenu}
              className="text-gray-700 dark:text-gray-200 hover:text-[#042cc7] dark:hover:text-[#008bff] transition duration-300"
            >
>>>>>>> dd0139464caf2351fc1d96709eb5d06f648c478a
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={toggleMenu}
          >
            <div
              className="bg-white dark:bg-gray-800 shadow-lg rounded-lg mx-4 mt-16 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-4">
                <button
<<<<<<< HEAD
                  onClick={() => {
                    scrollToSection("about");
                    toggleMenu();
                  }}
                  className="flex items-center space-x-3 text-textPrimary   hover:text-[#042cc7]  0"
=======
                  onClick={() => scrollToSection("about")}
                  className="flex items-center space-x-3 w-full text-left text-gray-700 dark:text-gray-200 hover:text-[#042cc7] dark:hover:text-[#008bff] transition duration-300"
>>>>>>> dd0139464caf2351fc1d96709eb5d06f648c478a
                >
                  <Info size={20} />
                  <span>About</span>
                </button>
                <button
<<<<<<< HEAD
                  onClick={() => {
                    scrollToSection("features");
                    toggleMenu();
                  }}
                  className="flex items-center space-x-3 text-textPrimary   hover:text-[#042cc7]  0"
=======
                  onClick={() => scrollToSection("features")}
                  className="flex items-center space-x-3 w-full text-left text-gray-700 dark:text-gray-200 hover:text-[#042cc7] dark:hover:text-[#008bff] transition duration-300"
>>>>>>> dd0139464caf2351fc1d96709eb5d06f648c478a
                >
                  <Settings size={20} />
                  <span>Features</span>
                </button>
                <button
<<<<<<< HEAD
                  onClick={() => {
                    scrollToSection("HowItWorks");
                    toggleMenu();
                  }}
                  className="flex items-center space-x-3 text-textPrimary   hover:text-[#042cc7]  0"
=======
                  onClick={() => scrollToSection("HowItWorks")}
                  className="flex items-center space-x-3 w-full text-left text-gray-700 dark:text-gray-200 hover:text-[#042cc7] dark:hover:text-[#008bff] transition duration-300"
>>>>>>> dd0139464caf2351fc1d96709eb5d06f648c478a
                >
                  <Home size={20} />
                  <span>How It Works</span>
                </button>
                <button
<<<<<<< HEAD
                  onClick={() => {
                    scrollToSection("pricing");
                    toggleMenu();
                  }}
                  className="flex items-center space-x-3 text-textPrimary   hover:text-[#042cc7]  0"
=======
                  onClick={() => scrollToSection("pricing")}
                  className="flex items-center space-x-3 w-full text-left text-gray-700 dark:text-gray-200 hover:text-[#042cc7] dark:hover:text-[#008bff] transition duration-300"
>>>>>>> dd0139464caf2351fc1d96709eb5d06f648c478a
                >
                  <HelpCircle size={20} />
                  <span>Pricing</span>
                </button>
                <button
<<<<<<< HEAD
                  onClick={() => {
                    scrollToSection("faq");
                    toggleMenu();
                  }}
                  className="flex items-center space-x-3 text-textPrimary   hover:text-[#042cc7]  0"
=======
                  onClick={() => scrollToSection("faq")}
                  className="flex items-center space-x-3 w-full text-left text-gray-700 dark:text-gray-200 hover:text-[#042cc7] dark:hover:text-[#008bff] transition duration-300"
>>>>>>> dd0139464caf2351fc1d96709eb5d06f648c478a
                >
                  <HelpCircle size={20} />
                  <span>FAQ</span>
                </button>
                <button
<<<<<<< HEAD
                  onClick={() => {
                    scrollToSection("contact");
                    toggleMenu();
                  }}
                  className="flex items-center space-x-3 text-textPrimary   hover:text-[#042cc7]  0"
=======
                  onClick={() => scrollToSection("contact")}
                  className="flex items-center space-x-3 w-full text-left text-gray-700 dark:text-gray-200 hover:text-[#042cc7] dark:hover:text-[#008bff] transition duration-300"
>>>>>>> dd0139464caf2351fc1d96709eb5d06f648c478a
                >
                  <Phone size={20} />
                  <span>Contact</span>
                </button>
                <Link
                  to="/login"
<<<<<<< HEAD
                  className="flex items-center space-x-3 text-[#042cc7] dark:text-[#008bff] hover:text-[#042cc7]  0"
=======
                  className="flex items-center space-x-3 text-[#042cc7] dark:text-[#008bff] hover:text-[#0136fc] dark:hover:text-[#60a5fa] transition duration-300"
                  onClick={toggleMenu}
>>>>>>> dd0139464caf2351fc1d96709eb5d06f648c478a
                >
                  <LogIn size={20} />
                  <span>Login</span>
                </Link>
                <Link
                  to="/create-account"
                  className="flex items-center space-x-3 text-[#042cc7] dark:text-[#008bff] hover:text-[#0136fc] dark:hover:text-[#60a5fa] transition duration-300"
                  onClick={toggleMenu}
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