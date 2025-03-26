import React, { useEffect, useRef } from "react";
import { Briefcase, User, Shield, MessageSquare, Folder, Bell } from "lucide-react";

import clientImage from "../../../assets/landing/client.png"; 
import lawyerImage from "../../../assets/landing/lawyer.png";

const Features = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const clientImageRef = useRef(null);
  const lawyerImageRef = useRef(null);
  const clientLabelRef = useRef(null);
  const lawyerLabelRef = useRef(null);
  
  const clientFeatureRefs = useRef([]);
  const lawyerFeatureRefs = useRef([]);

  // Reset refs arrays
  clientFeatureRefs.current = [];
  lawyerFeatureRefs.current = [];

  useEffect(() => {
    // Intersection Observer to handle entrance animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all elements with refs
    const elements = [
      sectionRef.current,
      titleRef.current,
      clientImageRef.current,
      lawyerImageRef.current,
      clientLabelRef.current,
      lawyerLabelRef.current,
      ...clientFeatureRefs.current,
      ...lawyerFeatureRefs.current
    ].filter(Boolean);

    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  // Helper function to add elements to refs array
  const addToClientRefs = (el) => {
    if (el && !clientFeatureRefs.current.includes(el)) {
      clientFeatureRefs.current.push(el);
    }
  };

  const addToLawyerRefs = (el) => {
    if (el && !lawyerFeatureRefs.current.includes(el)) {
      lawyerFeatureRefs.current.push(el);
    }
  };

  const clientFeatures = [
    {
      icon: <User size={28} className="text-blue-600 dark:text-blue-400 transition-transform duration-300 hover:scale-110" />,
      title: "Post Your Case",
      description: "Share legal issues anonymously and connect with the perfect lawyer.",
    },
    {
      icon: <Bell size={28} className="text-blue-600 dark:text-blue-400 transition-transform duration-300 hover:scale-110" />,
      title: "Stay Updated",
      description: "Get real-time updates on your case and deadlines.",
    },
    {
      icon: <MessageSquare size={28} className="text-blue-600 dark:text-blue-400 transition-transform duration-300 hover:scale-110" />,
      title: "Secure Messaging",
      description: "Chat securely with lawyers via our encrypted system.",
    },
  ];

  const lawyerFeatures = [
    {
      icon: <Briefcase size={28} className="text-blue-600 dark:text-blue-400 transition-transform duration-300 hover:scale-110" />,
      title: "Find Relevant Cases",
      description: "Discover cases tailored to your expertise and region.",
    },
    {
      icon: <Folder size={28} className="text-blue-600 dark:text-blue-400 transition-transform duration-300 hover:scale-110" />,
      title: "Case Management",
      description: "Streamline documents and schedules effortlessly.",
    },
    {
      icon: <Shield size={28} className="text-blue-600 dark:text-blue-400 transition-transform duration-300 hover:scale-110" />,
      title: "Build Trust",
      description: "Highlight your skills and grow your reputation.",
    },
  ];

  return (
    <section 
      id="features" 
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 
          ref={titleRef}
          className="text-4xl font-bold text-center text-blue-600 mb-16 opacity-0 translate-y-6 transition-all duration-700 delay-100"
        >
          Features
        </h2>
        
        <div className="grid md:grid-cols-2 gap-16">
          {/* Client Section */}
          <div className="relative">
            {/* Blue circle with person image */}
            <div className="relative mb-8 hidden md:block">
              <img 
                ref={clientImageRef}
                src={clientImage} 
                alt="Client" 
                className="w-full max-w-md mx-auto mr-40 transition-transform duration-300 hover:scale-105 opacity-0 -translate-x-12 transition-all duration-1000 delay-200"
                loading="lazy"
              />
              
              {/* Client label */}
              <div 
                ref={clientLabelRef}
                className="absolute top-10 right-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full py-2 px-6 shadow-lg transition-shadow duration-300 hover:shadow-xl opacity-0 translate-x-8 transition-all duration-700 delay-400"
              >
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
                  <div>
                    <p className="font-semibold text-blue-600 dark:text-blue-400">For Clients</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Individuals who seek legal <br />help in Sri Lanka</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Client Features */}
            <div className="space-y-6">
              {lawyerFeatures.map((feature, index) => (
                <div 
                  key={index}
                  ref={addToClientRefs}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg flex items-center transition-transform duration-300 hover:scale-105 hover:shadow-xl opacity-0 translate-y-8 transition-all duration-700"
                  style={{ transitionDelay: `${500 + (index * 150)}ms` }}
                  tabIndex="0"
                  aria-label={`Feature: ${feature.title}. ${feature.description}`}
                >
                  <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-800 mr-5">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Lawyer Section */}
          <div className="relative">
            {/* Lawyer Features (display first on mobile, but reversed order on desktop) */}
            <div className="space-y-6 order-2 md:mt-0 mb-8">
              {clientFeatures.map((feature, index) => (
                <div 
                  key={index}
                  ref={addToLawyerRefs}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg flex items-center transition-transform duration-300 hover:scale-105 hover:shadow-xl opacity-0 translate-y-8 transition-all duration-700"
                  style={{ transitionDelay: `${500 + (index * 150)}ms` }}
                  tabIndex="0"
                  aria-label={`Feature: ${feature.title}. ${feature.description}`}
                >
                  <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-800 mr-5">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Blue circle with lawyer image */}
            <div className="relative bottom-0 order-1 mt-10 md:mt-20 hidden md:block">
              <img 
                ref={lawyerImageRef}
                src={lawyerImage} 
                alt="Lawyer" 
                className="w-full max-w-md mx-auto ml-40 transition-transform duration-300 hover:scale-105 opacity-0 translate-x-12 transition-all duration-1000 delay-200 hover:scale-105 opacity-0 translate-x-12 transition-all duration-1000 delay-200"
                loading="lazy"
              />
              
              {/* Lawyer label */}
              <div 
                ref={lawyerLabelRef}
                className="absolute top-16 left-7 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full py-2 px-6 shadow-lg transition-shadow duration-300 hover:shadow-xl opacity-0 -translate-x-8 transition-all duration-700 delay-400"
              >
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
                  <div>
                    <p className="font-semibold text-blue-600 dark:text-blue-400">For Lawyers</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">22,000+ legal professionals<br />in Sri Lanka</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation styling */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .animate-in {
            opacity: 1 !important;
            transform: translateY(0) translateX(0) !important;
          }
        `
      }} />
    </section>
  );
};

export default Features;