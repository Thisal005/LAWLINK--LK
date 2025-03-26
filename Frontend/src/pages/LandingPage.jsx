import React from "react";
import Navbar from "../Components/landing/Navbar";
import Hero from "../Components/landing/Hero";
import About from "../Components/landing/About";
import Features from "../Components/landing/Features";
import FAQ from "../Components/landing/FAQ";
import Contact from "../Components/landing/Contact";
import CTA from "../Components/landing/CTA";
import Footer from "../Components/landing/Footer";
import Chatbot from "../Components/landing/Chatbot";
import Pricing from "../Components/landing/Pricing";
import Testimonials from "../Components/landing/Testimonials";
import HowItWorks from "../Components/landing/HowItWorks";

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