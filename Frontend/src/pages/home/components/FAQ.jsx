import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      question: "How do I post a case on LawLinkLK?",
      answer: "Post anonymously by filling out a quick form with your legal issue details—lawyers in your area will see it instantly.",
    },
    {
      question: "Is LawLinkLK free to use?",
      answer: "Yes, it’s free for clients to post cases and for lawyers to browse—no hidden fees, ever.",
    },
    {
      question: "How do lawyers express interest in my case?",
      answer: "Interested lawyers message you via the platform. You chat, decide, and only then is their profile revealed.",
    },
    {
      question: "Is my information secure on LawLinkLK?",
      answer: "Absolutely—advanced encryption keeps your data safe, shared only with your chosen lawyer.",
    },
    {
      question: "Can I share documents with my lawyer?",
      answer: "Yes, securely upload and share documents once you’ve agreed to collaborate.",
    },
    {
      question: "How do I stay updated on my case?",
      answer: "Get regular updates and deadline notifications from your lawyer through the platform.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-16 animate-slideInFromTop">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="group bg-white/90 backdrop-blur-lg rounded-2xl shadow-md border border-gray-200/50 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-slideIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center"
              >
                <h3 className="text-xl font-semibold text-blue-600 group-hover:text-blue-700 transition-colors duration-200 text-left">
                  {faq.question}
                </h3>
                <div className="p-2 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors duration-200 flex-shrink-0 transform group-hover:rotate-12">
                  {activeIndex === index ? (
                    <ChevronUp size={24} className="text-blue-600" />
                  ) : (
                    <ChevronDown size={24} className="text-blue-600" />
                  )}
                </div>
              </button>
              {activeIndex === index && (
                <div className="mt-4 text-gray-600 animate-expand">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes slideInFromTop {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateX(-30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes expand {
          0% {
            opacity: 0;
            max-height: 0;
            margin-top: 0;
          }
          100% {
            opacity: 1;
            max-height: 200px; /* Adjust as needed */
            margin-top: 1rem;
          }
        }

        .animate-slideInFromTop {
          animation: slideInFromTop 0.6s ease-out forwards;
        }

        .animate-slideIn {
          animation: slideIn 0.5s ease-out forwards;
        }

        .animate-expand {
          animation: expand 0.4s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default FAQ;