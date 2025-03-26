import React from "react";
import { motion } from "framer-motion";
import { Globe, Briefcase, Shield } from "lucide-react";
import aboutus from "../../../assets/landing/image.jpg";

const About = () => {
  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Stagger delay between children
        delayChildren: 0.2, // Delay before children animations start
      },
    },
  };

  // Animation variants for individual items
  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
      },
    },
  };

  // Animation for the image card
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
        delay: 0.4, // Slight delay for the image
      },
    },
  };

  return (
    <section
      id="about"
      className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 via-gray-100 to-white dark:from-gray-900 dark:via-gray-850 dark:to-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid for Image and Text Block */}
        <motion.div
          className="grid lg:grid-cols-2 gap-8 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }} // Animate only once and when 20% of the container is in view
        >
          {/* Image Card */}
          <motion.div
            className="relative group transform hover:-translate-y-2 transition-all duration-300"
            variants={imageVariants}
          >
            <div className="rounded-2xl overflow-hidden shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={aboutus}
                  alt="LawLinkLK team enhancing legal access in Sri Lanka"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>

          {/* Text Block */}
          <motion.div
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-md border border-gray-300/50 dark:border-gray-600/50 hover:shadow-lg transition-all duration-200"
            variants={itemVariants}
          >
            <h2 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">About LawLinkLK</h2>
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
              LawLinkLK is transforming legal access in Sri Lanka by connecting clients with expert lawyers. Our platform offers <span className="font-semibold text-blue-600 dark:text-blue-400">secure</span> and <span className="font-semibold text-blue-600 dark:text-blue-400">seamless</span> solutions for legal advice, document support, and case management. With encrypted messaging and smart scheduling, we bring justice closer to you—effortlessly.
            </p>
          </motion.div>
        </motion.div>

        {/* Vision, Mission, Values Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }} // Animate only once and when 20% of the container is in view
        >
          {/* Vision */}
          <motion.div
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-md border border-gray-300/50 dark:border-gray-600/50 hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            tabIndex={0}
            aria-labelledby="vision-title"
            variants={itemVariants}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
                <Globe className="text-blue-600 dark:text-blue-400" size={28} />
              </div>
              <h3 id="vision-title" className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                Our Vision
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-200">
              A world where justice is seamless and accessible to all through technology.
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-md border border-gray-300/50 dark:border-gray-600/50 hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            tabIndex={0}
            aria-labelledby="mission-title"
            variants={itemVariants}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
                <Briefcase className="text-blue-600 dark:text-blue-400" size={28} />
              </div>
              <h3 id="mission-title" className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                Our Mission
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-200">
              Empowering legal connections with a platform built on trust and efficiency.
            </p>
          </motion.div>

          {/* Values */}
          <motion.div
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-md border border-gray-300/50 dark:border-gray-600/50 hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            tabIndex={0}
            aria-labelledby="values-title"
            variants={itemVariants}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
                <Shield className="text-blue-600 dark:text-blue-400" size={28} />
              </div>
              <h3 id="values-title" className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                Our Values
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-200">
              Integrity and transparency at the core of every interaction.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;