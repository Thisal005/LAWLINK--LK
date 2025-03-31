import React from "react";
import { motion } from "framer-motion";
import { User, Search, MessageSquare, Shield, Folder, Bell, Hand, Scale } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <User size={28} className="text-blue-600" />,
      title: "Post Your Case",
      description: "Clients share legal cases anonymously and securely.",
    },
    {
      icon: <Search size={28} className="text-blue-600" />,
      title: "Find Relevant Cases",
      description: "Lawyers browse cases matching their skills and location.",
    },
    {
      icon: <MessageSquare size={28} className="text-blue-600" />,
      title: "Express Interest",
      description: "Lawyers message clients to offer their services.",
    },
    {
      icon: <Hand size={28} className="text-blue-600" />,
      title: "Mutual Agreement",
      description: "Profiles unlock once both agree to collaborate.",
    },
    {
      icon: <Folder size={28} className="text-blue-600" />,
      title: "Document Sharing",
      description: "Securely exchange case documents post-agreement.",
    },
    {
      icon: <Bell size={28} className="text-blue-600" />,
      title: "Case Updates",
      description: "Clients stay informed with lawyer updates.",
    },
    {
      icon: <Shield size={28} className="text-blue-600" />,
      title: "Secure Communication",
      description: "All interactions remain private and encrypted.",
    },
    {
      icon: <Scale size={28} className="text-blue-600" />,
      title: "Ethical & Ad-Free",
      description: "A clean, compliant platform with no ads.",
    },
  ];

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Delay between each child animation
      },
    },
  };

  // Animation variants for individual items
  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15,
      },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10,
      },
    },
  };

  // Icon animation variant
  const iconVariants = {
    hover: {
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        repeat: 1,
      },
    },
  };

  return (
    <section id="HowItWorks" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-16"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          How LawLinkLK Works
        </motion.h2>
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="group bg-white/90 backdrop-blur-lg rounded-2xl shadow-md border border-gray-200/50 p-6"
              variants={itemVariants}
              whileHover="hover"
            >
              <div className="flex items-center justify-center mb-4">
                <motion.div
                  className="p-3 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors duration-200"
                  variants={iconVariants}
                >
                  {step.icon}
                </motion.div>
              </div>
              <h3 className="text-xl font-semibold text-blue-600 group-hover:text-blue-700 transition-colors duration-200 text-center">
                {step.title}
              </h3>
              <p className="text-gray-600 text-center mt-2">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;