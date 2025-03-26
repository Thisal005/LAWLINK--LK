import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Features from "./components/Features";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import Pricing from "./components/Pricing";
import Testimonials from "./components/Testimonials";
import HowItWorks from "./components/HowItWorks";

const Home = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <Hero />
      <About />
      <Features />
      <FAQ />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <Contact />
      <CTA />
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Home;