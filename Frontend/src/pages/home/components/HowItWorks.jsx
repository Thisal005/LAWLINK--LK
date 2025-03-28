import React from "react";
import { motion } from "framer-motion";
import { User, Search, MessageSquare, Shield, Folder, Bell, Hand, Scale } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <User size={28} className="text-blue-600 dark:text-blue-400" />,
      title: "Post Your Case",
      description: "Clients share legal cases anonymously and securely.",
    },
    {
      icon: <Search size={28} className="text-blue-600 dark:text-blue-400" />,
      title: "Find Relevant Cases",
      description: "Lawyers browse cases matching their skills and location.",
    },
    {
      icon: <MessageSquare size={28} className="text-blue-600 dark:text-blue-400" />,
      title: "Express Interest",
      description: "Lawyers message clients to offer their services.",
    },
    {
      icon: <Hand size={28} className="text-blue-600 dark:text-blue-400" />,
      title: "Mutual Agreement",
      description: "Profiles unlock once both agree to collaborate.",
    },
    {
      icon: <Folder size={28} className="text-blue-600 dark:text-blue-400" />,
      title: "Document Sharing",
      description: "Securely exchange case documents post-agreement.",
    },
    {
      icon: <Bell size={28} className="text-blue-600 dark:text-blue-400" />,
      title: "Case Updates",
      description: "Clients stay informed with lawyer updates.",
    },
    {
      icon: <Shield size={28} className="text-blue-600 dark:text-blue-400" />,
      title: "Secure Communication",
      description: "All interactions remain private and encrypted.",
    },
    {
      icon: <Scale size={28} className="text-blue-600 dark:text-blue-400" />,
      title: "Ethical & Ad-Free",
      description: "A clean, compliant platform with no ads.",
    },
  ];

  // Animation variants for the steps
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Delay between each child animation
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="HowItWorks" className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-400 bg-clip-text text-transparent mb-16">
          How LawLinkLK Works
        </h2>
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }} // Animate only once and when 20% of the container is in view
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-md border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              variants={itemVariants}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-800 group-hover:bg-blue-200 dark:group-hover:bg-blue-700 transition-colors duration-200">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200 text-center">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center mt-2">
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